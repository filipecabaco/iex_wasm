\ Reference:

\   KL Majumder, GP Bhattacharjee,
\   Algorithm AS 63:
\   The incomplete Beta Integral,
\   Applied Statistics,
\   Volume 22, Number 3, 1973, pages 409-411.

\ Licensing:

\   This code is distributed under the GNU LGPL license.

\ Author:

\   Original FORTRAN77 version by KL Majumder, GP Bhattacharjee.
\   4tH version by Hans Bezemer

[UNDEFINED] fbeta.cdf [IF]
[UNDEFINED] gammaln   [IF] include lib/gammaln.4th [THEN]
[UNDEFINED] fexp      [IF] include lib/fexp.4th    [THEN]

float array _beta                      \ temporary variables
float array _xx
float array _pp
float array _qq
float array _psq
float array _cx
float array _ai
float array _rx
float array _acu
float array _term

1 -15 me>f _acu f!

[DEFINED] debug-betacdf [IF]
: ~ ." beta =" _beta f@ f. cr
    ." xx   =" _xx f@ f. cr
    ." pp   =" _pp f@ f. cr
    ." qq   =" _qq f@ f. cr
    ." psq  =" _psq f@ f. cr
    ." cx   =" _cx f@ f. cr
    ." ai   =" _ai f@ f. cr
    ." rx   =" _rx f@ f. cr
    ." acu  =" _acu f@ f. cr
    ." term =" _term f@ f. cr
;
[THEN]

: fbeta.cdf                            ( fx fp fq -- f1)
  fdup f0< fdup f0= or fover f0< fover f0= or or
  if fdrop fdrop FE.INVALID ferror ! exit then 
                                       ( F: fx fp fq) ( --)
  fover fover f+ _beta f! fover fover _qq f! _pp f!
  gammaln fswap gammaln f+ _beta f@ gammaln f- _beta f!
  _pp f@ _qq f@ frot                   ( F: fp fq fx) ( --)

  fdup f0< 1 u>f fover f< or
  if fdrop fdrop FE.INVALID ferror ! exit then
                                       ( F: fp fq fx) ( --)
  fdup f0= 1 u>f fover f= or
  1 u>f fover f- _cx f! frot frot      \ _cx = 1 - x
  if fdrop fdrop exit then             ( F: fx) ( --)
                                       \ _psq = p + q
  fover fover f+ _psq f! frot frot     ( F: fq fx fp) ( --)
  fover _psq f@ f* fover fswap f< dup  ( F: fq fx fp) ( f f)

  if                                   ( F: fq fx fp) ( f)
    _cx f@ _xx f! _qq f! _cx f! _pp f! ( F: --) ( f)
  else                                 ( F: fq fx fp) ( f)
    _pp f! _xx f! _qq f!               ( F: --) ( f)
  then

  1 u>f fdup _term f! fdup _ai f!      ( F: fv) ( f)
  _qq f@ fdup _cx f@ _psq f@ f* f+ f>d
  _xx f@ 2dup d0= 0= if _cx f@ f/ then ( F: fv ft f1) ( f d1)
  _rx f! fover f-                      ( F: fv ft) ( f d1)
 
  begin
    _term dup f@ f* _rx f@ f* _pp f@ _ai f@ f+ f/ fdup f!
    fswap fover f+ fswap fabs
    _acu f@ fover f< fover _acu f@ f* fover f< or
  while
    fdrop 1 u>d d- _ai dup f@ 1 u>f f+ f! 2dup d0<
    if
      _psq dup f@ fdup 1 u>f f+ f!
    else
      _qq f@ _ai f@ f- 2dup d0= if _xx f@ _rx f! then
    then
  repeat 2drop fdrop                   \ value *= ((exp ((pp * ln (xx)) + (qq
                                       \ - 1.0) * ln (cx) - beta )) / pp);
  _xx f@ fln _pp f@ f* _cx f@ fln _qq f@ 1 u>f f- f* f+ _beta f@ f- fexp f*
  _pp f@ f/ if 1 u>f fswap f- then
;

: fbetain fbeta.cdf _beta f@ fexp f* ;

[DEFINED] 4TH# [IF]
  hide _beta
  hide _xx
  hide _pp
  hide _qq
  hide _psq
  hide _cx
  hide _ai
  hide _rx
  hide _acu
  hide _term
[THEN]
[THEN]