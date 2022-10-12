\ 4tH library - Inverted Simple Sort - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]

: sort
  cells over + dup cell- swap rot ?do
    i over ?do i @ j @ precedes if i @ j @ i ! j ! then -1 cells +loop
  1 cells +loop drop
;
[THEN]