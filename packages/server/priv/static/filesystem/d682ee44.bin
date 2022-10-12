\ tean.f 2006 Jan 04
\ TEA is the Tiny Encryption Algorithm - a shared private key system
\ based on many iterations of a simple hashing function.
\ Created by David J. Wheeler and Roger M. Needham.
\ TEAN ( TEA New ) is an improved version of TEA which includes modifications
\ to TEA made after David Wagner discovered weaknesses in the key scheduling.
\ Based on C code from http://www.simonshepherd.supanet.com/source.htm#new_ansi
\ See also http://www.ftp.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html
\ TEA and TEAN are 64-bit block Feistel cyphers using a 128-bit key.

\ +tean  encrypts d to d' using the given number of rounds and initial key
\ -tean  decrypts d' to d using the same parameters.
\ You can use these to encrypt an array, adjusting the parameters
\ after each 64 bit value is encrypted if required.

\ This is a 32 bit Little Endian ANS Forth version ( PC ).
\ Usage : 123456. +tean  2dup d.  -tean d.

[UNDEFINED] +tean [IF]
[UNDEFINED] +UL   [IF] include lib/constant.4th [THEN]

\ user inputs - you choose the number of rounds and initial key :
\ #rounds holds the number of times round the loop :
\ should be > 8, increase for stronger encryption ( say 32 )
32 value #rounds
4 array MyKey   \ load this with the shared private key

\ The Golden Ratio ( 5 sqrt 1+ 2/ ) = 1.618033989, - 1 , scaled up to 32 bits
\ could be anything except "bad" values...
[HEX] 1e3779b9 +UL constant delta

\ working variables
variable delta#rounds@* \ pre-calculated value, for speed
variable MySum
variable MyVar1
variable MyVar2

\ get a new key value ( two flavours )
: GetKey1 ( - u)   MySum @  dup 3 and cells MyKey + @ + ;
: GetKey2 ( - u)   MySum @  dup 0B rshift 3 and cells MyKey + @ + ;

\ mix the bits of the variables ( two flavours again )
: Mangle1 ( - u)   MyVar1 @ 4 lshift  MyVar1 @ 5 rshift xor  MyVar1 @ + ;
: Mangle2 ( - u)   MyVar2 @ 4 lshift  MyVar2 @ 5 rshift xor  MyVar2 @ + ;

\ one round of the encryption algorithm
: (+tean) ( a b - a' b' )
   Mangle1
   GetKey1          \ key
   xor              \ mangled 1 and key
   MyVar2 +!        \ add to 2
   delta MySum +!   \ add to sum
   Mangle2
   GetKey2          \ key
   xor              \ mangled 2 and key
   MyVar1 +!        \ add to 1
;

\ encrypt d to d' using the number of rounds and private key values
: +tean ( d - d' )
   MyVar2 !  MyVar1 !
   0 MySum !
   #rounds 0 do  (+tean)  loop
   MyVar1 @  MyVar2 @
;

\ one round of the decryption algorithm
: (-tean) ( a' b' - a b )
    Mangle2
    GetKey2                 \ key
    xor                     \ mangled 1 and key
    negate MyVar1 +!        \ subtract from 1
    delta negate MySum +!   \ subtract from sum
    Mangle1
    GetKey1                 \ key
    xor                     \ mangled 2 and key
    negate MyVar2 +!        \ subtract from 2
;

\ decrypt d' back to d using the number of rounds and private key values
: -tean ( d' - d )
   MyVar2 !  MyVar1 !
   delta#rounds@* @ MySum ! \ initial value
   #rounds 0 do  (-tean)  loop
   MyVar1 @  MyVar2 @
;

[DECIMAL]

: #tean! ( n)   1 max 10000 min to #rounds
   #rounds delta * delta#rounds@* ! ;

[DEFINED] 4TH# [IF]
  hide #rounds
  hide delta
  hide delta#rounds@* \ pre-calculated value, for speed
  hide MySum
  hide MyVar1
  hide MyVar2
  hide GetKey1
  hide Getkey2
  hide Mangle1
  hide Mangle2
  hide (+tean)
  hide (-tean)
[THEN]
[THEN]

