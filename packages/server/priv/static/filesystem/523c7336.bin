\ zenfsinh.4th    --- written by Hugh Aguilar --- copyright (c) 2009, BSD license
\ 4tH Zen version --- written by Hans Bezemer --- copyright (c) 2012, GPL license

[UNDEFINED] fsinh  [IF]
[UNDEFINED] fexpm1 [IF] include lib/zenexpm1.4th [THEN]

: fsinh                                \ float: n -- sinh(n)
  2dup f0< >r fabs fexpm1 2dup 2dup 1 s>f f+ f/ f+ 2 s>f f/ r> if fnegate then
;
                                       \ float: n -- cosh(n)
: fcosh fabs fexpm1 2dup 2 s>f f+ 2over 1 s>f f+ f/ f+ 2 s>f f/ ;
: ftanh 2 s>f f* fexpm1 2dup 2 s>f f+ f/ ;
                                       \ float: n -- tanh(n)
[THEN]
