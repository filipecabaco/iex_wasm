\ 4tH library - MRG32k3a PRNG - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This is a 32-bit combined multiple recursive generator with two components
\ of order 3.

\ MRG32k3a combined generator meets the requirements for modern RNGs,
\ such as good multidimensional uniformity, or a long period. Optimization
\ for various architectures makes it competitive with the other VS BRNGSs
\ in terms of speed.

[UNDEFINED] random [IF]
[UNDEFINED] +UL    [IF] include lib/constant.4th [THEN]
[HEX] 7FFFFFFF +UL constant MAX-RAND [DECIMAL]

6 array (seed)                         \ holds the seed
6 array (gens)                         \ holds the generators
                                       \ set up constants
       0 (gens) 0 th !                 \ 1st generator
 1403580 (gens) 1 th !
 -810728 (gens) 2 th !
  527612 (gens) 3 th !                 \ 2nd generator
       0 (gens) 4 th !
-1370589 (gens) 5 th !

1 32 lshift   209 - value (m)          \ 1st generator constant
1 32 lshift 22853 - value (n)          \ 2nd generator constant
                                       ( n1 n2 -- n3)
: (mod) tuck mod tuck 0< if abs + ;then drop ;
: (generate) do (seed) i th @ (gens) i th @ * + loop swap (mod) ;
: (reseed) ?do (seed) i th ! loop ;    ( n1 n2 n3 limit index --)
: randomize! 6 0 do dup i 3 mod if >zero then (seed) i th ! loop drop ;
: randomize time randomize! ;
                                       ( n --)
: random                               ( -- n)
  (m) 0 3 0 (generate) (n) 0 6 3 (generate) over over
  (seed) 4 th @ (seed) 3 th @ rot 6 3 (reseed)
  (seed) 1 th @ (seed) 0 th @ rot 3 0 (reseed) - (m) (mod) 1+
;

[DEFINED] 4TH# [IF]
  hide (seed)
  hide (gens)
  hide (m)
  hide (n)
  hide (mod)
  hide (generate)
  hide (reseed)
[THEN]
[THEN]

