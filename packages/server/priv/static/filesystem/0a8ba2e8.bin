\ 4tH library - date recognition - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This heavy duty routine is able to recognize most commonly used date formats
\ in an intelligent way, including XLS formats (integer only). Note you should
\ not use this routine if you're parsing pre-defined formats. Use one of the
\ component routines instead. If the format is not recognized, the original
\ string is returned.

[UNDEFINED] getdate  [IF]
[UNDEFINED] S>DATE   [IF] include lib/todate.4th   [THEN]
[UNDEFINED] LOG>DATE [IF] include lib/m3todate.4th [THEN]
[UNDEFINED] USA>DATE [IF] include lib/ustodate.4th [THEN]
[UNDEFINED] SPLIT    [IF] include lib/scanskip.4th [THEN]
[UNDEFINED] '-'      [IF] include lib/chars.4th    [THEN]
[UNDEFINED] XLS>JDAY [IF] include lib/time.4th     [THEN]

: ndate>s 10000 * swap 100 * + +  <# # # '-' hold # # '-' hold # # # # #> ;

: getdate                              ( a1 n1 -- a2 n2)
  2dup ',' split 2nip number error?
  if                                   \ not a number, so it is a long format
    drop 2dup s>date >r over over + 2 = r> tuck 1970 = and
    if                                 \ check for 'common log' like dates
      drop drop drop 2dup log>date
      if                               \ check for Asian formatted dates
        drop drop drop 2dup asian>date
        if                             \ check for American dates
          drop drop drop 2dup usa>date
          if                           \ no success, so repeat the string
            drop drop drop exit        \ which the user entered
          then
        then
      then
    then
  else                                 \ decode numeric dates
    dup 45000 <                        \ assume more recent dates, so
    if                                 \ this has to be an Excel serial date
      xls>jday jdate
    else                               \ this could be a 'flat' ISO 8601 date
      n>date
    then
  then ndate>s 2nip
;
[THEN]

\ s" 25-MAR-1960" getdate type cr
\ s" December 26th 1981" getdate type cr
\ s" 20031105" getdate type cr
\ s" 02/12/39" getdate type cr