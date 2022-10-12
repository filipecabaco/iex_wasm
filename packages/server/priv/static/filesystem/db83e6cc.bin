\ arcfour.4th
\ ARCFOUR - Alleged RC4

\                                Neil Bawd 1997-05-25 2000-07-16

\ In 1987 Ron Rivest developed the RC4 cipher-system for RSA 
\ Data Security, Inc. It used a well-guarded proprietary trade 
\ secret. The system was popular and is used in several hundred 
\ commercial cryptography products, including Lotus Notes, 
\ Apple Computer's AOCE, and Oracle Secure SQL. It is part of 
\ the Cellular Digital Packet Data Specification, and is used 
\ by Internet Explorer, Netscape, and Adobe Acrobat. 

\ Seven years later, source code alleged to be equivalent to
\ RC4 was published anonymously on the Cypherpunks mailing
\ list.  Users with legal copies of RC4 confirmed compatibility.

\ The code is extremely simple and can be written by most
\ programmers from the description.

\   We have an array of 256 bytes, all different.

\   Every time the array is used it changes - by swapping
\   two bytes.

\   The swaps are controlled by counters _i_ and _j_, each
\   initially 0.

\   To get a new _i_, add 1.

\   To get a new _j_, add the array byte at the new _i_.

\   Exchange the array bytes at _i_ and _j_.

\   The code is the array byte at the sum of the array bytes
\   at _i_ and _j_.

\   This is XORed with a byte of the plaintext to encrypt, or
\   the ciphertext to decrypt.

\   The array is initialized by first setting it to 0 through
\   255. Then step through it using _i_ and _j_, getting the new
\   _j_ by adding to it the array byte at _i_ and a key byte, and
\   swapping the array bytes at _i_ and _j_.  Finally, _i_ and _j_
\   are set to 0.

\   All additions are modulo 256.

\ The cipher key to be used when initializing can be up to 256
\ bytes, i.e., 2048 bits.  It works best when it's shorter so
\ the randomizing done at initialization can thoroughly shuffle
\ the array.  At most 64 bytes are recommended for the key.

\ The name "RC4" is trademarked by RSA Data Security, Inc. So
\ anyone who writes his own code has to call it something else.
\ In 1997 I called it ARCIPHER. ARCFOUR has been since
\ widely accepted as the name of the alleged RC4.

\ It is popular because it is small, fast, and believed to be
\ secure.

\ It's a rare example of Cheap, Fast, and Good.

\ For further information, see http://ciphersaber.gurus.com

\ The following Standard Forth version uses Core words only.
\ The number of fetches and stores in `ARCFOUR` has been
\ minimized.  There is no need to optimize `ARCFOUR-INIT`.

\  Implementation dependency on 1 CHARS is 1.

\  All arithmetic modulo 256.
\  i = i + 1
\  j = j + S[i]
\  temp = S[i]; S[i] = S[j]; S[j] = temp
\  temp = S[S[i]+S[j]]
\  return char xor temp

\ Insignificant mods to Neil Bawd's code were made for 
\   use under kForth -- Krishna Myneni, 2002-04-26

\ Insignificant mods to Krishna Myneni's code were made for 
\   use under 4tH -- Hans Bezemer, 2003-03-26

[UNDEFINED] ARCFOUR [IF]

VARIABLE &I
VARIABLE &J
256 STRING &S

\  @ and ! may be replaced by C@ and C!.

: ARCFOUR  ( c -- x )
    \  All arithmetic modulo 256.
    \  i = i + 1
    &I @  1+  DUP &I !  255 AND   ( . i)

    \  j = j + S[i]
    &S +  DUP C@          ( . &S[i] S[i])
    DUP &J @ +  255 AND   ( . &S[i] S[i] j)
    DUP &J !

    \  temp = S[i]; S[i] = S[j]; S[j] = temp
    &S +  DUP C@          ( . &S[i] S[i] &S[j] S[j])
    >R  OVER SWAP C!      ( . &S[i] S[i])( R: S[j])
    R@ ROT C!             ( . S[i])

    \  temp = S[i]; S[i] = S[j]; S[j] = temp
    R> +                  ( . S[i]+S[j])( R: )
    255 AND &S + C@       ( c x)

    \  return char xor temp
    XOR ( x) ;

: ARCFOUR-INIT              ( key len -- )
    \  Set array to 0 through 255.
    256 0 DO  I DUP &S + C!  LOOP

    0 &J !
    256 0 DO                        ( key len)
        \  Get new j by adding array byte at i and a key byte.
        OVER OVER I SWAP MOD + C@  I &S + C@ +
            &J @ +  255 AND  &J !
        \  Swap array bytes at i and j.
        I &S + C@  &J @ &S +  &J @ &S + C@  I &S +  C! C!
    LOOP  DROP DROP

    \  Set i and j to 0.
    0 &I !  0 &J ! ;

[DEFINED] 4TH# [IF]
hide &I
hide &J
hide &S
[THEN]
[THEN]

