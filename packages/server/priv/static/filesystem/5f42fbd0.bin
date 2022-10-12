\ 4tH library - 4tH optimized insertion sort - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         \ compatible with QSORT
[THEN]

: sort                                 ( array len -- )
  dup 2 < if 2drop exit then
  1 ?do
    dup i cells + tuck dup @ >r        ( end start end)
    begin over over < while r@ over cell- @ precedes while cell- repeat
    rot over - dup 0> if over dup cell+ rot smove else drop then r> swap !
  loop drop                            ( --)
;
[THEN]
