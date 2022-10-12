\ FLOATING and FLOATING-EXT words not implemented here are:
\ FLITERAL REPRESENT F** FACOS FACOSH FALOG FASIN FASINH FATAN FATAN2
\ FATANH FCOS FCOSH FEXP FEXPM1 FLN FLNP1 FLOG FSIN FSINCOS FSINH FTAN
\ and FTANH

\ 0: Initial release 11/07/2002, Brad Eckert
\ 1: Removed locals from F*, PAD from F/. Added FSQRT.
\ 2: Fixed FROUND.
\ 3: Fixed FPICK, converted standard words to upper case, sped up stack.
\ 4: Changed F2* and F2/ to use fshift. You can use fshift for quick *2^n.
\    Replaced DO..LOOP with 0 ?DO LOOP structure.
\ 5: Changed 0 ?DO LOOP to use EVALUATE (more optimizer-friendly).
\ 6: Fixed a bug in F/.
\ 7: Removed extra FDUPs from F<. Fixed a bug in F+.
\ 8: Changed -ROT to ROT ROT for strict ANS compliance.
\ 9: Made F# state smart. Fixed bug in FSQRT.
\ 10: Made 4tH version, Hans Bezemer
\ 11: Fixed FLOOR, added F=.
\ 12: Added IEEE 754 exceptions.
\ 13: Fixed FSQRT (didn't clear stack on error).
\ 14: Fixed F+ (did FABS when 2OS is zero).
\ 15: Added F>S.
\ 16: Fixed F~ (didn't compare zero and negative zero properly).
\ 17: Fixed F0< (didn't compare zero and negative zero properly).
\ 18: Added FSIGN? and mmaxdigits.
\ 19: Made &esign more portable.
\ 20: Replaced 3 PICK with >R >R OVER R> R> ROT.
\ 21: Fixed FLOOR again.
\ 22: Fixed t2/, cleared sign bit. Optimized frshift.
\ 23: Made constants of &esign and maxdigits. Optimized FSQRT.
\ 24: Increased FLOATING-STACK.
\ 25: Split up library. Made fsp public.
\ 26: Removed 1 RSHIFT &unsign AND patches.
\ 27: Replaced bits/cell, optimized longdiv, F*, F/.
\ 28: Fixed *norm, conditionally round number.
\ 29: Added F0<>, F0>.
\ 30: Changed FLOAT+.
\ 31: Added FLOAT>EXP, EXP>FLOAT.
\ 32: Redefined FLOATS, FALIGN, FALIGNED. Optimized normalize.
\ 33: Optimized FMOVE, FROT, FTEMP'.
\ 34: Reimplemented PRECISION and SET-PRECISION.
\ 35: Assured compatibility with TRIPLE.4TH.
\ 36: Moved triple words to TRIPLUS.4TH.
\ 37: FCLEAR now initializes, fixed FLOOR once and for all

[UNDEFINED] floats   [IF]
[UNDEFINED] t+       [IF] include lib/triplus.4th  [THEN]
[UNDEFINED] um*      [IF] include lib/mixed.4th    [THEN]
[UNDEFINED] drrshift [IF] include lib/dblshift.4th [THEN]

[UNDEFINED] FLOATING-STACK [IF]
16 CONSTANT FLOATING-STACK             \ size of floating point stack
[THEN]
                                       \ dummy definitions
[IGNORE] FALIGN                        ( -- )
[IGNORE] FALIGNED                      ( addr -- addr )

\ Floating point representation uses three cells:
\ 0 upper mantissa
\ 1 lower mantissa
\ 2 exponent: MSB = sign of mantissa, others = signed exponent

3 CELLS CONSTANT c/float
c/float NEGATE CONSTANT -c/float
c/float CONSTANT FLOAT
c/float +CONSTANT FLOAT+               ( n1 -- n2 )
c/float *CONSTANT FLOATS               ( n1 -- n2 )

VARIABLE fsp                           \ stack pointer

FLOATING-STACK FLOATS ARRAY fstak      \ floating point stack
6 ARRAY ftemp                          \ temporary (float) variables
ftemp 2 CELLS + EQUATES ftemp'         ( -- addr )
                                       \ max. digits
CELL-BITS 1- 602 * 1000 / CONSTANT maxdigits
maxdigits VALUE PRECISION              \ max decimal digits/double
                                       \ # of digits to display (see F., R.)
lowbits   CONSTANT &unsign
highbit   CONSTANT &sign
&sign 2 / &sign + CONSTANT &esign      \ equals &sign 1 rshift
&esign [SIGN] 1 [=] [NOT] [IF] [ABORT] [THEN]
                                       \ abort when not positive
\ A variable called ferror stores error codes in the event of an error.
\ Execution is not interrupted, but a bad result could be generated. You
\ should check for a non-zero error code at appropriate times.

VARIABLE ferror                        \ last seen error

\ Standard IEEE 754 exceptions

0   enum FE.NOERRORS                   \ No FP errors
    enum FE.DIVBYZERO                  \ Division by zero
    enum FE.OVERFLOW                   \ Overflow
    enum FE.UNDERFLOW                  \ Underflow
    enum FE.INVALID                    \ Invalid operation
constant FE.INEXACT                    \ Inexact result

: tneg          ( d flag -- t )        \ conditionally negate d to 3-cell t
                0<> >R 2DUP OR 0<> R> AND IF DNEGATE -1 ELSE 0 THEN ;

: ud2/          ( d -- d' )
                D2/ &unsign AND ;

: frshift       ( count 'man -- )      \ right shift mantissa
                SWAP 0 MAX CELL-BITS 2 * MIN
                >R DUP 2@ R> 0 ?DO ud2/ LOOP ROT 2! ;

: exp>sign      ( exp -- exp' sign )
                DUP &unsign AND        \ mask off exponent
                DUP &esign AND 2* OR   \ sign extend exponent
                SWAP &sign AND ;       \ get sign of mantissa

: sign>exp      ( exp sign -- exp' )
                SWAP &unsign AND OR ;

: lstemp        ( -- )                 \ 6-cell left shift FTEMP
                ftemp 6 CELLS + 0      ( *LSB carry . . )
      6 0 ?DO   >R -1 CELLS +          \ LSB in high memory
                DUP @ 0 D2* SWAP R> +  ( a co n ) \ ROL
                ROT TUCK ! SWAP        \ a carry
        LOOP    2DROP ;

: *norm         ( triple exp -- double exp' )         \ normalize triple
     >R BEGIN   DUP 0< 0=
        WHILE   t2* R> 1- >R
        REPEAT  2DUP AND 1+ IF &sign 0 0 t+ THEN      \ round
                ROT DROP R> ;

: longdiv       ( DA DB -- DA/DB )     \ fractional divide
                0 0 ftemp 2!
                CELL-BITS 2 * 1+       \ long division
        0 ?DO   2OVER 2OVER DU<        \ double/double
                IF   0
                ELSE 2DUP 2>R D- 2R> 1 \ a b --> a-b b
                THEN 0 ftemp 2@ D2* D+ ftemp 2!
                2SWAP D2* 2SWAP
        LOOP    DU< 0= 1 AND 0         \ round
                ftemp 2@ D+ ;

\ The rest can be left in high level Forth...

: 'm1           ( -- addr )      fsp @ 3 CELLS - ;    \ -> 1st stack mantissa
: 'm2           ( -- addr )      fsp @ 6 CELLS - ;    \ -> 2nd stack mantissa
: 'm3           ( -- addr )      fsp @ 9 CELLS - ;    \ -> 3rd stack mantissa
: 'e1           ( -- addr )      fsp @ 1 CELLS - ;    \ -> 1st stack exponent
: 'e2           ( -- addr )      fsp @ 4 CELLS - ;    \ -> 2nd stack exponent
: fmove         ( a1 a2 -- )     c/float smove ;
: m1get         ( addr -- )      'm1 fmove ;          \ move to M1
: m1sto         ( addr -- )      'm1 SWAP fmove ;     \ move from M1
: expx1         ( -- exp sign )  'e1 @ exp>sign ;
: expx2         ( -- exp sign )  'e2 @ exp>sign ;
: >exp1         ( exp sign -- )  sign>exp 'e1 ! ;
: fshift        ( n -- )         expx1 >R + R> >exp1 ; \ F = F * 2^n

\ A normalized float has an unsigned mantissa with its MSB = 1

: normalize     ( -- )
                'm1 2@ 2DUP OR
       IF       0 ROT ROT expx1 >R *norm
                R> >exp1 'm1 2!
       ELSE     2DROP                  \ Zero is a special case.
       THEN     ;

\ *S Floating Point Words

\ *+
: F2*           ( fs: r1 -- r3 )  1 fshift ;
: F2/           ( fs: r1 -- r3 ) -1 fshift ;
: SET-PRECISION ( n -- )         maxdigits MIN TO PRECISION ;
: FCLEAR        ( -- )           fstak fsp ! FE.NOERRORS ferror ! ;
: FDEPTH        ( -- )           fsp @ fstak - c/float / ;
: FDUP          ( fs: r -- r r ) c/float fsp +! 'm2 m1get ;
: FDROP         ( fs: r -- )    -c/float fsp +! ;
: FNEGATE       ( fs: r1 -- r3 ) 'e1 @ &sign XOR 'e1 ! ;
: D>F           ( d -- | -- r )  FDUP DUP 0< IF DNEGATE &sign ELSE 0 THEN
                                 'e1 ! 'm1 2!  normalize ;
: F>D           ( -- d | r -- )  expx1 >R DUP 1- 0<
        IF      NEGATE &unsign AND 'm1 frshift 'm1 2@ R> IF DNEGATE THEN
        ELSE    R> 2DROP -1 &unsign FE.OVERFLOW ferror !
        THEN    FDROP ;                \ overflow: return maxdint
: S>F           ( n -- | -- r )  DUP ABS U>D ROT 0< IF DNEGATE THEN D>F ;
: F>S           ( r -- | -- n )  F>D 2DUP D0< >R DABS D>U R> IF NEGATE THEN ;
: FLOAT>EXP     normalize F2* 'm1 2@ ud2/ expx1 SWAP >R D+- R> FDROP ;
: EXP>FLOAT     FDUP OVER &sign AND >R >R DABS 'm1 2! R> R> >exp1 normalize ;
: F@            ( a -- | -- r )  FDUP m1get ;
: F!            ( a -- | r -- )  m1sto FDROP ;
: FSIGN?        ( -- t | r -- r) 'e1 @ 0< ;
: F0<>          ( -- t | r -- )  'm1 2@ OR 0<> FDROP ;
: F0=           ( -- t | r -- )  F0<> 0= ;
: F0<           ( -- t | r -- )  FSIGN? F0<> AND ;
: F0>           ( -- t | r -- )  FSIGN? 0= F0<> AND ;
: FABS          ( fs: r1 -- r3 ) FSIGN? IF FNEGATE THEN ;
: FSWAP         ( fs: r1 r2 -- r2 r1 )
                'm1 ftemp fmove 'm2 m1get ftemp 'm2 fmove ;
: FOVER         ( fs: r1 r2 -- r1 r2 r3 )
                c/float fsp +! 'm3 m1get ;
: FPICK         ( n -- ) ( fs: -- r )
                c/float fsp +! 2 + -c/float * fsp @ + m1get ;
: FNIP          ( fs: r1 r2 -- r2 ) FSWAP FDROP ;
: FROT          ( fs: r1 r2 r3 -- r2 r3 r1 )
                'm3 ftemp fmove  'm2 'm3 c/float 2 * smove  ftemp m1get ;
: F+            ( fs: r1 r2 -- r3 )    \ Add two floats
       FDUP F0= IF FDROP EXIT THEN                    \ r2 = 0
      FOVER F0= IF FNIP  EXIT THEN                    \ r1 = 0
                expx1 >R expx2 >R - DUP 0<
        IF      NEGATE 'm1 frshift 0   \ align exponents
        ELSE    DUP    'm2 frshift
        THEN    'e2 @ +
                'm2 2@ R> tneg
                'm1 2@ R> tneg
                t+ DUP >R              ( exp L M H | sign )
    DUP IF      t2/ IF DNEGATE THEN 'm2 2! 1+
        ELSE    DROP 'm2 2!
        THEN    R> &sign AND sign>exp 'e2 !
                FDROP normalize ;

: F-            ( fs: r1 r2 -- r3 )    \ Subtract two floats
                FNEGATE F+ ;

: F<            ( -- flag ) ( F: r1 r2 -- )           \ Compare two floats
                F- F0< ;

: F=            ( -- flag ) ( F: r1 r2 -- )           \ Compare two floats
                F- F0= ;
                ( fs: r1 -- r2 )       \ Truncate to negative infinity
: FLOOR         FLOAT>EXP DUP 0< IF ABS DARSHIFT 0 THEN EXP>FLOAT ;

: FROUND        ( fs: r1 -- r2 )       \ Round to the nearest integer
                expx1 >R NEGATE 1- 'm1 frshift        \ convert to half steps
                'm1 2@ 1 U>D D+ SWAP -2 AND SWAP      \ round
                'm1 2! -1 R> >exp1 normalize ;        \ re-float

: FMIN          ( F: r1 r2 -- rmin ) FOVER FOVER F<
                IF FDROP ELSE FNIP THEN ;

: FMAX          ( F: r1 r2 -- rmax ) FOVER FOVER F<
                IF FNIP ELSE FDROP THEN ;

: F*            ( fs: r1 r2 -- r3 )    \ Multiply two floats
                'm1 2@ 'm2 2@
                OVER >R ftemp' 2!
                OVER >R ftemp  2!
                R> R> OR
                                       \ need long multiply?
        IF      FTEMP CELL+ @ FTEMP' CELL+ @ UM* &sign 0 D+ NIP \ round
                FTEMP @       FTEMP' @       UM*
                FTEMP CELL+ @ FTEMP' @       UM* 0 t+
                FTEMP @       FTEMP' CELL+ @ UM* 0 t+
        ELSE    0 ftemp @ ftemp' @ UM* \ lower parts are 0
        THEN    2DUP OR >R >R OVER R> R> ROT OR       \ zero?
        IF      expx1 >R expx2 >R + CELL-BITS 2 * + *norm
                R> R> XOR sign>exp 'e2 !
        ELSE    DROP                   \ zero result
        THEN    'm2 2! FDROP ;

: F/            ( fs: r1 r2 -- r3 )    \ Divide r1 by r2
                FDUP F0=                              \ div by 0, man= umaxint
        IF      FDROP -1 -1 'm1 2! FE.DIVBYZERO ferror !
                'e1 @ &sign AND &esign 1- OR 'e1 !    \   exponent = maxint/2
        ELSE    'm2 2@ 'm1 2@
                DU< 0= IF 1 'm2 frshift F2/ THEN      \ divisor<=dividend
                'm1 CELL+ @
           IF   'm2 2@ ud2/ 'm1 2@ ud2/  longdiv      \ max divisor = dmaxint
           ELSE 0 'm2 2@ 'm1 @ DUP >R UM/MOD          \ 0 rem quot | divisor
                ROT ROT R@ UM/MOD ROT ROT R> 1 RSHIFT U>
                IF 1 U>D D+ THEN                      \ round
           THEN expx2 >R expx1 >R - CELL-BITS 2 * -
                >R 'm2 2! R> R> R> XOR sign>exp 'E2 !
                FDROP
        THEN    ;

: F~            ( f: r1 r2 r3 -- ) ( -- flag )        \ f-proximate
                FDUP F0<                              \ Win32forth version
        IF      FABS FOVER FABS 3 FPICK FABS F+ F*    \ r1 r2 r3*(r1+r2)
                FROT FROT F- FABS FSWAP F<
        ELSE    FDUP F0=
                IF      FDROP 'e1 @ 0< 'e2 @ 0< = F- F0= AND
                ELSE    FROT FROT F- FABS FSWAP F<
                THEN
        THEN ;

: FSQRT         ( fs: r -- r' )        \ Square root
                expx1 IF drop FE.INVALID ferror ! EXIT THEN \ sqrt of negative
                DUP 1 AND DUP >R +     \ round up exponent/2
                2/ CELL-BITS - 0 >exp1
                ftemp 6 BOUNDS DO 0 I ! LOOP
                'm1 2@                 \ x
                R> IF ud2/ THEN        \ exponent was rounded
                ftemp 2 CELLS + 2!     \ x*2^(2*bits/cell)
                0 0  CELL-BITS 2 *     \ p = 0
        0 ?DO   lstemp lstemp          \ shift left x into a 2 places
                D2*                    \ shift left p one place
                2DUP D2* ftemp 2@ D<
                IF      ftemp 2@ 2OVER D2* 1 U>D D+ D-
                        ftemp 2!       \ a:=a-(2*p+1)
                        1 U>D D+       \ p:=p+1
                THEN
        LOOP    'm1 2! normalize ;

\ For fixed-width fields, it makes sense to use fsplit and (F.) for output.
\ fsplit converts a float to integers suitable for pictured numeric output.
\ Fracdigits is the number of digits to the right of the decimal.
\ Left here as a public word because it requires carnal knowledge of the
\ ANS float library.

: fsplit        ( F: r -- ) ( fracdigits -- sign Dint Dfrac )
\ Split float into integer component parts.
                >R expx1 NIP FABS      \ int part must fit in a double
                FDUP F>D 2DUP D>F F-   \ get int, leave frac
            2 0 R> 0 ?DO D2* 2DUP D2* D2* D+ LOOP     \ 2 * 10^precision
                D>F F* F>D 1 U>D D+ ud2/ ;            \ round

FCLEAR                                 \ initialize, better for everyone

[DEFINED] 4TH# [IF]
  hide c/float
  hide -c/float
  hide fstak
  hide ftemp
  hide &unsign
  hide &sign
  hide &esign
  hide ud2/
  hide frshift
  hide exp>sign
  hide sign>exp
  hide tneg
  hide lstemp
  hide *norm
  hide longdiv
  hide 'm1
  hide 'm2
  hide 'm3
  hide 'e1
  hide 'e2
  hide fmove
  hide m1get
  hide m1sto
  hide expx1
  hide expx2
  hide ftemp'
  hide >exp1
  hide fshift
  hide normalize
[THEN]
[THEN]
