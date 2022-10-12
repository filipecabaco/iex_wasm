\ 4tH library - CYCLE SORT - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ A sorting algorithm that minimizes writes
\ See: http://en.wikipedia.org/wiki/Cycle_sort

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]                                 \ compatible with QSORT

variable (writes)
                                       \ find and perfom a 'write'
: (put_item)                           ( it pos -- it' pos)
  begin over over @ = while cell+ repeat
  dup @ >r tuck ! r> swap 1 (writes) +!
;

: sort
  0 (writes) ! cells over + dup cell- rot 
  ?do                                  ( end)
    i @ over i cell+ i -rot            ( end it pos lim st )
    ?do over i @ swap precedes if cell+ then 1 cells +loop
    dup i <>
    if
      (put_item)
      begin
        dup i <>
      while
        drop over i cell+ i -rot       ( end it pos lim st )
        ?do over i @ swap precedes if cell+ then 1 cells +loop (put_item)
      repeat
    then drop drop
  1 cells +loop drop
;
[DEFINED] 4TH# [IF] hide (put_item) [THEN]
[THEN]
