\ 4tH library - FASINH FACOSH FATANH - Copyright 2008,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fasinh [IF]
[UNDEFINED] fln [IF] include lib/flnflog.4th [THEN]

: (inverse) s>f fover fdup f* f+ fsqrt f+ fln ;
: fasinh  1 (inverse) ;
: facosh -1 (inverse) ;
: fatanh 1 s>f fswap fover fover f+ frot frot f- f/ fln f2/ ;

[DEFINED] 4TH# [IF] hide (inverse) [THEN]
[THEN]
