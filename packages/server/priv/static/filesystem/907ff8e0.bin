\ 4tH test - Factor compliance - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ include lib/anstools.4th
include lib/ttester.4th
include lib/compare.4th
include lib/factor.4th
                                       ( n1 -- n2)
: >sign dup 0< [: drop -1 ;] [: 0= [: 0 ;] [: 1 ;] if? ;] if? ;
                                       \ ** Shuffle words **
T{ 1 2 dupd => 1 1 2 }T
T{ 1 2 3 swapd => 2 1 3 }T
T{ 1 2 3 2over => 1 2 3 1 2 }T
T{ 1 2 3 4 2 pick => 1 2 3 4 2 3 }T
                                       \ ** Preserving combinators **
T{ 2 3 [: 2 + ;] dip => 4 3 }T
T{ 1 2 3 [: 2 + ;] 2dip => 3 2 3 }T
T{ 1 2 3 4 [: 2 + ;] 3dip => 3 2 3 4 }T
T{ 1 2 3 4 5 [: 2 + ;] 4dip => 3 2 3 4 5 }T
T{ 3 4 [: + ;] keep => 7 4 }T
T{ 3 4 [: + ;] 2keep => 7 3 4 }T
T{ 1 2 3 [: + ;] 3keep => 1 5 1 2 3 }T
                                       \ ** Cleave combinators **
T{ 1 [: 2 + ;] [: 3 + ;] bi => 3 4 }T
T{ 4 3 1 [: + ;] [: + ;] bi => 4 5 }T
T{ 20 [: 2 + ;] [: 2 * ;] bi => 22 40 }T
T{ 8 [: 2 * ;] [: 3 + ;] [: 4 / ;] tri => 16 11 2 }T
T{ 5 [: 1+ ;] [: 1- ;] [: 2* ;] tri => 6 4 10 }T
T{ 5 [: 1+ ;] keep [: 1- ;] keep 2* => 6 4 10 }T
                                       \ ** Spread combinators **
T{ 5 7 [: 2* ;] [: 2/ ;] bi* => 10 3 }T
T{ 3 15 20 [: 2 + ;] [: 2 * ;] [: 3 * ;] tri* => 5 30 60 }T
                                       \ ** Apply combinators **
T{ 1 2 [: 2 + ;] bi@ => 3 4 }T
T{ 1 2 3 [: 2 + ;] tri@ => 3 4 5 }T
T{ 4 3 [: 2 mod 0= ;] both? => false }T
T{ 4 3 [: 2 mod 0= ;] either? => true }T
T{ 4 6 [: 2 mod 0= ;] both? => true }T
T{ 4 6 [: 2 mod 0= ;] either? => true }T
T{ 3 5 [: 2 mod 0= ;] either? => false }T
                                       \ ** Conditional combinators **
T{ t 5 0 ?? => 5 }T
T{ f 0 5 ?? => 5 }T
T{ 5 [: true ;] when => true }T
T{ f [: true ;] when => }T
T{ f [: false ;] unless? => false }T
T{ 2 [: true ;] [: false ;] if? => true }T
T{ f [: true ;] [: false ;] if? => false }T
T{ 5 [: <# #s #> ;] [: s" no more" ;] if* s" 5" compare => 0 }T
T{ 0 [: <# #s #> ;] [: s" no more" ;] if* s" no more" compare => 0 }T
T{ -5 >sign => -1 }T
T{  0 >sign =>  0 }T
T{  5 >sign =>  1 }T
T{ 5 [: true ;] when* => 5 true }T
T{ f [: false ;] when* => }T
T{ 5 [: false ;] unless* => 5 }T
T{ f [: false ;] unless* => false }T
                                       \ ** Selected words **
T{ 5 [: ;] each-integer => 0 1 2 3 4 }T
T{ 0 1 2 3 [: + -rot ;] each-integer => 2 2 2 }T
T{ 1 4 [: dup ;] times => 1 1 1 1 1 }T
T{ 2 0 [: dup ;] times => 2 }T

