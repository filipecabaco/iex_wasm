\ This program prints numbers in canonical signed digit (CSD)
\ representation, a binary representation with the digits, 0, + (1), and -
\ (-1).  This allows creating numbers with few non-zero digits and is
\ useful for implementing multiplication by constants on machines
\ without hardware multipliers.

\ This programs was published by Rafael Deliano in Vierte Dimension
\ 1/2007, and adapted for ANS Forth (with common extensions) by Anton
\ Ertl.

[UNDEFINED] csd. [IF]
offset (SYM)
  char 0 c, char + c, char + c, char 0 c,
  char 0 c, char - c, char - c, char 0 c,

offset (Y+1)
  0 c, 0 c, 0 c, 1 c, 0 c, 1 c, 1 c, 1 c,

: csd.                                 ( u -- )
    1 lshift
    <#
    begin
        dup 7 and dup
        (SYM) hold
        (Y+1) swap 1 rshift
        -2 and or
    dup 0= until
    s>d #> type ;

[DEFINED] 4TH# [IF]
  hide (SYM)
  hide (Y+1)
[THEN]
[THEN]