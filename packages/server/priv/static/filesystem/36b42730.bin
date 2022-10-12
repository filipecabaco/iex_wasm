\ ==============================================================================

\            fwt - the fixed width types module in the ffl

\               Copyright (C) 2010  Dick van Oudheusden

\ This library is free software; you can redistribute it and/or
\ modify it under the terms of the GNU Lesser General Public
\ License as published by the Free Software Foundation; either
\ version 3 of the License, or (at your option) any later version.

\ This library is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
\ Lesser General Public License for more details.

\ You should have received a copy of the GNU Lesser General Public
\ License along with this library; if not, write to the Free
\ Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

\ ==============================================================================

\  $Date: 2007-12-09 07:23:15 $ $Revision: 1.6 $

\ ==============================================================================


[UNDEFINED] llroll [IF]
[UNDEFINED] nell   [IF] include lib/ncoding.4th [THEN]

( fwt = Fixed Width Types module )
( The fwt module implements types that have a fixed bit width. They are mainly )
( used in interfaces. The words are defined for 32- and 64-bit forth engines.  )

( Fixed width constants )

8 constant #bits/byte   ( -- n = Number of bits in a byte )

#bits/byte 1 chars *
  constant #bits/char   ( -- n = Number of bits in a char )

#bits/byte 1 nells *
  constant #bits/nell   ( -- n = Number of bits in a cell )

2 constant #bytes/word

4 constant #bytes/long


: n@!   ( x1 a-addr -- x2 = First fetch the contents x2 and then store value x1 )
  dup n@ -rot n!
;

: lroll   ( u1 u2 -- u3 = Rotate u1 u2 bits to the left )
  2dup lshift >r
  #bits/nell swap - rshift r>
  or
;

: rroll   ( u1 u2 -- u3 = Rotate u1 u2 bits to the right )
  2dup rshift >r
  #bits/nell swap - lshift r>
  or
;

( Fixed width store and fetch )

: w@         ( w-addr -- u = Fetch a word, 16 bit, zero extend )
  dup c@ swap char+ c@ 256 * +
;

: <w@        ( w-addr -- n = Fetch a word, 16 bit, sign extend )
  w@ dup [hex] 8000 [decimal] AND negate OR
;

: w!         ( n w-addr -- = Store a word, 16 bit )
  over 8 rshift over char+ c!
  c!
;

/nell 4 [=] [IF]
[IGNORE] u>l      ( u -- l = Convert a unsigned number to 32 bit number )
[ELSE]
: u>l  ( u -- l = Convert a unsigned number to 32 bit number )
  [hex] FFFFFFFF [decimal] AND
;
[THEN]

/nell 4 [=] [IF]
aka n@ l@         ( l-addr -- n = Fetch a long word, 32 bit, zero extend )
[ELSE]
: l@
  0 #bytes/long over do over i + c@ i 3 lshift lshift or loop nip
;
[THEN]

/nell 4 [=] [IF]
aka n@ <l@        ( l-addr -- n = Fetch a long word, 32 bit, sign extend )
[ELSE]
: <l@
  l@ dup [hex] 80000000 [decimal] AND negate OR
;
[THEN]

/nell 4 [=] [IF]
aka n! l!         ( n l-addr -- = Store a long word, 32 bit )
[ELSE]
: l!
  2dup c!
  char+
  over 8  rshift over c!
  char+
  over 16 rshift over c!
  char+
  swap 24 rshift swap c!
;
[THEN]

/nell 4 [=] [IF]
aka n+! l+!       ( l l-addr -- = Add l to l-addr )
[ELSE]
: l+!  ( l l-addr -- = Add l to l-addr )
  tuck l@ + swap l!
;
[THEN]

/nell 4 [=] [IF]
aka lroll llroll  ( l1 u2 -- l3 = Rotate l1 u2 bits to the left )
[ELSE]
: llroll  ( l1 u2 -- l3 = Rotate l1 u2 bits to the left )
  2dup lshift >r
  32 swap - rshift r>
  or
  u>l
;
[THEN]

/nell 4 [=] [IF]
aka rroll lrroll  ( l1 u2 -- l3 = Rotate l1 u2 bits to the right )
[ELSE]
: lrroll  ( l1 u2 -- l3 = Rotate l1 u2 bits to the left )
  2dup rshift >r
  32 swap - lshift r>
  or
  u>l
;
[THEN]

: l@!             ( l1 l-addr -- l2 = Fetch l2 from l-addr and then store l1 at l-addr )
  dup l@ -rot l!
;
[THEN]

\ ==============================================================================
