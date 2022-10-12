\ 4tH library - COMBSORT with different end - Copyright 2011,2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort [IF]
include lib/ins2sort.4th               \ obviously, no sort was included yet
aka sort insertionsort                 \ rename insertionsort
hide sort                              \ now forget the old name
                                       \ note PRECEDES is already defined
: sort
  dup >r over over cells + >r          ( a n R: n a+n)
  begin
    10 13 */ dup 8 >                   ( a g)
  while
    over over cells over + r@ swap     ( a g a a+n a+g)
    do i @ over @ precedes if i @ over @ i ! over ! then cell+ 1 cells +loop
    drop
  repeat r> drop drop r> insertionsort
;
[THEN]
