\ 4tH library - FROUND ZEN - Copyright 2009, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/zenfloat.4th

[UNDEFINED] FROUND [IF]
[UNDEFINED] FTRUNC [IF] include lib/zentrunc.4th [THEN]
: (fround) >r ftrunc r> if fnegate then ;

: fround
  dup 0< if                       \ if fractions
    2dup f0< >r                   \ save the sign
    fabs 2dup f>s 1 and           \ even and a half? just truncate..
    unless 2dup 2dup ftrunc f- 5 -1 f= if r> (fround) ;then then
    5 -1 f+ r> (fround)           \ add a half and truncate
  then
;

[DEFINED] 4TH# [IF] hide (fround) [THEN]
[THEN]
