\ Original Basic version by CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY
\ 4tH version by Hans Bezemer, 2007

include lib/choose.4th
include lib/enter.4th

variable car
variable distance
variable train

: magnitude choose + ;

: question                             ( -- n)
  ." A car traveling " car ?
  ." MPH can make a certain trip in " distance ?
  ." hours less than a train traveling at " train ?
  ." MPH. How long does the trip take by car? " enter
;

: calculate                            ( n1 -- n2 n3)
  distance @ train @ * car @ train @ - / tuck
  over - 100 * swap / abs 
;

: evaluate                             ( n1 n2 --)
  dup 5 >
  if ." Sorry. You were off by " 
  else ." Good! Answer within " 
  then . ." percent." cr
  ." Correct answer is " . ." hours." cr
;

: session
  ." Time - speed - distance exercise" cr
  40 25 magnitude car !
   5 15 magnitude distance ! 
  20 19 magnitude train !
  question calculate evaluate
;

: main
  begin session cr ." Another problem (0 = no, 1 = yes) " enter cr 0= until
;

main
