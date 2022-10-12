\ 4tH library - FSIN FCOS - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] fsin    [IF]
  [DEFINED] ZenFP   [IF] [ABORT] [THEN]
[UNDEFINED] pi      [IF] include lib/fpconst.4th [THEN]

float array _a1 s" -1.666666666640169148537065260055e-1" s>float _a1 f!
float array _a2 s" 8.333333316490113523036717102793e-3"  s>float _a2 f!
float array _a3 s" -1.984126600659171392655484413285e-4" s>float _a3 f!
float array _a4 s" 2.755690114917374804474016589137e-6"  s>float _a4 f!
float array _a5 s" -2.502845227292692953118686710787e-8" s>float _a5 f!
float array _a6 s" 1.538730635926417598443354215485e-10" s>float _a6 f!

: fsin
  pi fdup f+                           ( x pi2)
  fover fover f/                       ( x pi2 x/pi2)
  floor fover f*                       ( x pi2 mod)
  frot fswap f-                        ( pi2 mod)
  pi fover                             ( pi2 mod pi mod)
  f< if fswap f- else fnip then

  fdup fdup f*
  _a6 f@ fover f*
  _a5 f@ f+ fover f*
  _a4 f@ f+ fover f*
  _a3 f@ f+ fover f*
  _a2 f@ f+ fover f*
  _a1 f@ f+ f*
  1  s>f f+ f*
;

: fcos pi f2/ fswap f- fsin ;
: fsincos fdup fsin fswap fcos ;
: ftan fsincos f/ ;                    \ ftan = fsin / fcos

[DEFINED] 4tH# [IF]
  hide _a6
  hide _a5
  hide _a4
  hide _a3
  hide _a2
  hide _a1
[THEN]
[THEN]

