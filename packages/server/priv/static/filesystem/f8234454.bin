\ 4tH library - Neumaier-Kahan–Babuska algorithm - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: https://en.wikipedia.org/wiki/Kahan_summation_algorithm

[UNDEFINED] fsum [IF]
[UNDEFINED] fdup [IF] [ABORT] [THEN]
FLOAT array (acc)                      \ accumulator

: fsum                                 ( fn .. f2 f1 n -- f3)
  >r 0 s>f fdup (acc) f!               ( fn .. f2 f1 fsum)
  r> 0 ?do
     fover fabs fover fabs f< unless fswap then
     fover fover f+ fswap fover f- frot f+
     (acc) f@ f+ (acc) f!              ( fn .. f2 fsum)
  loop
  (acc) f@ f+                          ( acc+fsum)
;

[DEFINED] 4TH# [IF] hide (acc) [THEN]
[THEN]
\ include lib/fpconst.4th fclear e pi 10000000 s>f 3 fsum f. cr


