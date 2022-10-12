\ 4tH library - ANS float FREXP - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] frexp     [IF]
[UNDEFINED] float>exp [IF] [ABORT] [THEN]
: LDEXP >R float>exp R> + exp>float ;  ( f1 n -- f2)
: FREXP float>exp CELL-BITS 2 * 1- TUCK + >R NEGATE exp>float R> ;
[THEN]                                 ( f1 -- f2 n)