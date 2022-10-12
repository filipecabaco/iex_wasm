[UNDEFINED] F. [IF]
[UNDEFINED] represent [IF] include lib/represnt.4th [THEN]
[UNDEFINED] within    [IF] include lib/range.4th    [THEN]

\ FPOUT.F   version 3.4

\ A Forth floating point output words package

\ Main words:

\   Compact   Formatted   String
\   -------   ---------   ------
\   FS.       FS.R        (FS.)     Scientific
\   FE.       FE.R        (FE.)     Engineering
\   F.        F.R         (F.)      Fixed-point
\   G.        G.R         (G.)      General

\   FDP ( -- a-addr )

\   A variable controlling decimal point display.  If zero
\   then trailing decimal points are not shown. If non-zero
\   (default state) the decimal point is always displayed.

\   FECHAR ( -- a-addr )

\   A variable containing the output character used to
\   indicate the exponent. Default is 'E'.

\   FEDIGITS ( -- a-addr )

\   A variable containing the minimum number of digits
\   output for the exponent. Must be 2 or more. Default
\   is 2. Does not affect compact modes.

\ Notes:

\ Display words that specify the number of places after
\ the decimal point may use the value -1 to force compact
\ mode.  Compact mode displays all significant digits
\ with redundant zeros and signs removed.  FS. FE. F. G.
\ are displayed in compact mode.

\ The character string returned by (FS.) (FE.) (F.) (G.)
\ resides in the pictured-numeric output area.

\ An ambiguous condition exists if: BASE is not decimal;
\ character string exceeds pictured-numeric output area;
\ PRECISION is set greater than MAX-FLOAT-DIGITS.

\ For use with separate or common stack floating point
\ Forth models.

\ This code is PUBLIC DOMAIN.  Use at your own risk.

\ *****************************************************
\ This version of FPOUT requires REPRESENT conform to
\ the specification proposed here:

\  ftp://ftp.taygeta.com/pub/Forth/Applications/ANS/
\  Represent_21.txt  (2008-01-23)

\ If your Forth does not have a compliant REPRESENT
\ then use FPOUT v2.2 instead.
\ *****************************************************

\ History:

\ v3.1  13-Nov-06  es   Demo for REPRESENT proposal.
\ v3.2  05-Jun-07  es   Changed default to trailing
\                       decimal point on.
\ v3.3  19-Nov-07  es   Add FECHAR FEDIGITS. Fix zero
\                       sign in (F.) F.R
\ v3.4  23-Jan-08  es   Updated to REPRESENT spec 2.1

\ Stuff changed for 4tH:

\  S>D replaced in (f2) and (f4)
\  <# #> etc replaced with doubles version
\  (f9) reworked to eliminate '94 WHILE
\  NEGATE added for ANS style flag in (f3) and (G.)
\  Compensate Fig-style SIGN

\ Loading FPOUT v3.4  23-Jan-08

[DECIMAL]

\ Compile application

2 array FDP             \ CREATE FDP  2 CELLS ALLOT
VARIABLE FECHAR
VARIABLE FEDIGITS

\ ******************  USER OPTIONS  *******************

1 FDP !                 \ trailing decimal point control
2 FEDIGITS !            \ minimum exponent digits
CHAR E FECHAR !         \ output character for exponent

\ *****************************************************

maxdigits CHARS string fbuf

0 VALUE ex#             \ exponent
0 VALUE sn#             \ sign
0 VALUE ef#             \ exponent factor  1=FS. 3=FE.
0 VALUE pl#             \ +n  places right of decimal point
                        \ -1  compact display

\ get exponent, sign, flag2
: (f1)  ( F: r -- r ) ( -- exp sign flag2 )
  FDUP fbuf PRECISION REPRESENT ;

\ apply exponent factor
: (f2)  ( exp -- offset exp2 )
  DUP ABS U>D ROT 0< IF DNEGATE THEN ef# FM/MOD ef# * ;

\ float to ascii
: (f3)  ( F: r -- ) ( places -- c-addr u flag )
  TO pl#  (f1) NIP negate AND ( exp & flag2 )
  pl# 0< IF
    DROP PRECISION
  ELSE
    ef# 0> IF  1- (f2) DROP 1+  THEN  pl# +
  THEN  PRECISION MIN  fbuf SWAP REPRESENT >R
  TO sn#  TO ex#  fbuf maxdigits -TRAILING  R> <d# ;

\ insert exponent
: (f4)  ( exp -- )
  DUP DUP ABS U>D pl# 0< 0= DUP >R IF FEDIGITS @
  1 DO D# LOOP THEN D#S DSIGN 2DROP 0< 0=
  R> AND IF [CHAR] + DHOLD THEN FECHAR @ DHOLD ;

\ insert digit and update flag
: (f5)  ( char -- )
  DHOLD  1 FDP CELL+ ! ;

\ insert string
: (f6)  ( c-addr u -- )
  0 MAX  BEGIN  DUP  WHILE  1- 2DUP CHARS + C@ (f5)
  REPEAT 2DROP ;

