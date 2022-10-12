\ 4tH - Numerical Integration, Gamma function - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

32 constant floating-stack             \ we need a bigger stack

include lib/fp3.4th                    \ ANS floating point
include lib/falog.4th                  \ we need F**
include lib/simpson.4th                \ and we do numerical integration
include lib/fgamma.4th                 \ GAMMA function

8 constant (gamma-shift)               \ shift it in the more reliable realm

float array (x)                        \ the parameter of the gamma function
                                       \ integral of the gamma function
: IntegralfGamma fdup fnegate fexp fswap (x) f@ 1 s>f f- f** f* ;
                                       \ from 0 to infinity
: sgamma                               ( f1 -- f2)
  fdup (gamma-shift) s>f f+ (x) f!     \ now crank it up
  0 s>f 10000 s>f ' IntegralfGamma 10000 simpson
  fswap 1 s>f (gamma-shift) 0 do fover i s>f f+ f* loop fswap fdrop f/
;                                      \ now crank it down and we're there

fclear spouge_coef

." WARNING! This make take a while.." cr
." gamma(10)  = " 10 s>f fdup sgamma f. 9 emit gamma f. cr
." gamma(0.5) = " 1 s>f 2 s>f f/ fdup sgamma f. 9 emit gamma f. cr

\ 11 1 ?do i s>f 3 s>f f/ sgamma f. cr loop
