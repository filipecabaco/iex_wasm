\ Brainiac - Copyright 2007 J.L Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/enter.4th
include lib/choose.4th
include lib/timer.4th

: setup                                ( -- n1 n2 n3)
  timer-reset                          \ reset the timer
  30 choose 70 +                       \ choose the high number
   4 choose  6 + over over             \ choose number to subtract
  ." Let's begin at " swap .           \ show message
  ." and subtract " . ." each time." cr
;

: subtract                             ( n1 n2 -- n3 n2)
  begin                                \ calculate the substraction
    over over - ." Enter: " enter <>   \ user enters his answer
  while                                \ when it is wrong
    ." Wrong, try again: " over . cr   \ let him try again
  repeat tuck - swap                   \ else substract the number
;
                                       ( n1 n2 n3 -- n1)
: go begin over over > while subtract repeat drop drop ;
: result ." You did in in " .elapsed cr ; 
: brainiac setup go result ;

brainiac

  

