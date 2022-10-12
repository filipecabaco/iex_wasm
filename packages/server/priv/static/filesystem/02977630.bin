\ 4tH library - Probability Density functions - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] normal.pdf [IF]
[UNDEFINED] fexp       [IF] include lib/fexp.4th [THEN]
: normal.pdf fdup f* f2/ fnegate fexp 1 s>f pi f2* fsqrt f/ f* ;
: gauss.pdf fdup f* fnegate fexp 1 s>f pi fsqrt f/ f* ;
: stigler.pdf fdup f* pi f* fnegate fexp ;
[THEN]

