\ 4tH library - Range expansion - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The list of integers:
\    -6, -3, -2, -1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20 
\ Is accurately expressed by the range expression:
\    -6,-3--1,3-5,7-11,14,15,17-20 
\ Expand the range description.

include lib/scanskip.4th
[UNDEFINED] chop [IF] : chop 1 /string ; [THEN]

: .range                               ( a n --)
  over c@ [char] - = dup >r if chop then [char] - split
  number dup 0< abort" Invalid start of range"
  r> if negate then >r chop            \ save sign of start of range and reapply
  number error? abort" Invalid end of range" 1+ r>
  ?do i . loop                         \ increment end to match loop range
;

: expand-range                         ( a n --)
  begin                                \ split at comma
    [char] , split 2dup number error?  \ is it a number, then print it
    if drop .range else . 2drop then dup
  while                                \ otherwise expand a range
    chop                               \ skip comma delimiter
  repeat 2drop cr                      \ drop remaining string
;

s" -6,-3--1,3-5,7-11,14,15,17-20" expand-range