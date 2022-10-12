include lib/ansfloat.4th
include lib/ansfpio.4th
include lib/fatan2.4th

fclear
10 set-precision

-1 s>f  1 s>f fatan2 f. cr             \ -0.785398163397448  ok
-1 s>f  0 s>f fatan2 f. cr             \ -1.5707963267949  ok
-1 s>f -1 s>f fatan2 f. cr             \ -2.35619449019234  ok 

\ If y is +/-0 and x is < 0, +/-pi shall be returned.
 0 s>f -1 s>f fatan2 f. cr
\ If y is +/-0 and x is > 0, +/-0 shall be returned.
 0 s>f  1 s>f fatan2 f. cr
\ If y is < 0 and x is +/-0, -pi/2 shall be returned.
-1 s>f  0 s>f fatan2 f. cr
\ If y is > 0 and x is +/-0, pi/2 shall be returned.
 1 s>f  0 s>f fatan2 f. cr

\ Optional specs:

\ If y is +/-0 and x is +0, +/-0 shall be returned.
0 s>f 0 s>f fatan2 f. cr


