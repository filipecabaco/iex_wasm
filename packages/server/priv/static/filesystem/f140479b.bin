\ test code =============================================

include lib/fp3.4th
include lib/polys.4th

defer poly

\ test code for polynomials


: test-polys ( n -- )

     CR

     5 0 DO
             I S>F s" 0.25" s>float F* s" -0.25" s>float F+

             DUP 3 DO
                    FDUP I poly F. 2 SPACES
                 LOOP

             FDROP CR

     LOOP

     DROP
;

: test-gpoly ( n -- ) ( f: alpha -- )

     CR

     5 0 DO
             I S>F s" 0.25" s>float F* s" -0.25" s>float F+

             DUP 3 DO
                    FOVER FOVER FSWAP I   poly F. 2 SPACES
                 LOOP

             FDROP CR

     LOOP

     FDROP   DROP
;


\ comparison values generated from Mathematica V2.2
: cheby-table ( -- )
     ."   0.6875   0.53125   -0.953125   -0.0546875   0.980469 -0.435547 " cr
     ."   0.0      1.0        0.0        -1.0         0.0       1.0 " cr
     ."  -0.6875   0.53125    0.953125   -0.0546875  -0.980469 -0.435547 " cr
     ."  -1.0     -0.5        0.5         1.0         0.5      -0.5 " cr
     ."  -0.5625  -0.96875   -0.890625   -0.367187    0.339844  0.876953 " cr
;

: hermite-table ( -- )
      ."   2.875   9.0625   -27.5312   -76.8594   368.805   891.629 " cr
      ."   0.0    12.0        0.0     -120.0        0.0    1680.0 " cr
      ."  -2.875   9.0625    27.5312    -76.8594  -368.805  891.629 " cr
      ."  -5.0     1.0       41.0        31.0     -461.0   -895.0 " cr
      ."  -5.625  -9.9375    30.0937    144.516   -144.352 -2239.75 " cr
;

: laguerre-table ( -- )
     ."   1.84635   2.19808   2.58936    3.02332     3.50327   4.03269 " cr
     ."   1.0       1.0       1.0        1.0         1.0       1.0 "     cr
     ."   0.341146  0.177246  0.037264  -0.0809404 -0.179368 -0.259886 " cr
     ."  -0.145833 -0.330729 -0.445573  -0.504145  -0.518339 -0.498363 " cr
     ."  -0.476562 -0.580566 -0.576685  -0.501364  -0.383086 -0.243679 " cr
;

: glaguerre-table ( -- )     \ for alpha = 0.75
   ."   4.41667   5.90365   7.61446   9.56526  11.7909   14.3154 " cr
   ."   3.00781   3.57178   4.10754   4.62099   5.11609   5.59573 " cr
   ."   1.83333   1.79687   1.6724    1.48342   1.24821   0.981352 " cr
   ."   0.877604  0.506673  0.103621 -0.291272 -0.651256 -0.959288 " cr
   ."   0.125    -0.367187 -0.779687 -1.07754  -1.2493   -1.29858 " cr
;

: legendre-table ( -- )
   ."   0.335937   0.157715  -0.339722   0.0242767   0.279919  -0.152454 " cr
   ."   0.0        0.375      0.0       -0.3125      0.0        0.273437 " cr
   ."  -0.335937   0.157715   0.339722   0.0242767  -0.279919  -0.152454 " cr
   ."  -0.4375    -0.289062   0.0898437  0.323242    0.223145  -0.0736389 " cr
   ."  -0.0703125 -0.350098  -0.416382  -0.280777   -0.0341835  0.197609 " cr
;

: bessel-table ( -- )
   ." 11.609375  81.410156  733.416992  8072.675049 " cr
   ." 15.0      105.0       945.0      10395.0      " cr
   ." 19.140625 134.222656 1209.200195 13309.591064 " cr
   ." 24.125    170.0625   1536.59375  16945.046875 " cr
   ." 30.046875 213.597656 1939.280273 21452.231689 " cr
;

: test-cheby ( -- )
  ['] Ch_n is poly
  9 test-polys
  CR ." Comparison values " CR
  cheby-table
;

: test-hermite ( -- )
  ['] He_n is poly
  9 test-polys
  CR ." Comparison values " CR
  hermite-table
;

: test-laguerre ( -- )
  ['] La_n is poly
  9 test-polys
  CR ." Comparison values " CR
  laguerre-table
;

: test-glaguerre ( -- )
  s" 0.75" S>FLOAT                  \ alpha
  ['] Lag_n is poly
  9 test-gpoly
  CR ." Comparison values " CR
  glaguerre-table
;

: test-legendre ( -- )
  ['] Le_n is poly
  9 test-polys
  CR ." Comparison values " CR
  legendre-table
;

: test-bessel ( -- )
  ['] Be_n is poly
  7 test-polys
  CR ." Comparison values " CR
  bessel-table
;

fclear 10 set-precision

test-cheby
test-hermite
test-laguerre
test-glaguerre
test-legendre
test-bessel
