\ 4tH library - tiny PRINTF - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This tiny printf() implementation supports the following formats:

\ %{width}d = print an integer in field {width}, right aligned
\ %{width}s = print a string in field {width}, left aligned
\ %c        = print a character
\ %%        = print a percent character

\ {width} is optional, * is supported

[UNDEFINED] printf   [IF]
[UNDEFINED] .padding [IF] include lib/padding.4th [THEN]

variable (width)                       \ width of field
                                       \ print a special field
: (format)                             ( a1 n1 -- a2 n2)
  dup 0> if                            \ return on null string
    over swap 2>r c@ >r                \ save format and character
    r@ [char] % = if ." %" then        \ print percent
    r@ [char] d = if (width) @ .r then \ print number
    r@ [char] c = if emit then         \ print character or string
    r@ [char] s = if (width) @ .padding then
    r> [char] * = if (width) ! 2r> chop recurse else 2r> then
  then                                 \ recurse if width on command line
;

: (.field)                             ( x | - a1 n1 -- a2 n2)
  0 (width) ! begin                    \ start with a zero width
    chop dup                           \ get rid of the percent sign
  while                                \ is there any format string left?
    over c@ [char] 0 - dup max-n and 10 <
    if (width) @ 10 * + (width) ! else drop (format) exit then
  repeat                               \ get width or print format
;
                                       ( a n -- a n)
: (%?) over c@ [char] % = if (.field) else over c@ emit then ;
: printf begin dup 0> while (%?) chop repeat 2drop ;
                                       ( x1 .. xi a n --)
[DEFINED] 4TH# [IF]
  hide (width)
  hide (format)
  hide (.field)
  hide (%?)
[THEN]
[THEN]

\ 23 4 s" Hello" char !
\ s" This is %%char%c%%, string %6s and number%*d" printf cr
