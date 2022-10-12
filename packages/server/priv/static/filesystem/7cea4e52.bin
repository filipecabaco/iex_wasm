\ 4tH library - Odd Even Mergesort - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: (compare)                            ( a n -- a+n a)
  cells over + swap                    ( a+n a)
  over @ over @ precedes if over over over @ over @ swap rot ! swap ! then
;

: (oddEvenMerge)                       ( a n1 n2 --)
  over over 2* >
  if
    >r over over r@ 2* recurse
    over r@ cells + over r@ 2* recurse
    over >r cells + r> r@ cells +
    begin over over r@ cells + > while r@ (compare) drop r@ cells + repeat
    r> drop
  else
    nip (compare)
  then drop drop
;                                      \ ** ATTENTION **
                                       \ n MUST be a power of 2!!!
: sort                                 ( a n --)
  dup 1 >
  if
    over over 2/ recurse
    over over 2/ cells + over 2/ recurse
    1 (oddEvenMerge) exit
  then drop drop
;

[DEFINED] 4TH# [IF]
  hide (oddEvenMerge)
  hide (compare)
[THEN]
[THEN]