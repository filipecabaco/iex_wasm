\ 4tH library - NCODING - Copyright 2004,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] N! [IF]
/cell constant /nell
/nell constant nell
nell *constant nells
nell +constant nell+
nell negate +constant nell-

: n! nell bounds do dup i c! 8 rshift loop drop ;
: n@ 0 nell over do over i + c@ i 3 lshift lshift or loop nip ;
: n+! tuck n@ + swap n! ;
[THEN]
