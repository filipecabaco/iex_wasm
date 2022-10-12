\ Sample REPRESENT implementation - Copyright Ed, 2008
\ Assumes flag2 is always true and maxdigits can be held
\ as a DOUBLE number. "Negative zero" is not implemented.
\ include lib/ansfloat.4th

[UNDEFINED] represent [IF]
[UNDEFINED] fover [IF] [ABORT] [THEN]
[UNDEFINED] (D.)  [IF] [NEEDS lib/dbldot.4th] [THEN]
2 ARRAY expsgn                         \ exponent, sign
                                       ( F: r -- )
: REPRESENT                            ( c-addr n1 -- n2 flag1 flag2 )
  2DUP maxdigits MAX [CHAR] 0 FILL
  DUP 0< IF
    2DROP FDROP 0 DUP
  ELSE
    maxdigits MIN SWAP >R >R
    FDUP F0< 0 expsgn 2!
    FABS FDUP F0= 0=
    BEGIN WHILE
      FDUP 1 S>F F< 0= IF
        10 S>F F/ 1
      ELSE
        FDUP 1 S>F 10 S>F F/ F<
        IF 10 s>f F* -1 ELSE 0 THEN
      THEN
      DUP expsgn +!
    REPEAT
    1 S>F R@ 0 ?DO 10 S>F F* LOOP F*
    FROUND F>D 2DUP (D.) DUP R@ - expsgn +!
    R> R> SWAP ROT MIN 1 MAX CMOVE
  THEN                                 \ 0.0E fix-up
  D0= IF 1 0 ELSE expsgn 2@ SWAP THEN TRUE
;

[DEFINED] 4TH# [IF]
hide expsgn
[THEN]
[THEN]

\    r         u      string    n (exponent)
\    --        --     ------    --
\    0.6489    4      '6489'    0
\    0.6489    3      '649'     0
\    0.6489    2      '65'      0
\    0.6489    1      '6'       0

\ fclear
\ : test ( r ) >r PAD r@ REPRESENT . . PAD r> TYPE SPACE . CR ;
\ 5 0 do s" 0.6489" s>float i test loop depth fdepth . .
