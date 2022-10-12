\ elip     Complete Elliptic Integral         ACM Algorithm #149

\ Forth Scientific Library Algorithm #2

\ Evaluates the Complete Elliptic Integral,
\     Elip[a, b] = int_0^{\pi/2} 1/Sqrt{a^2 cos^2(t) + b^2 sin^2(t)} dt

\ This function can be used to evaluate the complete elliptic integral
\ of the first kind, by using the relation K[m] = a Elip[a,b],  m = 1 - b^2/a^2
 
\ This code conforms with ANS requiring:
\      1. The Floating-Point word set
\      2. The FCONSTANT PI (3.1415926536...)
 
\ Both a recursive form and an iterative form are given, but because of the
\ large stack consumption the recursive form is probably not of much
\ practical use.

\ Caution: this code can potentially go into an endless loop
\          for certain values of the parameters.

\ Collected Algorithms from ACM, Volume 1 Algorithms 1-220,
\ 1980; Association for Computing Machinery Inc., New York,
\ ISBN 0-89791-017-6

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided the
\ copyright notice is preserved.

\ ( ELIP     V1.2                  21 September 1994   EFC )
\ include lib/ansfloat.4th

[UNDEFINED] felip [IF]
  [DEFINED] ZenFP [IF] [ABORT] [THEN]
[UNDEFINED] float [IF] [ABORT] [THEN]
[UNDEFINED] pi    [IF] include lib/fpconst.4th [THEN]
: felip ( --, f: a b -- elip[a,b] )     \ nonrecursive version

    BEGIN
      FOVER FOVER F+ F2/
      FROT  FROT  F* FSQRT

      FOVER FOVER FOVER F- FABS
      FSWAP 100000000 S>F F/
   F< UNTIL

      FDROP

      pi F2/ FSWAP F/
;
[THEN]