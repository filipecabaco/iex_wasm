include lib/fp4.4th
include lib/fsl-util.4th
include lib/gauss.4th

\ test code ========================================

: gauss-test ( -- )
      fclear
      10 set-precision

      CR
      
      ." gauss(  5.0 ) = "  S" 5.0" S>FLOAT gauss F. ." (should be 1.0) " CR
      ." gauss( -1.5 ) = " S" -1.5" S>FLOAT gauss F. ." (should be 0.0668072) " CR
      ." gauss( -0.5 ) = " S" -0.5" S>FLOAT gauss F. ." (should be 0.308538) " CR
      ." gauss(  0.5 ) = "  S" 0.5" S>FLOAT gauss F. ." (should be 0.691462) " CR
         
      CR
;

gauss-test
