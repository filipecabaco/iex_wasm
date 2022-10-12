\ 4tH library - F**2 F10** 1/F - Copyright 2012, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Library for quickly scaling ANS FP numbers. F10** scales
\ from 1e0 up to 1e24 in 0-4 FP operations, or 1e49 in 0-5 FP operations for
\ 64 bit architectures.

[UNDEFINED] me>f  [IF]
[UNDEFINED] fswap [IF] [ABORT] [THEN]

[UNDEFINED] ZenFP [IF]
: u>f u>d d>f ;                        ( u -- f)  \ for speed!
[ELSE]                                 \ dummy definitions for Zen FP
aka s>f u>f
[THEN]

/cell 4 - constant (64bit)             \ largest integer 10^n supported
(64bit) [IF] 1000000000000000000 [ELSE] 1000000000 [THEN] constant (max-10**n)

: f**2 fdup f* ;                       ( f -- f')
: 1/f 1 u>f fswap f/ ;                 ( f -- 1/f)
                                       ( u1 -- u2)
create s10** 1 , 10 , 100 , 1000 , 10000 , 100000 ,    1000000 ,
           10000000 ,          100000000 ,          1000000000 ,
(64bit) [IF]
        10000000000 ,       100000000000 ,       1000000000000 ,
     10000000000000 ,    100000000000000 ,    1000000000000000 ,
  10000000000000000 , 100000000000000000 , 1000000000000000000 ,
[THEN]                                 \ integer powers of 10
here s10** - 1- constant (max-log10)   \ index of last table entry
:redo s10** cells + @c ;               \ get integer power of 10

create f10** 10 , 100 , 10000 , 100000000 ,
(64bit) [IF] 10000000000000000 , [THEN]
here f10** - constant (#10^2n)
                                       \ floating point powers of 10
:redo f10**                            ( u -- f)
  over (max-log10) > if                \ compute with floats
    (#10^2n) cells over + >r >r (max-log10) - >r
    (max-10**n) u>f begin              \ adjust exponent accordingly
      r'@ r"@ < while r@ while r@ 1 and
      if r'@ @c u>f f* then            \ get appropriate 10^n and multiply
      r> 2/ r> 1 cells + >r >r         \ shift exponent right and increment
    repeat rdrop rdrop rdrop           \ clear the return stack
  ;then drop s10** u>f                 \ compute 1e0 - 1e9 with integers
;
                                       \ positive or negative exponent
: (+-esign) 0< if f/ ;then f* ;        ( f1 f2 esign -- f3)
: dme>f >r d>f r@ abs f10** r> (+-esign) ;
                                       \ -max-d <= m <= max-d -24 <= e <= 24
[UNDEFINED] ZenFP [IF]                 \ -max-n <= m <= max-n -24 <= e <= 24
: me>f >r s>f r@ abs f10** r> (+-esign) ;
[ELSE]                                 \ mantisse / exponent format
[IGNORE] me>f                          \ native format of Zen float
[THEN]

[DEFINED] 4TH# [IF]
  hide (+-esign)
  hide (max-log10)
  hide (max-10**n)
  hide (#10^2n)
  hide (64bit)
[THEN]
[THEN]

\ 50 0 ?do i f10** f. cr loop depth . fdepth .

