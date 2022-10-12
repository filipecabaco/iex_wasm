\ Permute after Wirth, Programming in Modula 2, 2nd ed., pp. 54-55
\ Copyright 1996 Leo Wong; 4tH version 2007 J.L. Bezemer

0 VALUE #LETTERS
64 STRING LETTER DOES> SWAP CHARS + ;

: SWAP-CHARS  ( a1 a2 -- )
   2DUP C@  -ROT C@  SWAP C!  SWAP C! ;

: LETTERS  ( -- a u )
   0 LETTER  #LETTERS ;

: .LETTERS  ( -- )  
   LETTERS TYPE  SPACE ;

: SWAP-LETTERS  ( n1 n2 -- )
   LETTER  SWAP LETTER  SWAP-CHARS ;

: (PERMUTE) ( n -- )
   DUP 1 = IF
      .LETTERS
   ELSE
      1-
      DUP RECURSE
      DUP 0 DO
         DUP I SWAP-LETTERS
         DUP RECURSE  
         DUP I SWAP-LETTERS
      LOOP
   THEN
   DROP ;

: GET-LETTERS  ( 'ccc<char> -- )
   TO #LETTERS
   LETTERS CMOVE ;

: PERMUTE  ( 'ccc<char> -- )
     GET-LETTERS  CR  
     #LETTERS (PERMUTE) ;

[DEFINED] 4TH# [IF]
argn 2 < abort" Usage: permute [string]"
1 args permute
[THEN]