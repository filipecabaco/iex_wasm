\ BSEARCH demo

include lib/bsearch.4th

create elements 0 , 3 , 12 , 23 , 45 , 66 , 88 ,
here elements - 1 cells / value #elements

:noname  ( a b -- res )
    2dup < If 2drop -1 Exit Then > ; IS B-COMPARE

:noname ( index array -- key )
    swap cells + @c ; IS GET-KEY

: TEST  ( key -- )
    elements #elements bsearch cr
    IF ." FOUND = " ELSE ." NOT FOUND, insert = " THEN . cr ;

-1 test
45 test
46 test
13 test
99 test depth .