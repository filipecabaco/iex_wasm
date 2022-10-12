\ ==============================================================================

\                  sh2 - the SHA-256 module in the ffl

\               Copyright (C) 2007  Dick van Oudheusden

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

\  $Date: 2007-12-09 07:23:17 $ $Revision: 1.8 $

\ ==============================================================================


[UNDEFINED] sh2-init [IF]
[UNDEFINED] llroll   [IF] include lib/fwt.4th      [THEN]
[UNDEFINED] +UL      [IF] include lib/constant.4th [THEN]
[UNDEFINED] dump     [IF] include lib/dump.4th     [THEN]
                                       \ only required on 32 bits platforms
nell 4 [=] [UNDEFINED] m* * [IF] include lib/mixed.4th [THEN]
                                       \ minimal 32 bits plaform required
nell 3 - [SIGN] 1 [=] 1 chars 1 [=] * [IF]

\ Based on the algorithms published in FIPS 180-2 and Wikipedia

( sh2 = SHA-256 module )
( The sh2 module implements the SHA-256 algorithm)

( Private constants )

64 constant sh2.work%        \ Size of work buffer in longs
                             \ Size of input buffer in chars
16 #bytes/long * constant sh2.input%

[hex]
offset (sh2.k)
  98 c, 2F c, 8A c, 42 c, 91 c, 44 c, 37 c, 71 c,
  CF c, FB c, C0 c, B5 c, A5 c, DB c, B5 c, E9 c,
  5B c, C2 c, 56 c, 39 c, F1 c, 11 c, F1 c, 59 c,
  A4 c, 82 c, 3F c, 92 c, D5 c, 5E c, 1C c, AB c,
  98 c, AA c, 07 c, D8 c, 01 c, 5B c, 83 c, 12 c,
  BE c, 85 c, 31 c, 24 c, C3 c, 7D c, 0C c, 55 c,
  74 c, 5D c, BE c, 72 c, FE c, B1 c, DE c, 80 c,
  A7 c, 06 c, DC c, 9B c, 74 c, F1 c, 9B c, C1 c,
  C1 c, 69 c, 9B c, E4 c, 86 c, 47 c, BE c, EF c,
  C6 c, 9D c, C1 c, 0F c, CC c, A1 c, 0C c, 24 c,
  6F c, 2C c, E9 c, 2D c, AA c, 84 c, 74 c, 4A c,
  DC c, A9 c, B0 c, 5C c, DA c, 88 c, F9 c, 76 c,
  52 c, 51 c, 3E c, 98 c, 6D c, C6 c, 31 c, A8 c,
  C8 c, 27 c, 03 c, B0 c, C7 c, 7F c, 59 c, BF c,
  F3 c, 0B c, E0 c, C6 c, 47 c, 91 c, A7 c, D5 c,
  51 c, 63 c, CA c, 06 c, 67 c, 29 c, 29 c, 14 c,
  85 c, 0A c, B7 c, 27 c, 38 c, 21 c, 1B c, 2E c,
  FC c, 6D c, 2C c, 4D c, 13 c, 0D c, 38 c, 53 c,
  54 c, 73 c, 0A c, 65 c, BB c, 0A c, 6A c, 76 c,
  2E c, C9 c, C2 c, 81 c, 85 c, 2C c, 72 c, 92 c,
  A1 c, E8 c, BF c, A2 c, 4B c, 66 c, 1A c, A8 c,
  70 c, 8B c, 4B c, C2 c, A3 c, 51 c, 6C c, C7 c,
  19 c, E8 c, 92 c, D1 c, 24 c, 06 c, 99 c, D6 c,
  85 c, 35 c, 0E c, F4 c, 70 c, A0 c, 6A c, 10 c,
  16 c, C1 c, A4 c, 19 c, 08 c, 6C c, 37 c, 1E c,
  4C c, 77 c, 48 c, 27 c, B5 c, BC c, B0 c, 34 c,
  B3 c, 0C c, 1C c, 39 c, 4A c, AA c, D8 c, 4E c,
  4F c, CA c, 9C c, 5B c, F3 c, 6F c, 2E c, 68 c,
  EE c, 82 c, 8F c, 74 c, 6F c, 63 c, A5 c, 78 c,
  14 c, 78 c, C8 c, 84 c, 08 c, 02 c, C7 c, 8C c,
  FA c, FF c, BE c, 90 c, EB c, 6C c, 50 c, A4 c,
  F7 c, A3 c, F9 c, BE c, F2 c, 78 c, 71 c, C6 c,
[decimal]

: sh2.k 0 #bytes/long over do over i + (sh2.k) i 3 lshift lshift or loop nip ;

( SHA-256 structure )

