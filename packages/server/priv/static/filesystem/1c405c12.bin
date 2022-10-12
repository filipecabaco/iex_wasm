\ Reset within circle counter.
\ Generate a point, test for within circle.
\ Count points within circle.
\ Do next point.

\ From: http://www.scidata.ca/?page_id=940
\ Believed to be in the Public Domain

include lib/choose.4th

variable in-circle                     \ a place to keep a count of points 

: square dup * ;                       ( n -- n^2 )
: point 10000 choose 10000 choose ;    \ generate a 2D point ( -- x y )
: in-circle? square swap square + 100000000 < in-circle +! ;
: sim 0 dup in-circle ! do point in-circle? loop ;
: pi sim 4 in-circle @ * . ;           \ run a simulation

( don't divide by area of square because we want all digits)

1000000 pi

