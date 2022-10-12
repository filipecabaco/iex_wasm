\ split-path.4th
\ Split a string containing a path+filename into a path name and file name.
\ Published at c.l.f. RG_gol584i8/emkwabeKBgAJ
\ Believed to be in the public domain

[UNDEFINED] extract-path [IF]
: is-path-delim?                       ( c -- flag )
  dup dup [char] \ = swap [char] / = or swap [char] : = or
;

: extract-path                         ( c-addr u1 -- c-addr u2 )
  over 1- chars + 
  begin over over < while dup c@ is-path-delim? except char- repeat
  over over < if char+ then over -
;

: split-pathname                       ( c-addr1 u1 -- c-addr2 u2 c-addr3 u3 )
  2dup + >r extract-path 2dup type cr 2dup + r> over -
; 
[THEN]

