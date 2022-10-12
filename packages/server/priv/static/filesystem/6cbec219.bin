\ Copyright 2006, Anton Ertl
\ ** Raising a float to an integer power
\ ** Believed to be in the public domain

[UNDEFINED] fpow  [IF]
[UNDEFINED] float [IF] [ABORT] [THEN]
  [DEFINED] ZenFP [IF] [ABORT] [THEN]
: fpow                                 ( f -- f') ( n --)
  dup
  if dup 1 = if drop else 2 /mod fdup fdup f* recurse fswap recurse f* then
  else drop fdrop 1 s>f
  then
;
[THEN]
