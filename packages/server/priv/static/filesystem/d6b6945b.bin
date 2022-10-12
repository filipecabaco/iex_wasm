\ 4tH library - Extended precision maths - Copyright 2015, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ UT* by Robert Smith (from COLDFORTH Version 0.8, GPL )
\ TNEGATE, MT/MOD by Wil Baden

\ t2/       Shift right arithmatic      ( t -- t/2 )
\ t2*       Shift left arithmatic       ( t -- t*2 )
\ t+        Triple addition             ( t1 t2 -- t3 )
\ tnegate   Triple negation             ( t -- -t )
\ t+-       Conditional triple negation ( t n -- t|-t)
\ t-        Triple subtraction          ( t1 t2 -- t3 )
\ tabs      Triple absolute             ( t -- |t| )
\ t0=       Triple equal zero           ( t -- f )
\ t0<       Triple less than zero       ( t -- f )
\ t<        Triple smaller than triple  ( t1 t2 -- f )
\ t=        Triple equal to triple      ( t1 t2 -- f )
\ ut*       Double with unsigned        ( ud u -- t )
\ tu*       Triple with unsigned        ( ut u -- t )
\ mt*       Double with signed          ( d n -- t )
\ mt/mod    Divide triple by unsigned   ( t u -- |rem| d )
\ ut/mod    Divide triple by signed     ( ut n -- urem d )
\ tu/mod    Divide triple by unsigned   ( ut1 u -- urem ut2 )

[UNDEFINED] t*  [IF]
[UNDEFINED] um* [IF] include lib/mixed.4th   [THEN]
[UNDEFINED] t+  [IF] include lib/triplus.4th [THEN]

: tnegate >r 2dup or if dnegate r> 1+ else r> then negate ;
: t+- 0< if tnegate then ;
: t- tnegate t+ ;
: tabs dup t+- ;
: t0= or or 0= ;
: t0< nip nip 0< ;
: t< t- t0< ;
: t= t- t0= ;
: ut* swap >r dup >r um* 0 r> r> um* d+ ;
: tu* tuck * >r ut* r> + ;
: mt* over over signs? >r abs >r dabs r> ut* r> if tnegate then ;
: mt/mod over >r >r dup t+- r@ um/mod -rot r> um/mod rot r> d+- ;
: ut/mod dup >r um/mod -rot r> um/mod rot ;
: tu/mod >r 0 r@ ut/mod r> -rot 2>r um/mod 2r> ;
[THEN]
