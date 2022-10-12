\ Fred Behringer, 2012
\ Believed to be in the public domain

[UNDEFINED] local{ [IF]
\ local{ = Opening bracket, start local variable
\ ----------------------------------------------
: local{                               ( x -- )
  r>                                   \ return address of local[
  swap                                 \ swap with address of variable
  dup >r                               \ put address of variable on Rstack
  @ >r                                 \ put value of variable on Rstack
  >r ;                                 \ restore address of local[ on Rstack

\ }global = Closing bracket, restore global variable
\ --------------------------------------------------
: }global                              ( -- )
  r>                                   \ return address of ]global
  r>                                   \ get value of variable from Rstack
  r>                                   \ get address of variable from Rstack
  !                                    \ restore original value of variable
  >r ;                                 \ restore address of ]global on Rstack
[THEN]