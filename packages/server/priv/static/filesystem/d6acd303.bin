\ Believed to be in the public domain
\ 4tH port, J.L. Bezemer 2017

include lib/fp2.4th
[DEFINED] ZenFP [IF] include lib/zenfsqrt.4th [THEN]

\ 10 a = 1.0
\ 20 b = 1/SQR(2)
\ 30 c = 0.25
\ 40 d = 1.0
\ 50 FOR x = 1 TO 4
\ 60 y = a
\ 70 a = (b+a)/2
\ 80 b = SQR(b*y)
\ 90 c = c - (d*(a - y)^2)
\ 100 d = d*2
\ 110 NEXT x
\ 120 PRINT ((a + b)^2)/(4*c)

float array acc

: tamura-kanada                        ( n -- fpi)
  >r 1 s>f 4 s>f f/ acc f!
  1 s>f fdup 2 s>f fsqrt f/ fswap      ( f: b a)
  1 r> over                            ( 1 n 1)

  do                                   ( f: b a)
    >r fover fover f+ 2 s>f f/         ( f: b y a')
    frot frot fswap fover f* fsqrt     ( f: a' y b')
    frot frot fover fswap f- fdup f*   ( f: b' a' a'-y^2)
    r@ s>f f* acc f@ fswap f- acc f! r> 2*
  loop drop

  f+ fdup f* acc f@ 4 s>f f* f/
;

fclear 5 tamura-kanada f. cr