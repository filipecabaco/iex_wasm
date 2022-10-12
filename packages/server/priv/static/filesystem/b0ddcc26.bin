\ 4tH CSVSORT - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The first line of the CSV file MUST contain a list of all fields involved.

include lib/parsing.4th                \ for PARSE-CSV?
include lib/csv-w.4th                  \ for CSVtype
include lib/argopen.4th                \ for ARG-OPEN
include lib/getopts.4th                \ for GET-OPTIONS
include lib/compare.4th                \ for COMPARE
include lib/heapsort.4th               \ for HEAPSORT
include lib/csvfrom.4th                \ for CSV>

1024   *constant K                     \ scaling factors CSV buffer
1024 K *constant M

48 K constant /csv                     \ maximum CSV filesize
 255 constant max-fields               \ maximum number of fields
  32 constant max-length               \ maximum length of field

char ; value delimiter                 \ the delimiter (ASCII value)
0 value #fields                        \ number of fields
0 value /line                          \ length of a line
0 value selector                       \ field to sort

max-fields max-length * constant /buffer
max-fields array length-fields         \ array with field lengths
/buffer string field-names             \ array with field names
/buffer string bigTIB                  \ alternate TIB
/csv buffer: csv-buffer                \ buffering CSV file

: >address                             ( n1 n2 a1 -- a2 a3) 
  >r /line * length-fields selector th @ + r@ +
  swap /line * length-fields selector th @ + r> +
;
                                       \ field is smaller when negative
:noname >address count rot count compare 0< ; is precedes
                                       \ for numeric fields
: precedes-numeric >address count number swap count number < ;

:noname                                \ line swapping routine
  >r /line * r@ + swap /line * r> +    \ calculate addresses
  dup bigTIB /line cmove               \ move to temporary storage
  over >r /line cmove                  \ overwrite first line
  bigTIB r> /line cmove                \ move from temporary storage
; is exchange                          \ overwrite second line

: get-header refill 0= abort" Cannot read header" ;
                                       \ buffer with field names
: initialize                           ( --)
  bigTIB /buffer source! get-header    \ initialize big TIB
  0 field-names >r                     \ initialize variables
  begin                                \ start scanning field names
    delimiter parse-csv?               \ parse the header
  while                                \ if not EOL
    r@ place r> count 1+ chars + >r 1+ \ save column name, increment counter
  repeat                               \ next field
  2drop r> drop dup to #fields         \ clean up and save number of columns
  0 ?do 0 length-fields i th ! loop    \ initialize column length 
;

: scan-fields                          ( --)
  #fields 0 ?do                        \ scan all fields
    delimiter parse-csv csv> nip 1+    \ get length of field and update
    length-fields i th dup @ rot max swap !
  loop                                 \ next field
;

: scan-file                            ( -- n)
  0 begin refill while scan-fields 1+ repeat
  0 #fields over ?do dup length-fields i th dup @ >r ! r> + loop to /line
;                                      \ scan fields and otain lengths
                                       \ read the file in a structured manner
: read-file                            ( h n -- n)
  dup /line * /csv > abort" File too large"
  over rewind abort" Cannot rewind file"
  get-header 0 begin                   \ begin scanning after header
    refill                             \ get the next line
  while                                \ until no more lines
    #fields 0 ?do                      \ read all fields
      dup /line * length-fields i th @ chars + csv-buffer + delimiter
      parse-csv csv> rot place         \ get field and place it in buffer
    loop 1+                            \ count the lines
  repeat drop swap close               \ clean up and close file
;
                                       \ painless sort ;-)
: sort-file csv-buffer over heapsort ; ( n -- n)

: write-file                           ( n --)
  option-index args CSVOpen abort" Cannot write CSV file"
  field-names #fields 0 do count 2dup CSVtype 1+ chars + loop drop CSVcr
  0 ?do                                \ write all lines
    #fields 0 ?do                      \ write all fields
      j /line * length-fields i th @ chars + csv-buffer + count CSVtype
    loop CSVcr                         \ write next line
  loop CSVclose                        \ close the files
;

: get-delimiter                        ( --)
  get-argument drop c@ to delimiter    \ use first character
;
                                       \ get ASCII code delimiter
: get-code                             ( --)
  get-argument number error? abort" Invalid ASCII code" to delimiter
;
                                       \ get ASCII code delimiter
: get-field                            ( --)
  get-argument number error? abort" Invalid field number"
  dup 0< abort" Field number must be positive" to selector
;
                                       \ set field is numeric
: set-numeric ['] precedes-numeric is precedes ;

create options
  char d , ' get-delimiter ,
  char c , ' get-code ,
  char f , ' get-field ,
  char n , ' set-numeric ,
  NULL ,

: OpenFile                             ( -- h)
  options get-options input option-index dup 1+ argn >
  abort" Usage: csvsort -d delimiter -c code -f field -n csv-file"
  arg-open
;

: csvsort                              ( --)
  OpenFile                             \ open file
  initialize                           \ scan the header
  scan-file                            \ scan the fields
  read-file                            \ read the contents
  sort-file                            \ sort the contents
  write-file                           \ write the sorted file
;

csvsort