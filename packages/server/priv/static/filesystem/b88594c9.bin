\ 4tH library - Hashing - Copyright 2009,2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ ---
\ See: https://www.cse.yorku.ca/~oz/hash.html
\      https://en.wikipedia.org/wiki/Jenkins_hash_function
\      https://en.wikipedia.org/wiki/PJW_hash_function
\      https://www.drdobbs.com/database/hashing-rehashed/184409859

[UNDEFINED] (hash) [IF]
[UNDEFINED] +UL    [IF] include lib/constant.4th [THEN]

/cell 4 [=] [IF]                       \ 32 bit constants
  -2128831035 constant (FNVoffset)
     16777619 constant (FNVprime)
            4 constant (PJWleft)
           24 constant (PJWright)
[HEX]
 70000000 +UL constant (PJWand)
[DECIMAL]
[ELSE]                                 \ 64 bit constants
 -3750763034362895579 constant (FNVoffset)
        1099511628211 constant (FNVprime)
                    8 constant (PJWleft)
                   48 constant (PJWright)
[HEX]
7F00000000000000 +ULL constant (PJWand)
[DECIMAL]
[THEN]
                                       \ character hashes
: (pjw)                                ( c n1 -- n2)
  (PJWleft) lshift + dup (PJWand) and dup
  if dup (PJWright) rshift rot xor swap then invert and
;

: (djb2) dup 5 lshift + + ;            ( c n1 -- n2)
: (djb2a) dup 5 lshift + xor ;         ( c n1 -- n2)
: (fnv1) (FNVprime) * xor ;            ( c n1 -- n2)
: (fnv1a) xor (FNVprime) * ;
: (sdbm) dup >r 6 lshift r@ 16 lshift + + r> - ;
: (oaat) + dup 10 lshift + dup 6 rshift xor ;
: (hash) 2swap bounds ?do over i c@ -rot execute loop nip ;
                                       \ export hash words
: djb2 ['] (djb2) 5381 (hash) ;        ( a n -- n2)
: djb2a ['] (djb2a) 5381 (hash) ;      ( a n -- n2)
: fnv1 ['] (fnv1) (FNVoffset) (hash) ; ( a n -- n2)
: fnv1a ['] (fnv1a) (FNVoffset) (hash) ;
: sdbm ['] (sdbm) 0 (hash) ;           ( a n -- n2)
: pjw ['] (pjw) 0 (hash) ;             ( a n -- n2)
: oaat ['] (oaat) 0 (hash) dup 3 lshift + dup 11 rshift xor dup 15 lshift + ;

[DEFINED] 4th# [IF]
  hide (djb2)
  hide (djb2a)
  hide (fnv1)
  hide (fnv1a)
  hide (sdbm)
  hide (pjw)
  hide (oaat)
  hide (FNVprime)
  hide (FNVoffset)
  hide (PJWleft)
  hide (PJWright)
  hide (PJWand)
[THEN]
[THEN]


