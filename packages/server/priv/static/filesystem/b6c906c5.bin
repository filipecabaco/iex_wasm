\ 4tH library - Neumaier-Kahan–Babuska algorithm - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: https://en.wikipedia.org/wiki/Kahan_summation_algorithm

[UNDEFINED] fsum[] [IF]
[UNDEFINED] fdup   [IF] [ABORT] [THEN]
: fsum[]                               ( float-array #floats -- f)
  floats bounds >r >r 0 s>f fdup r> r> ?do
    i f@ fabs fover fabs f< 
    if fdup i f@ f+ fswap fover f- i f@
    else i f@ fover f+ fswap fover i f@ fswap f-
    then f+ frot f+ fswap
  float +loop f+
;
[THEN]

