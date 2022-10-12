include lib/fp4.4th
include lib/fsl-util.4th
include lib/gamma.4th

\ test code =============================================

: gamma-test ( -- )
      fclear
      10 set-precision

      CR
      ." gamma(  5.0 ) = "        5 s>f     gamma F.    ." (should be 24.0) " CR
      ." gamma( -1.5 ) = " s" -1.5" s>float gamma F.    ." (should be 2.36327) " CR
      ." gamma( -0.5 ) = " s" -0.5" s>float gamma F.    ." (should be -3.54491) " CR
      ." gamma(  0.5 ) = "  s" 0.5" s>float gamma F.    ." (should be 1.77245) " CR

      CR
      ." rgamma(  5.0 ) = "        5 s>f     rgamma F.    ." (should be 0.0416667) " CR
      ." rgamma( -1.5 ) = " s" -1.5" s>float rgamma F.    ." (should be 0.423142) " CR
      ." rgamma( -0.5 ) = " s" -0.5" s>float rgamma F.    ." (should be -0.282095) " CR
      ." rgamma(  0.5 ) = "  s" 0.5" s>float rgamma F.    ." (should be 0.564190) " CR
;

gamma-test
