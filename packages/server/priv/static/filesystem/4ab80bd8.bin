\ COMPOSE demonstration - Copyright J.L. Bezemer 2013

include lib/compose.4th                \ include the library
                                       \ create a couple of execution tokens
[DEFINED] 4TH# [IF]
:token '100' 100 ;
:token 'dup' dup ;
:token '/' / ;
:token '*' * ;
:token 'swap' swap ;
[ELSE]
:noname 100 ; constant '100'           \ Yes, it is ANS Forth compatible
:noname dup ; constant 'dup'
:noname / ; constant '/'
:noname * ; constant '*'
:noname swap ; constant 'swap'
[THEN]

overture                               \ initialize the compose buffer
                                       \ compose a square routine
'dup' '*' 2 compose value square       \ and a percent routine
'swap' '100' '*' 'swap' '/' 5 compose value percent
                                       \ throw a few values on the stack
50 300 percent recite . ." %" cr       \ and execute the compositions
    16 square  recite . cr             \ just like 'normal' words
