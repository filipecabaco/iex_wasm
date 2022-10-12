\ 4tH library - 4 item stack operations - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] 4drop [IF]
[UNDEFINED] 2over [IF] include lib/anscore.4th [THEN]
: 4swap 2rot 2>r 2rot 2r> ;
: 4drop 2drop 2drop ;
: 4dup 2over 2over ;
: 4over 2>r 2>r 4dup 2r> 2r> 4swap ;
: 4rot 2>r 2>r 4swap 2r> 2r> 4swap ;
[THEN]

\ 4SWAP  n1 n2 n3 n4 n5 n6 n7 n8 -- n5 n6 n7 n8 n4 n3 n2 n1
\ 4DROP  n1 n2 n3 n4 --
\ 4DUP   n1 n2 n3 n4 -- n1 n2 n3 n4 n1 n2 n3 n4
\ 4OVER  n1 n2 n3 n4 n5 n6 n7 n8 -- n1 n2 n3 n4 n5 n6 n7 n8 n1 n2 n3 n4
\ 4ROT   n1 n2 n3 n4 n5 n6 n7 n8 n9 n10 n11 n12 --
\        n5 n6 n7 n8 n9 n10 n11 n12 n1 n2 n3 n4