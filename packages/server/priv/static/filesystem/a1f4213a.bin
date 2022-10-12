\ 4tH library - LCG randomizers - Copyright 2017, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] random [IF]
[UNDEFINED] +UL    [IF] include lib/constant.4th [THEN] [HEX]
defer random                          \ link your own randomizer
variable seed                         \ seed variable
0 value max-rand                      \ maximum random number

FFFF          constant {16bit}        \ lower 16 bits
7FFFFFFF      constant {31bit}        \ lower 31 bits
{31bit} 2* 1+ constant {32bit}        \ lower 32 bits

: &max-rand swap dup to max-rand and dup ;  ( m n1 -- n2 n2)
: lcg2-z seed @ * + &max-rand seed ! ;      ( m b a -- n)
: lcg2-nz seed @ * &max-rand 0= if 1+ then dup seed ! ;
                                            ( m a -- n)
: randu   {31bit} 10003 lcg2-nz ;           \ System/360 SSP
: urn12   {31bit} 1AFD498D lcg2-nz ;        \ CUPL
: superduper   {32bit} 10DCD lcg2-nz ;
: derive  {32bit} 1 3B40E64D +UL lcg2-z ;   \ Derive
: bcpl    {32bit} 2AA01D31 7FF8A3ED lcg2-z ; \ BCPL
: turboc  {32bit} 1 15A4E35 lcg2-z ;        \ Turbo C++
: turbopascal  {32bit} 1 8088405 lcg2-z ;   \ Turbo Pascal
: ansic   {31bit} 3039 41C64E6D lcg2-z ;    \ ANSI-C, BSD
: apple   {32bit} 48C27395 lcg2-nz ;        \ SIMULA for BS 2000
: atari   {32bit} 1 3B40E62D +UL lcg2-z ;   \ Wil Baden / Atari ST
: ahrensdieter {32bit} 278DDE6D lcg2-nz ;   \ C-RAND
: apl     {31bit} 41a7 lcg2-nz ;            \ APL, IMLS, SwiftForth
: bspr    {31bit} 3b36ab7 lcg2-nz ;         \ Fishman, 1986
: epm     {31bit} bc8f lcg2-nz ;            \ Fishman, 1988
: stforth {16bit} 1b0f 7abd lcg2-z ;        \ Starting Forth
: tektronix    {32bit} 234567 107465 lcg2-z ; \ Paul Mennen, 1991
: randomize time seed ! ;                   ( -- )

[DECIMAL] [DEFINED] 4TH# [IF]
  hide {31bit}
  hide {32bit}
  hide &max-rand
[THEN]
[THEN]
