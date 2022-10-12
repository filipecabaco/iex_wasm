\ elip12     Complete Elliptic Integrals        ACM Algorithms #55 and # 56

\ Forth Scientific Library Algorithm #28

\ Evaluates the Complete Elliptic Integral of the first kind,
\     K[k] = int_0^{\pi/2} 1/Sqrt{ 1 - k^2 Sin^2(v)} dv
\ and of the second kind,
\     E[k] = int_0^{\pi/2}   Sqrt{ 1 - k^2 Sin^2(v)} dv

\ Note:
\       Uses the MODULUS k  (the parameter m = k^2).
\       These algorithms are not suitable for k = 1, and the accuracy
\         breaks down very near k = 1 ( 0.999999 )
\       These evaluations are by polynomial expansions, the accuracy is
\         controlled by the polynomial coefficients to about 7 places.

\ This is an ANS Forth program requiring:
\      1. The Floating-Point word set
\      3. Uses the words 'FLOAT' and Array to create floating point arrays.
\      4. The word '}' to dereference a one-dimensional array.
\      5. Uses the word '}Horner' (FSL #3) for fast polynomial evaluation.
\      6. The compilation of the test code is controlled by
\         the conditional compilation words in the Programming-Tools wordset
\      7. This program requires a FLOATING-STACK of at least 16 floats.

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ ( ELIP12     V1.1                   3 December 1994   EFC )

[UNDEFINED] K[k]      [IF]
[UNDEFINED] }horner   [IF] include lib/horner.4th  [THEN]
[UNDEFINED] fln       [IF] include lib/flnflog.4th [THEN]

4 FLOATS 1+ ARRAY K-Coefs1{
4 FLOATS 1+ ARRAY K-Coefs2{
3 FLOATS 1+ ARRAY E-Coefs1{
4 FLOATS 1+ ARRAY E-Coefs2{
FLOAT K-Coefs1{ FSL-ARRAY
FLOAT K-Coefs2{ FSL-ARRAY
FLOAT E-Coefs1{ FSL-ARRAY
FLOAT E-Coefs2{ FSL-ARRAY
:REDO K-Coefs1{ (FSL-ARRAY) ;
:REDO K-Coefs2{ (FSL-ARRAY) ;
:REDO E-Coefs1{ (FSL-ARRAY) ;
:REDO E-Coefs2{ (FSL-ARRAY) ;

: init-coefs
                        1 S>F F2/ K-Coefs1{ 0 } F!
  12475074 S>F  100000000 S>F F/  K-Coefs1{ 1 } F!
  60118519 S>F 1000000000 S>F F/  K-Coefs1{ 2 } F!
  10944912 S>F 1000000000 S>F F/  K-Coefs1{ 3 } F!

  13862944 S>F   10000000 S>F F/  K-Coefs2{ 0 } F!
  97932891 S>F 1000000000 S>F F/  K-Coefs2{ 1 } F!
  54544409 S>F 1000000000 S>F F/  K-Coefs2{ 2 } F!
  32024666 S>F 1000000000 S>F F/  K-Coefs2{ 3 } F!

  24969795 S>F  100000000 S>F F/  E-Coefs1{ 0 } F!
   8150224 S>F  100000000 S>F F/  E-Coefs1{ 1 } F!
   1382999 S>F  100000000 S>F F/  E-Coefs1{ 2 } F!

                        1 S>F     E-Coefs2{ 0 } F!
  44479204 S>F  100000000 S>F F/  E-Coefs2{ 1 } F!
  85099193 S>F 1000000000 S>F F/  E-Coefs2{ 2 } F!
  40905094 S>F 1000000000 S>F F/  E-Coefs2{ 3 } F!
;


: K[k] ( -- ) ( F: k -- K[k] )                  \ ACM Algorithm #55

       FDUP F* 1 S>F FSWAP F-

       FDUP K-Coefs2{ 3 }Horner
       FSWAP FDUP K-Coefs1{ 3 }Horner
       FSWAP FLN F*
       F-
;


: E[k] ( -- ) ( F: k -- K[k] )                  \ ACM Algorithm #56

       FDUP F* 1 S>F FSWAP F-

       FDUP E-Coefs2{ 3 }Horner
       FSWAP FDUP E-Coefs1{ 2 }Horner
       FOVER F* FSWAP FLN F*
       F-
;

init-coefs

[DEFINED] 4TH# [IF]
  hide K-Coefs1{
  hide K-Coefs2{
  hide E-Coefs1{
  hide E-Coefs2{
  hide init-coefs
[THEN]
[THEN]

