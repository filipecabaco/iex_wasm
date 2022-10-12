\ DWITHIN - josv@planet.nl Tuesday 29 March 2016 13:37:24
\ comp.lang.forth - believed to be in the public domain

[UNDEFINED] d+    [IF]
[UNDEFINED] 2over [IF] include lib/ansdbl.4th  [THEN]
: dwithin 2over d- 2>r d- 2r> du< ;    ( n limit1 limit2+1 -- f )
: dbetween 1 u>d d+ dwithin ;          ( n limit1 limit2 -- f )
[THEN]
