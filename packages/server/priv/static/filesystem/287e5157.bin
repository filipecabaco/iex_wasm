\  Here is a simple encryption program called TEA (Tiny Encryption
\  Algorithm) that was designed for small code size at the expense
\  of execution time.  As a diversion, I recoded it in Forth.
\  The word GRUNGE could be a CODE word, so execution time wouldn't
\  be too bad.  Details on how TEA works is at:
\  http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html

\ Translation from C code (see below) to 32-bit Forth.
\ Data to encode/decode is 8 bytes (2 cells), key is 16 bytes.

[UNDEFINED] encode [IF]
[UNDEFINED] +UL    [IF] include lib/constant.4th [THEN]
[HEX] 1e3779b9 +UL constant delta [DECIMAL]

[UNDEFINED] TH [IF]
: th            ( a n -- a' )   cells + ;
[THEN]

4 array teakey
variable sum

: grunge        ( y z offset -- y z z' )
\ diffuse the key into the data
                >r
                dup  4 lshift teakey r@ th @ +
                over sum @ + xor
                over 5 rshift teakey r> 1+ th @ + xor
                ;

: encode        ( y z -- y' z' )
\ encode y, z  with key[0..3]
                0 sum !
                32 0
                do      delta sum +!
                        0 grunge rot +
                        2 grunge rot +
                loop
                ;

: decode        ( y z -- y' z' )
\ decode y, z  with key[0..3]
               delta 5 lshift sum !
                swap 32 0
                do      2 grunge negate rot +
                        0 grunge negate rot +
                        delta negate sum +!
                loop    swap
                ;

: teakey! teakey 4 bounds do i ! loop ;

\ Excerpt from a Tiny Encryption Algorithm by David Wheeler & Roger Needham

\ Routine, written in the C language, for encoding with key k[0] - k[3].
\ Data in v[0] and v[1].

\ void code(long* v, long* k)  {
\ unsigned long y=v[0],z=v[1], sum=0,  /* set up */
\ delta=0x9e3779b9, n=32 ;             /* a key schedule constant */
\ while (n-->0) {                      /* basic cycle start */
\  sum += delta ;
\    y += (z<<4)+k[0] ^ z+sum ^ (z>>5)+k[1] ;
\    z += (y<<4)+k[2] ^ y+sum ^ (y>>5)+k[3] ;
\ }                                    /* end cycle */
\ v[0]=y ; v[1]=z ; }

\ void decode(long* v,long* k)  {
\ unsigned long n=32, sum, y=v[0], z=v[1],
\ delta=0x9e3779b9 ;
\ sum=delta<<5 ;
\                                      /* start cycle */
\ while (n-->0) {
\    z-= (y<<4)+k[2] ^ y+sum ^ (y>>5)+k[3] ;
\    y-= (z<<4)+k[0] ^ z+sum ^ (z>>5)+k[1] ;
\   sum-=delta ;  }
\                                      /* end cycle */
\ v[0]=y ; v[1]=z ;  }

[DEFINED] 4TH# [IF]
  hide delta
  hide sum
  hide teakey
  hide grunge
[THEN]
[THEN]

