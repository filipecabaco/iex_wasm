\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

\ Quaternions are an extension of the idea of complex numbers. A quaternion
\ has one real part and three imaginary parts, i, j, and k. A quaternion might
\ be written as a + bi + cj + dk.

\ In this numbering system, ii = jj = kk = ijk = -1. The order of
\ multiplication is important, as, in general, for two quaternions q1 and q2;
\ q1q2 != q2q1.

\ An example of a quaternion might be 1 +2i +3j +4k
\ See also: http://en.wikipedia.org/wiki/Quaternion

include lib/ansfloat.4th
include lib/fpout.4th

4 floats constant quaternion
quaternion *constant quaternions

\ access
: q.a             f@ ;
: q.b      float+ f@ ;
: q.c  2 floats + f@ ;
: q.d  3 floats + f@ ;

: q@ dup q.a dup q.b dup q.c q.d ;

: q! ( a b c d q -- )
  dup 3 floats + f!  dup 2 floats + f!  dup float+ f!  f! ;

: qcopy ( src dest -- ) swap q@ q! ;

: qnorm  ( q -- f )
  0 s>f 4 0 do  dup f@ fdup f* f+  float+ loop drop fsqrt ;

: qf* ( q f -- )
  4 0 do dup f@ fover f* dup f!  float+ loop fdrop drop ;

: qnegate ( q -- ) -1 s>f qf* ;

: qconj ( q -- )
  float+ 3 0 do dup f@ fnegate dup f!  float+ loop drop ;

: qf+ ( q f -- ) dup f@ f+ f! ;

: q+ ( q1 q2 -- )
  4 0 do over f@ dup f@ f+ dup f!  float+ swap float+ swap loop 2drop ;

: q* ( dest q1 q2 -- )
  over q.a dup q.d f*  over q.b dup q.c f* f+  over q.c dup q.b f* f-  over q.d dup q.a f* f+
  over q.a dup q.c f*  over q.b dup q.d f* f-  over q.c dup q.a f* f+  over q.d dup q.b f* f+
  over q.a dup q.b f*  over q.b dup q.a f* f+  over q.c dup q.d f* f+  over q.d dup q.c f* f-
  over q.a dup q.a f*  over q.b dup q.b f* f-  over q.c dup q.c f* f-  over q.d dup q.d f* f-
  2drop  4 0 do dup f!  float+ loop  drop ;

: q= ( q1 q2 -- ? )
  4 0 do
    over f@ dup f@ f= 0= if 2drop false unloop exit then
    float+ swap float+
  loop
  2drop true ;
 
\ testing

: q. ( q -- )
  [char] ( emit space
  4 0 do dup f@ f.  float+ loop drop
  [char] ) emit space ;

fclear 100 set-precision

quaternion array q   1 s>f 2 s>f 3 s>f 4 s>f q  q!
quaternion array q1  2 s>f 3 s>f 4 s>f 5 s>f q1 q!
quaternion array q2  3 s>f 4 s>f 5 s>f 6 s>f q2 q!

quaternion array tmp
quaternion array m1
quaternion array m2

q qnorm f. cr                           \ 5.47722557505166
q tmp qcopy  tmp qnegate  tmp q. cr     \ ( -1. -2. -3. -4. )
q tmp qcopy  tmp qconj    tmp q. cr     \ ( 1. -2. -3. -4. )

q m1 qcopy  m1 7 s>f qf+   m1 q. cr     \ ( 8. 2. 3. 4. )
q m2 qcopy  7 s>f m2 qf+   m2 q. cr     \ ( 8. 2. 3. 4. )
m1 m2 q= . cr                           \ 1  (true)

q2 tmp qcopy  q1 tmp q+   tmp q. cr     \ ( 5. 7. 9. 11. )

q m1 qcopy  m1 7 s>f qf*     m1 q. cr   \ ( 7. 14. 21. 28. )
q m2 qcopy  7 s>f m2 qf*     m2 q. cr   \ ( 7. 14. 21. 28. )
m1 m2 q= . cr                           \ 1  (true)

m1 q1 q2 q*  m1 q. cr                   \ ( -56. 16. 24. 26. )
m2 q2 q1 q*  m2 q. cr                   \ ( -56. 18. 20. 28. )
m1 m2 q= . cr                           \ 0  (false)