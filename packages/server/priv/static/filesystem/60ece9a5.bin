\ Taken from http://rosettacode.org 
\ 4tH version 2011,2012  Hans Bezemer

[UNDEFINED] horner [IF]
[UNDEFINED] ZenFP [IF] [ABORT] [THEN]  \ ONLY works with Zen FP library
: horner                               ( F: r1 -- F: r2 ) ( coeffs len -- )
  2>r 0 s>f 2r>
  floats bounds 
  ?do
    2over f* i 2@ f+
  float +loop
  2swap 2drop ;
[THEN]

\ -19 7 -4 6 4 floats array coeffs
\ coeffs 4 floats bounds do s>f .s i 2! float +loop
\ 3 s>f coeffs 4 horner f.    \ 128.
