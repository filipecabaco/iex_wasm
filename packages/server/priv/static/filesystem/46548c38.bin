\ Copyright 2001, Kristopher D. Johnson
\ Copyright 2007, Hans Bezemer, 4tH version
\ FIBONACCI

: +fib ( n1 n2 -- n2 n1+n2 )
  swap over + ;

\ Print first N Fibonacci numbers
: fib ( n -- )
  0 1
  rot 0 do
    dup . +fib pause
  loop
  2drop ;

: fib-loop ( -- )
  begin 24 fib again ;

fib-loop