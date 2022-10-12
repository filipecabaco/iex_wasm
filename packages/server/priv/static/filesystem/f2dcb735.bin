\ 4tH library - S>ESCAPE - Copyright 2008,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ RfD: Escaped Strings S\"
\ 23 November 2008, Stephen Pelc/Peter Knaggs

\ The word S" 6.1.2165 is the primary word for generating strings.
\ In more complex applications, it suffers from several deficiencies:
\ 1) the S" string can only contain printable characters,
\ 2) the S" string cannot contain the '"' character,
\ 3) the S" string cannot be used with wide characters as discussed
\    in the Forth 200x internationalisation and XCHAR proposals.

\ Since 4tH cannot offer the functionality of this proposal without
\ major surgery this word was created. It allows you to convert a S"
\ string containing escape characters to an escaped string. Note this
\ only works at runtime.

\ Typical use: S" \qThis is the end\q" S>ESCAPE

[UNDEFINED] S>ESCAPE [IF]              \ Table of translations for \a..\z.
offset \escape                         ( n -- c)
         7 c,    \ \a
         8 c,    \ \b
    char c c,    \ \c
    char d c,    \ \d
        27 c,    \ \e
        12 c,    \ \f
    char g c,    \ \g
    char h c,    \ \h
    char i c,    \ \i
    char j c,    \ \j
    char k c,    \ \k
        10 c,    \ \l
    char m c,    \ \m
        10 c,    \ \n (Unices only)
    char o c,    \ \o
    char p c,    \ \p
    char " c,    \ \q
        13 c,    \ \r
    char s c,    \ \s
         9 c,    \ \t
    char u c,    \ \u
        11 c,    \ \v
    char w c,    \ \w
    char $ c,    \ \x
    char y c,    \ \y
         0 c,    \ \z

: s>escape                             ( a1 n1 -- a1 n2)
  over dup >r >r                       \ setup loop parameters
  begin
    dup                                \ limit reached?
  while                                \ if not
    over c@ dup [char] \ =             \ is it a backslash
    if                                 \ is it an escaped character
      drop chop over c@ dup [char] a - max-n and 26 <
      if [char] a - \escape then       \ if so, escape character
    then
    r@ c! chop r> char+ >r             \ save and update parameters
  repeat                               \ next character
  drop drop r> r> tuck -               \ cleanup stacks
;
[DEFINED] 4TH# [IF]
hide \escape
[THEN]
[THEN]

