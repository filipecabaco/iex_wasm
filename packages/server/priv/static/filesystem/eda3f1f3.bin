\ polys             evaluation of various special polynomials.
\        Uses recurrance relations to do the evaluation from lower orders

\ Forth Scientific Library Algorithm #21

\ Ch_n   ACM # 10, Evaluates the nth order Chebyschev Polynomial (first kind),
\        Ch_n(x) = cos( n * cos^-1(x) )

\ He_n   ACM # 11, Evaluates the nth order Hermite Polynomial,
\        He_n(x) = (-1)^n exp( x^2 ) d^n exp( - x^2 ) /dX^n

\ La_n   ACM # 12, Evaluates the nth order Laguerre Polynomial,
\        La_n(x) = exp(x) d^n X^n exp( - x ) /dX^n

\ Lag_n   Evaluates the nth order Generalized Laguerre Polynomial,
\        Lag_n(x,a)

\ Le_n   ACM # 13, Evaluates the nth order Legendre Polynomial,
\        La_n(x) = 1/(2^n n!) d^n (X^2 -1)^n /dX^n

\ Be_n   Evaluates the nth order Bessel Polynomial,
\        Be_n(x) = \sum_k=0^n d_k x^k,  d_k = (2 n - k)!/(2^(n-k) k! (n-k)!

\ These algorithms have very similar internal structure that could in principle
\ be factored out, for reasons of computational efficiency this was factorization
\ was not done.

\ This code conforms with ANS requiring:
\      1. The Floating-Point word set
\      2. A separate FP stack

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ The original publication of Laguerre polynomial evaluation had some
\ errors, these are corrected in this code.

\ see also
\ Conte, S.D. and C. deBoor, 1972; Elementary Numerical Analysis,
\ an algorithmic approach, McGraw-Hill, New York, 396 pages

\ The Bessel polynomial is described in,
\ Rabiner, L.R. and B. Gold, 1975; Theory and Application of Digital
\ Signal Processing, Prentice-Hall, Englewood Cliffs, N.J. 762 pages
\ ISBN 0-13-914101-4

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

( POLYS             V1.1           21 September 1994 EFC )

  [DEFINED] ZenFP [IF] [ABORT] [THEN]
[UNDEFINED] float [IF] [ABORT] [THEN]

[UNDEFINED] Ch_n [IF]
4 floats array (locals)
: LOCALS floats (locals) dup rot bounds do i f! float +loop ;

: Ch_n ( n -- ) ( f: x -- z )          \ nth order 1st kind Chebyschev Polynomial
        \ set up a local fvariable frame
        FDUP 1 S>F 3 LOCALS SWAP
        DUP IF
            DUP 1 > IF
                1 DO
                  DUP FLOAT+ DUP FLOAT+ F@ F@
                  F* 2 S>F F* DUP F@ F-
                  DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;

: He_n ( n -- ) ( f: x -- z )          \ nth order Hermite Polynomial
        \ set up a local fvariable frame, c (=x) then b then a
        2 S>F F* FDUP 1 S>F 3 LOCALS SWAP
        DUP IF 
            DUP 1 > IF
                1 DO
                  DUP FLOAT+ DUP FLOAT+ F@ F@
                  F* I 2* S>F DUP F@ F* F-
                  DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;

: La_n ( n -- ) ( f: x -- z )          \ nth order Laguerre Polynomial
        \ set up a local fvariable frame, c then b then a
        1 S>F FOVER F- 1 S>F 3 LOCALS SWAP
        DUP IF
            DUP 1 > IF
                1 DO 
                  I 2* 1+ S>F
                  DUP FLOAT+ DUP FLOAT+ F@
                  F- F@ F*
                  I S>F DUP F@ F* F-
                  I 1+ S>F F/
                  DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;

\ nth order generalized Laguerre Polynomial
\ NOTE EXTRA PARAMETER COMPARED TO OTHER POLYNOMIALS,
\      for alpha = 0.0 this polynomial is the same as La_n
: Lag_n ( n -- ) ( f: x alpha -- z )
        \ set up a local fvariable frame, d then c then b then a
        FSWAP 1 S>F FOVER F- 1 S>F 4 LOCALS TUCK

        FLOAT+ DUP FLOAT+ FLOAT+ OVER F@ F@ F+ F!

        DUP IF
            DUP 1 > IF
                1 DO
                  DUP FLOAT+ DUP FLOAT+ DUP FLOAT+ DUP
                  I 2* 1+ S>F F@ F+ -ROT F@ F- F@ F*
                  I S>F F@ F+ DUP F@ F* F-
                  I 1+ S>F F/
                  DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;

: Le_n ( n -- ) ( f: x -- z )          \ nth order Legendre Polynomial
        \ set up a local fvariable frame, c then b then a
        FDUP 1 S>F 3 LOCALS SWAP
        DUP IF
            DUP 1 > IF
                1 DO
                  DUP DUP FLOAT+ DUP FLOAT+ 
                  F@ F@ F* FDUP F@ F-
                  I S>F I 1+ S>F F/ F* F+
                  DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;

: Be_n ( n -- ) ( f: x -- z )          \ nth order Bessel Polynomial
        \ set up a local fvariable frame, c then b then a
        1 S>F FOVER F+ 1 S>F 3 LOCALS SWAP
        DUP IF
            DUP 1 > IF
                1+ 2 DO
                   DUP DUP FLOAT+ DUP FLOAT+ SWAP
                   I 2* 1- S>F F@ F*
                   F@ FDUP F* F@ F* F+
                   DUP FLOAT+ DUP F@ OVER F! F!
                LOOP
            ELSE DROP
            THEN
        ELSE DROP 1 S>F DUP FLOAT+ F!
        THEN FLOAT+ F@
;
[DEFINED] 4TH# [IF]
  hide locals
  hide (locals)
[THEN]
[THEN]
