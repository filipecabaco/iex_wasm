( takeuchi benchmark in ANS Forth )
( see <url:http://www.lib.uchicago.edu/keith/crisis/benchmarks/tak/> )
( Keith Waclena <k-waclena@uchicago.edu> )

include lib/pickroll.4th

: 3dup ( x y z -- x y z x y z )
  2dup 4 pick rot rot
;

: tak1 ( x y z -- x1- y z )
  rot  ( x y z -- y z x )
  1-   ( y z x -- y z x1- )
  rot  ( y z x1- -- z x1- y )
  rot  ( z x1- y -- x1- y z )
;

: tak2 ( x y z -- y1- z x )
  swap ( x y z -- x z y )
  1-   ( x z y -- x z y1- )
  rot rot ( x z y1- -- y1- x z )
  swap ( y1- x z -- y1- z x ) 
;

: tak3 ( x y z -- z1- x y )
  1-   ( x y z -- x y z1- )
  rot rot ( x y z1- -- z1- x y )
;

: tak	 	( x y z -- t )
  over		( x y z -- x y z y )
  3 pick	( x y z -- x y z y x )
  < not if	( x y z y x -- x y z )
    swap drop	( x y z -- x z )
    swap drop	( x z -- z )
  else		( x y z y x -- x y z )
    3dup tak1 recurse >r   ( x y z -- x y z ) ( R: -- t1 )
    3dup tak2 recurse >r   ( x y z -- x y z ) ( R: t1 -- t1 t2 )
    tak3 recurse	   ( x y z -- t3 )
    r>			   ( t3 -- t3 t2 ) ( R: t1 t2 -- t1 )
    swap		   ( t3 t2 -- t2 t3 ) ( R: t1 -- )
    r>			   ( t2 t3 -- t2 t3 t1 )
    rot rot		   ( t2 t3 t1 -- t1 t2 t3 )
    recurse		   ( t1 t2 t3 -- t)
  then
;

18 12 6 tak 0 .r cr
