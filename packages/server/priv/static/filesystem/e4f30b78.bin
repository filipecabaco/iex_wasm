\ 4tH library - BITFIELD - Copyright 2011, 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] bn@ [IF]
: (mask) 1 swap lshift 1- ;            ( n1 -- n2)
: bn@ (mask) >r rshift r> and ;        ( cell bit len -- n)
: bn! over >r (mask) dup >r swap lshift invert and swap r> and r> lshift or ;
: b@ 2>r @ 2r> bn@ ;                   ( var bit len -- n)
: b! 2>r tuck @ 2r> bn! swap ! ;       ( n var bit len --)
: bc@ 2>r c@ 2r> bn@ ;                 ( addr bit len -- n)
: bc! 2>r tuck c@ 2r> bn! swap c! ;    ( n addr bit len --)
[DEFINED] 4TH# [IF] hide (mask) [THEN]
[THEN]
