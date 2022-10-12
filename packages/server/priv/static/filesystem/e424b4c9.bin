\ ====================================================
\ Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.

\ Permission to use, copy, modify, and distribute this
\ software is freely granted, provided that this notice
\ is preserved.
\ ====================================================

\ 1. Argument Reduction: find k and f such that
\                    x = 2**k * (1+f),
\      where  sqrt(2)/2 < 1+f < sqrt(2) .

\ 2. Approximation of log(1+f).
\    Let s = f/(2+f) ; based on log(1+f) = log(1+s) - log(1-s)
\             = 2s + 2/3 s**3 + 2/5 s**5 + .....,
\             = 2s + s*R

\    We use a special Remez algorithm on [0,0.1716] to generate
\    a polynomial of degree 14 to approximate R.  The maximum error
\    of this polynomial approximation is bounded by 2**-58.45.

\ 3. Finally, log(x) = k*Ln2 + log(1+f).
\                    = k*Ln2_hi+(f-(hfsq-(s*(hfsq+R)+k*Ln2_lo)))

[UNDEFINED] fln     [IF]
[UNDEFINED] s>float [IF] [ABORT] [THEN]
[UNDEFINED] frexp   [IF] include lib/frexp.4th [THEN]
                                                            \ 10 s>f fln
float array Ln10 s" 2.3025850929940456840179914546843642076011014886"
s>float Ln10 f! does> f@ ;
                                                            \ 3fe62e42 fee00000
float array _Ln2Hi s" 6.93147180369123816490e-01" s>float _Ln2Hi f!
float array _Ln2Lo s" 1.90821492927058770002e-10" s>float _Ln2Lo f!
                                                            \ 3dea39ef 35793c76
float array _L1 s" 6.666666666666735130e-01" s>float _L1 f! \ 3FE55555 55555593
float array _L2 s" 3.999999999940941908e-01" s>float _L2 f! \ 3FD99999 9997FA04
float array _L3 s" 2.857142874366239149e-01" s>float _L3 f! \ 3FD24924 94229359
float array _L4 s" 2.222219843214978396e-01" s>float _L4 f! \ 3FCC71C5 1D8E78AF
float array _L5 s" 1.818357216161805012e-01" s>float _L5 f! \ 3FC74664 96CB03DE
float array _L6 s" 1.531383769920937332e-01" s>float _L6 f! \ 3FC39A09 D078C69F
float array _L7 s" 1.479819860511658591e-01" s>float _L7 f! \ 3FC2F112 DF3E5244

: (t1)                                 ( s2 s4 -- s4 f')
  _L7 f@ fover f*
  _L5 f@ f+ fover f*
  _L3 f@ f+ fover f*
  _L1 f@ f+ frot f*
;

: (t2)                                 ( s4 -- f')
  _L6 f@ fover f*
  _L4 f@ f+ fover f*
  _L2 f@ f+ f*
;

: fln                                  ( f -- f')
  fdup f0> 0= if FE.INVALID ferror ! exit then
  frexp fdup 2 s>f fsqrt f2/ f< if f2* 1- then s>f fdup
  _Ln2Hi f@ f* fswap
  _Ln2Lo f@ f* frot 1 s>f f-           ( Ln2Hi Ln2Lo f)

  fswap fover                          ( Ln2Hi f Ln2Lo f)
  fdup fdup f* f2/                     ( Ln2Hi Ln2Lo f hfsq)
  fswap fdup 2 s>f f+ f/               ( Ln2Hi f Ln2Lo hfsq s)
  fdup fdup f*                         ( Ln2Hi f Ln2Lo hfsq s s2)
  fdup fdup f*                         ( Ln2Hi f Ln2Lo hfsq s s2 s4)
  (t1) fswap (t2) f+                   ( Ln2Hi f Ln2Lo hfsq s R)
  frot fswap fover f+                  ( Ln2Hi f Ln2Lo s hfsq R+hfsq )
  frot f*                              ( Ln2Hi f Ln2Lo hfsq [R+hfsq]*s )
  frot f+ f-                           ( Ln2Hi f hfsq-[[R+hfsq]*s]+Ln2Lo )
  fswap f- f-                          ( Ln2Hi-[[hfsq-[[R+hfsq]*s]+Ln2Lo]-f] )
;

: flog fln Ln10 f/ ;                   ( f -- f')
[DEFINED] 4TH# [IF]
  hide _Ln2Hi
  hide _Ln2Lo
  hide _L1
  hide _L2
  hide _L3
  hide _L4
  hide _L5
  hide _L6
  hide _L7
  hide (t1)
  hide (t2)
[THEN]
[THEN]

