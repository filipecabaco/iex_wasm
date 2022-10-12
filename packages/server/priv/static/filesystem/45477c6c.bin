\ ---------------------------------------------------
\     (c) Copyright 2001  Julian V. Noble.
\         Permission is granted by the author to
\         use this software for any application pro-
\         vided this copyright notice is preserved.
\ ---------------------------------------------------

[UNDEFINED] fsm [IF]
 3 cells constant fsm.head             \ FSM header overhead
       0 constant wide                 \ syntactic sugar
       0 value    fsm.current          \ currently active FSM

aka fsm.current fsm.state              \ create an alias
                                       \ run the active FSM
: fsm.run                              ( col# -- )
  fsm.current >r                       ( --)
  r@ @ r@ cell+ @ * +                  ( col# + width*state )
  2* fsm.head + r@ +                   ( adr-of-action )
  dup >r @ execute                     ( ? )
  r> cell+                             ( addr-of-update )
  @ execute                            ( ? state' )
  r> !                                 \ update state
;
                                       ( width state array --)
: fsm dup to fsm.current tuck ! cell+ tuck ! cell+ dup cell+ swap ! ;
: | fsm.current fsm.head 1- + dup >r @ dup >r ! r> cell+ r> ! ;
: || swap | | ;                        ( xt --)
[THEN]                                 ( xt1 xt2  --)
