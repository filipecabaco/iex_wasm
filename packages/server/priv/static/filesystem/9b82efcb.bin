\ Copyright(2006): Albert van der Horst, HCC FIG Holland by GNU Public License 
\ Eratosthenes sliding sieve.

6 CONSTANT ppn        256 CONSTANT root 
 VARIABLE round    VARIABLE prime
 : cp.   round @ root * prime @ + . ;
 : inc   prime @ 1+   root MOD  DUP prime !
         0= IF 1 round +! THEN ; 
\ buf is a circular buffer that tabulates all prime divisors 
\ for cp .. cp+root 
 root ppn * constant /buf
 /buf string buf
 : buf[]   root MOD ppn * buf + ; ( offset -- adr) 
 : nodiv?   prime @ buf[] C@ 0= ;  ( -- flag)
 : <<   DUP 1+ SWAP ppn 1- MOVE ;   ( adr -- ) 
 : >>   DUP 1+ ppn 1- MOVE ;  ( adr -- ) 
 : remove   prime @ buf[]   DUP C@   SWAP << ; ( -- p)
 : add   prime @ OVER + buf[]   DUP >>   C! ; ( p -- )
 : transport   BEGIN remove add nodiv? UNTIL ; 
 : investigate   nodiv? IF cp. ELSE transport THEN ; 
 : investigate1   nodiv? IF cp. prime @ add ELSE transport THEN ;
 : check ; ( limit -- limit ) \ left as an ETTR. 
 : init   2 prime !   0 round !   buf /buf ERASE ;
 : primes  ( limit --) 
     check init 
     DUP root MIN 2 ?DO investigate1 inc  LOOP 
     root ?DO investigate inc  LOOP ;

10000 primes
