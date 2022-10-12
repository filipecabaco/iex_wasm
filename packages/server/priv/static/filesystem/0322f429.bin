\ 4tH library - ANS haversine - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] haversine [IF]
[UNDEFINED] fsin      [IF] include lib/fsinfcos.4th [THEN]
[UNDEFINED] fasin     [IF] include lib/asinacos.4th [THEN]
[UNDEFINED] deg>rad   [IF] include lib/fdeg2rad.4th [THEN]

: difference f- deg>rad 2 s>f f/ fsin fdup f* ;
                                       ( n1 n2 -- n1-n2/2^2)
: haversine                            ( lat1 lon1 lat2 lon2 -- haversine)
  frot difference                      ( lat1 lat2 dLon*2)
  frot frot fover fover                ( dLon^2 lat1 lat2 lat1 lat2)
  fswap difference                     ( dLon^2 lat1 lat2 dLat^2)
  fswap deg>rad fcos                   ( dLon^2 lat1 dLat^2 lat2)
  frot  deg>rad fcos f*                ( dLon^2 dLat2 lat1*lat2)
  frot  f* f+                          ( lat1*lat2*dLon^2+dLat^2)
  fsqrt fasin 127456 s>f f* 10 s>f f/  ( haversine)
;

[DEFINED] 4TH# [IF]
  hide difference
[THEN]
[THEN]
\ fclear 100 set-precision
\ s" 3612e-2" s>float s" -8667e-2" s>float
\ s" 3394e-2" s>float s" -11840e-2" s>float
\ haversine f. ( 2887.25995060711)
