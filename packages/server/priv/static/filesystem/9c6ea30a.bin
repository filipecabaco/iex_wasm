\ 4tH library - GCD LCD - Copyright 2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] gcd [IF]
\ greatest common denominator
: gcd ( u1 u2 -- u3 )
      begin
         tuck mod dup 0=
      until drop ;

\ least common denominator
: lcd ( u1 u2 -- u3 )
      2dup gcd */ ;
[THEN]
