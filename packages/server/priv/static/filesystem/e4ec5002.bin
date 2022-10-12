\ 4tH library - FMIN FMAX ZEN - Copyright 2009,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/zenfloat.4th

[UNDEFINED] fmax  [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library

: (select) if 2swap then 2drop ;
: fmin 2over 2over f< 0= (select) ;
: fmax 2over 2over f<    (select) ;

[DEFINED] 4th# [IF] hide (select) [THEN]
[THEN]

\ 1 0 1 0 fmin f. cr
\ 1 0 1 0 fmax f. cr
\ 2 0 1 0 fmin f. cr 
\ 2 0 1 0 fmax f. cr
\ 0 0 1 -99 fmin f. cr
\ 0 0 1 -99 fmax f. cr
