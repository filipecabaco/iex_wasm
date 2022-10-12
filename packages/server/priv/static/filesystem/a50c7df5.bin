\ 4tH library - USA Long date format conversion - Copyright 2013,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Converts a large number of "Month Day Year" variations to day, month, year
\ format. It is geared for versatility and correct conversion, NOT for
\ catching format errors. It simply rewrites the common format to the US Army
\ format and then calls the appropriate conversion routine.

[UNDEFINED] usa>date   [IF]
[UNDEFINED] asian>date [IF] include lib/m3todate.4th [THEN]

32 string (temp-date)                  \ temporary buffer

: usa>date                             ( a1 n1 -- d m y f)
  ['] is-type defer@ >r [: is-digit 0= ;] is is-type
  (temp-date) >r split< 2swap r@ place s"  " r@ +place
  begin dup while 2dup 1- chars + c@ is-digit 0= while 1- repeat
  r@ +place r> count asian>date r> is is-type
;

[DEFINED] 4TH# [IF]
  hide (temp-date)
[THEN]
[THEN]
