\ 4tH library - Taylor series - Copyright 2008,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In order to preserve memory, it will abort rather than to
\ include the entire floating point emulation library again.

[UNDEFINED] >taylor [IF]
  [DEFINED] ZenFP   [IF] [ABORT] [THEN]
[UNDEFINED] floats  [IF] [ABORT] [THEN]

: >taylor fdup f* fover ;              \ setup for Taylor series
: (taylor) fover f* frot fover s>f f/ ;
: +taylor (taylor) f+ frot frot ;      \ add Taylor iteration
: -taylor (taylor) f- frot frot ;      \ subtract Taylor iteration

[DEFINED] 4TH# [IF] hide (taylor) [THEN]
[THEN]
