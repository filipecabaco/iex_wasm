\ Copyright 1983, S.D. Collier 
\ A Jupiter Ace computer game
\ First published in Practical Computing, May 1983
\ Converted to 4tH by Hans Bezemer, March 2010

include lib/enter.4th
include lib/choose.4th

VARIABLE RPOS

: AGAIN? CR CR ." To play again type GAME" DROP CR QUIT ; 
: TH? ( Guess too high? ) DUP RPOS @ > IF ." Too high !" CR THEN ;
: TL? ( Guess too Low? )  DUP RPOS @ < IF ." Too low !!" CR THEN ;
: EQ? ( Guess correct? )  DUP RPOS @ = IF ." Correct !!" CR AGAIN? THEN ;

: INST ( Instructions ) ." I will hide in a building of 100"
  CR ." floors. I will give you 9 goes to "
  CR ." guess where I am." CR CR ;

: GAME ( Put it all together ! ) INST 100 CHOOSE 1+ RPOS ! 0 10 1 DO 
  DROP ." Guess " I . ENTER DUP . TH? TL? EQ? LOOP
  ." It was room " RPOS ? CR AGAIN? ;
  
game