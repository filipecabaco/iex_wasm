\ 0: Initial release 11/07/2002, Brad Eckert
\ 1: Fixed FROUND, F.
\ 2: Limited number of significant digits in F. to comply with ANS standard.
\ 3: Added >FLOAT FS. FE. F.S
\ 4: Corrected (F.) rounding error and added more tests.
\ 5: Made 4tH version, Hans Bezemer
\ 6: Factored out part of number generation.
\ 7: Stripped (F.) even more.
\ 8: Replaced ?DUP in F.S
\ 9: Added E.FPERR

[UNDEFINED] >float  [IF]
[UNDEFINED] fsplit  [IF] [ABORT] [THEN]
[UNDEFINED] d#      [IF] include lib/dblsharp.4th [THEN]
[UNDEFINED] E.FPERR [IF] include lib/throw.4th [THEN]

\ (F.) uses PRECISION as the number of digits after the decimal. F. clips off
\ the result to avoid displaying extra (possibly garbage) digits. However,
\ this defeats last-digit rounding. (F.) TYPE is the prefered display method.
\ F. is included for completeness.

: (F.)          ( F: r -- ) ( -- addr len )
\ Convert float to a string
                <d# FDEPTH 1- 0< IF 0 0 EXIT THEN     \ empty stack -> blank
                PRECISION fsplit
                PRECISION 0 ?DO d# LOOP D+
                PRECISION IF [CHAR] . dhold THEN
                d#s dsign d#> ;

: F.            ( F: r -- )  (F.) PRECISION 1+ MIN TYPE SPACE ;
: R.            ( F: r -- )  (F.) TYPE SPACE ;

: (E.)          ( stepsize resolution -- | F: r -- )  \ X.XXXXXXEYY format
                >R FDUP FABS 0                  ( step 0 )
        BEGIN   FDUP 1 S>F F<
        WHILE   OVER - R@ S>F F*
        REPEAT
        BEGIN   FDUP R@ S>F F< 0=
        WHILE   OVER + R@ S>F F/
        REPEAT  R> DROP NIP
                FSWAP F0< IF FNEGATE THEN
                (F.) TYPE
                DUP ABS S>D <# #S SIGN
                [CHAR] E HOLD #> TYPE SPACE ;

: FS.   ( F: r -- ) 1   10 (E.) ;      \ scientific notation
: FE.   ( F: r -- ) 3 1000 (E.) ;      \ engineering notation

\ String to floating point conversion ---------------------------------------

: fsign         ( a n -- a' n' sign )  \ get sign from the input string
                OVER C@ OVER IF DUP
                  [CHAR] - = IF DROP CHOP -1 EXIT ELSE
                  [CHAR] + = IF CHOP THEN THEN
                ELSE DROP THEN 0
;

variable flgood

: fdigit?       ( a len -- a len n f ) \ get digit from the input string
                DUP 0<> >R
                OVER C@ [CHAR] 0 - DUP 0< OVER 9 > OR 0=
                R> AND  DUP
        IF      2SWAP CHOP 2SWAP       \ good digit, use it
                1 flgood +!
        THEN    ;

: flint         ( addr len -- addr' len' )
        BEGIN   fdigit?                \ get integer part
        WHILE   10 S>F F* S>F F+
        REPEAT  DROP ;

: flexp         ( addr len -- addr' len' )            \ get exponent
                OVER C@ [CHAR] D -     \ expect 0,1,20,21
                -34 AND 0=             \ and invert(0x21)
                flgood @ 1 <> AND      \ some mantissa digits are required
        IF      CHOP fsign >R 0 >R     \ E,e,D,d is valid
         BEGIN  fdigit?                \ get exponent
         WHILE  R> 10 * + >R
         REPEAT DROP R> R>
         IF     0 ?DO 10 S>F F/ LOOP   \ positive exponent
         ELSE   0 ?DO 10 S>F F* LOOP   \ negative exponent
         THEN
        THEN    DUP
        IF      0 flgood !             \ unknown text left to convert
        THEN    ;

: flfrac        ( addr len -- addr' len' )
                CHOP 1 S>F             \ convert after the decimal
        BEGIN   fdigit?
        WHILE   10 S>F F/              ( F: num digitmul )
                FDUP S>F F*            ( F: num digitmul delta )
                FROT F+ FSWAP
        REPEAT  FDROP DROP DUP         \ more to convert?
        IF      flexp
        THEN    ;

: >FLOAT        ( addr len -- f ) ( f: -- r | <nothing> )
\ Convert base 10 string to float regardless of BASE.
                -TRAILING  0 S>F
                fsign >R   1 flgood !
                flint DUP
        IF      OVER C@ [CHAR] . =
                IF flfrac ELSE flexp THEN
        THEN    2DROP
                R> IF FNEGATE THEN
                flgood @ IF true ELSE FDROP false THEN
                ;

: S>FLOAT >FLOAT 0= E.FPERR THROW" Bad float" ;

: F.S ( -- )   FDEPTH BEGIN DUP IF DUP THEN WHILE 1- DUP FPICK F. REPEAT CR ;

[DEFINED] 4TH# [IF]
  hide fsplit
  hide fsign
  hide flgood
  hide fdigit?
  hide flint
  hide flexp
  hide flfrac
[THEN]
[THEN]
