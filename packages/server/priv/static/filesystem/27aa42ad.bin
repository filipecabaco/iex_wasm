\ 4tH library - COCKTAIL SORT - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: sort
  1- cells bounds 2>r false
  begin
    0= dup
  while
    2r@ ?do
       i cell+ @ i @ over over precedes     ( mark unsorted )
       if i cell+ ! i ! dup xor else drop drop then
    1 cells +loop
    0= dup
  while
[DEFINED] 4TH# [IF]
    2r@ cell- swap cell- ?do
[ELSE]
    2r@ swap 1 cells - ?do
[THEN]
       i cell+ @ i @ over over precedes     ( mark unsorted )
       if i cell+ ! i ! dup xor else drop drop then
    -1 cells +loop
  repeat drop 2r> 2drop
;
[THEN]
