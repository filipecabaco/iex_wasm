\ --------------------------------------
\ Copyright 2009, George E. Hubert
\ Copyright 2012, Bernd Paysan
\ ** FCEIL and FTRUNC
\ ** Believed to be in the public domain
\ --------------------------------------

[UNDEFINED] FTRUNC [IF]
[UNDEFINED] FDUP   [IF] [ABORT] [THEN]
[UNDEFINED] FLOOR  [IF] [ABORT] [THEN]
: fceil  ( r1 -- r2 ) fnegate floor fnegate ;
: ftrunc ( r1 -- r2 ) fdup f0= 0= if fdup f0< if fceil else floor then then ;
[THEN]
