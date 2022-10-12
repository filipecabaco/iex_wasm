\ 4tH library - COCKTAIL SORT optimized - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: sort
  1- cells bounds 1
  begin
    >r over over r@ -rot true -rot
[DEFINED] 4TH# [IF]
    r> 0< if cell- swap cell- swap then
[ELSE]
    r> 0< if 1 cells - then
[THEN]
    ?do
      i cell+ @ i @ over over precedes     ( mark unsorted )
      if i cell+ ! i ! dup xor else drop drop then
    over cells +loop
    >r negate >r swap r@ cells + r> r>
  until drop drop drop
;
[THEN]