struct                ( -- n = Get the required space for a sha2 variable )
  #bytes/long +field sh2>h0
  #bytes/long +field sh2>h1
  #bytes/long +field sh2>h2
  #bytes/long +field sh2>h3
  #bytes/long +field sh2>h4
  #bytes/long +field sh2>h5
  #bytes/long +field sh2>h6
  #bytes/long +field sh2>h7
  #bytes/long +field sh2>a
  #bytes/long +field sh2>b
  #bytes/long +field sh2>c
  #bytes/long +field sh2>d
  #bytes/long +field sh2>e
  #bytes/long +field sh2>f
  #bytes/long +field sh2>g
  #bytes/long +field sh2>h
  sh2.work% #bytes/long * +field sh2>work    \ work buffer
  sh2.input% +field sh2>input                \ input buffer with data
  nell +field sh2>length                     \ total length of processed data
end-struct /sh2

( SHA-256 variable creation, initialisation and cleanup )

: sh2-init   ( sh2 -- = Initialise the sh2 variable )
  [hex]
  6A09E667     over sh2>h0 l!
  3B67AE85 +UL over sh2>h1 l!
  3C6EF372     over sh2>h2 l!
  254FF53A +UL over sh2>h3 l!
  510E527F     over sh2>h4 l!
  1B05688C +UL over sh2>h5 l!
  1F83D9AB     over sh2>h6 l!
  5BE0CD19     over sh2>h7 l!
  [decimal]

  0 swap sh2>length n!
;

( Private words )

: sha!
        over 24 rshift 255 and over c!
  char+ over 16 rshift 255 and over c!
  char+ over 8  rshift 255 and over c!
  char+ swap           255 and swap c!
;

: sha@
  dup                  c@ 24 lshift 
  swap char+ swap over c@ 16 lshift or
  swap char+ swap over c@  8 lshift or
  swap char+           c@           or
;

: sh2-cmove   ( c-addr u sh2 -- n flag = Move characters from the string to the input buffer, update the length, return length and full indication )
  2dup sh2>length n@ sh2.input% mod    \ index = sh2>length mod buf-size
  tuck + sh2.input% >= >r >r           \ full  = (index + str-len >= buf-size )
  swap sh2.input% r@ - min             \ copy-len = min(buf-size - index, str-len)
  2dup swap sh2>length n+!             \ sh2>length += copy-len
  r> swap >r
  chars swap sh2>input + r@ cmove      \ copy(str->buf,copy-len)
  r> r>
;

: sh2-transform   ( sh2 -- = Transform 64 bytes of data )
  >r

  r@ sh2>work
  r@ sh2>input 16 #bytes/long * bounds DO   \ Move input (bigendian) in work buffer
    I sha@ over l!
    #bytes/long +
  #bytes/long +LOOP                         \ S: sh2>work + 16 longs

  48 #bytes/long * bounds DO                \ Extend 16 words in work buffer to 64 words in work buffer
    I 16 #bytes/long * - l@                 \ w[i] = w[i-16] + ..
    I 15 #bytes/long * - l@
    dup   7 lrroll
    over 18 lrroll xor
    swap 3  rshift xor +                    \ .. + (w[i-15] rotr 7) xor (w[i-15] rotr 18) xor (w[i-15] rshift 3) + ..
    I 7  #bytes/long * - l@ +               \ .. + w[i-7] + ..
    I 2  #bytes/long * - l@
    dup  17 lrroll
    over 19 lrroll xor
    swap 10 rshift xor +                    \ .. + (w[i-2] rotr 17) xor (w[i-2] rotr 19) xor (w[i-2] rshift 10)
    I l!
  #bytes/long +LOOP

  r@ sh2>h0 r@ sh2>a
  8 #bytes/long * move                      \ Initialise hash values: h0..h7 -> a..h

  r>
  sh2.work% #bytes/long * 0 DO
    I sh2.k                                 \ k[i] + ..
    over sh2>work I + l@ +                  \ .. + w[i] + ..
    over sh2>h l@ +                         \ w[i] + k[i] + h

    swap >r                                 \ done with I, save sh2

    r@ sh2>e l@                             \ s1 = (e rotr 6) xor (e rotr 11) xor (e rotr 25)
    dup   6 lrroll
    over 11 lrroll xor
    over 25 lrroll xor

    swap                                    \ ch = (e and f) xor ((not e) and g)
    dup r@ sh2>f l@ and
    swap invert r@ sh2>g l@ and xor
    + +                                     \ t1 = w[i] + k[i] + h + s1 + ch

    r@ sh2>a l@                             \ s0 = (a rotr 2) xor (a rotr 12) xor (a rotr 22)
    dup   2 lrroll
    over 13 lrroll xor
    over 22 lrroll xor
    swap

    r@ sh2>b l@                             \ maj = (a and b) xor (a and c) xor (b and c)
    2dup
    r@ sh2>c l@
    tuck
    and >r and >r and r> xor r> xor
    +                                       \ t2 = s0 + maj

    over + r@ sh2>a
    tuck l@! swap #bytes/long +             \ a = t1 + t2
    tuck l@! swap #bytes/long +             \ b = a
    tuck l@! swap #bytes/long +             \ c = b
    tuck l@! rot + swap #bytes/long +       \ d = c
    tuck l@! swap #bytes/long +             \ e = d + t1
    tuck l@! swap #bytes/long +             \ f = e
    tuck l@! swap #bytes/long +             \ g = f
    l!                                      \ h = g

    r>
  #bytes/long +LOOP

  dup sh2>h0
  swap sh2>a 8 #bytes/long * bounds DO     \ Add hash values to current results
    I l@ over l+!
    #bytes/long +
  #bytes/long +LOOP
  drop
