\ Coos Haak, published on c.l.f. 10 Mar 2016 09:28:02
\ Believed to be in the public domain

[UNDEFINED] split-text [IF]
[UNDEFINED] search     [IF] include lib/search.4th [THEN]

: SPLIT-TEXT                           ( a1 n1 a2 n2 -- a3 n3 a1 n4 )
  >r >r 2dup r> r@ search
  if r> over >r /string 2swap r> -
  else 2drop 0 dup 2swap r> drop
  then
;
[THEN]

\ s" foo:=bar" s" :=" split-text type space type  cr