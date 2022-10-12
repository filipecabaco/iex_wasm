\ 4tH library - FP vectors - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fvector! [IF]
  [DEFINED] ZenFP    [IF] [ABORT] [THEN]
[UNDEFINED] float    [IF] [ABORT] [THEN]
: fsumvector                            ( x1 x2 x3 n1 -- x3 n1)
  >r -rot r@ floats 0
  ?do dup i + f@ over i + f@ f+ rot dup i + f! -rot float +loop
  drop drop r>
;

: fdotproduct                           ( x1 x2 n1 -- f1)
  0 dup s>f ?do dup i floats + f@ over i floats + f@ f* f+ loop drop drop
;
                                        ( x n -- f)
: flenvector over swap fdotproduct fsqrt ;
: fvector! -1 swap 1- ?do dup i floats + f! -1 +loop drop ;
[THEN]                                  ( f1 .. fn x1 n1 --)






