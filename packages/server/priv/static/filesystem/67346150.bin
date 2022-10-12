\ Taken from http://rosettacode.org 
\ 4tH version 2012, Hans Bezemer

\ A happy number is defined by the following process. Starting with any
\ positive integer, replace the number by the sum of the squares of its
\ digits, and repeat the process until the number equals 1 (where it will
\ stay), or it loops endlessly in a cycle which does not include 1. Those
\ numbers for which this process ends in 1 are happy numbers, while those
\ that do not end in 1 are unhappy numbers.

1024 array "here"                      \ fake dictionary

: next ( n -- n )
  0 swap begin 10 /mod >r dup * + r> dup 0= until drop ;
 
: cycle? ( n -- ? )
  "here" dup @ cells +
  begin dup "here" >
  while 2dup @ = if 2drop true exit then
        1 cells -
  repeat
  1 over +!  dup @ cells + !  false ;
 
: happy? ( n -- ? )
  0 "here" !  begin next dup cycle? until  1 = ;
 
: happy-numbers ( n -- )
  0 swap 0 do
    begin 1+ dup happy? until dup .
  loop drop ;
 
8 happy-numbers cr                     \ 1 7 10 13 19 23 28 31