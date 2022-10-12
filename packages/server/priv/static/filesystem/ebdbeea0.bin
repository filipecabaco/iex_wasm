\ 4tH library - Daylight Saving Time - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] dst-us? [IF]
[UNDEFINED] jday    [IF] include lib/time.4th [THEN]

: (dst?)                               ( d m y -- f)
  >r over >r >r dup >r jday r> r> execute
  jday over <= r> r> execute jday rot > and
;                                      \ equal or larger than beginning
                                       \ smaller than the end of dst
: (dst) >r >r over 5 * 4 / r> + 7 mod - r> rot ;
: dst-us-begin 14 1 3 (dst)  ;         ( y -- d m y)
: dst-us-end 7 1 11 (dst) ;            ( y -- d m y)
: dst-eu-begin 31 4 3 (dst) ;          ( y -- d m y)
: dst-eu-end 31 1 10 (dst) ;           ( y -- d m y)
: dst-eu? ['] dst-eu-begin ['] dst-eu-end (dst?) ;
: dst-us? ['] dst-us-begin ['] dst-us-end (dst?) ;
                                       ( d m y -- f)
[DEFINED] 4TH# [IF]
  hide (dst)
  hide (dst?)
[THEN]
[THEN]

