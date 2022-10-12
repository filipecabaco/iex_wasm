\ gamma             The Gamma, loggamma and reciprocal gamma functions
\ Calulates Gamma[x], Log[ Gamma[x] ] and 1/Gamma[x] functions
\ (for real arguments)

\ Forth Scientific Library Algorithm #18

\ This is an ANS Forth program requiring:
\      1. The Floating-Point word set
\      2. The word '}' to dereference a one-dimensional array.
\      3. Uses the word '}Horner' for fast polynomial evaluation.
\      4. The FCONSTANT PI (3.1415926536...)
\      5. The words 'S>F' and 'F>S' to convert between floats and singles
\      6. The word F>
\               : F>     FSWAP F< ;
\      7. The compilation of the test code is controlled by the
\         the conditional compilation words in the Programming-Tools wordset.

\ Baker, L., 1992; C Mathematical Function Handbook, McGraw-Hill,
\ New York, 757 pages,  ISBN 0-07-911158-0

\ The reciprocal Gamma function is ACM Algorithm #80

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.


\ ( GAMMA             V1.2            6 October 1994   EFC )
\ include lib/ansfloat.4th
\ include lib/ansfpio.4th
\ include lib/fsl-util.4th

[UNDEFINED] gamma   [IF]
[UNDEFINED] E.FPERR [IF] include lib/throw.4th    [THEN]
[UNDEFINED] }horner [IF] include lib/horner.4th   [THEN]
[UNDEFINED] fsin    [IF] include lib/fsinfcos.4th [THEN]
[UNDEFINED] fln     [IF] include lib/flnflog.4th  [THEN]
[UNDEFINED] fexp    [IF] include lib/fexp.4th     [THEN]
[UNDEFINED] f>      [IF] include lib/fequals.4th  [THEN]

 9 FLOATS 1+ ARRAY b{
 4 FLOATS 1+ ARRAY ser{
14 FLOATS 1+ ARRAY b-inv{
FLOAT b{     FSL-ARRAY
FLOAT ser{   FSL-ARRAY
FLOAT b-inv{ FSL-ARRAY
:REDO b{     (FSL-ARRAY) ;
:REDO ser{   (FSL-ARRAY) ;
:REDO b-inv{ (FSL-ARRAY) ;

FLOAT ARRAY X-TMP           \ scratch space to be kind on the fstack
FLOAT ARRAY Z-TMP

: logsr2pi 918938533 s>f 1000000000 s>f f/ ;

: init-b-ser
                              1 s>f    b{ 0 } F!    -577191652 s>f 1000000000 s>f f/ b{ 1 } F!
       988205891 s>f 1000000000 s>f f/ b{ 2 } F!    -897056937 s>f 1000000000 s>f f/ b{ 3 } F!
       918206857 s>f 1000000000 s>f f/ b{ 4 } F!    -756704078 s>f 1000000000 s>f f/ b{ 5 } F!
       482199394 s>f 1000000000 s>f f/ b{ 6 } F!    -193527818 s>f 1000000000 s>f f/ b{ 7 } F!
        35868343 s>f 1000000000 s>f f/ b{ 8 } F!

        S" 0.08333333333333" s>float ser{ 0 } F!
       S" -0.002777777777" s>float   ser{ 1 } F!
        S" 0.000793650793" s>float   ser{ 2 } F!
       S" -0.000595238095" s>float   ser{ 3 } F!

                             1 s>f b-inv{  0 } F!   S" -0.422784335092" s>float b-inv{  1 } F!
       S" -0.233093736365" s>float b-inv{  2 } F!    S" 0.191091101162" s>float b-inv{  3 } F!
       S" -0.024552490887" s>float b-inv{  4 } F!   S" -0.017645242118" s>float b-inv{  5 } F!
        S" 0.008023278113" s>float b-inv{  6 } F!   S" -0.000804341335" s>float b-inv{  7 } F!
       S" -0.000360851496" s>float b-inv{  8 } F!    S" 0.000145624324" s>float b-inv{  9 } F!
       S" -0.000017527917" s>float b-inv{ 10 } F!   S" -0.000002625721" s>float b-inv{ 11 } F!
        S" 0.000001328554" s>float b-inv{ 12 } F!   S" -0.000000181220" s>float b-inv{ 13 } F!

;

: non-negative-x ( -- , f: x -- loggamma{x} )

        FDUP 1 s>f F> IF

                           FDUP 2 s>f F> IF
                                            X-TMP F!

                                            1 s>f X-TMP F@ F/
                                            FDUP Z-TMP F! FDUP F*

                                            ser{ 3 }Horner Z-TMP F@ F*

                                            logsr2pi F+ X-TMP F@ F-
                                            X-TMP F@ FLN
                                            X-TMP F@ 1 S>F F2/ F- F*
                                            F+

                                          ELSE
                                            1 s>f F- b{ 8 }Horner FLN

                                          THEN

                       ELSE
                         FDUP F0= 0= IF
                                        FDUP X-TMP F!
                                        b{ 8 }Horner
                                        X-TMP F@ F/ FLN
                                       THEN

                       THEN
;


: ?negative-int ( -- t/f , f: x -- x )

       \ check to see if x is a negative integer, or zero
       FDUP F0< IF
                        FDUP FDUP F>D D>F F- F0=
                ELSE
                        FDUP F0=
                THEN
;

: rgam ( -- , f: x -- z )
       FDUP
       b-inv{ 13 }Horner
       FOVER 1 s>f F+ F* F*
;

: rgam-large-x ( -- , f: x -- z )

       1 s>f                                  \ the AA loop
       BEGIN
         FSWAP 1 s>f F-
         FSWAP FOVER F*
         FOVER 1 s>f F> 0=
       UNTIL

       FOVER 1 s>f F= IF   FSWAP FDROP 1 s>f FSWAP F/
                      ELSE
                            FSWAP rgam FSWAP F/
                      THEN
;

: rgam-small-x ( -- , f: x -- z )

      FDUP -1 s>f F= IF   FDROP 0 s>f
                     ELSE
                          FDUP -1 s>f F> IF rgam
                                         ELSE

                                              FDUP             \ the CC loop
                                              BEGIN
                                                FSWAP 1 s>f F+
                                                FDUP -1 s>f F<
                                              WHILE
                                                FSWAP
                                                FOVER F*
                                              REPEAT

                                              rgam F*

                                         THEN
                     THEN
;
                                          \ Log Gamma function
: loggam ( -- ) ( f: x -- loggamma{x} )   \ input arg is returned if routine aborts

        \ check to make sure x is not a negative integer or zero
        ?negative-int E.FPERR THROW" loggam has 0 or negative integer argument"

        FDUP F0< IF
                          FABS 1 s>f F+ Z-TMP F!
                          PI Z-TMP F@ F* FSIN FABS PI FSWAP F/ FLN
                          Z-TMP F@
                          non-negative-x
                          F-
                       ELSE
                          non-negative-x
                       THEN

;

                                        \ Gamma function
: gamma ( -- ) ( f: x -- g{x} )         \ input arg is returned if routine aborts

       \ check to make sure x is not a negative integer or zero
       ?negative-int E.FPERR THROW" gamma has 0 or negative integer argument"

       FDUP loggam FEXP

       FOVER F0< IF
                        FOVER F>S NEGATE 2 MOD
                        2* 1- S>F F*
                      THEN

      FSWAP FDROP
;


: rgamma ( -- ) ( f: x -- 1/g{x} )         \ reciprocal gamma function

      FDUP F0= FDUP 1 s>f F= OR 0=     \ will return x if x is zero or one
           IF
                FDUP 1 s>f F< IF  rgam-small-x
                              ELSE
                                  rgam-large-x
                              THEN

           THEN

;

init-b-ser

[DEFINED] 4TH# [IF]
  hide b{
  hide ser{
  hide b-inv{
  hide Z-TMP
  hide X-TMP
  hide logsr2pi
  hide init-b-ser
  hide non-negative-x
  hide ?negative-int
  hide rgam
  hide rgam-large-x
  hide rgam-small-x
[THEN]
[THEN]



