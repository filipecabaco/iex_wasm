\ 4tH library - SCAN-FILE - Copyright 2005,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Skips everything until the read string from the input
\ source defined by SOURCE starts with the string defined
\ by count pair a/n. If EOF occurs, it returns false.
\ If the string was found, it returns true.

\ Load definitions when needed
[UNDEFINED] COMPARE [IF]
[NEEDS lib/compare.4th]
[THEN]

[UNDEFINED] line-found? [IF]
defer line-found?                      ( a n -- a n f)

: scan-file                            ( a n -- a n f)
  begin
    refill dup                         \ was a line read?
  while
    drop line-found? dup 0= swap       \ was the string found?
  while
    drop                               \ if not, drop flag and repeat
  repeat
[UNDEFINED] 4TH# [IF] then [THEN]
;

:noname 2dup source drop over compare ; is line-found?
[THEN]
