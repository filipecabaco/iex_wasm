\ ==============================================================================

\                  sh1 - the SHA-1 module in the ffl

\               Copyright (C) 2006  Dick van Oudheusden

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

\  $Date: 2007-12-09 07:23:17 $ $Revision: 1.12 $

\ ==============================================================================

[UNDEFINED] sh1-init [IF]
[UNDEFINED] llroll   [IF] include lib/fwt.4th      [THEN]
[UNDEFINED] +UL      [IF] include lib/constant.4th [THEN]
[UNDEFINED] dump     [IF] include lib/dump.4th     [THEN]
                                       \ only required on 32 bits platforms
nell 4 [=] [UNDEFINED] m* * [IF] include lib/mixed.4th [THEN]
                                       \ minimal 32 bits plaform required
nell 3 - [SIGN] 1 [=] 1 chars 1 [=] * [IF]

\ Based on the algorithms published in FIPS 180-1 and Wikipedia

( sh1 = SHA-1 module )
( The sh1 module implements the SHA-1 algorithm)

( Private constants )

80       constant sh1.w%            \ Size of work buffer in longs

16 #bytes/long * constant sh1.b%    \ Size of input buffer in chars
[hex]
5A827999     constant sh1.k0
6ED9EBA1     constant sh1.k1
0F1BBCDC +UL constant sh1.k2
4A62C1D6 +UL constant sh1.k3
[decimal]

( SHA-1 structure )

struct                       ( -- n = Get the required space for a sha1 variable )
  #bytes/long +field   sh1>h0
  #bytes/long +field   sh1>h1
  #bytes/long +field   sh1>h2
  #bytes/long +field   sh1>h3
  #bytes/long +field   sh1>h4
  sh1.w% #bytes/long * +field sh1>w
  sh1.b% +field sh1>b              \ input buffer with data
  nell +field  sh1>length          \ total length of processed data
end-struct /sh1


( SHA-1 variable creation, initialisation and destruction )

: sh1-init         ( sh1 -- = Initialise the sh1 )
  [hex]
  67452301     over sh1>h0 l!
  6FCDAB89 +UL over sh1>h1 l!
  18BADCFE +UL over sh1>h2 l!
  10325476     over sh1>h3 l!
  43D2E1F0 +UL over sh1>h4 l!
  [decimal]

  0 swap sh1>length n!
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

: sh1-w-bounds     ( u1 u2 sh1 -- a-addr1 a-addr2 = Bounds work buffer a-addr2..a-addr1 from offsets u2..u1 )
  sh1>w >r
  swap #bytes/long * r@ +
  swap #bytes/long * r> +
;

: sh1+rotate       ( e d c b a f k w -- d c b a t = Rotate the sha-1 state )
  + +                         \ t = f + k + w
  over u>l 5 llroll  +        \ t += a lroll 5
  >r swap u>l 30 llroll swap  \ b lroll 30
  >r >r rot r> r> rot r> +    \ rotate the state t += e
;
                   ( c-addr u sh1 -- n flag = Move characters from the string to the input buffer,)
: sh1-cmove        ( update the length, return length and full indication )
  2dup sh1>length n@ sh1.b% mod   \ index = sh1>length mod buf-size
  tuck + sh1.b% >= >r >r          \ full  = (index + str-len >= buf-size )
  swap sh1.b% r@ - min            \ copy-len = min(buf-size -- index, str-len)
  2dup swap sh1>length n+!        \ sh1>length += copy-len
  r> swap >r
  chars swap sh1>b + r@ cmove     \ copy(str->buf,copy-len)
  r> r>
;

: sh1-transform    ( sh1 -- = Transform 64 bytes of data )
  >r

  r@ sh1>b
  16 0 r@ sh1-w-bounds DO       \ Move chunk in work buffer
    dup sha@ I l!
    #bytes/long +
  #bytes/long +LOOP
  drop

  80 16 r@ sh1-w-bounds DO      \ Extend 16  words in work buffer to 80 words in work buffer
    I 3  #bytes/long * - l@
    I 8  #bytes/long * - l@ xor
    I 14 #bytes/long * - l@ xor
    I 16 #bytes/long * - l@ xor
      u>l 1 llroll 
    I l!
  #bytes/long +LOOP

  r@ sh1>h4 l@                  \ Initialise hash values
  r@ sh1>h3 l@  
  r@ sh1>h2 l@ 
  r@ sh1>h1 l@ 
  r@ sh1>h0 l@                  \ S: e d c b a

  20 0 r@ sh1-w-bounds DO      \ Transform 0..19
    >r >r
    over r@ invert and         \ S: e d c d&~b
    over r@ and or             \ S: e d c f = d & ~b | c & b
    r> swap r> swap            \ S: e d c b a f
    sh1.k0 I l@ sh1+rotate 
  #bytes/long +LOOP

  40 20 r@ sh1-w-bounds DO     \ Transform 20..39
    >r >r
    2dup xor                   \ S: e d c f = c ^ d
    r> tuck xor                \ S: e d c b f = b ^ c ^ d
    r> swap                    \ S: e d c b a f
    sh1.k1 I l@ sh1+rotate 
  #bytes/long +LOOP

  60 40 r@ sh1-w-bounds DO     \ Transform 40..59
    >r >r
    2dup over r@ and >r        \ S: e d c d    R : a b f = b & d
    and r> or                  \ S: e d c f = b & d | c & d
    over r@ and or             \ S: e d c f = b & d | c & d | b & c  
    r> swap r> swap            \ S: e d c b a f
    sh1.k2 I l@ sh1+rotate
  #bytes/long +LOOP

  80 60 r@ sh1-w-bounds DO     \ Transform 60..79
    >r >r
    2dup xor
    r> tuck xor
    r> swap 
    sh1.k3 I l@ sh1+rotate
  #bytes/long +LOOP

  r@ sh1>h0 l+!                 \ Add hash values to current results
  r@ sh1>h1 l+!
  r@ sh1>h2 l+!
  r@ sh1>h3 l+!
  r> sh1>h4 l+!
