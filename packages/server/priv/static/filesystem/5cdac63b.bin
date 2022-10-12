\ Program by Leo Brodie

16 CONSTANT #NAME
 8 CONSTANT #EYES
16 CONSTANT #ME                        ( length of fields )

#NAME STRING NAME
#EYES STRING EYES
#ME   STRING ME                        ( calculate values )

: ENTER ( addr n -- , accept a string up to n characters to the )
        ( memory area starting at addr .)
        OVER OVER BLANK                ( clear the memory area to spaces )
        1- ACCEPT DROP                 ( wait for a string up to n )
        ;                              ( characters or a return )

: VITALS ( -- , get and store the names and the eye color in arrays )
        ." Enter your name    : "
        ME #ME ENTER                   ( get your name )
        ." Enter her name     : "
        NAME #NAME ENTER               ( get her name )
        ." Enter her eye color: "
        EYES #EYES ENTER               ( get her eye color )
        ;

: LETTER ( -- )
        CR CR CR CR
        ." Dear "
        NAME COUNT -TRAILING TYPE
        ." ," CR CR
        ." I go to heaven whenever I see your deep "
        EYES COUNT -TRAILING TYPE
        ."  eyes." CR
        ." Can you go to the movies Friday?"
        CR CR 30 SPACES
        ." Love,"
        CR 30 SPACES
        ME COUNT -TRAILING TYPE CR CR
        ." P.S.  Wear something "
        EYES COUNT -TRAILING TYPE
        ."  to show off those eyes!"
        CR CR CR
        ;

vitals
letter
