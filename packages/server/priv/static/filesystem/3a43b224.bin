\ 4tH library - DIGIT? - Copyright 2006,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] digit? [IF]
[char] A [char] 0 -              constant  'A'-'0'
[char] A [char] 0 10 + - negate +constant -'A'-'9'
         [char] 0        negate +constant -'0'

: digit?                               ( c -- n f )
  dup [char] Z > if bl xor then -'0' dup 'A'-'0' <
  if dup 9 > if drop base @ then else -'A'-'9' then dup 0< 0= over base @ < and
;
                                       ( n -- c)
: digit>c dup 9 > if 7 + then [char] 0 + ;

[DEFINED] 4TH# [IF]
  hide  'A'-'0'
  hide -'A'-'9'
  hide -'0'
[THEN]
[THEN]
