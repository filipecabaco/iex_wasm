\ 4tH Knight jump - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This is based on a popular puzzle in Holland. It is a 3x3 matrix,
\ centre unused:

\ IOS
\ E T
\ HHL

\ You have to visit all letters (without visiting them twice) using the
\ movement of a chess knight. You'll get an 8-letter word. This one uses a
\ brute force algorithm. "Used" is a bitmap of the used cells. "Path" is a
\ kind of execution plan, 0 is left jump, 1 is right jump. Invalid paths are
\ aborted. Actually, only 2 paths are valid per cell, so 16 in total:

\ 0: 26, 79; 1: 67, 122; 2: 83, 104; 3: 80, 105; 4: 13, 30; 5: 6, 61 
\ 6: 39, 52; 7: 33, 116

include lib/bits.4th                   \ for BIT and SET

8 constant /knight                     \ number of cells

/knight string knight                  \ compose solution here
/knight 1+ string puzzle               \ original puzzle

offset jumps                           \ possible jumps per cell
  4 c, 6 c, 5 c, 7 c, 6 c, 3 c, 2 c, 7 c,
  0 c, 5 c, 1 c, 4 c, 0 c, 2 c, 1 c, 3 c,

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
                                       \ evaluate an execution path
: try                                  ( path used current -- path)
  /knight 1- 0 do                      ( p u c)
    rot over 2* over i bit if 1+ then jumps
    >r rot dup r@ bit                  ( c p u f r:n)
    if                                 \ if we've been there
      r> drop drop nip unloop exit     \ this is not a valid path, exit
    else                               \ this is a valid path, it's untouched
      rot drop r>                      ( p u c)
      puzzle over chars + c@ knight i 1+ chars + c!
      tuck set swap                    \ mark the letter and add to solution 
    then                               \ show the solution
  loop drop drop knight /knight type cr 
;
                                       \ knight jump solver
: solve                                ( --)
  /knight 0 do                         \ try all eight letters
    puzzle i chars + c@ knight c!      \ set the first letter
    0 begin dup 128 < while 0 i set i try 1+ repeat drop
  loop                                 \ now try all possible paths
;

enter solve  

