\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

\ Sequence Definition

\    * Take a decimal number
\    * Look at the number, visually grouping consecutive runs of the same
\      digit.
\    * Say the number, from left to right, group by group; as how many of
\      that digit there are - followed by the digit grouped. 

\    This becomes the next number of the sequence. 

\ The sequence is from John Conway, of Conway's Game of Life fame.

\ An example:

\    * Starting with the number 1, you have one 1 which produces 11.
\    * Starting with 11, you have two 1's i.e. 21
\    * Starting with 21, you have one 2, then one 1 i.e. (12)(11) which
\      becomes 1211
\    * Starting with 1211 you have one 1, one 2, then two 1's i.e.
\      (11)(12)(21) which becomes 111221 

256 string buf1
256 string buf2

buf1 value src
buf2 value dest
 
s" 1" src place
 
: append-run ( digit run -- )
  swap >r >r
  0 dest count +
  r> over c! char+
  r> over c! char+ c!
;

: next-look-say
  0 dest c!
  src c@  [char] 0  ( digit run )
  src count bounds do
    over i c@ =
    if   1+
    else append-run  i c@ [char] 1
    then
  loop
  append-run
  src dest to src to dest ;
 
: look-and-say ( n -- )
  0 do next-look-say src count type cr loop ;
 
10 look-and-say