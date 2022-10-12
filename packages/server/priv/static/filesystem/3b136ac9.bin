\ code to support Project Euler problem 27

include lib/pickroll.4th

: ?prime  ( n -- f )                   \ check is number is prime
  dup 1 >                              \ only test when positive
  if  1 begin   1+ 2dup  /  2dup >     \ treat negative numbers,
          if 2drop dup 1 then          \ zero, and one as non-prime
          over * 2 pick =
        until  =
  else  drop FALSE
  then
;

: numprimes ( a b -- num )             \ find # of primes made by n^2+an+b
  1000 0
  do  2dup  i rot over + * +
    ?prime not                         \ test if prime
    if  2drop i  leave  then           \ if not, then return count
  loop                                 \ else keep testing
;

1 41 numprimes . cr                    \ should print 40
2 41 numprimes . cr                    \ should print 1 