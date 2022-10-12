\ Taken from http://rosettacode.org

\ A Monte Carlo Simulation is a way of approximating the value of a function
\ where calculating the actual value is difficult or impossible. It uses
\ random sampling to define constraints on the value and then makes a sort of
\ "best guess."

\ A simple Monte Carlo Simulation can be used to calculate the value for PI.
\ If you had a circle and a square where the length of a side of the square
\ was the same as the diameter of the circle, the ratio of the area of the
\ circle to the area of the square would be PI/4. So, if you put this circle
\ inside the square and select many random points inside the square, the
\ number of points inside the circle divided by the number of points inside
\ the square and the circle would be approximately PI/4.

include lib/choose.4th

10000 value r

: hit? ( -- ? )
  r choose dup *
  r choose dup * +
  r dup * < ;

: sims ( n -- hits )
  0 swap 0 do hit? if 1+ then loop ;

1000 sims 4 * . cr
10000 sims 4 * . cr
100000 sims 4 * . cr
1000000 sims 4 * . cr
10000000 sims 4 * . cr
