\ 4tH library - ZEN haversine - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] haversine [IF]
[UNDEFINED] fsin      [IF] include lib/zenfsin.4th  [THEN]
[UNDEFINED] fasin     [IF] include lib/zenfasin.4th [THEN]
[UNDEFINED] fsqrt     [IF] include lib/zenfsqrt.4th [THEN]
[UNDEFINED] deg>rad   [IF] include lib/zendegrd.4th [THEN]

: difference f- deg>rad 2 s>f f/ fsin 2dup f* ;
                                       ( n1 n2 -- n1-n2/2^2)
: haversine                            ( lat1 lon1 lat2 lon2 -- haversine)
  2rot difference                      ( lat1 lat2 dLon*2)
  2rot 2rot 2over 2over                ( dLon^2 lat1 lat2 lat1 lat2)
  2swap difference                     ( dLon^2 lat1 lat2 dLat^2)
  2swap deg>rad fcos                   ( dLon^2 lat1 dLat^2 lat2)
  2rot  deg>rad fcos f*                ( dLon^2 dLat2 lat1*lat2)
  2rot  f* f+                          ( lat1*lat2*dLon^2+dLat^2)
  fsqrt fasin 127456 s>f f* 10 s>f f/  ( haversine)
;

[DEFINED] 4TH# [IF]
  hide difference
[THEN]
[THEN]
\ 3612 -2 -8667 -2 3394 -2 -11840 -2 haversine f. ( 2887.25995060711)
