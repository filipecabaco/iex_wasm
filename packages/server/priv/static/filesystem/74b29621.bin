\ 4tH library - Integer floored division - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] // [IF]
( a b -- a//b)
: // over 0< over 0< xor >r over over / dup rot * rot = if rdrop ;then r> - ;
: //mod over over // dup >r * - r> ;
( a b -- rem a//b)
[THEN]

\ 10   7 //mod  . . cr
\ -10  7 //mod  . . cr
\ 10  -7 //mod  . . cr
\ -10 -7 //mod  . . cr

