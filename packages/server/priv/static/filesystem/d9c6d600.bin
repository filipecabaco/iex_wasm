\ test goodies
include lib/ansfloat.4th
include lib/ansfpio.4th
fclear
100 SET-PRECISION                      \ max precision for testing

CR .( Basic arithmetic ------------)
CR .( 1/7 = ) 1 S>F 7 S>F F/ R.
CR .( 1/3 = ) 1 S>F 3 S>F F/ R.
CR .( 2/3 = ) 2 S>F 3 S>F F/ R.
CR .( 355/113 = ) 355 S>F 113 S>F F/ R.
CR .( sqrt[2] = ) 2 S>F FSQRT R.

6 SET-PRECISION

CR .( Numeric conversion ----------)
CR .( .0001 =         ) 1 S>F 10000 S>F F/ FE.
CR .( -.0001 =        ) s" -.0001" s>float FE.
CR .( 10000 * .0001 = ) s" 10000" s>float s" .0001" s>float F* F.
CR .( 1M, 1u =        ) s" 1d6" s>float  FS. s" 1D-6" s>float FS.
CR .( -1.23M, 1.23u = ) s" -1.23e6" s>float FS. s" 1.23e-6" s>float FS.
CR .( sqrt[1e99] =    ) s" 1e99" s>float FSQRT FS.
CR .( 123 + 456 =     ) s" 123" s>float s" 456" s>float F+ F.
CR .( 123 - 456 =     ) s" 123" s>float s" 456" s>float F- F.
CR .( 456 - 123 =     ) s" 456" s>float s" 123" s>float F- F.
CR