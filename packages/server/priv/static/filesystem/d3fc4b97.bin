\ 4tH library - BITS - Copyright 2006,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] TOGGLE [IF]
[UNDEFINED] CELL-BITS [IF]
include lib/constant.4th
[THEN]

: >mask 1 swap lshift ;                ( n1 -- n2)
: toggle >mask xor ;                   ( n1 n2 -- n3)
: set >mask or ;                       ( n1 n2 -- n3)
: reset >mask invert and ;             ( n1 n2 -- n3)
: bit >mask and 0<> ;                  ( n1 n2 -- f)
: parity 0 cell-bits 0 do over i bit 1 and xor loop ;
: bitcount 0 swap begin dup while dup 1- and swap 1+ swap repeat drop ;
: distance xor bitcount ;              ( n1 n2 -- n3)

[DEFINED] 4TH# [IF]
  hide >mask
[THEN]
[THEN]
