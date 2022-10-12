\ 4tH library - SlowSort - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]

: (slowsort)                           ( n1 n2 a --)
  >r over over < 0= if r> drop drop drop exit then
  over over over + 2/ r@ (slowsort)    \ slowsort (a, n1, m)
  over over + 2/ 1+ over r@ (slowsort) \ slowsort (a, m+1, n2)
  over over + 2/ cells r@ + @ over cells r@ + @ swap precedes
  if
    over over + 2/ cells r@ + over cells r@ + over @ over @ swap rot ! swap !
  then
  1- r> (slowsort)                     \ slowsort (a, n1, n2-1)
;

: sort 0 swap 1- rot (slowsort) ;

[DEFINED] 4TH# [IF]
  hide (slowsort)
[THEN]
[THEN]
