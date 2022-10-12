\ 4tH library - PANCAKE SORT - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( addr addr -- flag )
[THEN]

: (flip)                               ( a n --)
  1- cells over +                      \ calculate addresses
  begin
    over over <                        \ as long we didn't pass the middle
  while                                \ swap the numbers
    over @ over @ >r over ! over r> swap !
    1- swap 1+ swap                    \ increment pointers
  repeat 2drop                         \ drop the addresses
;

: sort                                 ( a n --)
  1 swap ?do                           \ find position of the maximum number
    0 i over ?do over i th @ >r over over th @ r> precedes if drop i then loop
    dup i 1- <> if dup if over over 1+ (flip) then over i (flip) then drop
  -1 +loop drop                        \ move number to the end of the range
;
[DEFINED] 4TH# [IF] hide (flip) [THEN]
[THEN]
