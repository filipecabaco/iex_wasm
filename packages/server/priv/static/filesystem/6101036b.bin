\ 4tH library - CHI square test - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/fp2.4th                    \ use both ANS-float or ZEN-float
include lib/chi2.4th

10 floats array tester

fclear 10 set-precision

create A 199809 , 200665 , 199607 , 200270 , 199649 ,
create B 522573 , 244456 , 139979 ,  71531 ,  21461 ,

5 0 do A i cells + @c s>f tester i floats + f! loop
tester 5 chi2distance f. cr            \ 4.146

5 0 do B i cells + @c s>f tester i floats + f! loop
tester 5 chi2distance f. cr            \ 790063.276 

create C 44 , 50 , 56 , 50 ,

4 0 do C i cells + @c s>f tester i floats + f! loop
tester 4 chi2 f. cr                    \ 1.44
depth .