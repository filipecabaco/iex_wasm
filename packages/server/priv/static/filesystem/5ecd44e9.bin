\ Taken from http://rosettacode.org 
\ 4tH version 2010,2020 - Hans Bezemer

\ http://www.quinapalus.com/wi-index.html

\ Wireworld is a cellular automaton with some similarities to Conway's Game
\ of Life. It is capable of doing sophisticated computations (e.g.,
\ calculating primeness!) with appropriate programs, and is much simpler to
\ program for.

\ A wireworld arena consists of a cartesian grid of cells, each of which can
\ be in one of four states. All cell transitions happen simultaneously.

\ The cell transition rules are this:

\ Input State     Output State    Condition
\ ===========     ============    =========
\ empty           empt
\ electron head   electron tail
\ electron tail   conductor
\ conductor       electron head   if 1 or 2 cells in the neighborhood of the
\                                 cell are in the state "electron head"
\ conductor       conductor       otherwise

include lib/ansfile.4th
include lib/range.4th
include lib/yesorno.4th

    16 constant w
     8 constant h
w 2 * *constant rows

1 rows constant row
h rows constant size
 
size buffer: world
world   value old
old w + value new
 
: init   world size erase ;
: age    new old to new to old ;
: one+   1+ ;
: noop ;

: foreachrow ( xt -- )
  size 0 do  I over execute row +loop drop ;
 
0 constant EMPTY
1 constant          HEAD
2 constant                    TAIL
3 constant                              WIRE
offset cstate bl c, char H c, char t c, char . c,
 
: showrow ( i -- ) cr
  old + w over + swap do I c@ cstate emit loop ;
: show  ['] showrow foreachrow  ;
 
 
: line ( row addr len -- )
  bounds do
    i c@
    case
    bl of EMPTY over c! endof
    [char] H of HEAD  over c! endof
    [char] t of TAIL  over c! endof
    [char] . of WIRE  over c! endof
    endcase
    1+
  loop drop ;

: load ( filename -- )
  r/o open-file throw
  init  old row + 1+  ( file row )
  begin  over pad 80 rot read-line throw
  while  over pad rot line
         row +
  repeat
  2drop close-file throw
  show cr ;
 
 
: +head ( sum i -- sum )
  old + c@ HEAD = if 1+ then ;

: conductor ( i WIRE -- i HEAD|WIRE )
  drop 0
  over 1- row - +head
  over    row - +head
  over 1+ row - +head
  over 1-       +head
  over 1+       +head
  over 1- row + +head
  over    row + +head
  over 1+ row + +head
  1 3 within if HEAD else WIRE then ;
 
\ before:          empty    head   tail   wire

create transition  ' noop , ' one+ , ' one+ , ' conductor ,
 
\ after:           empty    tail   wire   head|wire

: new-state ( i -- )
  dup  old + c@
  dup cells transition + @c execute
  swap new + c! ;
 
: newrow ( i -- )
  w over + swap do I new-state loop ;
: gen  ['] newrow foreachrow  age ;
 
: wireworld begin gen show cr s" Continue" yes/no? 0= until ;

argn 2 <> abort" Usage: wirewrld scheme"
1 args load
wireworld
