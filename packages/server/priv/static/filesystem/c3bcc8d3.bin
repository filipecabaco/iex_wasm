\ 4tH library - STRING STACK - Copyright 2004,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ N.B. Items taken from a stack by s> will remain
\ unclobbered UNTIL the next >s to that stack is performed.

[UNDEFINED] string-stack [IF]
[UNDEFINED] 4TH#         [IF]
: string-stack chars over + swap ! ;
: s.free dup @ swap cell+ - ;
: >s dup >r @ over 1+ chars - dup r> ! place ;
: s@ @ count ;
: s> dup >r s@ 2dup chars + r> ! ;
[ELSE] [UNDEFINED] n! [IF] include lib/ncoding.4th [THEN]
: string-stack chars over + swap n! ;
: s.free dup n@ swap nell+ - ;
: >s dup >r n@ over 1+ chars - dup r> n! place ;
: s@ n@ count ;
: s> dup >r s@ 2dup 1+ chars + r> n! ;
[THEN]
[THEN]

