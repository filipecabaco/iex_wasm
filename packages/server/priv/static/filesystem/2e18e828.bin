\ animal.4th

\ animal  01.12.25 18:21 -- EJB

\ silly animal guessing game in which the computer
\ "learns" new animals as it goes.

\ written on 25 December 2001 by Edward J. Beroset
\ and released to the public domain by the author.

\ Modified to run under kForth --- K. Myneni, 2001-12-29
\ Modified to run under 4tH --- H. Bezemer, 2003-03-26

INCLUDE lib/ncoding.4th

 2048 STRING ANIMAL-TREE 	       \ allot space for the binary tree
/NELL STRING ROOT
   80 STRING MYPAD

VARIABLE TREE-PTR

ANIMAL-TREE TREE-PTR !

\ insert an integer value into the tree

: TREE,                                ( n -- )
    TREE-PTR @ N! TREE-PTR @ NELL+ TREE-PTR ! ;

\ insert a string into the tree

: TREE-S,                              ( c-addr u -- )
    DUP TREE,
    DUP >R
    TREE-PTR @ SWAP CMOVE
    TREE-PTR @ R> + TREE-PTR ! ;

\ adds a new node to the binary tree using
\ the passed string as the data

: NEWNODE                              ( c-addr u -- c-addr )
    ALIGN
    TREE-PTR @ >R                      \ save original address
    0 TREE,                            \ save YES node
    0 TREE,                            \ save NO node
    TREE-S,                            \ save string
    R> ;                               \ return address of this node

\ returns the address of the left branch of
\ the passed node
: LEFT                                 ( a-addr -- a-addr )
    N@ ;

\ returns the address of the right branch of
\ the passed node
: RIGHT                                ( a-addr -- a-addr )
    NELL+ N@ ;

\ returns TRUE if this is a terminal node.
: TERM?                                ( a-addr -- t )
    DUP LEFT SWAP RIGHT OR 0= ;

\ given the address of a node, types the
\ text stored at that node.
: GETQ                                 ( a-addr -- )
    NELL+ NELL+ DUP N@ SWAP NELL+ SWAP TYPE ;

\ cleans up the question.
: CLEANQ                               ( a-addr u -- a-addr u)
    OVER DUP C@ BL INVERT AND SWAP C!
    2DUP 1- CHARS + DUP C@ [CHAR] ? TUCK =
    IF DROP DROP ELSE SWAP CHAR+ C! 1+ THEN ;

\ prints the question based on the text
\ stored at this node.
: SHOWQ                                ( a-addr -- )
    DUP TERM? IF                       \ is it a terminal node?
        ." Is it a " GETQ ." ?"
    ELSE
        GETQ
    THEN CR ;

\ returns TRUE if the passed char was y or Y
: YES?                                 ( n -- t )
    DUP [CHAR] Y = SWAP
    [CHAR] y = OR ;

\ returns TRUE if the passed char was n or N
: NO?                                  ( n -- t )
    DUP [CHAR] N = SWAP
    [CHAR] n = OR ;

\ returns the letter pressed by the user
\ and TRUE if that was either Y or N
: GETA                                 ( -- n t )
    MYPAD 1 ACCEPT DROP MYPAD C@
    DUP DUP YES? SWAP NO? OR ;

\ asks a question based on the text at the
\ passed node and gets a response.  The
\ letter returned is the users response and
\ the flag returned is TRUE if the user
\ wants to continue
: QUERY                                ( a-addr -- n t )
    SHOWQ ." (Y, N or Q): "
    GETA CR ;

\ learning consists of asking three questions.  The questions
\ are: what was the animal? what's a question to differentiate?
\ and what is the answer to that question in the case of the new
\ animal?  The first question causes a new terminal node to be
\ created.  The second causes a new non-terminal node to be
\ created, and the last question allows the links to that
\ non-terminal to be set correctly.
: LEARN                                 ( a-addr -- )
    ." What is the animal you were thinking of?" CR
    MYPAD DUP 80 ACCEPT NEWNODE CR      ( -- oldtermaddr newnode )
    ." What is a yes/no question that differentiates a "
    OVER N@ GETQ ."  from a " DUP GETQ ." ?" CR
    MYPAD DUP 80 ACCEPT CLEANQ NEWNODE  ( -- oldtermaddr newnode qnode )
    CR ." And what is the answer in the case of a " OVER GETQ
    ." ? " GETA CR IF
        YES? IF
            DUP ROT ROT N!              ( -- oldtermadd qnode )
            OVER OVER NELL+ SWAP N@ SWAP N!
            SWAP N!
        ELSE
            DUP ROT ROT NELL+ N!        ( -- oldtermadd qnode )
            OVER OVER SWAP N@ SWAP N!
            SWAP N!
        THEN
    THEN ;

\ starts with the address of a variable which contains the
\ first structure.  We do it this way so that the variable
\ can be modified when we learn a new animal.
: GUESS                                ( a-addr -- a-addr t )
    DUP N@ QUERY IF                    \ user wants to continue
        OVER N@ TERM? IF
        YES? IF                        \ answer was Y
                ." I guessed it! Let's play again!" CR CR
                DROP
            ELSE                       \ answer was N
                ." You stumped me! "
                LEARN
            THEN
            ROOT
        ELSE                           \ follow answer to next question
            YES? IF
                N@
            ELSE
                N@ NELL+
            THEN
        THEN 0                         \ indicate user wants to continue
    ELSE DROP 1                        \ indicate user wants to quit
    THEN ;

\ seeds the binary tree with a single terminal node
: SEED                                 ( -- )
    S" cow" NEWNODE ROOT N! ;

\ given a node address, this either prints
\ the text if it's a terminal node or replaces
\ the address with the addresses of the left
\ and right nodes.
: EXPAND                               ( a-addr -- a-addr a-addr | )
    DUP TERM? IF
        GETQ CR
    ELSE
        DUP LEFT SWAP RIGHT
    THEN ;

\ lists the animals known to the game
: INVENTORY ( -- )
	0 ROOT N@ CR BEGIN EXPAND DUP 0= UNTIL DROP ;

\ plays the animal game
: ANIMAL
    ." You think of an animal and I'll try to guess it!" CR
    ." Let's start!" CR CR
    SEED ROOT BEGIN GUESS UNTIL DROP ;

ANIMAL

