\ 4tH library - TOOLBELT IS-TYPE - Copyright 2004,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] IS-ASCII [IF]
: IS-ASCII  ( char -- flag )  128 < ;
: IS-PRINT  ( char -- flag )  DUP IS-ASCII SWAP BL 1- - 0> AND ;
: IS-WHITE  ( char -- flag )  [CHAR] ! - 0< ;
: IS-DIGIT  ( char -- flag )  [CHAR] 0 - MAX-N AND 10 < ;
: IS-LOWER  ( char -- flag )  [CHAR] a - MAX-N AND 26 < ;
: IS-UPPER  ( char -- flag )  [CHAR] A - MAX-N AND 26 < ;
: IS-ALPHA  ( char -- flag )  BL OR IS-LOWER ;
: IS-ALNUM  ( char -- flag )  DUP IS-ALPHA SWAP IS-DIGIT OR ;
: IS-XML    ( char -- flag )  0 S| <>&"'| BOUNDS DO OVER I C@ = OR LOOP NIP ;
: IS-HTML   ( char -- flag )  DUP IS-XML SWAP IS-PRINT 0= OR ;
[THEN]
