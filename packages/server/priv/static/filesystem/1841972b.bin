\ 4tH library - TOKENIZE - Copyright 2004,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] IS-TYPE [IF]
[UNDEFINED] ?NOT    [IF] [NEEDS lib/yesno.4th] [THEN]
defer is-type                          ( c -- f)

: (-tokenize)                          ( a1 n2 xt -- a2 n2 )
  is ?not begin dup while 2dup 1- chars + c@ is-type ?not while 1- repeat
;
                                       ( a1 n2 xt -- a2 n2)
: (tokenize) is ?not begin dup while over c@ is-type ?not while chop repeat ;
: scan> ['] (no)  (tokenize) ;         ( a1 n1 -- a2 n2 )
: scan< ['] (no)  (-tokenize) ;        ( a1 n1 -- a2 n2 )
: skip> ['] (yes) (tokenize) ;         ( a1 n1 -- a2 n2 )
: skip< ['] (yes) (-tokenize) ;        ( a1 n1 -- a2 n2 )
: split> 2dup scan> 2swap >r over r> swap - ;
: split< dup >r scan< 2dup chars + -rot r> over - -rot ;
                                       ( a1 n1 -- a2 n2 a3 n3)
[DEFINED] 4TH# [IF]
  hide (TOKENIZE)
  hide (-TOKENIZE)
[THEN]
[THEN]
