\ Japanese multiplication - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This implementation works for numbers up to 99 as illustrated by
\ https://www.youtube.com/watch?v=VJf8XAhC550#t=236

\ Method description:
\ ===================
\ ab * cd                              (e.g. 23 * 13)

\ 1st digit = b*d % 10                 (rightmost digit)
\ 2nd digit = ((a*d+b*c) + (b*d / 10)) % 10
\ 3rd digit = a*c + ((a*d+b*c) + (b*d / 10)) / 10

\ ab*cd = (3rd * 100) + (2nd * 10) + 1st

: j*                                   ( n1 n2 -- n1*n2)
  10 /mod rot 10 /mod rot 2dup * >r 2swap 2dup * >r rot *
  >r * r> + r> 10 /mod rot + 10 /mod r> + 100 * swap 10 * + +
;

34 56 j* . cr