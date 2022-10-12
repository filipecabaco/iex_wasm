\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

\ A traveller gets diverted and has to make an unscheduled stop in what turns
\ out to be Shangri La. Opting to leave, he is allowed to take as much as he
\ likes of the following items, so long as it will fit in his knapsack, and he
\ can carry it. He knows that he can carry no more than 25 'weights' in total;
\ and that the capacity of his knapsack is 0.25 'cubic lengths'.

\ Looking just above the bar codes on the items he finds their weights and
\ volumes. He digs out his recent copy of a financial paper and gets the value
\ of each item.

\ See: http://rosettacode.org/wiki/Knapsack_problem/Unbounded

: weight cell+ ;
: volume 2 cells + ; 
: nummer 3 cells + ;

\      item value weight volume nummer (in reverse)

4 array panacea
4 array ichor
4 array gold
3 array sack

: reset
  0 25  3 30  4 0 do panacea i th ! loop
  0 15  2 18  4 0 do   ichor i th ! loop
  0  2 20 25  4 0 do    gold i th ! loop
  250  250 0  3 0 do    sack i th ! loop
;

: fits? ( item -- ? )
  dup weight @ sack weight @ > if drop false exit then
      volume @ sack volume @ > 0= ;
 
: add ( item -- )
  dup        @        sack        +!
  dup weight @ negate sack weight +!
  dup volume @ negate sack volume +!
  1 swap nummer +! ;
 
: take ( item -- )
  dup        @ negate sack        +!
  dup weight @        sack weight +!
  dup volume @        sack volume +!
  -1 swap nummer +! ;
 
variable max-value
variable max-pan
variable max-ich
variable max-au
 
: .solution
  max-pan @ . ." Panaceas, "
  max-ich @ . ." Ichors, and "
  max-au  @ . ." Gold for a total value of "
  max-value @ 100 * . cr ;
 
: check
  sack @ max-value @ < if exit then
  sack           @ max-value !
  panacea nummer @ max-pan   !
  ichor   nummer @ max-ich   !
  gold    nummer @ max-au    !
  ( .solution ) ;                      \ change to see all solutions
 
: solve-gold
  gold fits? if gold add  recurse  gold take
  else check then ;
 
: solve-ichor
  ichor fits? if ichor add  recurse  ichor take then
  solve-gold ;
 
: solve-panacea
  panacea fits? if panacea add  recurse  panacea take then
  solve-ichor ;

reset solve-panacea .solution
