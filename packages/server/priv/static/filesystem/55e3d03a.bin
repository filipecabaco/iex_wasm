\ Edit distance - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In information theory and computer science, the Levenshtein distance is a
\ metric for measuring the amount of difference between two sequences (i.e.
\ an edit distance). The Levenshtein distance between two strings is defined
\ as the minimum number of edits needed to transform one string into the
\ other, with the allowable edit operations being insertion, deletion, or
\ substitution of a single character.

\ This function was NOT added to the library, because even with a distance
\ of eight, it takes SECONDS to finish!

: levenshtein                          ( a1 n1 a2 n2 -- n3)
  dup                                  \ if either string is empty, difference
  if                                   \ is inserting all chars from the other
    2>r dup
    if
      2dup 1- chars + c@ 2r@ 1- chars + c@ =
      if
        1- 2r> 1- recurse exit
      else                             \ else try:
        2dup 1- 2r@ 1- recurse -rot    \   changing first letter of s to t;
        2dup    2r@ 1- recurse -rot    \   remove first letter of s;
        1- 2r> recurse min min 1+      \   remove first letter of t,
      then                             \ any of which is 1 edit plus 
    else                               \ editing the rest of the strings
      2drop 2r> nip
    then
  else
    2drop nip
  then
;

s" kitten"      s" sitting"       levenshtein . cr
s" rosettacode" s" raisethysword" levenshtein . cr