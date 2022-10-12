\ 4tH - sum digits of a number - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This task is to take a Natural Number in a given Base and return the sum
\ of its digits.

\    1(10) sums to 1; 
\    1234(10) sums to 10; 
\    fe(16) sums to 29; 
\    f0e(16) sums to 29. 

: sum_int 0 begin over while swap base @ /mod swap rot + repeat nip ;

 2 base ! [binary]  11110  sum_int decimal [decimal] . cr
10 base ! [decimal] 12345  sum_int decimal [decimal] . cr
16 base ! [hex]     f0e    sum_int decimal [decimal] . cr