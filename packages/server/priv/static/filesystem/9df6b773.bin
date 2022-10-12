\ 4tH library - WILDCARD - Copyright 2006,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ /* Written by Jack Handy - jakkhandy@hotmail.com */
\ int wildcmp (const char *wild, const char *string) {
\   const char *cp = NULL, *mp = NULL;

\   while ((*string) && (*wild != '*')) {
\      if ((*wild != *string) && (*wild != '?')) return 0;
\      wild++; string++;
\   }

\   while (*string) {
\     if (*wild == '*') {
\       if (!*++wild) return 1;
\       mp = wild; cp = string + 1;
\     } else if ((*wild == *string) || (*wild == '?')) {
\       wild++; string++;
\     } else { wild = mp; string = cp++; }
\   }

\   while (*wild == '*') wild++;

\   return !*wild;
\ }

\ Typical use: s" blah.jpg" s" bl?h.*g" match-wild

[UNDEFINED] match-wild [IF]
[UNDEFINED] 4drop      [IF] include lib/4dup4rot.4th [THEN]
                                       \ get wildcard character safely
: (w@) dup 0> if over c@ else dup then ;
                                       \ current char matches or equals '?'
: (match-or-?)                         ( a1 n1 wa1 wa1 -- a2 n2 wa2 wn2 f)
  2>r over c@ 2r> rot >r (w@) dup [char] ? = swap r> = or
  dup >r if 2>r chop 2r> chop then r>  \ increment pointers on match
;
                                       \ wildcard routine
: match-wild                           ( a n wa wa -- f)
  begin
    >r over r> swap                    \ we still have a string?
  while
    (w@) [char] * <>                   \ wildcard character unequal to '*'?
  while                                \ if so, try to match character
    (match-or-?) 0= if 4drop false exit then
  repeat                               \ if not, exit and return false
[UNDEFINED] 4TH# [IF] then [THEN] 2dup 2dup 2>r 2>r 
                                       \ set up temporary pointers
  begin
    >r over r> swap                    \ we still have a string?
  while
    (w@) [char] * =                    \ wildcard character equals '*'?
    if                                 \ if so, drop temporary values
      2r> 2r> 4drop chop dup 0>        \ chop wildcard string, exit if done
      if 2dup 2>r 2over chop 2>r else 4drop true exit then
    else                               \ if not, save new temporary values
      (match-or-?) 0=                  \ try to match character
      if 4drop 2r> 2r@ 2over chop 2>r then
    then                               \ if no match, restore values
  repeat 2nip 2r> 2r> 4drop            \ drop string and temporary values
                                       \ get rid of superfluous '*'
  begin dup 0> while over c@ [char] * = while chop repeat
[UNDEFINED] 4TH# [IF] then [THEN] nip 0> 0=
;                                      \ wildcard string should be empty now

[DEFINED] 4TH# [IF]
  hide (match-or-?)
  hide (w@)
  hide 4drop
[THEN]
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
