\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

\ Some languages allow you to embed recursion directly in-place. This might
\ work via a label, a local gosub instruction, or some special keyword.

:noname ( n -- n' )
  dup 2 < if exit then
  1- dup recurse swap 1- recurse + ; ( xt )

: fib ( xt +n -- n' )
  dup 0< abort" Negative numbers don't exist."
  swap execute ;

10 fib . cr