;

: sh2+pad   ( n c-addr -- = Pad the buffer c-addr, starting from index n )
  over chars +
  128 over c!                       \ Add 80h to buffer
  char+ 
  swap 1+ sh2.input% swap - chars   \ Pad remaining with zero's
  erase
;

nell 4 [=] [IF]
: sh2-length!  ( sh2 -- = Store the length as bit length in sha order )
  >r
  r@ sh2>length n@ #bits/char m*                    \ Calculate bit length

  sh2.input% 2 #bytes/long * - chars                \ Index for bit length
  r> sh2>input +                                    \ Buffer location for bit length

  tuck sha! #bytes/long + sha!                      \ Store the length
;
[ELSE]
: sh2-length!  ( sh2 -- = Store the length as bit length in sha order )
  >r
  r@ sh2>length n@ #bits/char *                     \ Calculate bit length

  dup u>l swap #bytes/long #bits/byte * rshift      \ Split in lsl msl

  sh2.input% 2 #bytes/long * - chars                \ Index for bit length
  r> sh2>input +                                    \ Buffer location for bit length

  tuck sha! #bytes/long + sha!                      \ Store the length
;
[THEN]

[hex]
: sha+#s       ( u -- Put a single SHA result in the hold area )
  dup           FF and s>d # # drop
  dup  8 rshift FF and s>d # # drop
  dup 10 rshift FF and s>d # # drop
      18 rshift FF and s>d # # drop
;
[decimal]

( SHA-256 words )

aka sh2-init sh2-reset   ( sh2 -- = Reset the SHA-256 state )

: sh2-update   ( c-addr u sh2 -- = Update the SHA-256 with more data c-addr u )
  >r
  BEGIN
    2dup r@ sh2-cmove
  WHILE
    r@ sh2-transform
    /string
  REPEAT
  r> 2drop 2drop
;

: sh2-finish   ( sh2 -- u1 u2 u3 u4 u5 u6 u7 u8 = Finish the SHA-256 calculation, return the result )
  >r

  r@ sh2>length n@ sh2.input% mod           \ index = sh2>length mod buf-size

  dup sh2.input% 2 #bytes/long * - 1 chars - > IF
    r@ sh2>input sh2+pad                    \ If buffer is too full Then
    r@ sh2-transform                        \   Pad buffer and transform
    r@ sh2>input sh2.input% chars erase     \   Pad next buffer
  ELSE                                      \ Else
    r@ sh2>input sh2+pad                    \   Pad buffer
  THEN

  r@ sh2-length!

  r@ sh2-transform                          \ Transform last buffer

  r@ sh2>h0 l@
  r@ sh2>h1 l@
  r@ sh2>h2 l@
  r@ sh2>h3 l@
  r@ sh2>h4 l@
  r@ sh2>h5 l@
  r@ sh2>h6 l@
  r> sh2>h7 l@
;

: sh2+to-string   ( u1 u2 u3 u4 u5 u6 u7 u8 -- c-addr u = Convert SHA-256 result)
  base @ >r hex   ( to the string c-addr u, using the pictured output area )
  <#  sha+#s sha+#s sha+#s sha+#s sha+#s sha+#s sha+#s sha+#s 0 s>d #>
  r> base !
;

( Inspection )

: sh2-dump   ( sh2 -- = Dump the sh2 variable )
  >r
  ." sha256 : " r@ . cr
  ." result : " r@ sh2>h0 l@ r@ sh2>h1 l@ r@ sh2>h2 l@ r@ sh2>h3 l@ r@ sh2>h4 l@ r@ sh2>h5 l@ r@ sh2>h6 l@ r@ sh2>h7 l@
                 sh2+to-string type cr
  ." length : " r@ sh2>length n@ . cr cr
  ." BUFFER" r@ sh2>input sh2.input% chars dump cr cr
  ." WORK" r> sh2>work sh2.work% #bytes/long * dump cr
;

[DEFINED] 4TH# [IF]
  hide sh2.work%
  hide sh2.input%
  hide (sh2.k)
  hide sh2.k
  hide sh2>h0
  hide sh2>h1
  hide sh2>h2
  hide sh2>h3
  hide sh2>h4
  hide sh2>h5
  hide sh2>h6
  hide sh2>h7
  hide sh2>a
  hide sh2>b
  hide sh2>c
  hide sh2>d
  hide sh2>e
  hide sh2>f
  hide sh2>g
  hide sh2>h
  hide sh2>work
  hide sh2>input
  hide sh2>length
  hide sha!
  hide sha@
  hide sh2-cmove
  hide sh2-transform
  hide sh2+pad
  hide sh2-length!
  hide sha+#s
[THEN]

[ELSE] [ABORT]
[THEN]

[THEN]

\ ==============================================================================
