\ Taken from http://rosettacode.org
\ 4tH version 2010,2021 Hans Bezemer

[UNDEFINED] ackermann [IF]
: ackermann                            ( m n -- u )
  over case                            ( case statement)
    0 of nip 1+     ;endof
    1 of nip 2 +    ;endof
    2 of nip 2* 3 + ;endof
    3 of swap 5 + swap lshift 3 - ;endof
  endcase

  swap 1- swap dup
  if 1- over 1+ swap recurse recurse ;then
  1+ recurse
;
[THEN]
