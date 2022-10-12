\ Taken from http://rosettacode.org 
\ 4tH version 2012, Hans Bezemer

64 constant /here
/here array "here"

: init ( n -- )
  "here" /here bounds do 0 i ! loop 1 "here" ! ;
: .line ( n -- )
  "here" swap 0 do dup @ . cell+ loop drop cr ;
: next ( n -- )
  "here" 1- swap 1- cells "here" + do
    i @ i cell+ +!
  -1 cells +loop ;
: pascal ( n -- )
      dup init 1 .line
  1 ?do i next i 1+ .line loop ;

13 pascal