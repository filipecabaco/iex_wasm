\ Towers of Hanoi, Raul Deluth Miller's version
\ Provided by Marcel Hendrix

: MOVERING ( depth dir -- depth dir ) 
                 ." Moving disk '" DUP 0 .R ." '" cr ;

offset TO! ( direction -- otherdirection )
                 0 c, 2 c, 1 c, 
                 5 c, 0 c, 3 c, 
                 7 c, 6 c,             \ use alternate dest 

offset FRO! ( direction -- otherdirection )
                 0 c, 7 c, 5 c, 
                 6 c, 0 c, 2 c, 
                 3 c, 1 c,             \ use alternate source 

: SMALLER ( depth direction -- depth-1 direction ) 
                 SWAP 1- SWAP ; 

: BIGGER ( depth direction -- depth+1 direction ) 
                 SWAP 1+ SWAP ; 

: HANOI ( depth direction -- depth direction ) 
   smaller 
        OVER IF  to!  RECURSE  to! 
                      movering 
                 fro! RECURSE  fro! 
           ELSE  movering 
           THEN 
   bigger ; 

.( Using a table: ) cr 10 1 hanoi 2DROP