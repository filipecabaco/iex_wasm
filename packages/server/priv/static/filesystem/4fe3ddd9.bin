\ 4tH library - Degrees/Radians conversion - Copyright 2011,2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] deg>rad [IF]
[UNDEFINED] ZenFP   [IF]
[UNDEFINED] pi      [IF] include lib/fpconst.4th [THEN]
[ELSE]
[UNDEFINED] pi      [IF] include lib/zenconst.4th [THEN]
[THEN]
: deg>rad pi f* 180 s>f f/ ;
: rad>deg 180 s>f f* pi f/ ;
[THEN]
