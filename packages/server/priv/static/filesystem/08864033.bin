\ 4tH ABC riddle - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ You are given a collection of ABC blocks. Just like the ones you had when
\ you were a kid. There are twenty blocks with two letters on each block.
\ You are guaranteed to have a complete alphabet amongst all sides of the
\ blocks. The goal of this task is to write a function that takes a string
\ and can determine whether you can spell the word with the given collection
\ of blocks.

offset (blocks)                        \ initial block data
  c" BO" c" XK" c" DQ" c" CP" c" NA"
  c" GT" c" RE" c" TG" c" QD" c" FS"
  c" JW" c" HU" c" VI" c" AN" c" OB"
  c" ER" c" FS" c" LY" c" PC" c" ZM"
  0 c, 0 c,                            \ terminate the blocks

21 constant #blocks                    \ number of blocks plus one
#blocks 2* buffer: blocks              \ allocate the blocks
defer get-letter                       \ defer comparison

: block@ dup c@ swap char+ c@ ;        ( x -- c1 c2)
: block! tuck c! char+ c! ;            ( c1 c2 x --)
: block+ 2 chars + ;                   ( x -- x+2)
: swap-blocks over over block@ 2>r block@ rot block! 2r> rot block! ;
                                       ( x1 x2 --)
: init-block                           ( --)
  #blocks 0 ?do i 2* (blocks) i 2* 1+ (blocks) blocks i 2* chars + block! loop
;

: can-make-word                        ( a n x -- f)
  over if -rot get-letter else true then >r drop drop drop r>
;                                      \ if any string left then do the test
                                       \ otherwise we've done it
:noname                                ( x a n -- x a n f)
  >r >r dup                            \ store string on return stack
  begin                                \ are there no more blocks?
    dup c@                             \ if so exit
  while                                \ does the first or second letter equal
    dup dup char+ r@ c@ bl invert and >r c@ r@ = swap c@ r> = or
    if                                 \ if so then swap the blocks
      over over swap-blocks            \ and try for the rest of the letters
      over r> r@ over >r chop rot block+ can-make-word >r
      over over swap-blocks            \ return to the previous state
      r@ if drop r> r> r> rot exit else r> drop then
    then                               \ exit if we found a solution
    block+                             \ if didn't work, try the next block
  repeat drop r> r> false              \ restore stack diagram, no more blocks
; is get-letter                        \ but remember we failed

init-block

s" A"       2dup blocks can-make-word . type cr
s" BARK"    2dup blocks can-make-word . type cr
s" BOOK"    2dup blocks can-make-word . type cr
s" TREAT"   2dup blocks can-make-word . type cr
s" Common"  2dup blocks can-make-word . type cr
s" SQUAD"   2dup blocks can-make-word . type cr
s" Confuse" 2dup blocks can-make-word . type cr
