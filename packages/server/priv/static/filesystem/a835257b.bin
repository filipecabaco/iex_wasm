\ 4tH library - Taylor series ZEN - Copyright 2009,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >taylor [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library

: >taylor 2dup f* 2over ;              \ setup for Taylor series
: (taylor) >r 2over f* 2rot 2over r> s>f f/ ;
: +taylor (taylor) f+ 2rot 2rot ;      \ add Taylor iteration
: -taylor (taylor) f- 2rot 2rot ;      \ subtract Taylor iteration

[DEFINED] 4TH# [IF] hide (taylor) [THEN]
[THEN]