\ pcylfun     Parabolic Cylinder Functions U and V,
\             plus related confluent hypergeometric functions

\ Forth Scientific Library Algorithm #20

\ Evaluates the Parabolic Cylinder functions,
\     Upcf              U(nu,x)
\ and 
\     Vpcf              V(nu,x)
\ In addition the following related functions are provided,
\ U()        U(a,b,x)      Hypergeometric function U for real args
\ M()        M(a,b,x)      Hypergeometric function M for real args
\ Wwhit      W(k,mu,z)     Whittaker function W for real args
\ Mwhit      M(k,mu,z)     Whittaker function M for real args


\ This code conforms with ANS requiring:
\      1. The Floating-Point word set
\      2. The immediate word '%' which takes the next token
\         and converts it to a floating-point literal
\      3. Uses the word 'GAMMA' to evaluate the gamma function
\      4. The FCONSTANT PI (3.1415926536...)
\      5. The compilation of the test code is controlled by TRUE/FALSE
\         and the conditional compilation words in the Programming-Tools wordset.
\      6. Under 4tH this function is neither fast nor precise! (about 5 digits).

\ There is a bit of stack gymnastics in this code particularly in U() and M()
\ but that seems to be in the nature of the algorithm.

\ Baker, L., 1992; C Mathematical Function Handbook, McGraw-Hill,
\ New York, 757 pages,  ISBN 0-07-911158-0


\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ PCYLFUN      V1.1                 3 October 1994   EFC

\ Private:

[UNDEFINED] Upcf    [IF]
[UNDEFINED] F**     [IF] [NEEDS lib/falog.4th]  [THEN]
[UNDEFINED] F10**   [IF] [NEEDS lib/fpow10.4th] [THEN]
[UNDEFINED] GAMMA   [IF] [NEEDS lib/gamma.4th]  [THEN]
[UNDEFINED] E.FPERR [IF] [NEEDS lib/throw.4th]  [THEN]

FLOAT array SUM
FLOAT array TERM
FLOAT array OLD-TERM

\ scratch space for stack conservation
FLOAT array XX-TMP
FLOAT array A-TMP
FLOAT array B-TMP
FLOAT array C-TMP
FLOAT array D-TMP
FLOAT array U-TMP

FLOAT array AV-TMP
FLOAT array BV-TMP
FLOAT array CV-TMP
FLOAT array XV-TMP
FLOAT array NV-TMP
FLOAT array XU-TMP
FLOAT array NU-TMP
FLOAT array AU-TMP
FLOAT array BU-TMP

: FRAC ( -- , f: x -- fractional_part_of_x )
         FDUP F>D D>F F-
;

: FAC ( -- , f: x -- z )
         1 S>F F+ GAMMA
;


: ?big-x ( -- t/f , f: nu x -- nu x )
        FOVER FOVER
        4 S>F F> FABS 4 S>F F* FOVER FSWAP F> AND
;

: asymptotic-u ( -- , f: nu x -- U[nu,x] )

                 1 S>F F2/ FOVER FDUP F* F/
                 A-TMP F!

                 FDUP FDUP F* -1 S>F F2/ F2/ F*
                 FEXP D-TMP F!

                 FOVER 1 S>F F2/ F+ F** D-TMP F@ FSWAP F/
                 D-TMP F!

                 FDUP FDUP
                 7 S>F F2/ F+ FSWAP 5 S>F F2/ F+ F* A-TMP F@ F* 1 S>F F2/ F* 1 S>F F-
                 A-TMP F@ F*
                 FOVER 1 S>F F2/ F+ F*
                 FSWAP 3 S>F F2/ F+ F*
                 1 S>F F+

                 D-TMP F@ F*
;

: simple-u ( -- , f: b a -- z )
           FSWAP FDROP XX-TMP F@ FSWAP F**
           SUM F@ FSWAP F/
;


: asymptotic-v ( -- , f: nu x -- V[nu,x] )

                 1 S>F F2/ FOVER FDUP F* F/
                 A-TMP F!

                 FDUP FDUP F* 1 S>F F2/ F2/ F*
                 FEXP D-TMP F!

                 FOVER 1 S>F F2/ F- F** D-TMP F@ F*

                 2 S>F PI F/ FSQRT F*
                 D-TMP F!

                 FDUP FDUP
                 7 S>F F2/ F- FSWAP 5 S>F F2/ F- F* A-TMP F@ F* 1 S>F F2/ F* 1 S>F F+
                 A-TMP F@ F*
                 FOVER 1 S>F F2/ F- F*
                 FSWAP 3 S>F F2/ F- F*
                 1 S>F F+

                 D-TMP F@ F*
;

: ?bad-M-parms ( -- t/f , f: a b -- a b )
           FDUP F0<
           FOVER FOVER FSWAP F< AND
           FOVER FRAC F0= AND
           FDUP FRAC F0= AND
