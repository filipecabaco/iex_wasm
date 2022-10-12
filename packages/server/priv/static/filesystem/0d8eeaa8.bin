\ 4tH demo - Numerical Integration - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/fp3.4th                    \ works only with ANS float
include lib/falog.4th                  \ get native FLN
include lib/ferf.4th                   \ get native FERF
include lib/simpson.4th                \ get Simpson
include lib/csimpson.4th               \ get Composite Simpson 
include lib/simps38.4th                \ get Simpson 3/8 rule
include lib/gauslege.4th               \ get Gauss Legendre
                                       \ derivate routines
: f() fdup f* fnegate e fswap f** ;    \ e^-(x^2)
: g() 1 s>f fswap f/ ;                 \ 1/x
                                       \ Simpson wrappers for ERF and LN
: (erf) 0 s>f fswap ['] f() -rot execute s" 1.1283791671" s>float f* ;
: (ln)  1 s>f fswap ['] g() -rot execute ;

: erf_1 100 ['] simpson    (erf) ;     \ Simpson ERF routines
: erf_2 100 ['] csimpson   (erf) ;
: erf_3  99 ['] simpson3/8 (erf) ;
: ln_1 1000 ['] simpson    (ln) ;      \ Simpson LN routines
: ln_2 1000 ['] csimpson   (ln) ;
: ln_3  999 ['] simpson3/8 (ln) ;
                                       \ Gauss Legendre routines
: erf_4  0 s>f fswap ['] f() lege_inte s" 1.1283791671" s>float f* ;
: ln_4 1 s>f fswap ['] g() lege_inte ; \ ERF and LN

lege_coef lege_roots                   \ initialize Gauss Legendre
                                       \ ERF results
." ERF(0.75)"  s" 0.75" s>float cr
." Simpson          : " fdup erf_1 f. cr
." Composite Simpson: " fdup erf_2 f. cr
." Simpson 3/8      : " fdup erf_3 f. cr
." Gauss/Legendre   : " fdup erf_4 f. cr
." Native           : " ferf       f. cr cr
                                       \ LN results
." LN(100)" 100 s>f cr
." Simpson          : " fdup ln_1 f. cr
." Composite Simpson: " fdup ln_2 f. cr
." Simpson 3/8      : " fdup ln_3 f. cr
." Gauss/Legendre   : " fdup ln_4 f. cr
." Native           : " fln  f. cr cr
