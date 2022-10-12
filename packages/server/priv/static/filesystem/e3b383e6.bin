\ 4tH library - Circle sort (different ending) - Copyright 2014, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort    [IF]
[UNDEFINED] lastbit [IF] include lib/bitset.4th [THEN]
include lib/binssort.4th               \ obviously, no sort was included yet
aka sort insertionsort                 \ rename insertionsort
hide sort                              \ now forget the old name

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
  dup lastbit 2/ >r over over 1- cells over + 1
  begin                                \ calculate depth and indexes
    dup r@ <                           \ index reached?
  while                                \ if not, do a circlesort iteration
    true (sorted?) ! 1+ >r over over (circlesort) r> (sorted?) @
  until                                \ quit when sorted

  r> drop drop drop drop (sorted?) @ if drop drop else insertionsort then
;                                      \ change to insertion sort if required

[DEFINED] 4TH# [IF]
  hide (compare)
  hide (circlesort)
  hide (sorted?)
[THEN]
[THEN]