;

\ Public:

: M()  ( -- , f: a b x --- u )
       XX-TMP F!

       ?bad-M-parms E.FPERR throw" M() bad parameters"

       XX-TMP F@ F0= IF
                     FDROP FDROP 1 S>F
                ELSE
                     1 S>F TERM F!    1 S>F SUM F!

                     XX-TMP F@ 10 S>F F>

                                   IF
                                      15 f10** f**2 OLD-TERM F!

                                      40 0 DO
                                             FOVER FOVER FOVER F- I S>F F+
                                             FSWAP I 1+ S>F FSWAP F- F*
                                             I 1+ S>F XX-TMP F@ F* F/
                                             TERM F@ F* FDUP TERM F!

                                             FABS OLD-TERM F@ F> IF LEAVE THEN
                                             TERM F@ FDUP FABS OLD-TERM F!
                                             SUM F@ F+ SUM F!

                                             OLD-TERM F@ FDUP 1 S>F 1000000 S>F F/ F<
                                             SUM F@ FABS 1000000 S>F F/ F<
                                             OR IF LEAVE THEN
                                      LOOP

                                      FOVER FOVER F- XX-TMP F@ FSWAP F**
                                      XX-TMP F@ FEXP F* SUM F@ F*
                                      FSWAP GAMMA F*
                                      FSWAP GAMMA F/

                                   ELSE

                                       40 0 DO
                                              FOVER I S>F F+ XX-TMP F@ F*

                                              FOVER I S>F F+
                                              I 1+ S>F F* F/

                                              TERM F@ F* FDUP TERM F!

                                              FABS
                                              SUM F@ FABS 1000000 S>F F/
                                              F< IF LEAVE THEN
                                              SUM F@ TERM F@ F+ SUM F! 
                                       LOOP

                                       FDROP FDROP SUM F@
                                    THEN
                THEN
;

\ Private:

: u-small-x ( -- , f: a b  -- u )
            \ wont work if b is an integer, so tweak it slightly if it is
            FDUP FRAC F0= IF 1 S>F 1000000 S>F F/ F+ THEN

            BU-TMP F!  AU-TMP F!

            XX-TMP F@ 0 S>F F> IF    \ 0 > x > 5

                                 PI BU-TMP F@ PI F* FSIN F/

                                 AU-TMP F@ BU-TMP F@ F- 1 S>F F+ GAMMA
                                 BU-TMP F@ GAMMA F* U-TMP F!

                                 AU-TMP F@ BU-TMP F@ XX-TMP F@ M() U-TMP F@ F/
                                 U-TMP F!

                                 BU-TMP F@ FNEGATE FDUP BU-TMP F!    \ b is now -b
                                 1 S>F F+ FAC

                                 AU-TMP F@ GAMMA F*
                                 XX-TMP F@ BU-TMP F@ 1 S>F F+ F**
                                 FSWAP F/

                                 AU-TMP F@ BU-TMP F@ F+ 1 S>F F+
                                 2 S>F BU-TMP F@ F+
                                 XX-TMP F@     M()

                                 F* FNEGATE

                                 U-TMP F@ F+ F*

                              ELSE    \ -5 < x < 0

                                  PI BU-TMP F@ PI F* FSIN F/

                                  XX-TMP F@ FEXP F*

                                  BU-TMP F@ AU-TMP F@ F-
                                  BU-TMP F@
                                  XX-TMP F@ FNEGATE M()
                                  U-TMP F!

                                  \ NOTE: side effect recovery !!!!
                                  \ M() stores last parameter in XX-TMP
                                  \ which is now the original XX-TMP
                                  \ with it sign changed, so we have
                                  \ to fix it here,
                                  XX-TMP F@ FNEGATE XX-TMP F!

                                  AU-TMP F@ BU-TMP F@ F- 1 S>F F+ GAMMA
                                  BU-TMP F@ GAMMA F* U-TMP F@ FSWAP F/
                                  U-TMP F!

                                  BU-TMP F@ FNEGATE FDUP BU-TMP F!    \ b is now -b

                                  2 S>F F+ GAMMA AU-TMP F@ GAMMA F*

                                  BU-TMP F@ 1 S>F F+ PI F* FCOS FSWAP F/

                                  XX-TMP F@ FNEGATE
                                  BU-TMP F@ 1 S>F F+  F** F*

                                  1 S>F AU-TMP F@ F-
                                  BU-TMP F@ 2 S>F F+
                                  XX-TMP F@    M()

                                  F* FNEGATE

                                  U-TMP F@ F+ F*
            THEN
;

\ Public:

