\ Taken from http://rosettacode.org 
\ 4tH version 2011,2012 Hans Bezemer

[UNDEFINED] >gray [IF]
: >gray dup 2/ xor ;                   ( n -- n )

: gray>                                ( n -- n )
  0  1 /cell 8 * 1- lshift             ( g b mask )
  begin >r 2dup 2/ xor r@ and or r> 1 rshift dup 0= until
  drop nip
;
[THEN]