\ 4tH library - Unit Conversion - Copyright 2005,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] C>F [IF]
: SCALE 10000 */ ;               \ internal precision is
                                 \ one decimal
\ Temperature                    ( degrees Kelvin )
 2732 +constant C>K
-2732 +constant K>C

: C>F ( n-n')  9 5 */ 320 + ;    ( 100C = 212F )
: F>C ( n-n') 320 -  5 9 */ ;

\ Imperial > Metric
: MILE>KM 16090 SCALE ;
: YARD>M   9144 SCALE ;
: FT>M     3048 SCALE ;
: INCH>CM 25400 SCALE ;
: LB>KG    4536 SCALE ;

\ Metric > Imperial
: KM>MILE  6214 SCALE ;
: M>YARD  10936 SCALE ;
: M>FT    32808 SCALE ;
: CM>INCH  3940 SCALE ;
: KG>LB   22046 SCALE ;

[DEFINED] 4TH# [IF]
  hide SCALE
[THEN]
[THEN]
