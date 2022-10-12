\ 4tH library - EVALUATE - Copyright 2005,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] interpret [IF]
[NEEDS lib/interprt.4th]
[THEN]

4 [DEFINED] block [IF] 1+ [THEN] constant /input
                                       \ the number of items on stack
[UNDEFINED] evaluate [IF]              \ this routine evaluates a string
: save-input                           ( -- n1 n2 a n3 h n4)
[DEFINED] block [IF]                   \ only if BLOCK has been defined
  blk @                                \ save also the block number
[THEN]                                 \ save >IN, buffer and channel
  >in @ source cin /input              ( -- n1 a n2 h)
;

: restore-input                        ( n1 n2 a n3 h n4 -- f)
  swap cin <> dup >r                   \ check if input channel has changed
  if                                   \ if true, drop all items
    1- 0 do drop loop
  else                                 \ otherwise restore >IN and buffer
    drop source! >in !
[DEFINED] block [IF]                   \ only if BLOCK has been defined
    block drop                         \ reload the block
[THEN]
  then r>                              \ retrieve the flag
;
                                       \ interpret contents of a buffer
: (evaluate)                           ( x xt --)
  save-input dup 1- begin rot >r dup while 1- repeat drop >r
  execute source! 0 >in ! ['] interpret catch drop 
  r> dup 1- begin r> -rot dup while 1- repeat drop
  restore-input throw
;
                                       \ interpret a named buffer
: evaluate [: ;] (evaluate) ;          ( a n --)
                                       \ interpret the contents of a block
[DEFINED] block [IF]                   \ only if BLOCK has been defined
: load [: block b/buf ;] (evaluate) ;
[THEN]                                 ( n --)

[DEFINED] 4TH# [IF]
  hide (evaluate)
  hide /input
[THEN]
[THEN]
