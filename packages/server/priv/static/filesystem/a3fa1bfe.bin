\ ==============================================================================

\                  md5 - the MD5 algorithm in the ffl

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

\  $Date: 2007-12-09 07:23:16 $ $Revision: 1.14 $

\ ==============================================================================


\ This module uses ideas and code from Fedrick Warren, Marcel Hendrix and Ulrich Hoffmann


[UNDEFINED] md5-init [IF]
[UNDEFINED] llroll   [IF] include lib/fwt.4th      [THEN]
[UNDEFINED] +UL      [IF] include lib/constant.4th [THEN]
[UNDEFINED] dump     [IF] include lib/dump.4th     [THEN]
                                       \ only required on 32 bits platforms
nell 4 [=] [UNDEFINED] m* * [IF] include lib/mixed.4th [THEN]
                                       \ minimal 32 bits plaform required
nell 3 - [SIGN] 1 [=] 1 chars 1 [=] * [IF]

( md5 = MD5 Message Digest Algorithm )
( The md5 module implements the MD5 algorithm.)

( Private constants )

16 constant md5.long-size   ( -- n = Size of buffer in longs )
64 constant md5.byte-size   ( -- n = Size of buffer in bytes )

( MD5 Structure )

struct                      ( -- n = Get the required space for a md5 variable )
  #bytes/long +field  md5>a
  #bytes/long +field  md5>b
  #bytes/long +field  md5>c
  #bytes/long +field  md5>d
  md5.long-size #bytes/long * +field md5>buffer
  nell +field  md5>length
end-struct /md5


( Private words )

\ MD5 Transform constants
7  constant md5.s11
12 constant md5.s12
17 constant md5.s13
22 constant md5.s14
5  constant md5.s21
9  constant md5.s22
14 constant md5.s23
20 constant md5.s24
4  constant md5.s31
11 constant md5.s32
16 constant md5.s33
23 constant md5.s34
6  constant md5.s41
10 constant md5.s42
15 constant md5.s43
21 constant md5.s44

: md5+f            ( x y z -- r = basic MD5 F function )
  invert and or + +
;

: md5+g            ( x y z  -- r = basic MD5 G function )
  invert and or + +
;

: md5+h            ( x y z -- r = basic MD5 H function )
  xor xor + +
;

: md5+i            ( x y z  -- r = basic MD5 I function )
  invert or xor + +
;

0 value md5.a        ( -- a = MD5 variable local a )
0 value md5.b        ( -- b = MD5 variable local b )
0 value md5.c        ( -- c = MD5 variable local c )
0 value md5.d        ( -- d = MD5 variable local d )
0 value md5.buf      ( -- addr = Current MD5 buffer )

#bytes/long 2* buffer: md5.length    ( -- addr = MD5 length in bits )

md5.long-size #bytes/long * buffer: md5.pad ( -- addr = MD5 padding )
md5.pad md5.long-size #bytes/long * erase
128 md5.pad c!

: md5+buf@+        ( u n -- u+buf[n] = Fetch and add with MD5 buffer )
  #bytes/long * md5.buf + l@ +
;

aka l! md5!

