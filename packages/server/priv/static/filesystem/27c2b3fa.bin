\ 4tH library - CSV-TYPE - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] csv-type [IF]
[UNDEFINED] break?   [IF] include lib/breakq.4th [THEN]
[UNDEFINED] '"'      [IF] include lib/chars.4th  [THEN]

: (quotes?)                            ( a n c -- a n f)
  false 2swap 2dup 2>r bounds break? '"'
  false 2r@ bounds break? or 2r> rot
;
                                       ( a n --)
: (CSVtype) bounds ?do i c@ dup '"' = if dup emit then emit loop ;
: csv-type (quotes?) if '"' emit (CSVtype) '"' emit ;then (CSVtype) ;
                                       ( a n c --)
[DEFINED] 4TH# [IF]
  hide (quotes?)
  hide (CSVtype)
[THEN]
[THEN]

