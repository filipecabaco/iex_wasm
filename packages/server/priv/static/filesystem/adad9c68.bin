\ 4tH CSV grep - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/csv-w.4th                  \ for CSVOpen
include lib/argopen.4th                \ for ARG-OPEN
include lib/parsing.4th                \ for PARSE-CSV
include lib/getopts.4th                \ for GET-OPTIONS
include lib/csvfrom.4th                \ for CSV>
include lib/scanskip.4th               \ for SPLIT
include lib/kpre.4th                   \ for MATCH-REG

2048 constant /mytib                   \ define extra large TIB
/mytib buffer: mytib                   \ for long records

255 string look-for                    \ search string

255 constant #field                    \ maximum number of fields
#field array fields does> swap cells + ;

0 value #fields                        \ size of selected fields array
char ; value delimiter                 \ the delimiter (ASCII value)
defer match                            \ deferred string comparison
                                       \ read a CSV record
: ReadLine refill mytib count nip /mytib 1- = abort" Line too long" ;
: WriteLine 0 >in ! dup 0 ?do delimiter parse-csv csv> CSVtype loop CSVcr ;
: ?Field false #fields 0 ?do over i fields @ = if 0= leave then loop nip ;
                                       ( n -- f)
: ScanFile                             ( -- n)
  ReadLine 0= abort" Cannot read header" 0
  begin delimiter parse-csv? while CSVtype 1+ repeat 2drop CSVcr
;                                      \ write all fields and count them
                                       \ check line for expression
: CheckLine                            ( n -- n)
  dup 0 ?do                            \ either required field or all fields
    delimiter parse-csv csv> i ?Field #fields 0= or
    if look-for count match if WriteLine unloop exit then else 2drop then
  loop                                 \ if a match is found, write the line
;                                      \ and exit
                                       \ process a single line
: ProcessFile begin ReadLine while CheckLine repeat ;
: CloseFiles drop CSVclose close ;     ( h n --)
                                       \ get ASCII char delimiter
: get-delimiter get-argument drop c@ to delimiter ;
: get-string get-argument look-for place [: compare 0= ;] is match ;
: get-expression get-argument look-for place ['] match-reg is match ;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get the fields list
: get-fields                           ( --)
  get-argument 0 >r                    \ get the argument
  begin
    [char] , split number              \ split and convert to number
    dup 0< if drop ." Illegal field ignored" cr else r@ fields ! r> 1+ >r then
    chop dup 0> 0=                     \ until everything is parsed
  until 2drop r> to #fields
;

create options
  char d , ' get-delimiter ,           \ get the delimiter by character
  char c , ' get-code ,                \ get the delimiter by code
  char s , ' get-string ,              \ get a string expression (like fgrep)
  char e , ' get-expression ,          \ get a regular expression (like egrep)
  char f , ' get-fields ,              \ get the fields to check
  NULL ,
                                       \ open all files
: OpenFiles                            ( -- h)
  look-for 0 >string options get-options option-index input over 1+ 1+ argn >
  abort" Usage: csvgrep -s string -e expression -d delimiter -c code -f n1,n2,.. csv-file-in csv-file-out"
  over arg-open swap 1+ args CSVOpen abort" Can't open spreadsheet file"
  mytib /mytib source!
;                                      \ initialize large input buffer

: Convert OpenFiles ScanFile ProcessFile CloseFiles ;

Convert