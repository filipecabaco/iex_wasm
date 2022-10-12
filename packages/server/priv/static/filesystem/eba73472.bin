\ 4tH library - Sum divisors - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The sum of positive divisors function sigma1 for a real number x, is defined
\ as the sum of the xth powers of the positive divisors of n.

\ The aliquot sum s(n) of n is the sum of the proper divisors (that is, the
\ divisors excluding n itself and equals sigma1(n) − n; the aliquot sequence
\ of n is formed by repeatedly applying the aliquot sum function.

[UNDEFINED] sumdivisors [IF]
: (leastpow) swap dup >r begin over over mod 0= while r@ * repeat r> drop nip ;
                                       ( n1 n2 -- n3)
: sumdivisors                          ( n1 -- n2)
  1 swap 2 over (leastpow) rot over 1- * -rot 2/ /
                                       \ 2 is a special case
  3 >r begin                           \ check all odd numbers
    r@ dup * over <=
  while
    r@ over (leastpow) rot over 1- r@ 1- / * -rot r@ / / r> 2 + >r
  repeat r> drop                       \ drop the count

  dup 1 > if 1+ * else drop then       \ at this point it must be 1 or prime
;

: aliquotsum dup sumdivisors swap - ;  ( n1 .. n2)

[DEFINED] 4TH# [IF] hide (leastpow) [THEN]
[THEN]

\ 17 1 ?do i sumdivisors . loop