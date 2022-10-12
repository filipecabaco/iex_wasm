\ 4tH library - FLOOR ZEN - Copyright 2009,2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] floor [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library
: floor
  dup 0< if                            \ if exponent < zero, set to zero
    2dup abs 0 ?do 10 / dup 0= if leave then loop >r
    over 0< if r@ s>f f- f0= 0= r> swap if 1- then else 2drop r> then s>f
  then                                 \ check on remainder
;
[THEN]

\  10   3 floor f. cr
\  20  -1 floor f. cr
\  31  -1 floor f. cr
\   0 s>f floor f. cr
\  -4 s>f floor f. cr
\ -51  -1 floor f. cr
\ -60  -1 floor f. cr
\ -70   3 floor f. cr

