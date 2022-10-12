\ TicTacToe - Copyright 1997, 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/enter.4th
                                       \ convert to display coordinates
table convert 0 , 1 , 2 , 5 , 8 , 7 , 6 , 3 , 4 , does> swap 1- th @c ;

1 constant X                           \ X (computer)
2 constant O                           \ O (human)
9 string   board                       \ Starting Forth page 214
                                       \ -- This code by Leo Brodie --
: clear board 9 0 fill ;               \ THIS CODE MAY BE COPYRIGHTED
: bar ." | " ;
: dashes cr ." ---------" cr ;
: used X = if ." X " else ." O " then ;
: .box chars board + c@ dup if used else drop 2 spaces then ;
: display cr 9 0 do I if I 3 mod if bar else dashes then then I .box loop cr ;
: play swap 0 max 8 min chars board + dup c@ if 2drop else c! then ;
: x! convert X play display ;
: o! convert O play ;
                                       \ -- End of code by Leo Brodie --
: fnM + 1- 8 mod 1+ ;                  ( n1 n2 -- n3)

: EndGame                              ( n --)
  x!                                   \ final computer move
  cr ." You lose." cr                  \ since you've lost
  quit
;

: Player                               ( c1 -- p1)
  x!                                   \ computers move
  cr
  ." 123" cr
  ." 894" cr
  ." 765 Your move: " enter dup
  o!                                   \ my move
;
                                       \ calculate computer move
: Computer fnM dup ;                   ( p1 n1 -- c2 c2)
: Draw 6 fnM x! cr ." It's a draw." cr ;

: EndGame?                             ( p1 c2 n1)
  Computer rot <>                      ( c3 f)
  if EndGame else drop then
;

: 1stMove?                             \ was the first move fatal?
  swap 2 mod 0=                        ( c3 f)
  if 7 fnM EndGame then                ( c3)
;
                                       \ computer/player turn
: Moves                                ( n1 n2 -- n1)
  Computer                             ( c1 c1)
  Player                               ( c1 p1)
  over 4 EndGame?                      ( c1)
;
                                       \ now play the game!
: TicTacToe
   clear 9                             ( c1)
                                       \ computer takes centre
   Player dup                          ( p1)
                                       \ store the first move
   1 Moves                             \ play second move
   2 Moves                             \ play third move
   1stMove?                            \ was 1st move fatal?
   3 Moves                             \ play fourth move
   Draw                                \ it's a draw
;

TicTacToe
