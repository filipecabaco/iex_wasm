\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

\ Run random simulations of the Monty Hall game. Show the effects of a
\ strategy of the contestant always keeping his first guess so it can be
\ contrasted with the strategy of the contestant always switching his guess.

include lib/choose.4th

variable stay-wins
variable switch-wins
 
: trial ( -- )
  3 choose 3 choose ( prize choice )
  = if 1 stay-wins +!
  else 1 switch-wins +!
  then ;
: trials ( n -- )
  0 stay-wins ! 0 switch-wins !
  dup 0 do trial loop
  stay-wins   @ . [char] / emit dup . ." staying wins"   cr
  switch-wins @ . [char] / emit     . ." switching wins" cr ;
 
1000 trials