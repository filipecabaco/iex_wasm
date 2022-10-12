\ 4tH library - CHOOSE - Copyright 2004,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] NULL [IF]
include lib/constant.4th
[THEN]

[UNDEFINED] random [IF]
include lib/random.4th
randomize
[THEN]

[UNDEFINED] CHOOSE [IF]
: MANY   0 begin over over th @c NULL <> while 1+ repeat nip ;
: CHOOSE random * max-rand 1+ / ;
[THEN]
