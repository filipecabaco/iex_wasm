\ fexpint     Real Exponential Integral         ACM Algorithm #20

\ Forth Scientific Library Algorithm #1

\ Evaluates the Real Exponential Integral,
\     E1(x) = - Ei(-x) =   int_x^\infty exp^{-u}/u du      for x > 0
\ using a rational approximation

\ This code conforms with ANS requiring:
\      1. The Floating-Point word set

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided the
\ copyright notice is preserved.

\ CR .( EXPINT     V1.1                  21 September 1994   EFC )

[UNDEFINED] fexpint [IF]
[UNDEFINED] fexp    [IF] include lib/fexp.4th    [THEN]
[UNDEFINED] fln     [IF] include lib/flnflog.4th [THEN]
[UNDEFINED] f10**   [IF] include lib/fpow10.4th [THEN]
: FEXPINT ( --, f: x -- expint[x] )
  FDUP
  1 u>f F< IF                          \ 0.00107857
             FDUP 107857 u>f 100000000 u>f F/
             F*   976004 u>f 100000000 u>f F/ F-
             FOVER                     \ 0.00976004
             F*  5519968 u>f 100000000 u>f F/ F+
             FOVER                     \ 0.05519968
             F* 24991055 u>f 100000000 u>f F/ F-
             FOVER                     \ 0.24991055
             F* 99999193 u>f 100000000 u>f F/ F+
             FOVER                     \ 0.99999193
             F* 57721566 u>f 100000000 u>f F/ F-
             FSWAP FLN F-              \ 0.57721566
           ELSE
             FDUP                      \  8.5733287401
             85  u>f 10 u>f F/ 733287401 u>f 10 F10** F/ F+ F+
             FOVER F*                  \ 18.059016973
             18  u>f 59016973 u>f 1000000000 u>f F/ F+ F+
             FOVER F*                  \  8.6347608925
             86  u>f 10 u>f F/ 347608925 u>f 10 F10** F/ F+ F+
             FOVER F*                  \  0.2677737343
             2   u>f 10 u>f F/ 677737343 u>f 10 F10** F/ F+ F+
             FOVER FDUP                \  9.5733223454
             95  u>f 10 u>f F/ 733223454 u>f 10 F10** F/ F+ F+
             FOVER F*                  \ 25.6329561486
             256 u>f 10 u>f F/ 329561486 u>f 10 F10** F/ F+ F+
             FOVER F*                  \ 21.0996530827
             210 u>f 10 u>f F/ 996530827 u>f 10 F10** F/ F+ F+
             FOVER F*                  \  3.9584969228
             39  u>f 10 u>f F/ 584969228 u>f 10 F10** F/ F+ F+

             FSWAP FDROP
             F/
             FOVER F/
             FSWAP FNEGATE FEXP
             F*
           THEN
;
[THEN]
