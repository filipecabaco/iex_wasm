\ 4tH library - >CUT CUT< - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/anstools.4th

\ Returns the string before/after a2 n2 if true, else a1 n1

[UNDEFINED] >cut   [IF]
[UNDEFINED] search [IF] include lib/search.4th [THEN]
                             ( a1 n1 a2 n2 -- a3 n3 f)
: >cut dup >r search r> swap >r r@ if /string else drop then r> ;
: cut< 2>r 2dup 2r> search dup >r if nip - else 2drop then r> ;
[THEN]                       ( a1 n1 a2 n2 -- a3 n3 f)

