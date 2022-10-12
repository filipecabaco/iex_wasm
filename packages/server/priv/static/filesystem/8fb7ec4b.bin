\ 4tH library - MINSTD - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ MINSTD, a Lehmer random number generator in the form of
\ X(k+1) = g * X(k) mod n, where g = 7^5 and n = 2^31 - 1
\ The other numbers were added to prevent overflow in 32 bits

[UNDEFINED] random [IF]
variable seed                          \ seed variable
2147483647 constant max-rand           \ maximum random number

: random                               ( -- n)
  seed @ 127773 /mod 2836 * swap 16807 * swap -
  dup 0> 0= if 2147483647 + then max-rand and dup seed !
;

: randomize time seed ! ;              ( -- )
[THEN]

\ 123456789 seed ! random . seed ?