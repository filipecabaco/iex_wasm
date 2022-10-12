\ Forth version of the 99 Bottles program.
\ Dan Reish, dreish@izzy.net

: .bottles ( n -- n-1 )
   dup 1 = IF  ." One bottle of beer on the wall," CR
           ." One bottle of beer," CR
           ." Take it down," 
   ELSE  dup . ." bottles of beer on the wall," CR
     dup . ." bottles of beer," CR
     ." Take one down," 
   THEN
   CR
   ." Pass it around," CR
   1-
   DUP IF DUP 1 = IF  ." One bottle of beer on the wall;" 
        ELSE  dup . ." bottles of beer on the wall;" 
        THEN
    ELSE  ." No more bottles of beer on the wall." 
   THEN
   CR
;

: bottles ( n -- )
  BEGIN  .bottles DUP 0= UNTIL DROP
;

99 bottles
