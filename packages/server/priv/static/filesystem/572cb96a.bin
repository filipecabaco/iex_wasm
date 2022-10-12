\ 4tH library - ANS FLNP1 - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This works because e^x ~ x + 1 when x approaches zero

[UNDEFINED] flnp1 [IF]
[UNDEFINED] fln   [IF] include lib/flnflog.4th [THEN]
: flnp1 fdup fabs 1 s>f 1000000000 s>f f/ f< 0= if 1 s>f f+ fln then ;
[THEN]
