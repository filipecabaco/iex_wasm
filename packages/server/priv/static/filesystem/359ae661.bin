\ 4tH library - FEXP - Copyright 2008,2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fexp [IF]
[UNDEFINED] +taylor [IF] include lib/taylor.4th  [THEN]
[UNDEFINED] e       [IF] include lib/fpconst.4th [THEN]
[UNDEFINED] fpow    [IF] include lib/fpow.4th    [THEN]
[UNDEFINED] ftrunc  [IF] include lib/ftrunc.4th  [THEN]

: (!) over * swap 1+ swap ;

: ^integer               ( float -- integer fraction)
  fdup ftrunc fdup f0< fdup f>d dabs d>u f-
  e fpow if 1 s>f fswap f/ then fswap
;

: ^fraction              ( integer fraction -- float)
  1 dup dup s>f fswap fover
  begin over 13 < while (!) dup +taylor repeat
  drop drop fdrop fdrop f*
;

: fexp ^integer ^fraction ;

[DEFINED] 4TH# [IF]
  hide (!)
  hide ^integer
  hide ^fraction
[THEN]
[THEN]
