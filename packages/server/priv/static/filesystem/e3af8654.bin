\ 4tH library - Fixed width types (little endian) - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Inspired by gForth equivalents
\ ==============================

\ sw@       c-addr – n
\ n is the sign-extended 16-bit value stored at c_addr.

\ uw@       c-addr – u
\ u is the zero-extended 16-bit value stored at c_addr.

\ w!       w c-addr –
\ Store the bottom 16 bits of w at c_addr.

\ sl@       c-addr – n
\ n is the sign-extended 32-bit value stored at c_addr.

\ ul@       c-addr – u
\ u is the zero-extended 32-bit value stored at c_addr.

\ l!       w c-addr –
\ Store the bottom 32 bits of w at c_addr.

[HEX] [UNDEFINED] w! [IF]
2 constant /16bit
4 constant /32bit

: x! bounds do dup i c! 8 rshift loop drop ;
: x@ 0 tuck do over i + c@ i 3 lshift lshift or loop nip ;
                                       ( n1 n2 -- +n|-n)
: (+sign) over over > if -1 xor or ;then drop ;
: w! /16bit x! ;                       ( n a --)
: w@ /16bit x@ ;                       ( a -- +n)
: l! /32bit x! ;                       ( n a --)
: l@ /32bit x@ ;                       ( a -- +n)

: sw@ w@ 7FFF (+sign) ;                ( a -- n)
: sl@ l@ 7FFFFFFF (+sign) ;            ( a -- n)

aka w@ uw@                             ( a -- +n)
aka l@ ul@                             ( a -- +n)

[DECIMAL] [DEFINED] 4TH# [IF]
  hide (+sign)
[THEN]
[THEN]

