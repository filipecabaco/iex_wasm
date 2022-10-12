\ sinhcosh.4th    --- written by Hugh Aguilar --- copyright (c) 2009, BSD license
\ 4tH ANS version --- written by Hans Bezemer --- copyright (c) 2012, GPL license

[UNDEFINED] fsinh  [IF]
[UNDEFINED] fexpm1 [IF] include lib/fexpm1.4th [THEN]

: fsinh                                \ float: n -- sinh(n)
  fdup f0< >r fabs fexpm1 fdup fdup 1 s>f f+ f/ f+ f2/ r> if fnegate then
;
                                       \ float: n -- cosh(n)
: fcosh fabs fexpm1 fdup 2 s>f f+ fover 1 s>f f+ f/ f+ f2/ ;
: ftanh f2* fexpm1 fdup 2 s>f f+ f/ ;
                                       \ float: n -- tanh(n)
[THEN]
