\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

\ A zig-zag array is a square arrangement of the first N2 integers, where the
\ numbers increase sequentially as you zig-zag along the anti-diagonals of the
\ array.

0 value diag

256 array temp

: south  diag abs + cell+ ;
: east cell+ ;

' east  value zig
' south value zag

: init ( n -- )
  1- cells negate to diag
  ['] east  to zig
  ['] south to zag ;

: swap-diag   zig zag to zig to zag ;

: put ( n addr -- n+1 addr )
  2dup !  swap 1+ swap ;

: turn ( addr -- addr+E/S )
  zig execute  swap-diag
  diag negate to diag ;

: zigzag ( matrix n -- )
  dup >r init
  0 swap
  r@ 1 ?do
    put turn
    i 0 do put diag + loop
  loop
  swap-diag
  r@ -rot r> 1 ?do
    put turn
    >r over r> swap i 1+
    ?do put diag + loop
  loop
  ! drop ;

: .matrix ( n matrix -- )
  over 0 do
    over 0 do
      dup @ 3 .r cell+
    loop cr
  loop 2drop ;

: test ( n -- ) temp over zigzag temp .matrix ;

5 test