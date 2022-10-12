\ Taken from http://rosettacode.org
\ Original Factor code
\ 4tH version 2021, Hans Bezemer

include lib/factor.4th                 \ Factor-like support

: bottle                               ( -- xt )
  [:
     [:
        [: . ." bottles of beer on the wall, " ;]
        [: . ." bottles of beer." ;] bi cr
     ;] keep

     s" Take one down, pass it around, " rot
     1- [: <# #s #> ;] [: s" no more" ;] if*
     s"  bottles of beer on the wall!" [: print ;] 2tri@ cr
  ;] ;

: last-verse                           ( -- )
  s" Go to the store and buy some more, "
  s" no more bottles of beer on the wall!" [: print ;] 2bi@ cr ;

: bottles                              ( n -- )
  dup [: bottle keep 1- ;] times drop last-verse ;

99 bottles

