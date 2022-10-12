\ ==============================================================================

\          sh2_test - the test words for the sh2 module in the ffl

\               Copyright (C) 2007  Dick van Oudheusden

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

\  $Date: 2007-12-24 19:32:12 $ $Revision: 1.2 $

\ ==============================================================================

include lib/sha256.4th
include lib/tst.4th
include lib/memchar.4th

[DEFINED] sh2-init [IF]

.( Testing: sh2) cr
                                       ( -- sha2 = Create a new SHA2 variable on the heap )
: sh2-new /sh2 allocate throw dup sh2-init ;
: sh2-free free throw ;                ( sha2 -- = Free the SHA2 variable from the heap )

/sh2 buffer: sh21 latest sh2-init

[hex]

t{ pad 0 sh21 sh2-update }t    \ see test vectors 1-0

t{ sh21 sh2-finish 7852B855 ?u 2495991B +UL ?u 649B934C ?u 27AE41E4 ?u
                   196FB924 +UL ?u 1AFBF4C8 +UL ?u 18FC1C14 +UL ?u 63B0C442 +UL ?u }t


t{ sh21 sh2-reset }t

t{ s" abc" sh21 sh2-update }t    \ see test vectors 1-2

t{ sh21 sh2-finish 720015AD +UL ?u 3410FF61 +UL ?u 16177A9C +UL ?u 300361A3 +UL ?u
                   5DAE2223 ?u 414140DE ?u 0F01CFEA +UL ?u 3A7816BF +UL ?u }t


t{ sh2-new value sh22 }t   \ see test vector 1-5

t{ s" abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq" sh22 sh2-update }t

t{ sh22 sh2-finish 19DB06C1 ?u 76ECEDD4 +UL ?u 64FF2167 ?u 233CE459 +UL ?u
                   0C3E6039 ?u 65C02693 +UL ?u 520638B8 +UL ?u 248D6A61 ?u }t

[decimal]

: sh2-test
  31250 0 DO
    s" aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" sh22 sh2-update
  LOOP
;

t{ sh22 sh2-reset }t

sh2-test                 \ million times "a", see test vectors 1-8

t{ sh22 sh2-finish sh2+to-string s" CDC76E5C9914FB9281A1C7E284D73E67F1809A48A497200E046D39CCC7112CD0" ?str }t

t{ sh22 sh2-free }t

[THEN]

\ ==============================================================================