[hex]
: md5+round1
  576AA478 +UL 00 md5+buf@+ md5.a  md5.b md5.c AND md5.d md5.b md5+f u>l md5.s11 llroll  md5.b + TO md5.a
  68C7B756 +UL 01 md5+buf@+ md5.d  md5.a md5.b AND md5.c md5.a md5+f u>l md5.s12 llroll  md5.a + TO md5.d
  242070DB     02 md5+buf@+ md5.c  md5.d md5.a AND md5.b md5.d md5+f u>l md5.s13 llroll  md5.d + TO md5.c
  41BDCEEE +UL 03 md5+buf@+ md5.b  md5.c md5.d AND md5.a md5.c md5+f u>l md5.s14 llroll  md5.c + TO md5.b
  757C0FAF +UL 04 md5+buf@+ md5.a  md5.b md5.c AND md5.d md5.b md5+f u>l md5.s11 llroll  md5.b + TO md5.a
  4787C62A     05 md5+buf@+ md5.d  md5.a md5.b AND md5.c md5.a md5+f u>l md5.s12 llroll  md5.a + TO md5.d
  28304613 +UL 06 md5+buf@+ md5.c  md5.d md5.a AND md5.b md5.d md5+f u>l md5.s13 llroll  md5.d + TO md5.c
  7D469501 +UL 07 md5+buf@+ md5.b  md5.c md5.d AND md5.a md5.c md5+f u>l md5.s14 llroll  md5.c + TO md5.b
  698098D8     08 md5+buf@+ md5.a  md5.b md5.c AND md5.d md5.b md5+f u>l md5.s11 llroll  md5.b + TO md5.a 
  0B44F7AF +UL 09 md5+buf@+ md5.d  md5.a md5.b AND md5.c md5.a md5+f u>l md5.s12 llroll  md5.a + TO md5.d
  7FFF5BB1 +UL 0A md5+buf@+ md5.c  md5.d md5.a AND md5.b md5.d md5+f u>l md5.s13 llroll  md5.d + TO md5.c
  095CD7BE +UL 0B md5+buf@+ md5.b  md5.c md5.d AND md5.a md5.c md5+f u>l md5.s14 llroll  md5.c + TO md5.b
  6B901122     0C md5+buf@+ md5.a  md5.b md5.c AND md5.d md5.b md5+f u>l md5.s11 llroll  md5.b + TO md5.a
  7D987193 +UL 0D md5+buf@+ md5.d  md5.a md5.b AND md5.c md5.a md5+f u>l md5.s12 llroll  md5.a + TO md5.d
  2679438E +UL 0E md5+buf@+ md5.c  md5.d md5.a AND md5.b md5.d md5+f u>l md5.s13 llroll  md5.d + TO md5.c
  49B40821     0F md5+buf@+ md5.b  md5.c md5.d AND md5.a md5.c md5+f u>l md5.s14 llroll  md5.c + TO md5.b 
;

: md5+round2
  761E2562 +UL 01 md5+buf@+ md5.a  md5.b md5.d AND md5.c md5.d md5+g u>l md5.s21 llroll  md5.b + TO md5.a
  4040B340 +UL 06 md5+buf@+ md5.d  md5.a md5.c AND md5.b md5.c md5+g u>l md5.s22 llroll  md5.a + TO md5.d
  265E5A51     0B md5+buf@+ md5.c  md5.d md5.b AND md5.a md5.b md5+g u>l md5.s23 llroll  md5.d + TO md5.c
  69B6C7AA +UL 00 md5+buf@+ md5.b  md5.c md5.a AND md5.d md5.a md5+g u>l md5.s24 llroll  md5.c + TO md5.b
  562F105D +UL 05 md5+buf@+ md5.a  md5.b md5.d AND md5.c md5.d md5+g u>l md5.s21 llroll  md5.b + TO md5.a
  02441453     0A md5+buf@+ md5.d  md5.a md5.c AND md5.b md5.c md5+g u>l md5.s22 llroll  md5.a + TO md5.d
  58A1E681 +UL 0F md5+buf@+ md5.c  md5.d md5.b AND md5.a md5.b md5+g u>l md5.s23 llroll  md5.d + TO md5.c
  67D3FBC8 +UL 04 md5+buf@+ md5.b  md5.c md5.a AND md5.d md5.a md5+g u>l md5.s24 llroll  md5.c + TO md5.b
  21E1CDE6     09 md5+buf@+ md5.a  md5.b md5.d AND md5.c md5.d md5+g u>l md5.s21 llroll  md5.b + TO md5.a
  433707D6 +UL 0E md5+buf@+ md5.d  md5.a md5.c AND md5.b md5.c md5+g u>l md5.s22 llroll  md5.a + TO md5.d
  74D50D87 +UL 03 md5+buf@+ md5.c  md5.d md5.b AND md5.a md5.b md5+g u>l md5.s23 llroll  md5.d + TO md5.c
  455A14ED     08 md5+buf@+ md5.b  md5.c md5.a AND md5.d md5.a md5+g u>l md5.s24 llroll  md5.c + TO md5.b
  29E3E905 +UL 0D md5+buf@+ md5.a  md5.b md5.d AND md5.c md5.d md5+g u>l md5.s21 llroll  md5.b + TO md5.a
  7CEFA3F8 +UL 02 md5+buf@+ md5.d  md5.a md5.c AND md5.b md5.c md5+g u>l md5.s22 llroll  md5.a + TO md5.d
  676F02D9     07 md5+buf@+ md5.c  md5.d md5.b AND md5.a md5.b md5+g u>l md5.s23 llroll  md5.d + TO md5.c
  0D2A4C8A +UL 0C md5+buf@+ md5.b  md5.c md5.a AND md5.d md5.a md5+g u>l md5.s24 llroll  md5.c + TO md5.b
