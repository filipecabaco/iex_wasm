\ 4tH - Rock, paper, scissors - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/choose.4th
include lib/enter.4th
                                       ( n1 n2 n3 -- n1++ n2++ n3++)
: RR 1+ ." We both chose 'rock'. It's a draw." ;
: PR >r 1+ r> ." You chose 'paper', I chose 'rock'. You win.." ;
: SR rot 1+ -rot ." You chose 'scissors', I chose 'rock'. I win!" ;
: RP rot 1+ -rot ." You chose 'rock', I chose 'paper'. I win!" ;
: PP 1+ ." We both chose 'paper'. It's a draw." ;
: SP >r 1+ r> ." You chose 'scissors', I chose 'paper'. You win.." ;
: RS >r 1+ r> ." You chose 'rock', I chose 'scissors'. You win.." ;
: PS rot 1+ -rot ." You chose 'paper', I chose 'scissors'. I win!" ;
: SS 1+ ." We both chose 'scissors'. It's a draw." ;
                                       ( n --)
create play ' RR , ' PR , ' SR , ' RP , ' PP , ' SP , ' RS , ' PS , ' SS ,
  does> swap 3 choose 3 * + cells + @c execute cr ;
                                       ( --- )
: statistics                           ( cwins pwins draws --)
  ." There were " . ." draws. I lost " . ." times, you lost " . ." times." cr
;

: rock,paper,scissors                  ( ---)
  0 dup dup                            \ setup counters
  begin                                \ enter choice
    ." Rock, paper, or scissors (1 = rock, 2 = paper, 3 = scissors)? " enter
    dup 0>                             \ choice greater than zero?
  while
    1- dup 3 <                         \ decrement choice
  while                                \ choice less than three?
    play                               \ play the game
  repeat drop statistics               \ show statistics
;

rock,paper,scissors