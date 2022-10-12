\ 4tH library - Gauss–Legendre quadrature - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ An n-point Gaussian quadrature rule is a quadrature rule constructed to
\ yield an exact result for polynomials of degree 2n − 1 or less.

\ Gaussian quadrature will only produce accurate results if the function f(x)
\ is well approximated by a polynomial function within the range [−1, 1].
\ The method is not suitable for functions with singularities, like f(x)= 1/x.

\ For the simplest integration problem the associated polynomials are Legendre
\ polynomials, Pn(x), and the method is usually known as Gauss–Legendre
\ quadrature.

\ include lib/fp3.4th include lib/fexp.4th

[UNDEFINED] lege_inte [IF]
[UNDEFINED] fcos      [IF] include lib/fsinfcos.4th [THEN]

10 constant #lege_points               \ perform an n-point quadrature
float array (temp)                     \ temporary variable

#lege_points floats array lroots       \ roots of a n-order polynomial
#lege_points floats array weight       \ weights of the function
                                       \ nodes
#lege_points 1+ #lege_points 1+ * floats array lcoef
  does> rot #lege_points 1+ * floats rot floats + + ;
                                       \ calculate coefficients
: lege_coef                            ( --)
  1 s>f fdup 0 0 lcoef f! 1 1 lcoef f!
  #lege_points 1+ 2 ?do
    i 2 - 0 lcoef f@ i s>f f/ 1 i - s>f f* i 0 lcoef f!
    i 1+ 1 ?do
      j 2* 1- s>f j 1- i 1- lcoef f@ f*
      j 1- s>f j 2 - i lcoef f@ f*
      f- j s>f f/ j i lcoef f!
    loop
  loop
;

: lege_eval                            ( f1 n -- f2)
  dup dup lcoef f@                     ( f1 f2 | n)
  0 over ?do fover f* dup i 1- lcoef f@ f+ -1 +loop fnip drop
;

: lege_diff                            ( f1 n -- f2)
  dup fdup lege_eval fover f*          ( f1 f2 | n)
  dup 1- fover lege_eval f-            ( f1 f3 | n)
  s>f f* fswap fdup f* 1 s>f f- f/     ( f4)
;
                                       \ i-th root of a n-order polynomial
: lege_roots                           ( --)
  1 s>f max-n s>f f/ (temp) f!         \ set epsilon to 1/MAX-N

  #lege_points 1+ 1 ?do
    1 s>f f2/ fdup #lege_points s>f f+ ( 0.5 f1)
    i s>f frot f2/ f- pi f*            ( f1 f2)
    fswap f/ fcos                      ( f3)

    begin
      fdup fdup #lege_points lege_eval ( f3 f3 f4)
      fover #lege_points lege_diff     ( f3 f3 f4 f5)
      f/ f- fswap fover (temp) f@ f~
    until 
                                       \ compute the appropriate weights
    fdup lroots i 1- floats + f!       ( f6)
    fdup #lege_points lege_diff        ( f6 f7)
    fdup f* 1 s>f frot fdup f* f- f*   ( f8)
    2 s>f fswap f/ weight i 1- floats + f!
  loop
;
                                       \ do the integration of function xt
: lege_inte                            ( f1 f2 xt -- f3)
  fswap fover fover f+ f2/             ( f1 f2 f3)
  frot frot f- f2/ 0 s>f (temp) f!     ( f3 f4)

  #lege_points 0 ?do                   ( f3 f4)
    fover fover lroots i floats + f@   ( f3 f4 f3 f4 f5)
    f* f+ dup execute                  ( f3 f4 f6)
    weight i floats + f@ f*            ( f3 f4 f7)
    (temp) dup f@ f+ f!                ( f3 f4)
  loop                                 ( f3 f4)

  drop fnip (temp) f@ f*               ( f8)
;

[DEFINED] 4TH# [IF]
  hide #lege_points
  hide (temp)
  hide lroots
  hide weight
  hide lcoef
  hide lege_eval
  hide lege_diff
[THEN]
[THEN]

\ #lege_points 0 ?do lroots i floats + f@ f. cr loop cr
\ #lege_points 0 ?do weight i floats + f@ f. cr loop

\ lege_coef lege_roots                 ( Typical use)
\ -3 s>f 3 s>f ' fexp lege_inte f. fdepth . depth .  cr
\  0 s>f 3 s>f ' fexp lege_inte f. fdepth . depth .  cr
