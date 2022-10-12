\ 4tH CSV field filter - Copyright 2013,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/csv-w.4th                  \ for CSVOpen
include lib/argopen.4th                \ for ARG-OPEN
include lib/parsing.4th                \ for PARSE-CSV
include lib/getopts.4th                \ for GET-OPTIONS
include lib/csvfrom.4th                \ for CSV>
include lib/scanskip.4th               \ for SPLIT

2048 constant /mytib                   \ define extra large TIB
/mytib buffer: mytib                   \ for long records

255 constant #field                    \ maximum number of fields
#field array fields does> swap cells + ;

0 value #fields                        \ size of selected fields array
char ; value delimiter                 \ the delimiter (ASCII value)
                                       \ read a CSV record
: ReadLine refill mytib count nip /mytib 1- = abort" Line too long" ;
                                       \ use this field?
: ?Field                               ( a n1 n2 --)
  #fields 0 ?do                        \ check all selected fields
    dup i fields @ = if drop CSVType unloop exit then
  loop drop 2drop                      \ if found, leave true flag
;                                      \ else false
                                       \ determine number of fields
: ScanFile                             ( -- n)
  ReadLine 0= abort" Cannot read header" 0
  begin >r delimiter parse-csv? while csv> r@ ?Field r> 1+ repeat
  2drop r> CSVcr                       \ count the number of fields
;                                      \ and write them if required
                                       \ write a CSV line
: WriteLine dup 0 ?do delimiter parse-csv csv> i ?Field loop CSVcr ;
: ProcessFile begin ReadLine while WriteLine repeat ;
: CloseFiles drop CSVclose close ;
                                       \ get ASCII delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get spreadsheet format
: get-fields                           ( --)
  get-argument 0 >r                    \ get the argument
  begin
    [char] , split number              \ split and convert to number
    dup 0< if drop ." Illegal field ignored" cr else r@ fields ! r> 1+ >r then
    chop dup 0> 0=                     \ until everything is parsed
  until 2drop r> to #fields
;

create options
  char d , ' get-delimiter ,
  char c , ' get-code ,
  char f , ' get-fields ,
  NULL ,
                                       \ open all files
: OpenFiles                            ( -- h)
  options get-options option-index input over 1+ 1+ argn >
  abort" Usage: csvfield -d delimiter -c code -f n1,n2,.. csv-file-in csv-file-out"
  over arg-open swap 1+ args CSVOpen abort" Can't open spreadsheet file"
  mytib /mytib source!
;                                      \ initialize large input buffer

: Convert OpenFiles ScanFile ProcessFile CloseFiles ;

Convert
