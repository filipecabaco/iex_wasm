\  Copyright 2000 (c): Albert van der Horst, Dutch Forth Worksshop by GPL
\  Copyright 2004 (c): Hans Bezemer, 4tH version
\ ( Environmental dependancies : )
\ ( This is a ISO Forth Program using only standard ISO Words)
\ ( plus LINOS (par1, par2, par3, function# -- result/error )
\ ( The following words are not ANSI : none (any more))
\ ( An environmental dependancy ?BLANK is used. )

9 CONSTANT TAB
10 CONSTANT LF
 ( char -- flag)
: IS-BLANK    BL 1+ < ;   ( Compiles under ISO.)

VARIABLE LAST-WAS-BLANK
VARIABLE L
VARIABLE W
VARIABLE C

: ZERO-COUNT 0 L !   0 W !   0 C ! TRUE LAST-WAS-BLANK ! ;
: SHOW-COUNT SPACE L @ . W @ . C @ . ARGS TYPE CR ;

32768 CONSTANT SIZE
SIZE STRING Buffer

: AT-WORD-START IS-BLANK LAST-WAS-BLANK @ 0= AND ; ( char -- flag)
( All four  : ( char -- char )
: COUNT-L LF OVER = IF 1 L +! THEN ;
: COUNT-W DUP AT-WORD-START IF 1 W +! THEN DUP IS-BLANK LAST-WAS-BLANK ! ;
: COUNT-C 1 C +! ;
: COUNT-CHAR COUNT-C COUNT-W COUNT-L ;
: COUNT-BUFFER OVER + SWAP DO I C@ COUNT-CHAR DROP LOOP ; ( addr len -)

: COUNT-FILE
    BEGIN
        Buffer DUP SIZE ACCEPT
    DUP 0> WHILE
        COUNT-BUFFER
    REPEAT 2DROP ;

include lib/argopen.4th

: WordCount
  argn 2 < abort" Usage: wc ascii-file"
  argn 1 do 
    input i arg-open
    zero-count count-file i show-count
    close
  loop
;

WordCount