;

: md5+round3
  7FFA3942 +UL 05 md5+buf@+ md5.a  md5.b md5.c md5.d md5+h u>l md5.s31 llroll  md5.b + TO md5.a
  0771F681 +UL 08 md5+buf@+ md5.d  md5.a md5.b md5.c md5+h u>l md5.s32 llroll  md5.a + TO md5.d
  6D9D6122     0B md5+buf@+ md5.c  md5.d md5.a md5.b md5+h u>l md5.s33 llroll  md5.d + TO md5.c
  7DE5380C +UL 0E md5+buf@+ md5.b  md5.c md5.d md5.a md5+h u>l md5.s34 llroll  md5.c + TO md5.b
  24BEEA44 +UL 01 md5+buf@+ md5.a  md5.b md5.c md5.d md5+h u>l md5.s31 llroll  md5.b + TO md5.a
  4BDECFA9     04 md5+buf@+ md5.d  md5.a md5.b md5.c md5+h u>l md5.s32 llroll  md5.a + TO md5.d
  76BB4B60 +UL 07 md5+buf@+ md5.c  md5.d md5.a md5.b md5+h u>l md5.s33 llroll  md5.d + TO md5.c
  3EBFBC70 +UL 0A md5+buf@+ md5.b  md5.c md5.d md5.a md5+h u>l md5.s34 llroll  md5.c + TO md5.b
  289B7EC6     0D md5+buf@+ md5.a  md5.b md5.c md5.d md5+h u>l md5.s31 llroll  md5.b + TO md5.a
  6AA127FA +UL 00 md5+buf@+ md5.d  md5.a md5.b md5.c md5+h u>l md5.s32 llroll  md5.a + TO md5.d
  54EF3085 +UL 03 md5+buf@+ md5.c  md5.d md5.a md5.b md5+h u>l md5.s33 llroll  md5.d + TO md5.c
  04881D05     06 md5+buf@+ md5.b  md5.c md5.d md5.a md5+h u>l md5.s34 llroll  md5.c + TO md5.b
  59D4D039 +UL 09 md5+buf@+ md5.a  md5.b md5.c md5.d md5+h u>l md5.s31 llroll  md5.b + TO md5.a
  66DB99E5 +UL 0C md5+buf@+ md5.d  md5.a md5.b md5.c md5+h u>l md5.s32 llroll  md5.a + TO md5.d
  1FA27CF8     0F md5+buf@+ md5.c  md5.d md5.a md5.b md5+h u>l md5.s33 llroll  md5.d + TO md5.c
  44AC5665 +UL 02 md5+buf@+ md5.b  md5.c md5.d md5.a md5+h u>l md5.s34 llroll  md5.c + TO md5.b
