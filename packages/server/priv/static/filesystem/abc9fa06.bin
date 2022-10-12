\ 4tH library - TOOLBELT STARTS?/ENDS? - Copyright 2003,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] STARTS? [IF]
[UNDEFINED] 2OVER   [IF] [NEEDS lib/anscore.4th] [THEN]
[UNDEFINED] COMPARE [IF] [NEEDS lib/compare.4th] [THEN]
                                       ( str len pat len2 -- str len flag )
: starts? dup >r 2over r> min compare 0= ;
: ends? dup >r 2over dup r> - 0 max /string compare 0= ;
                                       ( str len pat len2 -- str len flag )
[DEFINED] casesensitive [IF]
: equals? 2over compare 0= ;           ( str /str pat /pat -- str /str flag )
[ELSE]
: similar? 2over compare 0= ;          ( str /str pat /pat -- str /str flag )
[THEN]
[THEN] 

