include lib/fp3.4th
include lib/fsl-util.4th
include lib/pcylfun.4th

\ Test Code =============================================

\ compares against test values given in Baker, 1992

: pcf-test ( -- )

     CR

     ."   nu   x     Upcf-actual Vpcf-actual    Upcf     Vpcf " CR

     ."  -2.0  0.0   -0.6081402  -0.4574753   "
     -2 S>F 0 S>F Upcf F.   -2 S>F 0 S>F Vpcf F. CR

     ."   2.0  0.0    0.8108537   0.3431063    "
     2 S>F 0 S>F Upcf F.   2 S>F 0 S>F Vpcf F. CR

     ."  -2.0  1.0    0.5156671  -0.5417693    "
     -2 S>F 1 S>F Upcf F.   -2 S>F 1 S>F Vpcf F. CR

     ."   2.0  1.0    0.1832067   1.439015     "
     2 S>F 1 S>F Upcf F.   2 S>F 1 S>F Vpcf F. CR

;

fclear 10 set-precision
pcf-test
