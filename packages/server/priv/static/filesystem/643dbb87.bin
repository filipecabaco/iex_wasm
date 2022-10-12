\ 4tH library - Beta Probability density function
\ Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fbeta.pdf [IF]
[UNDEFINED] fbeta     [IF] include lib/fbeta.4th [THEN]
[UNDEFINED] f**       [IF] include lib/falog.4th [THEN]

float array _arg1                      \ first argument
float array _arg2                      \ second argument
                                       \ be nice to tiny FP stack ;-)
: fbeta.pdf                            ( f1 f2 f3 -- f4)
  fover _arg1 f! fdup _arg2 f!         ( x a b)
  1 u>f f- frot 1 u>f fover f-         ( a b-1 x 1-x)
  frot f** frot frot                   ( 1-x**b-1 a x)
  fswap 1 u>f f- f** f*                ( 1-x**b-1*x**a-1)
  _arg1 f@ _arg2 f@ fbeta f/
;

[DEFINED] 4TH# [IF]
  hide _arg1
  hide _arg2
[THEN]
[THEN]