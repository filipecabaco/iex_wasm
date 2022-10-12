\ 4tH library - Fast double exponentiation - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] D**      [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
[UNDEFINED] D*       [IF] include lib/mixed.4th [THEN]

\  Function exp_by_squaring_iterative(x, n)
\    if n < 0 then
\      x := 1 / x;
\      n := -n;
\    if n = 0 then return 1
\    y := 1;
\    while n > 1 do
\      if n is even then 
\        x := x * x;
\        n := n / 2;
\      else
\        y := x * y;
\        x := x * x;
\        n := (n – 1) / 2;
\    return x * y

: D**                            ( d n -- d^n)
  dup 0< E.LIBERR throw" Negative exponent"
  dup unless drop 2drop 1 u>d ;then
  1 u>d 2>r
  begin
    dup 1 >
  while
    dup 1 and if -rot 2dup 2r> d* 2>r rot 1- then
    2/ -rot 2dup d* rot
  repeat drop 2r> d*
;
[THEN]





  
  
