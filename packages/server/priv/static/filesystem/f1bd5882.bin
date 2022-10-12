\ 4tH library - TRIPLE >TNUMBER - Copyright 2015, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >tnumber [IF]
[UNDEFINED] digit?   [IF] [needs lib/digit.4th]  [THEN]
[UNDEFINED] tu*      [IF] [needs lib/triple.4th] [THEN]
[UNDEFINED] E.LIBERR [IF] [needs lib/throw.4th]  [THEN]

: >tnumber                             ( ut1 a1 u1 -- ut2 a2 u2)
  >r                                   ( u1 u2 u3 a )
  begin                                ( u1 u2 u3 a )
    dup r@                             ( u1 u2 u3 a a n)
  while                                ( u1 u2 u3 a a)
    c@ digit?                          ( u1 u2 u3 a n f)
  while                                ( u1 u2 u3 a n)
    swap >r >r                         ( u1 u2 u3)
    base @ tu* r> 0 dup t+ r> char+    ( u1 u2 u3 a)
    r> 1- >r                           ( u1 u2 u3 a)
  repeat                               ( u1 u2 u3 a)
  drop r>
;

: >triple                              ( a n -- t f+ | f-)
  over c@ [char] - = dup >r if chop then 2>r 0 dup dup 2r> >tnumber
  r> swap >r nip if tnegate then r@ if drop drop drop then r> 0=
;
                                       ( a n -- t)
: s>triple >triple 0= E.LIBERR throw" Bad triple" ;
[THEN]

\ s" -295147905179352825855" s>triple . . . cr depth .
