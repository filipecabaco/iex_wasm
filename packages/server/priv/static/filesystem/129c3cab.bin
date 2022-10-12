\ 4tH library - RANDOM - Copyright 1997 Wil Baden, 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ ANSI C rand() function as suggested by Brian W. Kernighan and
\ Dennis M. Ritchie in their book "The C programming language"
\ See also: http://members.cox.net/srice1/random/random4.html

\ BSD RANDOM produces a cycling sequence of only 2^31 possible states;
\ this is already too short to produce good random numbers. The big problem
\ with BSD RANDOM is that the low n bits' cycle sequence length is only 2^n.
\ (This problem happens because the modulus 2^31 is a power of two.) The worst
\ case, when n = 1, becomes obvious if one uses the low bit to flip a coin.
\ In general, the low bits from BSD RANDOM are much less random than the high
\ bits. This defect of BSD RANDOM is so famous that this implementation
\ ignores the lower 16 bits from RANDOM.

[UNDEFINED] random [IF]
[UNDEFINED] BSD-random [IF]
  [UNDEFINED] MS-random [IF]
    [PRAGMA] BSD-random               \ default BSD random
  [THEN]
[THEN]

variable seed                         \ seed variable
32767 constant max-rand               \ maximum random number
                                      ( -- n)
: (random) seed @ * + dup seed ! 16 rshift max-rand and ;
: BSDrandom 12345 1103515245 (random) ;
: MSrandom 2531011 214013 (random) ;  ( -- n)
: randomize time seed ! ;             ( -- )

[DEFINED] BSD-random [IF] aka BSDrandom random [THEN]
[DEFINED] MS-random  [IF] aka MSrandom  random [THEN]
[DEFINED] 4TH#       [IF] hide (random)        [THEN]
[THEN]
