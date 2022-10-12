\ 4tH library - FBETA - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fbeta   [IF]
[UNDEFINED] gammaln [IF] include lib/gammaln.4th [THEN]
[UNDEFINED] fexp    [IF] include lib/fexp.4th    [THEN]

float array _beta                      \ temporary variable 
                                       \ be nice to tiny FP stack ;-)
: fbeta                                ( f1 f2 -- f3) 
  fover fover f+ _beta f! gammaln fswap gammaln f+ _beta f@ gammaln f- fexp
;

[DEFINED] 4TH# [IF]
  hide _beta
[THEN]
[THEN]