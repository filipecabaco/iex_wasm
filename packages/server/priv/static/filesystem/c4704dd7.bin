\ 4tH library - Binomial coefficient (mixed) - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] mbinomial [IF]              ( n k -- d)
[UNDEFINED] m*/       [IF] include lib/mixed.4th [THEN]
: mbinomial >r 1 u>d r> 0 ?do >r over r> swap i - i 1+ m*/ loop rot drop ;
: mcatalan dup dup + over mbinomial rot 1+ mu/mod rot drop ;
[THEN]                                  ( n -- d)

\ k must be positive
\ 7 3 mbinomial d. cr
\ 30 0 do i mcatalan d. loop cr