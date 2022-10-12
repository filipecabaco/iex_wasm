\ Posted on comp.lang.forth/wtdRtCTWKcw by dxforth
\ FINPUT.F  version 0.1  2009-05-07

\ A minimum yet compliant Forth-94 implementation of
\ >FLOAT. Works with separate or common stack float
\ models.

\ The code is intended as a model only. No particular
\ effort has been made to optimize for speed or
\ accuracy.

\ This code is PUBLIC DOMAIN.  Use at your own risk.

\ History:

\ 0.1  Replaced .1E F* with 10E F/ for better accuracy.
\      Added conditional to allow leading decimal point
\      on forth text input.
\ 0.1a Adapted to ANS float for 4tH by Hans Bezemer
\ 0.1b Reimplemented using the >FNUMBER version

\ Loading FINPUT v0.1  2009-05-07

[UNDEFINED] >float   [IF]
[UNDEFINED] fdrop    [IF] [ABORT] [THEN]
[UNDEFINED] E.FPERR  [IF] include lib/throw.4th [THEN]
[UNDEFINED] >snumber [IF] include lib/tonumber.4th [THEN]

: ?CHOP IF CHOP THEN ;  ( a n f -- a' n')

: /NUMBER ( adr len -- adr' len' u)
  0 -ROT >SNUMBER ROT ;

: /SIGN ( adr len -- adr' len' flag )
  OVER C@  DUP [CHAR] + =  SWAP [CHAR] - =
  DUP >R OR OVER 0<> AND ?CHOP R> ;

\ String-to-float conversion
\ Works with floats on the data stack

VARIABLE (exp)  \ exponent
VARIABLE (dpf)  \ decimal point

: (getdigs) ( r adr len -- r' adr' len' )
  BEGIN  DUP  WHILE
    OVER C@ [CHAR] 0 - DUP 10 U<
    UNLESS DROP ;THEN ( r adr len n )
    >R CHOP R> -ROT  2>R
    0 D>F FSWAP 10 S>F  F*  F+
    (dpf) @ (exp) +!  2R>
  REPEAT ;

: (getmant) ( adr len -- adr' len' flag )
  DUP >R  (getdigs)  DUP IF
    OVER C@ [CHAR] . = IF
      -1 (dpf) ! CHOP (getdigs)
    THEN
  THEN  R> OVER - (dpf) @ + ;

: (getexp) ( r adr len -- r' adr' len' )
  DUP IF
    OVER C@ 33 OR [CHAR] e = ?CHOP 
  THEN   ( 'D' 'E' 'd' 'e')
  /SIGN >R /NUMBER R> IF NEGATE THEN
  (exp) @ +  ( r adr len n )  -ROT 2>R
  BEGIN  DUP WHILE  DUP 0<
    IF    1+  >R  10 S>F  F/
    ELSE  1-  >R  10 S>F  F*  THEN  R>
  REPEAT DROP 2R> ;

\ Convert string to float stop at unconvertible char
: >FNUMBER ( adr len -- r adr' len' )
  0 DUP (exp) ! (dpf) ! 2>R 0 S>F  2R>
  /SIGN >R  (getmant) IF  (getexp)  THEN 
  R> -ROT 2>R IF FNEGATE THEN  2R> ;

[DEFINED] simpletofloat [IF]
: >FLOAT >FNUMBER >R DROP R@ IF FDROP THEN R> 0= ;
[ELSE]
: >FLOAT ( c-addr u -- r true | false )
  0 DUP (exp) ! (dpf) ! 2>R 0 S>F  2R>
  2DUP -TRAILING NIP IF
    /SIGN >R TRUE >R (getmant)
    IF RDROP (getexp) DUP >R THEN R>
    IF 2DROP FDROP RDROP FALSE ;THEN
  ELSE DROP 0 DUP >R
  THEN 2DROP R> IF FNEGATE THEN TRUE ;
[THEN]

: S>FLOAT >float 0= E.FPERR throw" Bad float" ;

[DEFINED] 4TH# [IF]
  hide (getexp)
  hide (getmant)
  hide (exp)
  hide (dpf)
  hide (getdigs)
  hide /sign
  hide /number
  hide ?chop
[THEN]
[THEN]

