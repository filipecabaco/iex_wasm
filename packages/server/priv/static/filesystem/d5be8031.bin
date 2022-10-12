\ 4tH library - CSV writer - Copyright 2012, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] CSVcr    [IF]
[UNDEFINED] csv-type [IF] include lib/csvtype.4th [THEN]

variable CSVfield                      \ Number of CSV fields
variable CSVcol                        \ Current CSV column

file CSV                               \ file descriptor for XMLS file

: (?delimiter) CSVcol @ if ';' emit then ;
                                       \ CSV equivalents of CR, . and TYPE
: >CSV CSV use ;                       ( --)
: CSV# >CSV (?delimiter) type 1 CSVcol +! ;
: CSV. <# #s #> CSV# ;                 ( n --)
: CSVtype >CSV (?delimiter) ';' csv-type 1 CSVcol +! ;
                                       \ start a new line
: CSVcr                                ( --)
  >CSV CSVcol @ dup CSVfield @ max dup CSVfield ! swap 1 max -
  0 ?do ';' emit loop cr 0 CSVcol !
;
                                       ( --)
: CSVclose CSVcol @ if CSVcr then CSV close ;
                                       \ open a CSV file
: CSVopen                              ( a n -- f)
  output open dup to CSV error? dup >r
  if drop else use 0 dup CSVfield ! CSVcol ! then r>
;                                      \ init variables

[DEFINED] 4TH# [IF]
  hide CSVcol
  hide CSVfield
  hide CSV
  hide >CSV
  hide (?delimiter)
[THEN]
[THEN]

\ A small example
\ s" csv4th.csv" CSVopen 0= if s" Label2" CSVtype s" Label3" CSVtype
\ s" Label4" CSVtype CSVcr CSVcr 4 CSV. 5 CSV. 6 CSV. CSVclose then depth .
