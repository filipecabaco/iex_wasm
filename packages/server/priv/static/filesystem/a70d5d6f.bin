\ 4tH library - >NUMBER - Copyright 2006,2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] digit? [IF]
[needs lib/digit.4th]
[THEN]

[UNDEFINED] >snumber [IF]
: >snumber                             ( n1 a1 n2 -- n3 a2 n4)
  >r                                   \ save count
  begin                                ( n a)
    dup r@                             \ any characters left to convert?
  while                                ( n a a)
    c@ digit?                          \ is current character a digit?
  while                                ( n a n2) 
    swap >r >r                         ( n)
    base @ * r> + r> char+             \ add digit and adjust string
    r> 1- >r                           ( n a)
  repeat                               ( n a)
  drop r>                              \ drop digit and count
;

[UNDEFINED] >number [IF]               \ create the alias >NUMBER
  aka >snumber >number                 \ if it hasn't been defined already
[THEN]
[THEN]
