\ 4tH library - Composite SIMPSON - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In numerical analysis, Simpson's rule is a method for numerical integration,
\ the numerical approximation of definite integrals.

[UNDEFINED] csimpson [IF]
  [DEFINED] ZenFP    [IF] [ABORT] [THEN]
[UNDEFINED] float    [IF] [ABORT] [THEN]

float array (s1)                       \ temporary sum s1
                                       \ composite Simpson, step MUST be even
: csimpson                             ( f1 f2 xt n -- f3)
  dup 1 and over 4 < or if drop drop fdrop FE.INVALID ferror ! exit then
  fover over execute                   \ a b f(a)
  fover over execute f+ (s1) f!        \ a b
  fover f- dup s>f f/                  \ a h
                                       \ for i in range(1, n, 2)
  dup 1 ?do                            \   s += 4 * f(a + i * h)
    fover fover i s>f f* f+ over execute f2* f2* (s1) dup f@ f+ f!
  2 +loop
                                       \ for i in range(2, n-1, 2)
  1- 2 ?do                             \   s += 2 * f(a + i * h)
    fover fover i s>f f* f+ dup execute f2* (s1) dup f@ f+ f!
  2 +loop drop

  fnip (s1) f@ f* 3 s>f f/             \ s * h / 3
;

[DEFINED] 4TH# [IF] hide (s1) [THEN]
[THEN]

\ fclear 1 s>f 100 s>f [: 1 s>f fswap f/ ;] 1000 csimpson f. cr f.s depth .