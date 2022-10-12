\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

3 array bottles                        \ array holding 99 bottles of beer
variable accumulator                   \ HQ9+ accumulator

:noname   dup . ." bottles" ;
:noname       ." 1 bottle"  ;
:noname ." no more bottles" ;

bottles 3 bounds ?do i ! loop          \ fill 99 bottles array
                                       \ 99 bottles code
: .bottles  dup 2 min cells bottles + @ execute ;
: .beer     .bottles ."  of beer" ;
: .wall     .beer ."  on the wall" ;
: .take     ." Take one down, pass it around" ;
: .verse    .wall cr .beer cr 1- .take cr .wall cr ;
: verses    begin cr .verse dup 0= until drop ;

: _H ." Hello, world!" cr ;            \ H instruction
: _Q [char] Q emit cr ;                \ Q instruction
: _9 99 verses ;                       \ 9 instruction
: _+ 1 accumulator +! ;                \ + instruction
                                       \ mapping character to code
create cpu
  char h , ' _H ,
  char q , ' _Q ,
  char 9 , ' _9 ,
  char + , ' _+ ,
does>
  dup 8 + >r                           \ calculate final address
  begin
    dup r@ <                           \ final address reached?
  while
    over bl or over @c =               \ if not, get instruction
    if cell+ @c execute r> drop drop exit else 2 cells + then
  repeat                               \ if valid, execute it
  ." Invalid HQ9+ instruction" cr quit \ otherwise issue error message
;
                                       \ main loop
: hq9+ begin ." hq9+> " refill while 0 parse bounds ?do i c@ cpu loop repeat ;

hq9+

