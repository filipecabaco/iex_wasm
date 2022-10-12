\ Taken from http://rosettacode.org
\ http://en.wikipedia.org/wiki/Van_der_Corput_sequence

\ A van der Corput sequence is a low-discrepancy sequence over the unit
\ interval first published in 1935 by the Dutch mathematician J. G. van
\ der Corput. It is constructed by reversing the base n representation of
\ the sequence of natural numbers (1, 2, 3, ..).

include lib/ansfloat.4th
include lib/fpout.4th

: fvdc ( base n -- f )
  0 s>f 1 s>f ( F: vdc denominator )
  begin dup while
    over s>f f*
    over /mod  ( base rem n )
    swap s>f fover f/
    frot f+ fswap
  repeat 2drop fdrop ;
 
: test  10 0 do 2 i fvdc cr f. loop ;

fclear 10 set-precision test cr