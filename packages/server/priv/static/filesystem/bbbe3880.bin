\ 4tH library - Incomplete Gamma P/Q - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] gammaP  [IF]
[UNDEFINED] gammaln [IF] include lib/gammaln.4th [THEN]
[UNDEFINED] fexp    [IF] include lib/fexp.4th    [THEN]

float array _temp                      \ temporary values
float array _beta                      \ for use in incomplete gamma
float array _underflow                 \ constant for Ln(1e-37)

s" -85.1956484407796903086656838233" s>float _underflow f!
                                       \ x a -- P(x,a)
: gammaP                               ( f1 f2 -- f3)
  fdup f0< fdup f0= or fover f0< fover f0= or or 
  if fdrop FE.INVALID ferror ! exit then 
                                       \ save _beta for incomplete gamma
  fswap fover 1 u>f f+ gammaln fdup _beta f!
  fover f+ _temp f! fover fover fln f* _temp f@ f-

  fdup _underflow f@ f< 
  if fdrop fdrop FE.UNDERFLOW ferror ! exit then

  fexp fdup f0=
  if fdrop fdrop FE.UNDERFLOW ferror ! exit then

  frot frot 1 u>f fdup _temp f!        ( f3 f2 f1 f4=1)

  begin
    fover f* frot 1 u>f f+ fswap fover f/
    fdup fdup _temp f@ f+ fdup _temp f! 1000000000 u>f f/ f<
    frot fswap
  until

  fdrop fdrop fdrop _temp f@ f*
;

: gammaQ gammaP fnegate 1 u>f f+ ;     ( f1 f2 -- f3)
: lgammain fswap fover gammaP _beta f@ fexp frot f/ f* ;
: ugammain fswap fover gammaQ _beta f@ fexp frot f/ f* ;
                                       \ G(x) = G(x+1)/x
[DEFINED] 4TH# [IF]
  hide _temp
  hide _beta
  hide _underflow
[THEN]
[THEN]