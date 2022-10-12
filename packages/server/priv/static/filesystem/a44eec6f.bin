\ Lucas-Lehmer Test: for p an odd prime, the Mersenne number 2^p − 1 is prime
\ if and only if 2^p − 1 divides S(p − 1) where S(n + 1) = (S(n))^2 − 2,
\ and S(1) = 4 .

\ Task: Calculate all Mersenne primes up to the implementation's
\ maximum precision

: lucas-lehmer
  1+ 2 do
    4 i 2 <> * abs swap 1+ dup + 1- swap
    i 1- 1 ?do dup * 2 - over mod loop 0= if ." M" i . then
  loop cr
;

1 31 lucas-lehmer