;

: sh1+pad      ( n c-addr -- = Pad the buffer c-addr starting from n )
  over chars +
  128 over c!                       \ Add 80h to buffer
  char+ 
  swap 1+ sh1.b% swap - chars  \ Pad remaining with zero's
  erase
;

nell 4 [=] [IF]
: sh1-length!  ( sh1 -- = Store the length as bit length in sha order )
  >r
  r@ sh1>length n@ #bits/char m*                              \ Calculate bit length

  sh1.b% 2 #bytes/long * - chars                             \ Index for bit length
  r> sh1>b +                                                 \ Buffer location for bit length

  tuck sha! #bytes/long + sha!                               \ Store the length
;
[ELSE]
: sh1-length!  ( sh1 -- = Store the length as bit length in sha order )
  >r
  r@ sh1>length n@ #bits/char *                              \ Calculate bit length

  dup u>l swap #bytes/long #bits/byte * rshift               \ Split in lsl msl

  sh1.b% 2 #bytes/long * - chars                             \ Index for bit length
  r> sh1>b +                                                 \ Buffer location for bit length

  tuck sha! #bytes/long + sha!                               \ Store the length
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

( SHA-1 words )

aka sh1-init sh1-reset        ( sh1 -- = Reset the SHA-1 state )

: sh1-update       ( c-addr u sh1 -- = Update the SHA-1 with more data c-addr u )
  >r
  BEGIN
    2dup r@ sh1-cmove
  WHILE
    r@ sh1-transform
    /string
  REPEAT
  r> 2drop 2drop
;

: sh1-finish       ( sh1 -- u1 u2 u3 u4 u5 = Finish the SHA-1 calculation, return the sha values )
  >r

  r@ sh1>length n@ sh1.b% mod               \ index = sh1>length mod buf-size

  dup sh1.b% 2 #bytes/long * - 1 chars - > IF
    r@ sh1>b sh1+pad                        \ If buffer is too full Then
    r@ sh1-transform                        \   Pad buffer and transform
    r@ sh1>b sh1.b% chars erase             \   Pad next buffer
  ELSE                                      \ Else
    r@ sh1>b sh1+pad                        \   Pad buffer
  THEN

  r@ sh1-length!

  r@ sh1-transform                          \ Transform last buffer

  r@ sh1>h0 l@
  r@ sh1>h1 l@
  r@ sh1>h2 l@
  r@ sh1>h3 l@
  r> sh1>h4 l@
;

: sh1+to-string    ( u1 u2 u3 u4 u5 -- c-addr u = Convert SHA-1 result to the string c-addr u, using the pictured output area )
  base @ >r hex
  <#  sha+#s sha+#s sha+#s sha+#s sha+#s 0 s>d #>
  r> base !
;

( Inspection )

: sh1-dump         ( sh1 -- = Dump the sh1 variable )
  >r
  ." sh1    : " r@ . cr
  ." result : " r@ sh1>h0 l@ r@ sh1>h1 l@ r@ sh1>h2 l@ r@ sh1>h3 l@ r@ sh1>h4 l@ sh1+to-string type cr
  ." length : " r@ sh1>length n@ . cr cr
  ." BUFFER" r@ sh1>b sh1.b% chars dump cr cr
  ." WORK" r> sh1>w sh1.w%  #bytes/long * dump cr
;

[DEFINED] 4TH# [IF]
  hide sh1.w%
  hide sh1.b%
  hide sh1.k0
  hide sh1.k1
  hide sh1.k2
  hide sh1.k3
  hide sh1>h0
  hide sh1>h1
  hide sh1>h2
  hide sh1>h3
  hide sh1>h4
  hide sh1>w
  hide sh1>b
  hide sh1>length
  hide sha!
  hide sha@
  hide sh1-w-bounds
  hide sh1+rotate
  hide sh1-cmove
  hide sh1-transform
  hide sh1+pad
  hide sh1-length!
  hide sha+#s
[THEN]

[ELSE] [ABORT]
[THEN]

[THEN]

\ ==============================================================================
