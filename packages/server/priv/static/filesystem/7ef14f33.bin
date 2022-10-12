\ Taken from http://en.literateprograms.org/Sierpinski_triangle_(Forth)
\ Converted to 4tH by J.L. Bezemer, 2007,2012

80 constant size
size 1+ constant /size

/size string state

create symbol bl , char * ,

\ the input has three bits: 
\ b0, b1, b2 = next neighbor, current cell, previous neighbor
\ 000  001  010  011  100  101  110  111

create transition 0 , 1 , 1 , 1 , 1 , 1 , 1 , 0 ,

: init-state
  state /size erase
  1 state size 2 / + c! ;

: .state
  cr size 0 do
    state i + c@ symbol + @c emit
  loop ;
   
: gen
  state c@ ( neighborhood )
  size 0 do
    2* state i + 1+ c@ or 7 and
    dup transition + @c state i + c!
  loop drop ;
  
: sierpinski ( n -- )
  init-state .state
  1 ?do gen .state loop ;

32 sierpinski
  
