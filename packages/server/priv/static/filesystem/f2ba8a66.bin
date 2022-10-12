\ 4tH Knight jump - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This is based on a popular puzzle in Holland. It is a 3x3 matrix,
\ centre unused:

\ IOS
\ E T
\ HHL

\ You have to visit all letters (without visiting them twice) using the
\ movement of a chess knight. You'll get an 8-letter word. Actually, only
\ 2 paths are valid per cell, so 16 in total:

\ 1 7 3 2 6 0 4 5 
\ 7 3 2 6 0 4 5 1
\ 3 2 6 0 4 5 1 7
\ 2 6 0 4 5 1 7 3
\ 6 0 4 5 1 7 3 2
\ 0 4 5 1 7 3 2 6 
\ 4 5 1 7 3 2 6 0
\ 5 1 7 3 2 6 0 4

\ 5 4 0 6 2 3 7 1
\ 4 0 6 2 3 7 1 5
\ 0 6 2 3 7 1 5 4 
\ 6 2 3 7 1 5 4 0
\ 2 3 7 1 5 4 0 6 
\ 3 7 1 5 4 0 6 2
\ 7 1 5 4 0 6 2 3 
\ 1 5 4 0 6 2 3 7

\ These can be condensed into 2 8-byte sequences:

offset sequences 
  0 c, 4 c, 5 c, 1 c, 7 c, 3 c, 2 c, 6 c,
  0 c, 6 c, 2 c, 3 c, 7 c, 1 c, 5 c, 4 c,

8 constant /sequence                   \ size of a sequence
8 constant /puzzle                     \ size of puzzle

/puzzle 1+ string puzzle               \ original puzzle
                                       \ solve a sequence
: solve                                ( offset --)
  /puzzle 0 do                         \ different starting points
    /puzzle 0 do
      puzzle over j i + /puzzle mod + sequences chars + c@ emit
    loop cr
  loop drop                            \ drop offset
;

: enter                                ( --)
  begin
    ." Enter the letters that form the knightjump puzzle in this order:" cr cr
    ." 123" cr
    ." 4 5" cr
    ." 678" cr cr
    ." Enter: " puzzle 8 accept 8 <    \ we don't accept incomplete puzzles
  while
    ." Too short, try again.." cr
  repeat
;
 
enter 0 solve /sequence solve
