\ Stack sort, copyright 1983, Dr. Richard H. Turpin
\ Purdue University Indianapolis, Indiana
\ Enhanced and ported to 4tH by Hans Bezemer, 2010

[UNDEFINED] ascending [IF]
0 value #sort defer (?)

: (gt) > ;
: (lt) < ;
: (sink) depth #sort - 0> if over over (?) if swap then >r recurse r> then ;
: (sort) 1 max depth 1- min depth over - to #sort 1- 0 ?do (sink) loop ;
: ascending  ['] (lt) is (?) (sort) ;
: descending ['] (gt) is (?) (sort) ;

[DEFINED] 4TH# [IF]
  hide #sort
  hide (?)
  hide (gt)
  hide (lt)
  hide (sink)
  hide (sort)
[THEN]
[THEN]

\ include lib/anstools.4th
\ 25 -4 326 1 25 0 -628 75 3 descending .s
