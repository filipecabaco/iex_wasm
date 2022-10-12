\ 4tH Knight jump maker - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This is based on a popular puzzle in Holland. It is a 3x3 matrix,
\ centre unused:

\ IOS
\ E T
\ HHL

\ You have to visit all letters (without visiting them twice) using the
\ movement of a chess knight. You'll get an 8-letter word.

offset sequences 
  0 c, 4 c, 5 c, 1 c, 7 c, 3 c, 2 c, 6 c,
  0 c, 6 c, 2 c, 3 c, 7 c, 1 c, 5 c, 4 c,

include lib/choose.4th                 \ for CHOOSE

8 constant /sequence                   \ size of a sequence
8 constant /knight                     \ size of puzzle
3 constant /grid                       \ size of grid

/knight 1+ string knight               \ original string
/knight 1+ string puzzle               \ new puzzle

: enter                                ( --)
  begin                                \ we don't accept incomplete puzzles
    ." Enter an 8-letter word: " knight 8 accept 8 <
  while
    ." Too short, try again.." cr
  repeat
;

: makepuzzle                           ( --)
  cr 2 choose /sequence * /knight choose
                                       \ choose a sequence
  /knight 0 do
    over over i + /knight mod + sequences chars puzzle + 
    knight i chars + c@ swap c!        \ fill the matrix
  loop drop drop                       \ drop sequence and offset
                                       \ make room for centre space
  puzzle /grid 1+ + dup dup 1+ /grid 1+ cmove bl swap c! 
  /grid 0 do /grid 0 do puzzle i j /grid * + chars + c@ emit loop cr loop
;                                      \ show puzzle

enter makepuzzle
