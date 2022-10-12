\ 4tH library - FATAN2 - Copyright 2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fatan2 [IF]
[UNDEFINED] fatan [IF] include lib/asinacos.4th [THEN]

\ x == 0 and y == 0   invalid operation
\ x == 0 and y < 0    -(pi/2)
\ x == 0 and y > 0    pi/2
\ x > 0               arctan (y/x)
\ x < 0 and y < 0     arctan (y/x) - pi
\ otherwise           arctan (y/x) + pi

: fatan2                               ( sin[y] cos[x] -- rad)
  fdup f0= if                          \ if x equals 0          
    fdrop fdup f0= if FE.INVALID ferror ! exit then
    f0< pi 2 s>f f/ if fnegate then    \ calculate the radian (equals pi/2)
  else                                 \ if x doesn't equal zero
    fover fover f/ fatan               \ calculate arctan(y/x)
    fswap f0< if pi frot f0< if fnegate then f+ else fnip then
  then                                 \ adjust accordingly
;
[THEN]
