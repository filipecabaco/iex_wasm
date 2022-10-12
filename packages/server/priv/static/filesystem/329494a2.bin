\ ==============================================================================

\          sh1_test - the test words for the sh1 module in the ffl

\               Copyright (C) 2006  Dick van Oudheusden

\ This library is free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public
\ License as published by the Free Software Foundation; either
\ version 2 of the License, or (at your option) any later version.

\ This library is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
\ General Public License for more details.

\ You should have received a copy of the GNU General Public
\ License along with this library; if not, write to the Free
\ Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

\ ==============================================================================

\  $Date: 2007-12-24 19:32:12 $ $Revision: 1.5 $

\ ==============================================================================

include lib/sha1.4th
include lib/tst.4th
include lib/memchar.4th

[DEFINED] sh1-init [IF]

.( Testing: sh1) cr

                                       ( -- sha1 = Create a new SHA1 variable on the heap )
: sh1-new /sh1 allocate throw dup sh1-init ;
: sh1-free free throw ;                ( sha1 -- = Free the SHA1 variable from the heap )

/sh1 buffer: sh11 latest sh1-init

[hex]

t{ s" abc" sh11 sh1-update }t

t{ sh11 sh1-finish 1CD0D89D +UL ?u 7850C26C ?u 3A3E2571 +UL ?u 4706816A ?u 29993E36 +UL ?u }t

t{ sh11 sh1-reset }t

t{ s" abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq" sh11 sh1-update }t

t{ sh11 sh1-finish 654670F1 +UL ?u 795129E5 +UL ?u 3AAE4AA1 +UL ?u 1C3BD26E ?u 04983E44 +UL ?u }t

t{ sh1-new value sh12 }t

[decimal]

: sh1-test
  50000 0 DO
    s" aaaaaaaaaaaaaaaaaaaa" sh12 sh1-update
  LOOP
;

sh1-test  \ a million times "a", see test vectors

t{ sh12 sh1-finish sh1+to-string s" 34AA973CD4C4DAA4F61EEB2BDBAD27316534016F" ?str }t

t{ sh12 sh1-free }t

[THEN]

\ ==============================================================================

