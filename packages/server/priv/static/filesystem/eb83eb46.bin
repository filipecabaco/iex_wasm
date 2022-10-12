\ Example code recursion
\ Copyright 1997 HanSoft & Partners

: factorial1
  dup 2 >
  if
    dup 1-
    recurse *
  then
;

: factorial2
  dup 2 >
  if
    dup 1-
    factorial2 *
  then
;

: factorial3
  dup

  begin
    dup 2 >
  while
    1- swap over * swap
  repeat

  drop
;

10 factorial1 . cr
10 factorial2 . cr
10 factorial3 . cr

