\ 4tH library - ZEN Cartesian>Polar conversion - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] xy>polar [IF]
[UNDEFINED] fatan    [IF] include lib/zenfasin.4th [THEN]
[UNDEFINED] fsqrt    [IF] include lib/zenfsqrt.4th [THEN]
: magnitude dup * swap dup * + s>f fsqrt ;
: direction s>f rot s>f f/ fatan ;
: xy>polar over over direction 2>r magnitude 2r> ;
[THEN]
