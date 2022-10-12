\ 4tH library - Uniform randomizer - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Bennett Fox,
\ Algorithm 647:
\ Implementation and Relative Efficiency of Quasirandom
\ Sequence Generators,
\ ACM Transactions on Mathematical Software,
\ Volume 12, Number 4, pages 362-376, 1986.

[UNDEFINED] randomize [IF]
[UNDEFINED] f/ [IF] [ABORT] [THEN]
time value (seed)

: randomize to (seed) ;

: random
  (seed) dup 127773 / dup -2836 * swap -127773 * rot + 16807 * +
  dup 0< if 2147483647 + else 2147483647 mod then dup to (seed)
  s>f 2147483647 s>f f/
;

[DEFINED] 4TH# [IF]
  hide (seed)
[THEN]
[THEN]

\ fclear 100 set-precision 12345 randomize 5 0 do random f. cr loop depth .

\   Input     Output      R8_UNIFORM_01
\   SEED      SEED

\      12345   207482415  0.096616
\  207482415  1790989824  0.833995
\ 1790989824  2035175616  0.947702