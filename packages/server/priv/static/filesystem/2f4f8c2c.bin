\ 4tH library - Forward difference - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ A finite difference is a mathematical expression of the form
\ f(x + b) − f(x + a). If a finite difference is divided by b − a,
\ one gets a difference quotient. The approximation of derivatives
\ by finite differences plays a central role in finite difference
\ methods for the numerical solution of differential equations,
\ especially boundary value problems.

[UNDEFINED] forward-difference [IF]
[UNDEFINED] floats             [IF] [ABORT] [THEN]

: forward-difference
  dup 0
  ?do
     swap rot over i 1+ - 0
     ?do dup i floats + dup >r float+ f@ r@ f@ f- r> f! loop
     swap rot
  loop -
;
[THEN]

\ create a 90 , 47 , 58 , 29 , 22 , 32 , 55 , 5 , 55 , 73 ,
\ a 10 9 forward-difference bounds ?do i ? loop => -2921
