\ 4tH library - Floored division - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Only works on systems with default symmetric division
\ (that means: if it doesn't work for you, there is a LOT that doesn't work).

\ Based on identity:
\    a mod n = (a/n - floor(a/n))*n => floor (a/n) = (a - a mod n) / n

\ And this page:
\    http://www.microhowto.info/howto/round_towards_minus_infinity_when_dividing_integers_in_c_or_c++.html

[UNDEFINED] |mod| [IF]                 ( n1 n2 -- |_n1%n2_|)
: |mod| tuck mod over 0< over 0< <> over 0<> and if + else nip then ;
: |/mod| over over |mod| swap >r tuck - r> / ;
: |/| |/mod| nip ;                     ( n1 n2 -- |_n1/n2_|)
[THEN]

\ 0 1 |/mod| . . cr                 ( 0 0)
\ 1 1 |/mod| . . cr                 ( 1 0)
\ 2 1 |/mod| . . cr                 ( 2 0)
\ -1 1 |/mod| . . cr                ( -1 0)
\ -2 1 |/mod| . . cr                ( -2 0)
\ 0 -1 |/mod| . . cr                ( 0 0)
\ 1 -1 |/mod| . . cr                ( -1 0)
\ 2 -1 |/mod| . . cr                ( -2 0)
\ -1 -1 |/mod| . . cr               ( 1 0)
\ -2 -1 |/mod| . . cr               ( 2 0)
\ 2 2 |/mod| . . cr                 ( 1 0)
\ -1 -1  |/mod| . . cr              ( 1 0)
\ -2 -2 |/mod| . . cr               ( 1 0)
\ 7 3 |/mod| . . cr                 ( 2 1)
\ 7 -3 |/mod| . . cr                ( -3 -2)
\ -7 3 |/mod| . . cr                ( -3 2))
\ -7 -3 |/mod| . . cr               ( 2 -1)
\ max-n 1 |/mod| . . cr             ( max-n 0)
\ (error) 1 |/mod| . . cr           ( error 0)
\ max-n max-n |/mod| . . cr         ( 1 0)
\ (error) (error) |/mod| . . cr     ( 1 0)
