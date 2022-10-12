\ 4tH library - Fast FLN and FEXP functions - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fswap [IF] [ABORT] [THEN]
[UNDEFINED] fxexp [IF] include lib/fxexpln.4th [THEN]

\ Fast, but inaccurate - about 5-7 digits of accuracy

[UNDEFINED] fexp [IF]
: fexp *fx s>f f* f>s dup 0< >r abs fxexp s>f *fx s>f r> if fswap then f/ ;
[THEN]

[UNDEFINED] fln  [IF]
: fln *fx s>f f* f>s fxln s>f *fx s>f f/ ;
[THEN]

