\ 4tH CSV wrapper - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Wraps "n" lines into records of "n" fields

include lib/getopts.4th

char ; value delimiter                 \ delimiter ASCII value
char 2 value wrap                      \ wrapping number of fields

2048 constant /mytib                   \ size of input buffer
/mytib buffer: mytib                   \ allocate input buffer

: Read-File refill mytib count nip /mytib 1- = abort" Line too long" ;
: Usage abort" Usage: csvwrap -w wrap -d delimiter -c code csv-file csv-file" ;
: PreProcess mytib /mytib source! 0 ;
: PostProcess drop ;                   ( n --)
: Process 0 parse type 1+ dup wrap mod if delimiter emit else cr then ;
                                       \ get ASCII delimiter
: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get wrap factor
: get-wrap                             ( --)
  get-argument number error? abort" Invalid wrap" to wrap
;

create options                         \ set ASCII code
  char c , ' get-code ,                \ either as a number
  char d , ' get-delimiter ,           \ or as a character
  char w , ' get-wrap ,                \ get number of fields to wrap
  NULL ,

include lib/convert.4th
