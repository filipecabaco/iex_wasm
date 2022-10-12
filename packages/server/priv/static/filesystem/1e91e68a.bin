\ 4tH CSV to TCS converter - Copyright 2010,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/getopts.4th
include lib/parsing.4th
include lib/csvfrom.4th
include lib/leading.4th
include lib/swapping.4th
include lib/fp2.4th

char a constant 'a'
char ; value delimiter                 \ delimiter ASCII value

2048 constant /mytib                   \ size of input buffer
/mytib buffer: mytib                   \ allocate input buffer

: Read-File refill mytib count nip /mytib 1- = abort" Line too long" ;
: .float maxdigits (f.) type ;
: float|string 2dup >float if .float 2drop else .| " | type .| "| then cr ;
: .Field 2>r over . dup emit ."  = " 2r> float|string ;
: Usage abort" Usage: csv2tcs -c ascii -d delimiter csv-file tcs-file" ;
: PreProcess mytib /mytib source! 0 'a' ;
: PostProcess drop drop ;              ( n c --)

: WriteField                           ( a n --)
  csv> -leading -trailing [char] " [char] ' swapping
  dup if .Field else 2drop then 1+     \ clean field, if not empty
;                                      \ write it out

: Process
  begin delimiter parse-csv? while WriteField repeat 2drop drop 1+ 'a'
;
                                       \ get ASCII delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;

create options                         \ set ASCII code
  char c , ' get-code ,                \ either as a number
  char d , ' get-delimiter ,           \ or as a character
  NULL ,

include lib/convert.4th