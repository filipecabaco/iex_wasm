include lib/fp4.4th
include lib/fexpint.4th

\ test code generates a small table of selected E1 values.
\ most comparison values are from Abramowitz & Stegun,
\ Handbook of Mathematical Functions, Table 5.1

: fexpint_test ( -- )
      CR
      ."  x     E1(x) exact    x FEXPINT " CR

      ."  0.5   0.5597736      "
      s" 0.5" s>float fexpint  F. CR

      ."  1.0   0.2193839      "
      1 s>f fexpint   F. CR

      ."  2.0   0.0489005      "
      2 s>f fexpint    F. CR

      ."  5.0   0.001148296    "
      5 s>f  fexpint    F. CR

      ." 10.0   0.4156969e-5   "
      10 s>f fexpint   FS. CR
;

fclear
10 set-precision
fexpint_test