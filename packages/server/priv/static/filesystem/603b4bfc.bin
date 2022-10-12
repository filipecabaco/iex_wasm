\ test code ==========================================
\ convert a modulus angle in degrees to the  modulus
\ : modulus   PI F* 180 S>F F/ FCOS FDUP F* 1 S>F FSWAP F- FSQRT ;

\ test driver,  calculates the complete elliptic integral of the first
\ and second kind compare with Abramowitz & Stegun,
\ Handbook of Mathematical Functions, Table 17.1

include lib/fp4.4th
include lib/fsl-util.4th
include lib/ellipint.4th

: EK_test ( -- )
        fclear
        10 set-precision

        CR
        ."  m     k         E(k) exact  K(k) exact      E(k)   K(k) " CR

       ." 0.0  0.0         1.57079633  1.57079633     "
       0 S>F FDUP E[k] F.  K[k] F. CR

      ." 0.44 0.66332495  1.38025877  1.80632756     "
      S" 0.66332495" S>FLOAT FDUP E[k] F.  K[k] F. CR

      ." 0.75 0.86602539  1.21105603  2.15651565     "
      S" 0.86602539"S>FLOAT  FDUP E[k] F.  K[k] F. CR

      ." 0.96 0.97979589  1.05050223  3.01611249     "
      S" 0.97979589" S>FLOAT FDUP E[k] F.  K[k] F. CR
;

EK_test
