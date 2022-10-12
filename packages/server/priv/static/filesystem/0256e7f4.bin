\ 4tH library - HARSHAD - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ A positive integer which is divisible by the sum of its digits. Grundman 
\ (1994) defined an n-Harshad number to be a positive integer which is
\ divisible by the sum of its digits in base n>1. Define an all-Harshad 
\ number as a positive integer which is divisible by the sum of its digits
\ in all bases n>1.

[UNDEFINED] harshad [IF]               ( n -- f)
: n-harshad 0 over begin base @ /mod dup while >r + r> repeat drop + mod 0= ;
: harshad base @ >r decimal n-harshad r> base ! ;
: all-harshad dup 1 and if 1 = else dup 0> swap 7 < and then ;
[THEN]

\ : test
\   begin over while dup harshad if dup . swap 1- swap then 1+ repeat 2drop
\ ; 20 1 test cr 1 1001 test cr