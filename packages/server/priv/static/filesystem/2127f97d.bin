\ 4tH - Numerical Integration, Gamma function - Copyright 2016 David Johnson
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License 

include lib/fp3.4th                    \ ANS floating point 
include lib/falog.4th                  \ we need F** 
include lib/asinacos.4th               \ and FATAN 
include lib/simpson.4th                \ and we do numerical integration
include lib/fgamma.4th                 \ GAMMA function

float array 2PI   s" 6.283185307" s>float 2PI f! does> f@ ; 
float array C1    s" 0.918938533" s>float C1  f! does> f@ ;   \ 0.5ln(2pi) 
float array ~ZERO s" 0.000000001" s>float ~ZERO f! does> f@ ; 

8 constant (gamma-shift)               \ shift it in the more reliable realm 

float array (x)                        \ the parameter of the gamma function 

\ ln(gamma(x)) = (x-.5)ln(x) - x + 0.5ln(2pi) + 
\    2*integral(0,inf)|[arctan(t/x)/(exp(2pi*t)-1)]|dt 

: IntegralLnGamma ( f1 -- f2) 
    fdup  (x) F@  F/  fatan 2PI frot  f*  fexp 1 s>f f- f/ ; 

: sgamma                               ( f1 -- f2) 
   fdup (gamma-shift) s>f f+           \ now crank it up
   (x) f!   ~ZERO 10 s>f
   ' IntegralLnGamma 50 simpson 2 s>f f*
   (x) f@ 1 s>f 2 s>f f/ f- (x) f@ fln f* (x) f@ f- C1 f+ f+ fexp
                                       \ now crank it down and we're there
   fswap 1 s>f (gamma-shift) 0 do fover i s>f f+ f* loop fswap fdrop f/ 
;

fclear spouge_coef

." gamma(10)   = "  10 s>f fdup sgamma f. 9 emit gamma f. cr 
." gamma(.5)   = "  s" .5"  s>float fdup sgamma f. 9 emit gamma f. cr
." gamma(1.5)  = "  s" 1.5" s>float fdup sgamma f. 9 emit gamma f. cr
." gamma(.0001)= "  s" 0.0001" s>float fdup sgamma f. 9 emit gamma f. cr
." gamma(20)   = "  20 s>f fdup sgamma f. 9 emit gamma f. cr
