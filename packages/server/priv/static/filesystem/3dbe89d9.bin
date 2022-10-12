\ 4tH library - Vector demo - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/fp4.4th
include lib/fvector.4th

3 constant #dims                       \ three dimensional vector
#dims floats constant /vector          \ size of a single vector
/vector array a
/vector array b
/vector array c
                                       \ display a vector
: .fvector 0 ?do dup i floats + f@ f. loop drop ;

fclear 10 set-precision                \ initialize FP

1 s>f  3 s>f -5 s>f a #dims fvector!   \ initialize vector A
4 s>f -2 s>f -1 s>f b #dims fvector!   \ initialize vector A
a b c #dims fsumvector .fvector cr     \ sum both vectors
    c #dims flenvector f. cr           \ calculate length resulting vector