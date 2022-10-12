\ Written by Brad Eckert for c.l.f
\ Believed to be in the public domain

\ Convert a double number to a string with an embedded decimal.
\ Round to a fixed number of digits (D-PRECISION) after the decimal.
\ The input is scaled by 10^D-DIGITS.

[UNDEFINED] D.F [IF]
[UNDEFINED] D#  [IF] include lib/dblsharp.4th [THEN]

9 VALUE D-DIGITS                       \ digits after decimal in raw data
6 VALUE D-PRECISION                    \ digits after decimal in output

: D.F                                  ( d -- addr u )
  DUP >R DABS <D#
  D-DIGITS D-PRECISION -               \ # of truncated digits
  BEGIN DUP WHILE 1-                   \ discard trailing digits
  DUP >R 0= IF 5 U>D D+ THEN D# R>     \ round
  REPEAT DROP
  <D#
  D-PRECISION DUP >R 0 ?DO D# LOOP     \ digits after decimal
  R>  IF [CHAR] . DHOLD THEN D#S       \ omit . if no trailing digits
  R> 0< IF [CHAR] - DHOLD THEN D#>
;
[THEN]

\ max-n u>d d.f type cr depth .
