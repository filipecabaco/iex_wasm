\ 4tH Binary Tree Key/Value - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] put       [IF]
[UNDEFINED] find-node [IF] include lib/bintree.4th [THEN]
[UNDEFINED] fnv1a     [IF] include lib/hash.4th    [THEN]

: put                                  ( n1 n2 var --)
  dup @ NULL = if >r NULL insert-node r> ! exit then
  over over @ find-node dup NULL =     ( n1 n2 var node)
  if drop >r r@ @ insert-node r> ! else nip nip set-value then
;
                                       ( n1 var)
: get @ find-node dup NULL = if drop (error) else get-value then ;
: put$ >r fnv1a r> put ;               ( n1 a1 n2 var --)
: get$ >r fnv1a r> get ;               ( a1 n1 var --)
[THEN]

\ variable kv NULL kv !
\ 15 5 kv put 100 6 kv put 5 kv get .6 kv get . cr cr 25 s" alpha" kv
\ put$ 35 s" beta" kv put$ s" alpha" kv get$ . s" beta" kv get$ . cr
