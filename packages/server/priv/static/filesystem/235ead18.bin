\ 4tH library - Fast integer exponentiation - Copyright 2020, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] **       [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]

\ EXP (b, n)
\ let a := 1
\ repeat
\   if n AND 1 then let a := a⋆b
\   let n := n div 2
\   let b := b⋆b
\ until n=0
\ return a

: **                            ( n1 n2 -- n1^n2)
  dup 1 = if drop ;then
  dup 0< E.LIBERR throw" Negative exponent"
  1 >r begin dup 1 and if over r> * >r then 2/ swap dup * swap dup 0= until
  drop drop r>
;
[THEN]