: U()  ( -- , f: a b x --- u )

       FDUP XX-TMP F!
       FABS 5 S>F F< IF
                         u-small-x
                     ELSE
                         1 S>F TERM F!  1 S>F SUM F!
                         FSWAP
                         40 0 DO
                                FOVER FOVER FSWAP F- I 1+ S>F F+
                                FOVER I S>F F+ F*
                                I 1+ S>F XX-TMP F@ F* F/ FNEGATE

                                FDUP FABS 1 S>F F> IF

                                              TERM F@ SUM F@ F/ FABS 1 S>F 1000 S>F F/ F<
                                              IF   FDROP simple-u
                                              ELSE

                                                   FDROP FSWAP u-small-x
                                              THEN

                                              LEAVE
                                ELSE
                                              TERM F@ F* FDUP TERM F!
                                              SUM F@ F+ SUM F!

                                              TERM F@ SUM F@ F/ FABS 1 S>F 1000000 S>F F/ F<
                                              IF   simple-u
                                                   LEAVE
                                              THEN
                                THEN
                         LOOP
                     THEN
;


: Upcf ( -- , f: nu x  -- U[nu,x] ) 
        ?big-x IF
                   asymptotic-u
               ELSE

                  FSWAP 1 S>F F2/ F* FSWAP         \ nu is now 0.5*nu

                  FDUP FDUP F* -1 S>F F2/ F2/ F* FEXP A-TMP F!
                  FOVER 1 S>F F2/ F2/ F+ 2 S>F FSWAP F**
                  A-TMP F@ FSWAP F/  A-TMP F!

                  FDUP 0 S>F F> IF

                              FDUP F* 1 S>F F2/ F*
                              FSWAP 1 S>F F2/ F2/ F+ FSWAP
                              1 S>F F2/ FSWAP

                              U()

                           ELSE                \ x <= 0

                              PI FSQRT A-TMP F@ F* A-TMP F!

                              \ saving params in TMPs to conserve stack space
                              XU-TMP F!    FDUP NU-TMP F!

                              3 S>F F2/ F2/ F+ GAMMA           B-TMP F!
                              NU-TMP F@ 1 S>F F2/ F2/ F+ GAMMA C-TMP F!

                              NU-TMP F@ 1 S>F F2/ F2/ F+ 
                              1 S>F F2/ 
                              XU-TMP F@ FDUP F* 1 S>F F2/ F*

                              M() B-TMP F@ F/ B-TMP F!

                              NU-TMP F@ 3 S>F F2/ F2/ F+
                              3 S>F F2/
                              XU-TMP F@ FDUP F* 1 S>F F2/ F*

                              M() C-TMP F@ F/ 2 S>F FSQRT F* XU-TMP F@ F* FNEGATE

                              B-TMP F@ F+
                           THEN

                           A-TMP F@ F*
               THEN
;

: Vpcf ( -- , f: nu x -- V[nu,x] )
        ?big-x IF
                   asymptotic-v
               ELSE
                   \ saving params in TMPs to conserve stack space
                   XV-TMP F!    FDUP NV-TMP F!

                   1 S>F F2/ F+ GAMMA PI F/        AV-TMP F!
                   NV-TMP F@ PI F* FSIN        BV-TMP F!

                   NV-TMP F@ XV-TMP F@
                               Upcf            CV-TMP F!
                   NV-TMP F@ XV-TMP F@ FNEGATE
                               Upcf            D-TMP F!

                   BV-TMP F@ CV-TMP F@ F* D-TMP F@ F+ AV-TMP F@ F*
               THEN
;

: Mwhit (  -- , f: k mu z -- M[k,mu,z] )
         FOVER FOVER FSWAP 1 S>F F2/ F+ FSWAP F**
         FOVER -1 S>F F2/ F* FEXP F*
         D-TMP F!

         FROT FNEGATE 1 S>F F2/ F+
         FROT FSWAP FOVER F+

         FSWAP F2* 1 S>F F+
         FROT     M()
         D-TMP F@ F*
;

: Wwhit ( -- , f: k mu z -- W[k,mu,z] )
         FOVER FOVER FSWAP 1 S>F F2/ F+ FSWAP F**
         FOVER -1 S>F F2/ F* FEXP F*
         D-TMP F!

         FROT FNEGATE 1 S>F F2/ F+
         FROT FSWAP FOVER F+

         FSWAP F2* 1 S>F F+
         FROT     U()
         D-TMP F@ F*
;

[DEFINED] 4TH# [IF]
  hide SUM
  hide TERM
  hide OLD-TERM
  hide XX-TMP
  hide A-TMP
  hide B-TMP
  hide C-TMP
  hide D-TMP
  hide U-TMP
  hide AV-TMP
  hide BV-TMP
  hide CV-TMP
  hide XV-TMP
  hide NV-TMP
  hide XU-TMP
  hide NU-TMP
  hide AU-TMP
  hide BU-TMP
  hide FRAC
  hide FAC
  hide ?big-x
  hide asymptotic-u
  hide asymptotic-v
  hide simple-u
  hide ?bad-M-parms
  hide u-small-x
[THEN]
[THEN]
