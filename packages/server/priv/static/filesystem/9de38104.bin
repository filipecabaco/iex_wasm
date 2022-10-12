\ Gauss       The Gaussian (Normal) probablity function   ACM Algorithm #209
\ Calulates, z = 1/sqrt( 2 pi ) \int_-\infty^x exp( - 0.5 u^2 ) du
\ by means of polynomial approximations.   Accurate to 6 places.

\ Forth Scientific Library Algorithm #42

\ This is an ANS Forth program requiring:
\      1. The Floating-Point word set
\      2. Uses the words 'FLOAT' and ARRAY to create floating point arrays.
\      3. The word '}' to dereference a one-dimensional array.
\      4. Uses the FSL word '}Horner' for fast polynomial evaluation.
\      5. The compilation of the test code is controlled by
\         the conditional compilation words in the
\         Programming-Tools wordset.

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.


\ ( GAUSS             V1.0            2 November 1994   EFC )

\ include lib/ansfloat.4th
\ include lib/fsl-util.4th

[UNDEFINED] gauss     [IF]
[UNDEFINED] }horner   [IF] include lib/horner.4th  [THEN]

15 FLOATS 1+ ARRAY big{
FLOAT big{ FSL-ARRAY
:REDO big{ (FSL-ARRAY) ;

9 FLOATS 1+ ARRAY small{
FLOAT small{ FSL-ARRAY
:REDO small{ (FSL-ARRAY) ;

: init-gauss
       S" 0.999936657524" S>FLOAT big{ 0 } F!        S" 0.000535310849" S>FLOAT big{ 1 } F!
      S" -0.002141268741" S>FLOAT big{ 2 } F!        S" 0.005353579108" S>FLOAT big{ 3 } F!
      S" -0.009279453341" S>FLOAT big{ 4 } F!        S" 0.011630447319" S>FLOAT big{ 5 } F!
      S" -0.010557625006" S>FLOAT big{ 6 } F!        S" 0.006549791214" S>FLOAT big{ 7 } F!
      S" -0.002034254874" S>FLOAT big{ 8 } F!       S" -0.000794620820" S>FLOAT big{ 9 } F!
       S" 0.001390604284" S>FLOAT big{ 10 } F!      S" -0.000676904986" S>FLOAT big{ 11 } F!
      S" -0.000019538132" S>FLOAT big{ 12 } F!       S" 0.000152529290" S>FLOAT big{ 13 } F!
      S" -0.000045255659" S>FLOAT big{ 14 } F!

       S" 0.797884560593" S>FLOAT small{ 0 } F!     S" -0.531923007300" S>FLOAT small{ 1 } F!
       S" 0.319152932694" S>FLOAT small{ 2 } F!     S" -0.151968751364" S>FLOAT small{ 3 } F!
       S" 0.059054035624" S>FLOAT small{ 4 } F!     S" -0.019198292004" S>FLOAT small{ 5 } F!
       S" 0.005198775019" S>FLOAT small{ 6 } F!     S" -0.001075204047" S>FLOAT small{ 7 } F!
       S" 0.000124818987" S>FLOAT small{ 8 } F!
;

: gauss-small-y ( -- ) ( F: y -- z )
       FDUP FDUP F*
       small{ 8 }Horner
       F* F2*
;

: gauss-mid-y ( -- ) ( F: y -- z )
      2 S>F F-
      big{ 14 }Horner
;

init-gauss

: gauss ( -- ) ( f: x -- gauss{x} )
        FDUP F0= IF
                    F0< 0 S>F
                 ELSE

                    FDUP F0<            \ push flag for sign of x
                    FABS F2/

                    FDUP 1 S>F F<  IF
                                      gauss-small-y
                                   ELSE
                                      FDUP 485 S>F 100 S>F F/ F< IF
                                                      gauss-mid-y
                                                     ELSE
                                                      FDROP 1 S>F
                                                     THEN
                                   THEN
                 THEN

      IF ( x < 0 )    FNEGATE THEN

      1 S>F F+ F2/
;

[DEFINED] 4TH# [IF]
  hide big{
  hide small{
  hide init-gauss
  hide gauss-small-y
  hide gauss-mid-y
[THEN]
[THEN]
