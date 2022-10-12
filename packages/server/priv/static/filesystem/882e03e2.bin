\ Cube root of real number by Newton's method
\ ANS compatible version V1.2  10/6/1994

\ Forth Scientific Library Algorithm #5

\ This code conforms with ANS requiring:
\      The FLOAT and FLOAT EXT word sets

\     (c) Copyright 1994  Julian V. Noble.     Permission is granted
\     by the author to use this software for any application provided
\     the copyright notice is preserved.

[UNDEFINED] fcbrt [IF]
[UNDEFINED] fsqrt [IF] include lib/zenfsqrt.4th [THEN]

: X'       ( F: N x -- x')
  2SWAP 2OVER 2DUP F* F/ 2SWAP 2DUP F+ F+ 3 S>F F/ ;

\ The magic number 1E-8 needs no change, even when extended (80-bit) precision
\ is needed.

: FCBRT    ( F: N -- N^1/3)
  2DUP  F0<  >R FABS              ( F: -- |N|)  ( -- f)
  2DUP  FSQRT                     ( F: -- N x0 )
  BEGIN 2OVER 2OVER X' 2SWAP 2OVER F- 2OVER F/ FABS 1 -8 F< UNTIL
  X' R> IF FNEGATE THEN ;
[DEFINED] 4TH# [IF] hide X' [THEN]
[THEN]
