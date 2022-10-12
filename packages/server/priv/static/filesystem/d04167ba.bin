\ Euler 9                                uho 2008-08-24

\ a + b + c = 1000
: a_b_c ( a b -- a b c )  
   2dup + 1000 swap - ;

\ a^2 + b^2 = c^2
: pytriple? ( a b c -- flag )  
   >r  dup *  swap  dup *  +  r>  dup *  = ;

: euler9? ( a b -- flag )  
   a_b_c pytriple? ;

: euler9 ( -- a b c )
   500 dup 1 DO
      dup I DO
          J I euler9?
          IF drop  J I a_b_c  UNLOOP UNLOOP EXIT THEN
      LOOP
   LOOP drop 0 0 0 ;
   
: .solution ( a b c -- )
    dup IF
      >r cr ." a=" over .  ." b=" dup .  ." c=" r@ .  
      cr ." a+b+c=" 2dup + r@ + .
      cr ." a*b*c=" * r> * . EXIT THEN
    drop drop drop cr ." No solution" ;
   
euler9 .solution cr