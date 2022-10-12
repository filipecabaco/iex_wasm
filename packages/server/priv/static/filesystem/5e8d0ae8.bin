\ 4tH library - Simple Sort - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

: sort
  cells over + dup rot
  ?do
     dup i cell+ ?do i @ j @ precedes if i @ j @ i ! j ! then 1 cells +loop
  1 cells +loop
  drop
;
[THEN]
