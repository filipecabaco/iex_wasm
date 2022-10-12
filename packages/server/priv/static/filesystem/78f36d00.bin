\ Multiply With Carry random generator
\ Copyright Albert v/d Horst, 2013
\ Believed to be in the public domain

[UNDEFINED] RANDOM [IF]
[UNDEFINED] UM*    [IF] include lib/mixed.4th [THEN]

/CELL 4 [=] [IF]
-178  CONSTANT (multiplier)   \ 4,294,967,118 32 bits
[ELSE]                        \ Ignoring 16 bits.
-742  CONSTANT (multiplier)   \ 18,446,744,073,709,550,874
[THEN]

MAX-N CONSTANT MAX-RAND

2 ARRAY (SEED)

: RANDOM (SEED) 2@ >R (multiplier) UM* R> U>D D+ TUCK (SEED) 2! ;
: RANDOMIZE! (SEED) 2! ;
: RANDOMIZE TIME U>D RANDOMIZE! ;

[DEFINED] 4TH# [IF]
  hide (multiplier)
  hide (SEED)
[THEN]
[THEN]

\ 1 1 randomize! 200 0 do random . loop cr depth . 
