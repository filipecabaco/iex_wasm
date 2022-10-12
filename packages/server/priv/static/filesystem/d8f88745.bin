\ Cube root of real number by Newton's method
\ ANS compatible version V1.2  10/6/1994

\ Forth Scientific Library Algorithm #5

\ This code conforms with ANS requiring:
\      The FLOAT and FLOAT EXT word sets

\     (c) Copyright 1994  Julian V. Noble.     Permission is granted
\     by the author to use this software for any application provided
\     the copyright notice is preserved.

[UNDEFINED] fcbrt [IF]
  [DEFINED] ZenFP [IF] [ABORT] [THEN]
[UNDEFINED] float [IF] [ABORT] [THEN]

: X'       ( F: N x -- x')
  FSWAP FOVER FDUP F* F/ FSWAP FDUP F+ F+ 3 S>F F/ ;

\ The magic number 1E-8 needs no change, even when extended (80-bit) precision
\ is needed.

: FCBRT    ( F: N -- N^1/3)
  FDUP  F0<  FABS                 ( F: -- |N|)  ( -- f)
  FDUP  FSQRT                     ( F: -- N x0 )
  BEGIN FOVER FOVER X' FSWAP FOVER F- FOVER F/ FABS 1 S>F 100000000 S>F F/ F< UNTIL
  X' IF FNEGATE THEN ;
[DEFINED] 4TH# [IF] hide X' [THEN]
[THEN] 