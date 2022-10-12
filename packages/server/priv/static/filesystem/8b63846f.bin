\ 4tH library - ZX Spectrum randomizer - Copyright 2013,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This is an exact replica of the ZX Spectrum randomizer, which uses a Lehmer
\ random number generator. Issue: "RANDOMIZE 1 : PRINT RND" and you will get
\ exactly the same sequence.

[UNDEFINED] randomize [IF]
[UNDEFINED] f/ [IF] [ABORT] [THEN]
1 value (seed)

: randomize to (seed) ;
: random (seed) 1+ 75 * 1- 65537 mod dup randomize s>f 65536 s>f f/ ;

[DEFINED] 4TH# [IF]
  hide (seed)
[THEN]
[THEN]