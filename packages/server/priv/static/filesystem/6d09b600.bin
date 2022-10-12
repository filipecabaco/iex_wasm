\ ****************
\ Claus Vogt, 1995 - believed to be in the public domain
\ ****************

[UNDEFINED] [r [IF]
0 value __rp

: [r r> rp@ __rp >r to __rp >r ;       ( R: xt -- n xt)
: r] r> r> __rp rp@ - abort" Return stack imbalance" to __rp >r ;
[DEFINED] 4TH# [IF] hide __rp [THEN]   ( R: n xt -- xt)
[THEN]

\ : test-err [R r> R] ; : test-ok  [R  r> dup . r> dup . >r >r R] ;
\ test-ok test-err
