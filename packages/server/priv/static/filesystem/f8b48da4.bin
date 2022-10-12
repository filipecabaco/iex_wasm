\ Horner          Evaluation of a polynomial by the Horner method

\ Forth Scientific Library Algorithm #3

\ This routine evaluates an Nth order polynomial Y(X) at point X
\ Y(X) = \sum_i=0^N a[i] x^i                  (NOTE: N+1 COEFFICIENTS)
\ by the Horner scheme.  This algorithm minimizes the number of multiplications
\ required to evaluate the polynomial.
\ The implementation demonstrates the use of array aliasing.

\ This code conforms with ANS requiring:
\      1. The Floating-Point word set
\      2. The immediate word '%' which takes the next token
\         and converts it to a floating-point literal
\      3. Uses words 'Private:', 'Public:' and 'Reset_Search_Order'
\         to control the visibility of internal code.
\      4. The immediate word '&' to get the address of an array
\         function at either compile or run time.
\      5. Uses the words 'DArray' and '&!' to alias arrays.
\      6. Test code uses 'ExpInt' for real exponential integrals

\  (code for the dependencies , 3, 4, and 5 above are in the file 'fsl_util' )

\ This algorithm is described in many places, e.g.,
\ Conte, S.D. and C. deBoor, 1972; Elementary Numerical Analysis, an algorithmic
\ approach, McGraw-Hill, New York, 396 pages

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ ( HORNER            V1.5           31 October 1994   EFC )
\ include lib/ansfloat.4th
\ include lib/fsl-util.4th
\ include lib/fexpint.4th
\ include lib/fexp.4th
\ include lib/flnflog.4th

[UNDEFINED] }horner   [IF]
[UNDEFINED] fsl-array [IF] [ABORT] [THEN]

: }Horner ( &a n -- , f: x -- y[x] )
  SWAP VALUE ha{
        0 s>f
        -1 SWAP DO
                     FOVER F*
                     ha{ I } F@ F+
        -1 +LOOP
         FSWAP FDROP
;
[THEN]