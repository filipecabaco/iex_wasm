\ 4tH library - SAVE-FILE - Copyright 2003,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] within [IF]
[NEEDS lib/range.4th]
[THEN]

[UNDEFINED] save-file [IF]
: save-file >in @ cin source 4 ;        ( -- n1 h a n2 4)

: restore-file                          ( n1 h a n2 4 -- f)
  0<> >r over source over dup >r + between r> swap >r >r
  2dup r> -rot over + between r> or 0=  \ check if buffers do not overlap
  if rot [: use ;] catch 0= if source! >in ! r> 0= exit then then
  drop drop drop drop r>                \ Note: count is transformed to flag!
; 
[THEN]
