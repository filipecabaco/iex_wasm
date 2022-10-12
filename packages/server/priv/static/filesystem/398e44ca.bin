\ 4tH library - FATAN2 ZEN - Copyright 2009, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/zenfloat.4th

[UNDEFINED] fatan2  [IF]
[UNDEFINED] fatan   [IF] include lib/zenfasin.4th [THEN]

\ x == 0 and y == 0   invalid operation
\ x == 0 and y < 0    -(pi/2)
\ x == 0 and y > 0    pi/2
\ x > 0               arctan (y/x)
\ x < 0 and y < 0     arctan (y/x) - pi
\ otherwise           arctan (y/x) + pi

: fatan2                               ( sin[y] cos[x] -- rad)
  2dup f0= if                          \ if x equals 0
    2drop 2dup f0= E.FPERR throw" Invalid operation"
    f0< >r 314159265 -8 2 s>f f/ r> if fnegate then
  else                                 \ if x doesn't equal zero
    2over 2over f/ fatan               \ calculate arctan(y/x)
    2swap f0< if 314159265 -8 2rot f0<
    if fnegate then f+ else 2swap 2drop then
  then                                 \ adjust accordingly
;
[THEN]

\ -2 s>f  0 s>f fatan2 f. cr
\  2 s>f  0 s>f fatan2 f. cr
\  2 s>f  2 s>f fatan2 f. cr
\ -2 s>f -2 s>f fatan2 f. cr
\  0 s>f  2 s>f fatan2 f. cr
\  0 s>  -2 s>f fatan2 f. cr
\  2 s>f -2 s>f fatan2 f. cr
\  0 s>f  0 s>f fatan2 f. cr
