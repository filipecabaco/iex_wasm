\ 4tH library - TOOLBELT - Copyright 2003,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] [VOID]   [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
FALSE CONSTANT [VOID] IMMEDIATE

\ ==========
\ Common Use
\ ==========
[DEFINED] 4TH# [IF]
: APPEND-CHAR COUNT CHARS + DUP CHAR+ >R C! 0 R> C! ;
[ELSE]
: APPEND-CHAR DUP >R COUNT DUP 1+ R> C! + C! ;
[THEN]

\ ==============
\ Stack Handling
\ ==============
: THIRD  ( x y z -- x y z x )     >R OVER R> SWAP ;
: FOURTH ( w x y z -- w x y z w ) >R >R OVER R> R> ROT ;

\ ================
\ Common Constants
\ ================
 8 CONSTANT #BACKSPACE-CHAR
62 VALUE    #CHARS/LINE
13 CONSTANT #EOL-CHAR
 9 CONSTANT #TAB-CHAR
-1 CELLS CONSTANT -CELL

\ ===============
\ Filter Handling
\ ===============
VARIABLE TEMP
: NEXT-WORD  ( -- str len )
  BEGIN BL PARSE-WORD DUP IF EXIT THEN REFILL WHILE DROP DROP REPEAT ;

\ ==============
\ Error Checking
\ ==============
: FILE-CHECK      ( n -- ) 0= E.LIBERR THROW" File Access Error " ;

\ ================
\ Generally Useful
\ ================
: ++  ( addr -- )  1 SWAP +! ;

\ =============
\ Miscellaneous
\ =============
: HIWORD  ( xxyy -- xx )  16 RSHIFT ;
: LOWORD  ( xxyy -- yy )  65535 AND ;
[THEN]
