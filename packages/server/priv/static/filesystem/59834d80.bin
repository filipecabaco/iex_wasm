\ 4tH library - Phone numbers - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This routine will strip all non-numeric characters from a string and
\ add a zero if the remaining string doesn't start with it. It can be used
\ to normalize phone numbers or used as a building block in a custom routine
\ for cleaning up phone numbers. Note it can handle *at most* 32 digits and
\ doesn't do any bounds checking. The string is overwritten with each call,
\ leaving the original string intact.

[UNDEFINED] >phone   [IF]
[UNDEFINED] is-digit [IF] include lib/istype.4th [THEN]

32 string (phone#)
                                       \ filter out all non-numeric chars
: >phone                               ( a1 n1 -- a2 n2)
  (phone#) dup >r >r                   \ set up loop
  begin dup while over c@ is-digit if over c@ r@ c! r> char+ >r then chop
  repeat 2drop r> r> tuck -            \ calculate string and size
;
                                       \ prefix with a zero if required
: ?zero                                ( a1 n1 -- a1 n2)
  over c@ [char] 0 <>                  \ correct if not beginning with a "0"
  if 2dup over dup >r char+ swap cmove [char] 0 r> c! 1+ then
;

[DEFINED] 4tH# [IF] hide (phone#) [THEN]
[THEN]

\ s" (800) 555-60 23" >phone ?zero type cr

