\ If x is very small, directly computing exp(x) - 1 can be inaccurate.
\ Numerical libraries often include a function expm1 to compute this
\ function. The need for such a function is easiest to see when x is
\ extremely small. If x is small enough, exp(x) = 1 in machine arithmetic
\ and so exp(x) - 1 returns 0 even though the correct result is positive.
\ All precision is lost. If x is small but not so extremely small, direct
\ computation still loses precision, just not as much.

\ double expm1(double x)
\ {
\   if (fabs(x) < 1e-6) return x + 0.5*x*x; else return exp(x) - 1.0;
\ }

\ This code is in the public domain. Do whatever you want to with it,
\ no strings attached.

[UNDEFINED] fexpm1 [IF]
[UNDEFINED] fexp   [IF] include lib/fexp.4th [THEN]
: fexpm1
  fdup fabs 1 s>f 1000000 s>f f/ f<
  if fdup fdup f* f2/ f+ else fexp 1 s>f f- then
;
[THEN]

