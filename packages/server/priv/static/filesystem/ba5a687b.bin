\ 4tH library - COMUS - Copyright 2003,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Load definitions when needed
[UNDEFINED] 2OVER [IF]
[NEEDS lib/anscore.4th]
[THEN]

[UNDEFINED] UNDER+ [IF]
1 CELLS CONSTANT CELL
                                       ( n -- str len )
: (.) BASE @ 10 = IF DUP ELSE 0 SWAP THEN ABS <# #S SIGN #> ;
: 2+   ( n1|u1 -- n2|u2 )  1+ 1+ ;
: 2-   ( n1|u1 -- n2|u2 )  1- 1- ;
: @+   ( a-addr1 -- a-addr2 x )  DUP CELL+  SWAP @ ;
: !+   ( addr1 x -- addr2 )  OVER !  CELL+ ;
: C@+  ( c-addr1 -- c-addr2 c )  DUP CHAR+  SWAP C@ ;
: C!+  ( c-addr1 c -- c-addr2 )  OVER C!  CHAR+ ;
: C+!  ( n c-addr -- )  DUP >R C@ + R> C! ;
: CLEAR   ( i*x -- )  DEPTH 0 ?DO DROP LOOP ;
: NOOP ;
: OFF     ( a-addr -- )  FALSE SWAP ! ;
: ON      ( a-addr -- )  TRUE SWAP ! ;
: PERFORM ( i*x a-addr -- j*x )  @ EXECUTE ;
: UNDER+  ( n1|u1 x n2|u2 -- n3|u3 x ) ROT + SWAP ;
[THEN]
