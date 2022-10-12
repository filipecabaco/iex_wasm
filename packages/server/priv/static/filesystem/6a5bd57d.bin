\ Line burst - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] burst [IF]
[UNDEFINED] line  [IF] [ABORT] [THEN]
[UNDEFINED] (sin) [IF] include lib/math.4th [THEN]

defer (burst)                          ( x1 y1 x2 y2 --)

: (xy+) 5000 + 10000 / + ;             ( n1 n2*10K -- n1+n2/10K)

: burst                                ( x y r #lines xt --)
  is (burst)                           ( x y r #lines)
  PI*10K 2* over / swap 0 tuck         ( x y r step curr #lines 0) 
  ?do                                  ( x y r step curr)
     swap >r >r >r                     ( x y R: step curr r)
     over over over                    ( x y x y x R: step curr r)
     r'@ (sin) r@ * (xy+) over         ( x y x y x' y R: step curr r)
     r'@ (cos) r@ * (xy+) (burst)      ( x y )
     r> r> r> tuck +                   ( x y r curr step)
  loop drop drop drop drop drop        ( --)
;

[DEFINED] 4TH# [IF]
  hide (xy+)
  hide (burst) 
[THEN]
[THEN]

