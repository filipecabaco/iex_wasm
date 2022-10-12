\  UTF-8 CODEC
\  John M. Drake  
\  08/10/2000
\  Hans Bezemer (4tH version)
\  08/01/2007

[UNDEFINED] getwch   [IF]
[UNDEFINED] E.LIBERR [IF] [needs lib/throw.4th] [THEN]
[HEX]
DEFER putch ( c -- )
DEFER getch ( -- c )

: ErrorUTF8 E.LIBERR THROW" Error decoding UTF-8" ;

: put6bits ( n -- )
        3F AND 80 OR putch ;

: put12bits ( n -- )
        DUP 6 RSHIFT put6bits  
        put6bits ;

: put18bits ( n -- )
        DUP 0C RSHIFT put6bits
        put12bits ;
        
: +6bits  ( n1 -- n2 )
        getch DUP 6 RSHIFT 2 <> ErrorUTF8
        3F AND  SWAP 6 LSHIFT  OR ;

: putwch  ( n -- )
        DUP     80 < IF                        putch                 EXIT  THEN
        DUP    800 < IF  DUP   6 RSHIFT 0C0 OR putch  put6bits       EXIT  THEN
        DUP  10000 < IF  DUP 00C RSHIFT 0E0 OR putch  put12bits      EXIT  THEN
        DUP 200000 < IF  DUP 012 RSHIFT 0F0 OR putch  put18bits      EXIT  THEN
            ErrorUTF8 ;

: getwch  ( -- n )
        getch
        DUP          080 < IF                                   EXIT  THEN
        DUP 5 RSHIFT   6 = IF 1F AND +6bits                     EXIT  THEN
        DUP 4 RSHIFT 00E = IF 0F AND +6bits +6bits              EXIT  THEN
        DUP 3 RSHIFT 01E = IF  7 AND +6bits +6bits +6bits       EXIT  THEN
            ErrorUTF8 ;
[DECIMAL]
[DEFINED] 4TH# [IF]
  hide ErrorUTF8
  hide put6bits
  hide put12bits
  hide put18bits
  hide +6bits
[THEN]
[THEN]
