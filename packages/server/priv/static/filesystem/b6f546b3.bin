\ 4tH library - TOOLBELT TRIM - Copyright 2003,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] TRIM     [IF]
[UNDEFINED] IS-WHITE [IF] [NEEDS lib/istype.4th]   [THEN]
[UNDEFINED] IS-TYPE  [IF] [NEEDS lib/tokenize.4th] [THEN]
                                       ( str len -- str+i len-i )
: bl-skip ['] is-white is is-type skip> ;
: bl-scan ['] is-white is is-type scan> ;
: trim    ['] is-white is is-type skip< ;
                                       ( str len -- str len-i )
[THEN]