\ 4tH library - Fixed length fields - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fields! [IF]
[UNDEFINED] 2!      [IF] include lib/anscore.4th [THEN]

2 constant /layout                     \ size of the layout array
aka 2! fields!                         ( fields buffer x --)

: next-field                           ( x -- a n)
  dup >r @ r@ cell+ @ @c dup           \ get the field
  if 2dup chars + r@ ! 1 cells r> cell+ +! else r> drop then
;                                      \ now increment the variables
[THEN]
