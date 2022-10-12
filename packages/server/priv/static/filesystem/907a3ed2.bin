\ 4tH library - WILDCARD - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] match-wild [IF]
[UNDEFINED] 4drop      [IF] include lib/4dup4rot.4th [THEN]
: match-wild
  begin
    dup                                \ exit when match string is exhausted
  while
    over c@ [char] ? =                 \ match any character
    if                                 \ except empty string
      >r over r> swap 0= if 4drop false exit then
      2>r chop 2r> chop                \ okay, next one please
    else
      over c@ [char] * =               \ match zero or more characters
      if                               \ because we eat one character
        4dup chop recurse if 4drop true exit then
        >r over r> swap if 2over chop 2over recurse else false then
        >r 4drop r> exit               \ from match string, recursion stops
      else                             \ nothing worked with this wildcard
        2over if                       \ not an empty string?
          c@ >r over c@ r> =           \ if so, compare both characters
          if 2>r chop 2r> chop else 4drop false exit then
        else                           \ otherwise, it's no use going on
          drop 4drop false exit
        then
      then
    then
  repeat                               \ get next character
  >r drop nip r> or 0=                 \ only a match if both are at the end
;

[DEFINED] 4TH# [IF] hide 4drop [THEN]
[THEN]

\ s" abracadabra"    s" ?b*r?"  match-wild . cr
\ s" pArka"          s" *a"     match-wild . cr
\ s" parka"          s" *a"     match-wild . cr
\ s" park"           s" *a*"    match-wild . cr
\ s" a"              s" a"      match-wild . cr
\ s" aardvark"       s" a*"     match-wild . cr
\ 0 dup              s" *"      match-wild . cr cr

\ s" argh"           s" a"      match-wild . cr
\ s" ba"             s" a"      match-wild . cr
\ s" badger"         s" a*"     match-wild . cr
\ s" park"           s" *a"     match-wild . cr
\ s" perk"           s" *a*"    match-wild . cr
\ s" abracadabr"     s" ?b*r?"  match-wild . cr
\ s" abracadabzr"    s" ?b*r?"  match-wild . cr depth .