;

: md5+round4
  74292244 +UL 00 md5+buf@+ md5.a  md5.c md5.b md5.d md5+i u>l md5.s41 llroll  md5.b + TO md5.a
  432AFF97     07 md5+buf@+ md5.d  md5.b md5.a md5.c md5+i u>l md5.s42 llroll  md5.a + TO md5.d
  2B9423A7 +UL 0E md5+buf@+ md5.c  md5.a md5.d md5.b md5+i u>l md5.s43 llroll  md5.d + TO md5.c
  7C93A039 +UL 05 md5+buf@+ md5.b  md5.d md5.c md5.a md5+i u>l md5.s44 llroll  md5.c + TO md5.b
  655B59C3     0C md5+buf@+ md5.a  md5.c md5.b md5.d md5+i u>l md5.s41 llroll  md5.b + TO md5.a
  0F0CCC92 +UL 03 md5+buf@+ md5.d  md5.b md5.a md5.c md5+i u>l md5.s42 llroll  md5.a + TO md5.d
  7FEFF47D +UL 0A md5+buf@+ md5.c  md5.a md5.d md5.b md5+i u>l md5.s43 llroll  md5.d + TO md5.c
  05845DD1 +UL 01 md5+buf@+ md5.b  md5.d md5.c md5.a md5+i u>l md5.s44 llroll  md5.c + TO md5.b
  6FA87E4F     08 md5+buf@+ md5.a  md5.c md5.b md5.d md5+i u>l md5.s41 llroll  md5.b + TO md5.a
  7E2CE6E0 +UL 0F md5+buf@+ md5.d  md5.b md5.a md5.c md5+i u>l md5.s42 llroll  md5.a + TO md5.d
  23014314 +UL 06 md5+buf@+ md5.c  md5.a md5.d md5.b md5+i u>l md5.s43 llroll  md5.d + TO md5.c
  4E0811A1     0D md5+buf@+ md5.b  md5.d md5.c md5.a md5+i u>l md5.s44 llroll  md5.c + TO md5.b
  77537E82 +UL 04 md5+buf@+ md5.a  md5.c md5.b md5.d md5+i u>l md5.s41 llroll  md5.b + TO md5.a
  3D3AF235 +UL 0B md5+buf@+ md5.d  md5.b md5.a md5.c md5+i u>l md5.s42 llroll  md5.a + TO md5.d
  2AD7D2BB     02 md5+buf@+ md5.c  md5.a md5.d md5.b md5+i u>l md5.s43 llroll  md5.d + TO md5.c
  6B86D391 +UL 09 md5+buf@+ md5.b  md5.d md5.c md5.a md5+i u>l md5.s44 llroll  md5.c + TO md5.b
;
[decimal]

: md5-transform    ( md5 -- = MD5 Basic transformation )
  >r

  r@ md5>a l@ to md5.a     \ copy to values for easy access
  r@ md5>b l@ to md5.b
  r@ md5>c l@ to md5.c 
  r@ md5>d l@ to md5.d

  md5+round1
  md5+round2
  md5+round3
  md5+round4

  md5.d r@ md5>d l+!
  md5.c r@ md5>c l+!
  md5.b r@ md5>b l+!
  md5.a r> md5>a l+!
;

: md5+cmove        ( c-addr u n1 -- n2 flag = Move data from source to buffer, return number processed and full indication )
  2dup + md5.byte-size min md5.byte-size = >r   \ full buffer ?
  tuck md5.byte-size swap - min >r              \ number of chars taken from source
  chars md5.buf + r@ chars cmove                \ move source in the buffer
  r> r>
;


nell 4 [=] [IF]
: md5-length!      ( md5 -- = Store the bit length )
  md5>length n@ #bits/byte m* swap                \ Bit length: msl lsl
  md5.length tuck md5! #bytes/long + md5!
