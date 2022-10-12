\ 4tH library - Gamma function (Spouge) - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License 

\ Gamma function by Spouge approximation
\ https://en.wikipedia.org/wiki/Spouge%27s_approximation

\ #define A 12

\ double sp_gamma(double z)
\ {
\   const int a = A;
\   static double c_space[A];
\   static double *c = NULL;
\   int k;
\   double accm;

\   if ( c == NULL ) {
\     double k1_factrl = 1.0; /* (k - 1)!*(-1)^k with 0!==1*/
\     c = c_space;
\     c[0] = sqrt(2.0*M_PI);
\     for(k=1; k < a; k++) {
\       c[k] = exp(a-k) * pow(a-k, k-0.5) / k1_factrl;
\       k1_factrl *= -k;
\     }
\   }
\   accm = c[0];
\   for(k=1; k < a; k++) {
\     accm += c[k] / ( z + k );
\   }
\   accm *= exp(-(z+a)) * pow(z+a, z+0.5); /* Gamma(z+1) */
\   return accm/z;
\ }
\ include lib/fp3.4th

[UNDEFINED] gamma [IF]
[UNDEFINED] f**   [IF] include lib/falog.4th [THEN]
[UNDEFINED] (spouge_accuracy) [IF]
13 constant (spouge_accuracy)
[THEN]

(spouge_accuracy) floats array (coef)

: spouge_coef                          ( --)
  pi fdup f+ fsqrt (coef) f! 1 s>f     ( f: 1.0)
  (spouge_accuracy) 1 ?do
    (spouge_accuracy) i - s>f          ( f: 1.0 a-k)
    fover fover i 2* 1- s>f f2/ f**    ( f: 1.0 a-k 1.0 a-k^k-1/2)
    frot fexp f* fswap f/              ( f: 1.0 coeff)
    (coef) i floats + f!               ( f: 1.0)
    i negate s>f f*
  loop fdrop
;

: gamma                                ( f1 -- f2)
  fdup f0> 0= if FE.INVALID ferror ! exit then (coef) f@
  (spouge_accuracy) 1 ?do              ( f: z acc)
    fover i s>f f+                     ( f: z acc z+k)
    (coef) i floats + f@ fswap f/ f+   ( f: z acc+c[k]/z+k)
  loop

  fover fdup (spouge_accuracy) s>f f+  ( f: z acc z z+a)
  fdup frot 1 s>f 2 s>f f/ f+ f**      ( f: z acc z+a z+a^z+1/2)
  fswap fnegate fexp f* f*             ( f: z acc)
  fswap f/                             ( f: acc/z)
;

[DEFINED] 4TH# [IF]
  hide (spouge_accuracy)
  hide (coef)
[THEN]
[THEN]

\ fclear spouge_coef
\ 11 1 ?do i s>f 5 s>f f/ gamma f. cr loop fdepth .
