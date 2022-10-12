\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

\ A positive integer is a Kaprekar number if:
\ * It is 1
\ * The decimal representation of its square may be split once into two
\   parts consisting of positive integers which sum to the original number.

\ Note that a split resulting in a part consisting purely of 0s is not valid,
\ as 0 is not considered positive.

[UNDEFINED] kaprekar [IF]

\ If n is a Kaprekar number, return true.
\ If n is not a Kaprekar number, return zero.

: kaprekar                             ( +n - +n1) 
  dup dup * >r 
  base @ swap 
  begin                                ( tens n) ( R: n^2) 
    over r@ <
  while 
    over over r@
    rot /mod over 0<> >r + = r> and    ( tens n n^2 -- t)
    if drop r> drop exit then 
    swap base @ * swap 
  repeat 
  r> drop 1 = swap 0<> and
;

\ 10000 1 do i dup kaprekar if . else drop then loop
\ 17 base ! 10000 1 do i dup kaprekar if . else drop then loop
[THEN]
