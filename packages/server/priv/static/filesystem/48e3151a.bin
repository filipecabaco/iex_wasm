\ Random binary patterns
\ Copyright 2006, Frank Buss
\ Website: http://www.frank-buss.de
\ 4tH version Copyright 2006,2012 J.L. Bezemer

[UNDEFINED] random-bit [IF]
time value seed

: lrot ( u1 -- u2 ) dup 1 lshift swap (error) and if 1 or then ;
: rrot ( u1 -- u2 ) dup 1 rshift swap 1 and if (error) or then ;
: random-bit ( -- 1 | 0 ) seed dup rrot or seed lrot xor dup to seed 1 and ;
: random-pattern ( n -- x) 0 swap 0 do 1 lshift random-bit or loop ;
: random-char ( -- char) /char 8 * random-pattern ;
: random-cell ( -- cell) /cell 8 * random-pattern ;
[THEN]