\ From: Julian Fondren <julian.fondren@gmail.com>
\ Date: Saturday 30 September 2017 07:28:03
\ Groups: comp.lang.forth

\ Believed to be in the public domain

include lib/matcher.4th
include lib/compare.4th
include lib/ttester.4th

\ Test program for MATCHER.4TH

T{ s" bob" s" bo" match s" b" compare 0= => true }T
T{ s" bob" s" xx" match 0 0 compare 0= => true }T
T{ s" bob" [char] b cmatch s" ob" compare 0= => true }T
T{ s" bob" [char] x cmatch 0 0 compare 0= => true }T

T{ s" bob" 2dup s" bo" match optional s" b" compare 0= => true }T
T{ s" bob" 2dup s" xx" match optional s" bob" compare 0= => true }T
T{ s" bob" 2dup [char] b cmatch optional s" ob" compare 0= => true }T
T{ s" bob" 2dup [char] x cmatch optional s" bob" compare 0= => true }T

T{ s" bob" 2dup s" bo" match matched
   s" bo" compare 0= => true }T
T{ s" bob" 2dup 2dup s" xx" match optional matched
   0 0 compare 0= => true }T

T{ s" ****omg" :noname [char] * cmatch ; any-matches
   s" omg" compare 0= => true }T
T{ s" ****omg" :noname [char] * cmatch ; some-matches
   s" omg" compare 0= => true }T
T{ s" omg" :noname [char] * cmatch ; any-matches
   s" omg" compare 0= => true }T
T{ s" omg" :noname [char] * cmatch ; some-matches
   0 0 compare 0= => true }T

variable oo-matches

T{ s" bob's McBob" :noname s" Mc" match ; find-match
   s" Bob" compare 0= => true }T

0 oo-matches !
T{ s" boooo" :noname s" oo" match ; :noname 2drop 1 oo-matches +! ;
   each-match oo-matches @ => 2 }T

0 oo-matches !
T{ s" boooo" :noname s" oo" match ; :noname 2drop 1 oo-matches +! ;
   each-overlapping-match oo-matches @ => 3 }T

." Done" cr