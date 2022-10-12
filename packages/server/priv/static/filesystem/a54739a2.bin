\ 4tH library - SIMPSON - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In numerical analysis, Simpson's rule is a method for numerical integration,
\ the numerical approximation of definite integrals. 

[UNDEFINED] simpson [IF]
  [DEFINED] ZenFP   [IF] [ABORT] [THEN]
[UNDEFINED] float   [IF] [ABORT] [THEN]

float array (s1)                       \ temporary sum s1
float array (s2)                       \ temporary sum s2
                                       \ standard Simpson rule
: simpson                              ( f1 f2 xt n -- f3)
  fover over execute                   \ a b f(a)
  fover over execute f+                \ a b f(b)+f(a)
  frot frot fover f- dup s>f f/        \ f(a)+f(b) a h
  fover fover f2/ f+ over execute      \ f(a)+f(b) a h s1
  (s1) f! 0 s>f (s2) f!                \ f(a)+f(b) a h

  1 ?do
    fover fover i s>f f* f+ fover f2/ f+ dup execute (s1) dup f@ f+ f!
    fover fover i s>f f* f+ dup execute (s2) dup f@ f+ f!
  loop drop

  fnip 6 s>f f/ fswap                  \ h/6 f(a)+f(b)
  (s1) f@ f2* f2* (s2) f@ f2* f+       \ h/6 f(a)+f(b) 4*s1+2*s2
  f+ f*
;

[DEFINED] 4TH# [IF]
  hide (s1)
  hide (s2)
[THEN]
[THEN]

\ fclear 1 s>f 100 s>f [: 1 s>f fswap f/ ;] 1000 csimpson f. cr f.s depth .