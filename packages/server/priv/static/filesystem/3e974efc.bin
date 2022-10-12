\ 4tH library - FSQRT ZEN - Copyright 2009, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/zenfloat.4th include lib/zenfpio.4th include lib/anstools.4th

[UNDEFINED] fsqrt [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]
                                       \ same number but crank up mantissa
: (scale)                              ( f1 -- f1 )
  max-n 10 / 1+ >r begin over r@ < while 1- swap 10 * swap repeat r> drop
;
                                       \ estimate courtesy of David Johnson
: estimate                             ( f1 -- f1 f2)
  2dup (scale) dup 1 and               \ scale for sqrt; crank up mantissa
  if 1+ 2/ swap 10 / 3 else 2/ swap 1 then
  -1 /cell 4 * rot + rshift            \ first estimate: half a word, bits set
  begin over over / over + 2/ tuck - abs 2 < until
  nip swap                             \ take sqrt of mantissa and
;                                      \ divide exponent by two

: fsqrt                                ( f1 -- f2 )
  2dup f0= if exit then                \ check for zero
  2dup f0< E.FPERR throw" Negative float"        \ check for negative float
  estimate begin                       \ get initial estimation
    2over 2over f/ 2over f+ (scale) swap 2/ swap \ get next estimate
    2swap 2over rot - 0= >r - abs 6 < r> and     \ assume exponents are equal
  until                                \ difference half last digit mantissa
  2swap 2drop                          \ babylonian method w/ estimate
;                                      \ clean up after final iteration
                                       ( f -- f/2)
: f2/ over if over 0< >r fabs (scale) swap 2/ r> if negate then swap then ;

[DEFINED] 4TH# [IF]
  hide estimate
  hide (scale)
[THEN]
[THEN]

\    0 s>f fsqrt f. cr
\    1 s>f fsqrt f. cr
\    2 s>f fsqrt f. cr
\    5  -1 fsqrt f. cr
\    5 s>f fsqrt f. cr
\   64 s>f fsqrt f. cr
\    4   9 fsqrt f. cr
\    4  -2 fsqrt f. cr
\   41  -8 fsqrt f. cr
\    1  10 fsqrt f. cr
\    1  99 fsqrt f. cr
\    1 -99 fsqrt f. cr
\ 9224  -4 fsqrt f. cr
\  120  -4 fsqrt f. cr
\ 9643  -3 fsqrt f. cr
\  max-n 0 fsqrt f. cr
\  max-n 1 fsqrt f. cr
\   -1 s>f fsqrt f. cr
\ 100001 1 do i -4 fsqrt 2drop loop
