\ Based on: http://leetcode.com/2011/09/regular-expression-matching.html
\ Believed to be in the public domain

\ 4tH version by J.L. Bezemer 2014

\ bool isMatch(const char *s, const char *p) {
\   assert(s && p);
\   if (*p == '\0') return *s == '\0';

\   // next char is not '*': must match current character
\   if (*(p+1) != '*') {
\     assert(*p != '*');
\     return ((*p == *s) || (*p == '.' && *s != '\0')) && isMatch(s+1, p+1);
\   }
\   // next char is '*'
\   while ((*p == *s) || (*p == '.' && *s != '\0')) {
\     if (isMatch(s, p+2)) return true;
\     s++;
\   }
\   return isMatch(s, p+2);
\ }

[UNDEFINED] match-reg [IF]
[UNDEFINED] 2over     [IF] include lib/anscore.4th [THEN]

: (match-or-dot)                       ( a n ra rn -- a n ra rn f)
  2over if >r over c@ dup r> c@ = >r [char] . = r> or else dup xor then
;

: match-reg                            ( a n ra rn -- f)
  dup 0> if                            \ pattern not exhausted?
    dup 1 > dup if drop over char+ c@ [char] * = then 0=
    if                                 \ next character is not a '*'
      (match-or-dot)                   \ must match the current character
      if 2swap chop 2swap chop recurse else 2drop 2drop false then exit
    then                               \ recurse if chars equal or '.'

    begin                              \ next character is a '*'
      (match-or-dot)                   \ repeat while match-or-dot
    while
      2over 2over chop chop recurse if 2drop 2drop true exit then
      2>r chop 2r>                     \ next char from examined string
    repeat chop chop recurse exit
  then
                                       \ return result from condition
  2drop nip 0=                         \ that string examined is empty
;

[DEFINED] 4TH# [IF] hide (match-or-dot) [THEN]
[THEN]

\ s" aa" s" a"    match-reg . cr
\ s" aa" s" aa"  match-reg . cr
\ s" aaa" s" aa"  match-reg . cr
\ s" aa" s" a*"  match-reg . cr
\ s" aa" s" .*"  match-reg . cr
\ s" ab" s" .*"  match-reg . cr
\ s" aab" s" c*a*b"  match-reg . cr depth .
