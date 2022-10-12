\ 4tH library - Binomial coefficient - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] binomial [IF]              ( n k -- r)
: binomial 1 swap 0 ?do over i - i 1+ */ loop nip ;
: catalan dup dup + over binomial swap 1+ / ;
[THEN]                                 ( n1 -- n2)

\ 7 3 binomial . ( 35)
\ 4 2 binomial . (  6)
\ 15 0 do i catalan . loop ( sequence A000108 in OEIS)