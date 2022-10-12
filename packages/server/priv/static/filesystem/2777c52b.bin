\ 4tH library - SIMPSON 3/8 - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In numerical analysis, Simpson's rule is a method for numerical integration,
\ the numerical approximation of definite integrals. 

[UNDEFINED] simpson3/8 [IF]
  [DEFINED] ZenFP      [IF] [ABORT] [THEN]
[UNDEFINED] float      [IF] [ABORT] [THEN]

float array (s1)                       \ temporary sum s1
float array (s2)                       \ temporary sum s2
                                       \ Simpson second rule
: simpson3/8                           ( f1 f2 xt n -- f3)
  dup 3 mod if drop drop fdrop FE.INVALID ferror ! exit then
  fover over execute                   \ a b
  fover over execute f+ frot frot      \ f(a)+f(b) a b
  fover f- dup s>f f/                  \ f(a)+f(b) a h
  0 s>f fdup (s1) f! (s2) f!           \ f(a)+f(b) a h

  1 ?do
    fover fover i s>f f* f+ dup execute
    i 3 mod if (s1) else (s2) then dup f@ f+ f!
  loop fnip drop                       \ f(a)+f(b) h
                                       \ ((3*h)/8)*(f(a)+3*s1+2*s2+f(b))
  3 s>f f* 8 s>f f/ fswap 3 s>f (s1) f@ f* f+ (s2) f@ f2* f+ f*
;

[DEFINED] 4TH# [IF]
  hide (s1)
  hide (s2)
[THEN]
[THEN]

\ fclear 1 s>f 100 s>f [: 1 s>f fswap f/ ;] 999 simpson3/8 f. cr f.s depth .
