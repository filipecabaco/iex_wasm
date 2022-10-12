\ 4tH library - FASINH FACOSH FATANH ZEN - Copyright 2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fasinh [IF]
[UNDEFINED] fln   [IF] include lib/zenfln.4th   [THEN]
[UNDEFINED] fsqrt [IF] include lib/zenfsqrt.4th [THEN]

: (inverse) s>f 2over 2dup f* f+ fsqrt f+ fln ;
: fasinh  1 (inverse) ;
: facosh -1 (inverse) ;
: fatanh 1 s>f 2swap 2over 2over f+ 2rot 2rot f- f/ fln 2 s>f f/ ;

[DEFINED] 4TH# [IF] hide (inverse) [THEN]
[THEN]
