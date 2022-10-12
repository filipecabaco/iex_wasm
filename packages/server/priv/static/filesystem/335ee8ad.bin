\ 4tH library - GAMMALN - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on a Lanczos approximation:
\ Lanczos, Cornelius (1964), "A Precision Approximation of the Gamma Function"
\ See also: http://en.wikipedia.org/wiki/Lanczos_approximation

[UNDEFINED] fbeta [IF]
[UNDEFINED] fln   [IF] include lib/flnflog.4th [THEN]
[UNDEFINED] me>f  [IF] include lib/fpow10.4th  [THEN]

6 floats array _L

s" 76.18009172947146"     s>float _L 0 floats + f!
s" -86.50532032941677"    s>float _L 1 floats + f!
s" 24.01409824083091"     s>float _L 2 floats + f!
s" -1.231739572450155"    s>float _L 3 floats + f!
s" 0.1208650973866179e-2" s>float _L 4 floats + f!
s" -0.5395239384953e-5"   s>float _L 5 floats + f!

: gammaln                              ( f1 -- f2)
  fdup f0> 0= if FE.INVALID ferror ! exit then
  190015 -15 me>f 1 u>f f+ fover
  6 0 do 1 u>f f+ _L i floats + f@ fover f/ frot f+ fswap loop fdrop
  fover fdup 55 -1 me>f f+ fdup fln
  frot 1 u>f 2 u>f f/ f+ f* f- fnegate fswap
  746310005 -16 me>f 25066282 -7 me>f f+ f* frot f/ fln f+
;

[DEFINED] 4TH# [IF]
  hide _L
[THEN]
[THEN]