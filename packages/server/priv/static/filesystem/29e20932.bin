\ 4tH library - ANS Cartesian>Polar conversion - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] xy>polar [IF]
[UNDEFINED] fatan    [IF] include lib/asinacos.4th [THEN]
: magnitude dup * swap dup * + s>f fsqrt ;
: direction s>f s>f f/ fatan ;
: xy>polar over over magnitude direction ;
[THEN]