\ insert '0's
: (f7)  ( n -- )
  0 MAX 0 ?DO [CHAR] 0 (f5) LOOP ;

\ insert sign
: (f8)  ( -- )
  sn# IF [CHAR] - DHOLD THEN 0. D#> ;

\ trim trailing '0's
: (f9)  ( c-addr u1 -- c-addr u2 )
  pl# 0< IF
    BEGIN  DUP 0= IF  EXIT  THEN
      1- 2DUP CHARS +
      C@ [CHAR] 0 -  UNTIL  1+
  THEN ;

: (fa)  ( n -- n n|pl# )
  pl# 0< IF  DUP  ELSE  pl#  THEN ;

\ insert fraction string n places right of dec. point
: (fb)  ( c-addr u n -- )
  0 FDP CELL+ !
  >R (f9)  R@ +
  (fa) OVER - (f7)     \ trailing 0's
  (fa) MIN  R@ - (f6)  \ fraction
  R> (fa) MIN (f7)     \ leading 0's
  FDP 2@ OR IF
    [CHAR] . DHOLD
  THEN ;

\ split string into integer/fraction parts at n and insert
: (fc)  ( c-addr u n -- )
  >R  2DUP R@ MIN 2SWAP R> /STRING  0 (fb) (f6) ;

\ exponent form
: (fd)  ( F: r -- ) ( n factor -- c-addr u )
  TO ef#  (f3) IF  ex# 1- (f2) (f4) 1+ (fc) (f8)  THEN ;

\ display c-addr u right-justified in field width u2
: (fe)  ( c-addr u u2 -- )
  OVER - SPACES TYPE ;

\ These are the main words

\ Convert real number r to a string c-addr u in scientific
\ notation with n places right of the decimal point.

: (FS.)  ( F: r -- ) ( n -- c-addr u )
  1 (fd) ;

\ Display real number r in scientific notation right-
\ justified in a field width u with n places right of the
\ decimal point.

: FS.R  ( F: r -- ) ( n u -- )
  >R (FS.) R> (fe) ;

\ Display real number r in scientific notation followed by
\ a space.

: FS.  ( F: r -- )
  -1 0 FS.R SPACE ;

\ Convert real number r to a string c-addr u in engineering
\ notation with n places right of the decimal point.

: (FE.)  ( F: r -- ) ( n -- c-addr u )
  3 (fd) ;

\ Display real number r in engineering notation right-
\ justified in a field width u with n places right of the
\ decimal point.

: FE.R  ( F: r -- ) ( n u -- )
  >R (FE.) R> (fe) ;

\ Display real number r in engineering notation followed
\ by a space.

: FE.  ( F: r -- )
  -1 0 FE.R SPACE ;

\ Convert real number r to string c-addr u in fixed-point
\ notation with n places right of the decimal point.

: (F.)  ( F: r -- ) ( n -- c-addr u )
  0 TO ef#  (f3) IF
    ex#  DUP maxdigits > IF
      fbuf 0 ( dummy ) 0 (fb)
      maxdigits - (f7) (f6)
    ELSE
      DUP 0> IF
        (fc)
      ELSE
        ABS (fb) 1 (f7)
      THEN
    THEN (f8)
  THEN ;

\ Display real number r in fixed-point notation right-
\ justified in a field width u with n places right of the
\ decimal point.

: F.R  ( F: r -- ) ( n u -- )
  >R (F.) R> (fe) ;

\ Display real number r in fixed-point notation followed
\ by a space.

: F.  ( F: r -- )
  -1 0 F.R SPACE ;

\ Convert real number r to string c-addr u with n places
\ right of the decimal point.  Fixed-point is used if the
\ exponent is in the range -4 to 5 otherwise use scientific
\ notation.

: (G.)  ( F: r -- ) ( n -- c-addr u )
  >R  (f1) NIP negate AND -3 7 WITHIN
  R> SWAP IF  (F.)  ELSE  (FS.)  THEN ;

\ Display real number r right-justified in a field width u
\ with n places right of the decimal point.  Fixed-point
\ is used if the exponent is in the range -4 to 5 otherwise
\ use scientific notation.

: G.R  ( F: r -- ) ( n u -- )
  >R (G.) R> (fe) ;

\ Display real number r followed by a space.  Fixed-point
\ is used if the exponent is in the range -4 to 5 otherwise
\ use scientific notation.

: G.  ( F: r -- )
  -1 0 G.R SPACE ;

\ Decimal point always displayed.  Use  0 FDP !
\ to disable trailing decimal point.

[DEFINED] 4tH# [IF]
  hide (f1)
  hide (f2)
  hide (f3)
  hide (f4)
  hide (f5)
  hide (f6)
  hide (f7)
  hide (f8)
  hide (f9)
  hide (fa)
  hide (fb)
  hide (fc)
  hide (fd)
  hide (fe)
  hide ex#
  hide sn#
  hide ef#
  hide pl#
  hide fbuf
[THEN]
[THEN]
