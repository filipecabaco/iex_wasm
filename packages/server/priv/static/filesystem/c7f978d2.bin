\ Regular spherical Bessel functions jn(x), n=0-9

\ Forth Scientific Library Algorithm #43

\ Uses Miller's method of downward recursion, as described
\ in Abramowitz & Stegun, "Handbook of Mathematical Functions"
\ 10.5 ff. The recursion is

\     j(n-1) = (2n+1) j(n) / x  - j(n+1)

\ The downward recursion is started with j40 = 0, j39 = 1 . The
\ resulting functions are normalized using

\     Sum (n=0 to inf) { (2n+1) * jn(x)^2 } = 1 .

\ Usage:  % 3 SPHBES  leaves jn(3), n=0-9,
\         in the double-length (64-bit) array JBES{

\ Programmed by J.V. Noble
\ ANS Standard Program  -- version of  10/25/1994

\ This code conforms with ANS requiring:
\      The FLOAT and FLOAT EXT word sets
\ Environmental dependencies:
\       Assumes independent floating point stack

[UNDEFINED] sphbes [IF]
  [DEFINED] ZenFP  [IF] [ABORT] [THEN]
[UNDEFINED] float  [IF] [ABORT] [THEN]

10 FLOATS ARRAY JBES DOES> SWAP 0 MAX 9 MIN FLOATS + ;

FLOAT ARRAY SUM                        \ temps to off-load from fp stack
FLOAT ARRAY X

: SETUP                                ( F: x -- 0 1 )  ( -- 79)
     X F!   79 S>F  SUM F!
     0 S>F 1 S>F    79  ;

: NORMALIZE     SUM  F@  FSQRT  1 S>F FSWAP F/
      10 0   DO   FDUP  I JBES  DUP  F@  F*   F!   LOOP
      FDROP  ;

: DO_X=0    FDROP  1 S>F  0 JBES F!
            10 1  DO    0 S>F   I JBES   F!    LOOP   ;

: ITERATE   ( F:  jn+1 jn -- jn jn-1)  ( 2n+1 -- 2n-1)
      DUP  S>F   FOVER  F*             ( F:  jn+1 jn jn*[2n+1] )
      X F@  F/    FROT  F-             ( F:  -- jn jn-1)
      FDUP  FDUP F*                    ( F:  -- jn jn-1 jn-1^2 )
      2 -  DUP                         ( -- 2n-1 2n-1 )
      S>F  F*
      SUM F@   F+   SUM F!   ;

: SPHBES  ( F: x --)
      FDUP   F0=
      IF     DO_X=0   EXIT    THEN
      SETUP
      10 39 DO   ITERATE   -1 +LOOP
      -1  9  DO   ITERATE
                 FDUP   I JBES  F!
      -1 +LOOP
      DROP   FDROP  FDROP              \ clean up stacks
      NORMALIZE  ;

[DEFINED] 4TH# [IF]
  hide X
  hide SUM
  hide SETUP
  hide NORMALIZE
  hide DO_X=0
  hide ITERATE
[THEN]
[THEN]

