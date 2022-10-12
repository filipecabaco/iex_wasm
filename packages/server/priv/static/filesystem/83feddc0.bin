\ Detect a cycle in a list structure. This is a modified form of Brent's
\ algorithm.

\ The code marked *** assumes that this is a linked list where the first
\ cell contains the address of the next node; modify it to suit whatever
\ linked structures are being tested. Input is a node; output is a node
\ & the number of entries in the loop, or 0 0 when no cycles are found.

: cycle?                               ( node -- node' n | 0 0 ) 
  1 >r 0 >r dup                        ( find a cycle )
  begin                                ( hare, *** )
    @ over over <> over 0<> and        ( tortoise <> hare, hare <> 0 )
  while                                ( teleport tortoise to hare )
    r> dup r@ = if drop r> 2* >r nip dup 0 then 1+ >r
  repeat
  nip r> over 0= if drop 0 then r> drop
;

hex

variable a 0 a !
variable b a b !
variable c b c !
variable d c d !
variable e d e !
variable f e f !
variable g f g !
variable h g h !

( connect lists in a cycle )
g c !

cr

a dup . ." -> " @ . cr
b dup . ." -> " @ . cr
c dup . ." -> " @ . cr
d dup . ." -> " @ . cr
e dup . ." -> " @ . cr
f dup . ." -> " @ . cr
g dup . ." -> " @ . cr
h dup . ." -> " @ . cr

h cycle? . . cr