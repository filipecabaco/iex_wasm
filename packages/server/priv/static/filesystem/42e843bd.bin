\ Copyright http://wiki.forthfreak.net/index.cgi?HigherOrderFunctions
\ Copyright 4tH version 2005,2017 J.L. Bezemer
\ HigherOrderFunctions

\ : .cells ( addr n -- )  [: . ;] -rot foreach ;

[UNDEFINED] foreach [IF]
: foreach                              ( 'f addr count -- )
  cells bounds do
    I @ over execute
  loop drop ;

\ where : f ( n -- m )
: map                                  ( 'f addr count -- )
  cells bounds do
    I @ over execute I !
  loop drop ;

\ where : f ( st n -- st' )
: reduce                               ( st 'f addr count -- st' )
  cells bounds do
    I @ swap dup >r execute r>
  loop drop ;
[THEN]
