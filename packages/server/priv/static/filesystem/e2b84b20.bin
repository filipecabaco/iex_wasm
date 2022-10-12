\ 4tH library - Ordinal date - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] oday [IF]
[UNDEFINED] jday [IF] include lib/time.4th [THEN]
                                       ( d m y -- wday yday y)
: ODAY dup >r jday dup 7 mod 1+ swap 31 12 r@ 1- jday - r> ;
: ODATE 31 12 rot 1- jday + jdate ;    ( yday y -- d m y)

\ Taken from: http://www.merlyn.demon.co.uk/weekinfo.htm#WPY
: (ends) dup >r 4 / r@ 100 / - r@ 400 / + r> + 7 mod ;
: week53? dup 1- (ends) 3 = over (ends) 4 = or ;
                                       \ returns ISO 8601 weekday and week
: DATE>WEEK                            ( d m y -- wday week y)
  oday >r over swap over over 3 + >    \ check if last week of last year
  if drop drop 52 r> 1- week53? if swap 1+ swap then exit then
  swap - 10 + 7 / r> over 53 =         \ check if first week of next year
  if week53? 0= if swap 1 and swap 1+ then then
;                                      \ convert ISO 8601 weekday and week
                                       ( wday week y -- d m y)
: WEEK>DATE >r 7 * + 4 1 r@ jday 7 mod 4 + - r> odate ;

[DEFINED] 4TH# [IF]
  hide (ends)
  hide week53?
[THEN]
[THEN]
