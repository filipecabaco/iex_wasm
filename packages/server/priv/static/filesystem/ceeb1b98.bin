\ logistic     The Logistic function and its first derivative
\     logistic =   Exp( c + a x ) / (1 + Exp( c + a x ) )
\   d_logistic = a Exp( c + a x ) / (1 + Exp( c + a x ) )^2

\ Forth Scientific Library Algorithm #4

\ This code conforms with ANS requiring:
\      1. The Floating-Point word set

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ cr .( Logistic          V1.2           17 October 1994   EFC )
\ include lib/ansfloat.4th

[UNDEFINED] fexpint [IF]
[UNDEFINED] fexp [IF] include lib/fexp.4th [THEN]
: FLOGISTIC ( --, f: x a c -- z )
        FROT FROT
        F* F+
        FEXP
        FDUP 1 s>f F+
        F/
;

: FD_LOGISTIC ( -- , f: x a c -- z )
        FSWAP FROT
        FOVER F* FROT F+
        FEXP
        FDUP 1 s>f F+ FDUP F*
        F/ F*
;

\ Examples :
\ fclear 10 set-precision 1 s>f 1 s>f 0 s>f flogistic f. ." => 0.731059" cr
\ s" 3.2" s>float s" 1.5" s>float s" 0.2" s>float flogistic f. ." => 0.993307" cr
\ s" 3.2" s>float s" 1.5" s>float s" 0.2" s>float fd_logistic f. ." => 0.00997209" cr
[THEN]