;
[ELSE]
: md5-length!      ( md5 -- = Store the bit length )
  md5>length n@ #bits/byte *                       \ Bit length
  dup  #bytes/long #bits/byte * rshift swap u>l   \ Split in msl lsl
  md5.length tuck md5! #bytes/long + md5!
;
[THEN]


[hex]
: md5+#s       ( u -- = Convert one MD5 number in hold area )
  dup 18 rshift FF and s>d # # drop
  dup 10 rshift FF and s>d # # drop
  dup  8 rshift FF and s>d # # drop
                FF and s>d # # drop
;
[decimal]

( MD5 words )

: md5-init     ( md5 -- = Initialise the MD5 variable )
  >r
  [hex]
  67452301     r@ md5>a l!
  6FCDAB89 +UL r@ md5>b l!
  18BADCFE +UL r@ md5>c l!
  10325476     r@ md5>d l!
  [decimal]

  0 r> md5>length n!
;

aka md5-init md5-reset        ( md5 -- = Reset the MD5 state )

: md5-update       ( c-addr u md5 -- = Update the MD5 with more data c-addr u )
  >r
  r@ md5>buffer to md5.buf

  BEGIN
    2dup r@ md5>length n@ md5.byte-size mod md5+cmove
    over r@ md5>length n+!
  WHILE
    r@ md5-transform
    /string
  REPEAT
  r> drop
  drop 2drop
;

: md5-finish       ( md5 -- u1 u2 u3 u4 = Finish the MD5 calculation, return the result u1 u2 u3 u4 )
  >r
  r@ md5-length!

  r@ md5>length n@ md5.byte-size mod
  md5.byte-size #bytes/long 2* -   \ reserve two longs for the length

  2dup < IF                        \ pad length
    swap -
  ELSE
    md5.byte-size + swap -
  THEN

  md5.pad swap r@ md5-update       \ pad the buffer

  md5.length #bytes/long 2* r@ md5-update \ add the bit length to the algorithm

  r@ md5>a l@                       \ Return the result
  r@ md5>b l@
  r@ md5>c l@
  r> md5>d l@
;


: md5+to-string    ( u1 u2 u3 u4 -- c-addr u = Convert MD5 result to the string, using the pictured output area )
  base @ >r hex
  <# md5+#s md5+#s md5+#s md5+#s 0 s>d #>
  r> base !
;


( Inspection )

: md5-dump         ( md5 -- = Dump the md5 variable )
  >r
  ." md5    : " r@ . cr
  ." result : " r@ md5>a l@ r@ md5>b l@ r@ md5>c l@ r@ md5>d l@ md5+to-string type cr
  ." length : " r@ md5>length n@ . cr cr
  ." BUFFER" r@ md5>buffer r> md5>length n@ 64 min dump cr
;

[DEFINED] 4TH# [IF]
  hide md5.long-size
  hide md5.byte-size
  hide md5>a
  hide md5>b
  hide md5>c
  hide md5>d
  hide md5>buffer
  hide md5>length
  hide md5.s11
  hide md5.s12
  hide md5.s13
  hide md5.s14
  hide md5.s21
  hide md5.s22
  hide md5.s23
  hide md5.s24
  hide md5.s31
  hide md5.s32
  hide md5.s33
  hide md5.s34
  hide md5.s41
  hide md5.s42
  hide md5.s43
  hide md5.s44
  hide md5+f
  hide md5+g
  hide md5+h
  hide md5+i
  hide md5.a
  hide md5.b
  hide md5.c
  hide md5.d
  hide md5.buf
  hide md5.length
  hide md5.pad
  hide md5+buf@+
  hide md5!
  hide md5+round1
  hide md5+round2
  hide md5+round3
  hide md5+round4
  hide md5-transform
  hide md5+cmove
  hide md5-length!
  hide md5+#s
[THEN]

[ELSE] [ABORT]
[THEN]

[THEN]

\ ==============================================================================
