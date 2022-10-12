\ Copyright BASIC version - Creative Computing, Morristown, New Jersey
\ Copyright 4tH version - 2003,2009 J.L. Bezemer

[needs lib/enter.4th]
[needs lib/random.4th]

: wins? dup 2 < dup ;

: start
  ." This is a game called '23 matches'." cr cr
  ." When it is your turn, you may take one, two, or three" cr
  ." matches. The object of the game is not to have to take" cr
  ." the last match." cr cr

  ." Let's flip a coin to see who goes first." cr
  ." If it comes up heads, I will win the toss." cr cr

  randomize random 1 and 
  if
    ." Heads! I win! Ha! Ha!" cr 
    ." Prepare to lose, meatball-nose!!" cr
    ." I take 2 matches" cr
    2 - 
  else
    ." Tails! You go first. " cr
  then 
;

: user-moves
  ." The number of matches is now " dup . cr
  ." Your turn -- you may take 1, 2 or 3 matches." cr

  begin
    ." How many do you wish to remove? " 
    enter over 1- 3 min over  
    swap > over 1 < or
  while
    drop
    ." Very funny! Dummy!" cr 
    ." Do you want to play or goof around?" cr
  repeat

  swap over - 

  ." There are now " dup . ." matches remaining." cr
;

: user-wins?
  wins?
  if
    cr ." You won, floppy ears!" cr
    ." Think you're pretty smart!" cr 
    ." Let's play again and I'll blow your shoes off!!" cr
  then
;

: computer-moves
  dup 5 <
  if
    nip dup 1-
  else
    4 rot -
  then

  cr ." My turn! I remove " dup . ." matches." cr -
;

: computer-wins?
  wins? 
  if 
    ." You poor boob! You took the last match! I gotcha!!" cr
    ." Ha! Ha! I beat you!!!" cr
    ." Goodbye loser!" cr
  then
;

: game
  begin
    user-moves
    user-wins?
    if exit then

    computer-moves
    computer-wins?
    if exit then
  again
;

: matches
  start
  game
  drop
;

23 matches
