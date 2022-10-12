\ The projects presented here are experimental in nature.  They
\ may be incomplete, not fully tested or contain defects.  Being
\ free software, it is provided 'as is' and without any warranty.
\ Use of these projects or information is strictly at your own
\ risk and responsibility.

\ Project material written and created by the author is public
\ domain; any non-original or reference material included may be
\ subject to copyright by their respective owners.

\ A simple string handling package by Ed.

\ STRING/C    extract char from end of string
\ C/STRING    extract char from start of string

[UNDEFINED] c/string [IF]
: c/string over >r chop r> c@ ;        ( a n -- a n-1 c)
: string/c 1- 2dup chars + c@ ;        ( a n -- a n-1 c)
[THEN]
