\ 4tH library - Circle sort - Copyright 2014, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN] 

variable (sorted?)                     \ is the array sorted?

: (compare)                            ( a1 a2 -- a1 a2)
  over @ over @ precedes               \ flag if swapped
  if over over over @ over @ swap rot ! swap ! false (sorted?) ! then
;

: (circlesort)                         ( a1 a2 --)
  over over = if drop drop exit then   \ quit if indexes are equal
  over over swap                       \ swap indexes (end begin)
  begin
    over over >                        \ as long as middle isn't passed
  while
    (compare) swap cell- swap cell+    \ check and swap opposite elements
  repeat rot recurse recurse           \ split array and recurse
;

: sort                                 ( a n --)
  1- cells over +                      \ calculate addresses
  begin true (sorted?) ! over over (circlesort) (sorted?) @ until drop drop
;

[DEFINED] 4TH# [IF]
  hide (compare)
  hide (circlesort)
  hide (sorted?)
[THEN]
[THEN]
