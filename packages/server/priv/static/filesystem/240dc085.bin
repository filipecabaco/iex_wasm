\ 4tH library - SBREAK - Copyright 2009,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sbreak [IF]                ( c +f a1 a2 -- f)
[UNDEFINED] break? [IF] include lib/breakq.4th [THEN]
                                       \ search for c between a1 and a2
: sbreak                               ( a1 n1 a2 n2 -- a3 f)
  bounds 2>r bounds                    \ calculate addresses
  begin over over > while dup c@ true 2r@ break? while 1+ repeat
  2r> 2drop tuck <>                    \ make flag and cleanup
;
                                       \ reverse character search
: -sbreak                              ( a1 n1 a2 n2 -- a3 f)
  bounds 2>r bounds 1- swap 1-         \ calculate addresses
  begin over over < while dup c@ true 2r@ break? while 1- repeat
  2r> 2drop tuck <>                    \ make flag and clean up
;
[THEN]
