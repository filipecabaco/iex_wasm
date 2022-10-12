\ 4tH library - 3 item stack operations - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] 3drop [IF]
: 3drop drop drop drop ;               ( n1 n2 n3 ---)
: 3dup >r over over r@ rot rot r> ;    ( n1 n2 n3 -- n1 n2 n3 n1 n2 n3)
: 3swap >r rot r> swap >r >r 2swap r> rot rot r> ;
: 3over >r >r >r 3dup r> r> r> 3swap ;
: 3rot >r >r >r 3swap r> r> r> 3swap ;
[THEN]

\ 3swap ( n1 n2 n3 n4 n5 n6 -- n4 n5 n6 n1 n2 n3)
\ 3over ( n1 n2 n3 n4 n5 n6 -- n1 n2 n3 n4 n5 n6 n1 n2 n3)
\ 3rot  ( n1 n2 n3 n4 n5 n6 n7 n8 n9 -- n4 n5 n6 n7 n8 n9 n1 n2 n3)