include lib/fp3.4th
include lib/felip.4th

\ test driver,  calculates the complete elliptic integral of the first
\ kind (K(m)) using the relation: K[m] = a Elip[a,b], m = 1 - b^2/a^2
\ compare with Abramowitz & Stegun, Handbook of Mathematical Functions,
\ Table 17.1

: felipr ( --, f: a b -- elip[a,b] )     \ recursive form

     FOVER FOVER FOVER F- FABS
     FSWAP 1 S>F 100000000 S>F F/ F*
     F< IF
          FDROP
          pi F2/ FSWAP F/
        ELSE
          FOVER FOVER F+ F2/
          FROT  FROT  F* FSQRT
          RECURSE
        THEN
;

: elip_test ( -- )
        fclear
        10 set-precision

        CR
        ." m      K(m) exact   a Elip1[a,b]    a Elip2[a,b] " CR

       ." 0.0    1.57079633   "
       S" 1000.0" S>FLOAT S" 1000.0" S>FLOAT felipr S" 1000.0" S>FLOAT  F* F. ."     "
       S" 1000.0" S>FLOAT S" 1000.0" S>FLOAT felip S" 1000.0" S>FLOAT  F* F. CR

      ." 0.44   1.80632756   "
      S" 400.0" S>FLOAT S" 299.33259" S>FLOAT felipr  S" 400.0" S>FLOAT  F* F. ."     "
      S" 400.0" S>FLOAT S" 299.33259" S>FLOAT felip  S" 400.0" S>FLOAT  F* F. CR

      ." 0.75   2.15651565   "
      S" 1000.0" S>FLOAT S" 500.0" S>FLOAT felipr S" 1000.0" S>FLOAT  F* F. ."     "
      S" 1000.0" S>FLOAT S" 500.0" S>FLOAT felip S" 1000.0" S>FLOAT  F* F. CR

      ." 0.96   3.01611249   "
      S" 500.0" S>FLOAT S" 100.0" S>FLOAT felipr S" 500.0" S>FLOAT  F* F.  ."     "
      S" 500.0" S>FLOAT S" 100.0" S>FLOAT felip S" 500.0" S>FLOAT  F* F. CR
;

elip_test

