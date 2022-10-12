\ Taken from http://rosettacode.org 
\ 4tH version 2011,2012 Hans Bezemer

\ Assume an array of cells with an initial distribution of live and dead
\ cells, and imaginary cells off the end of the array having fixed values.

\ Cells in the next generation of the array are calculated based on the value
\ of the cell and its left and right nearest neighbours in the current
\ generation. If, in the following table, a live cell is represented by 1 and
\ a dead cell by 0 then to generate the value of the cell at a particular
\ index in the array of cellular values you use the following table:

\ 000 -> 0  #
\ 001 -> 0  #
\ 010 -> 0  # Dies without enough neighbours
\ 011 -> 1  # Needs one neighbour to survive
\ 100 -> 0  #
\ 101 -> 1  # Two neighbours giving birth
\ 110 -> 1  # Needs one neighbour to survive
\ 111 -> 0  # Starved to death.

offset rules 0 c, 0 c, 0 c, 1 c, 0 c, 1 c, 1 c, 0 c,

20 constant size
size 1+ buffer: state

: .state
  size 0 do
    state i + c@ if [char] # else bl then emit
  loop cr ;

: gen
  state c@ ( window )
  size 0 do
    2*  state i + 1+ c@ or  7 and
    dup rules state i + c!
  loop drop ;

: init 152942 state size 1+ bounds do dup 1 and i c! 2/ loop drop ;
: life1d init .state 1 do gen .state loop ;
                                       ( n -- )
10 life1d

