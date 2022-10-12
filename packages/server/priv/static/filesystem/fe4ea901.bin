\ Triple Precision Words - Initial release 11/07/2002, Brad Eckert
\ t2/       Shift right arithmatic     ( t -- t/2)
\ t2*       Shift left arithmatic      ( t -- t*2)
\ t+        Triple addition            ( t1 t2 -- t3 )

[UNDEFINED] t+ [IF]
[UNDEFINED] d+ [IF] include lib/ansdbl.4th [THEN]
-s>d constant -d>t                     ( -d -- -t)
 u>d constant ud>t                     ( ud -- ut)

: t2/                                  ( t -- t/2 )
  over 1 and 0 swap if invert then highbit and >r d2/ rot 1 rshift r> or -rot
;
                                       ( t -- t*2 )
: t2* d2* rot dup 0< 1 and >r 2* rot rot r> 0 d+ ;
: t+ 2>r >r rot 0 r> 0 d+ 0 2r> d+ rot >r d+ r> -rot ;
[THEN]                                 ( t1 t2 -- t1+t2 )