\ 4tH - Hamming numbers - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Hamming numbers are also known as ugly numbers and also 5-smooth numbers
\ (numbers whose prime divisors are less or equal to 5). Generate the sequence
\ of Hamming numbers, in increasing order.

\ In particular: Show the first twenty Hamming numbers.

include lib/anscore.4th
                   \ declare array
2000 constant /hamming
/hamming array hamming
                   ( n1 n2 n3 n4 n5 n6 n7 -- n3 n4 n5 n6 n1 n2 n8)
: min? >r dup r> min >r 2rot r> ;

: hit?             ( n1 n2 n3 n4 n5 n6 n7 n8 -- n3 n4 n9 n10 n1 n2 n7)
  >r 2dup =        \ compare number with found minimum
  if -rot drop 1+ hamming over cells + @ r@ * rot then
  r> drop >r 2rot r>
;                  \ if so, increment and rotate

: hamming#         ( n1 -- n2)
  1 hamming ! >r   \ set first cell and initialize parms
  0 5 over 3 over 2
  r@ 1 ?do         \ determine minimum and set cell
     dup min? min? min? dup hamming i cells + !
     2 hit? 5 hit? 3 hit? drop
  loop             \ find if minimum equals value
  2drop 2drop 2drop hamming r> 1- cells + @
;                  \ clean up stack and fetch hamming number

21 1 ?do i . i hamming# . cr loop
1691 hamming# . cr
