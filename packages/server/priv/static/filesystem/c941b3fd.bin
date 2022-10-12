\ 4tH library - ZEN FLNP1 - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This works because e^x ~ x + 1 when x approaches zero

[UNDEFINED] flnp1 [IF]
[UNDEFINED] fln   [IF] include lib/zenfln.4th [THEN]
: flnp1 2dup fabs 1 -9 f< 0= if 1 s>f f+ fln then ;
[THEN]
