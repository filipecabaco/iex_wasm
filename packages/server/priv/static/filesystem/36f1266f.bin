\ A Mersenne number is a number in the form of (2^P)-1.

\ If P is prime, the Mersenne number may be a Mersenne prime (if P is not
\ prime, the Mersenne number is also not prime).

\ In the search for Mersenne prime numbers it is advantageous to eliminate
\ exponents by finding a small factor before starting a, potentially lengthy,
\ Lucas-Lehmer test.

\ There are very efficient algorithms for determining if a number divides
\ (2^P)-1 (or equivalently, if 2P mod (the number) = 1). Some languages
\ already have built-in implementations of this exponent-and-mod operation
\ (called modPow or similar).

include lib/locals.4th

: prime? ( odd -- ? )
  3
  begin 2dup dup * >=
  while 2dup mod 0=
        if 2drop false exit
        then 2 +
  repeat   2drop true ;
 
: 2-exp-mod
  2 locals 1
  -1 30 do
    :a @ 1 i lshift >= if
      dup *
      :a @ 1 i lshift and if 2* then
      :b @ mod
    then
  -1 +loop end-locals ;
 
: factor-mersenne ( exponent -- factor )
  16384 over /  dup 2 < abort" Exponent too large!"
  1 do
    dup i * 2* 1+      ( q )
    dup prime? if
      dup 7 and  dup 1 = swap 7 = or if
        2dup 2-exp-mod 1 = if
          nip unloop exit
        then
      then
    then drop
  loop drop 0 ;

 929 factor-mersenne .  cr \ 13007
4423 factor-mersenne .  cr \ 0