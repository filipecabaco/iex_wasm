\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

include lib/comus.4th
include lib/toolbelt.4th

\ Integers with the property that, when digit positions are labeled 0 to N-1,
\ the digit in each position is equal to the number of times that that digit
\ appears in the number.

\ For example 2020 is a four digit self describing number.

\ Position "0" has value 2 and there is two 0 in the number. Position "1" has
\ value 0 because there are not 1's in the number. Position "2" has value 2
\ and there is two 2. And the position "3" has value 0 and there are zero 3's.

\ Self-describing numbers < 100000000 :
\ 1210
\ 2020
\ 21200
\ 3211000
\ 42101000

\ COUNT is a standard word with a very different meaning, so this
\ would typically be beheaded, or given another name, or otherwise
\ given a short lifespan, so to speak.
: counts ( c-addr1 u1 c -- c-addr1 u1 c+1 u )
  0 2over bounds do
    over i c@ = if 1+ then
  loop swap 1+ swap ;

: self-descriptive? ( u -- f )
  (.) [char] 0 third third bounds ?do
    counts i c@ [char] 0 - <> if drop 2drop false unloop exit then
  loop drop 2drop true ;

." Self-describing numbers < 10000000 :" cr
10000000 1 do i self-descriptive? if i . cr then loop