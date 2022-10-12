\ --------------------------------------
\ Copyright 2012, Bernd Paysan
\ ** FCEIL and FTRUNC
\ ** Believed to be in the public domain
\ --------------------------------------

[UNDEFINED] ftrunc [IF]
[UNDEFINED] floor  [IF] include lib/zenfloor.4th [THEN]
: fceil  ( r1 -- r2 ) fnegate floor fnegate ;
: ftrunc ( r1 -- r2 ) 2dup f0< if fceil else floor then ;
[THEN]
