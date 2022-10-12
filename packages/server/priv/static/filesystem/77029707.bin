\ 4tH library - CHI square - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] chi2 [IF]
[UNDEFINED] fdup [IF] [ABORT] [THEN]
\ length of all arrays is in elements (floats), not address units

: chi2distance                         ( a n -- f)
  2>r 0 s>f 2r@ floats bounds ?do i f@ f+ float +loop
  2r@ nip s>f f/ 0 s>f fswap
  2r> floats bounds ?do i f@ fover f- fdup f* frot f+ fswap float +loop f/
;

\ array should be laid out as follows:
\   freq0, expected_freq0, freq1, expected_freq1 .. freqN, expected_freqN

: chi2                                 ( a n -- f)
  2>r 0 s>f 2r> floats
  bounds ?do i float+ f@ i f@ fover f- fdup f* fswap f/ f+ 2 floats +loop
;
[THEN]
