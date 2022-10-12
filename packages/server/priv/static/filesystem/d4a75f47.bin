\ run-time routine headers gForth
\ Mixed arithmetic words

\ Copyright (C) 1997,1998,1999,2000,2003 Free Software Foundation, Inc.
\ Copyright 4tH version (C) 2007,2013 J.L. Bezemer

\ This file is part of 4tH.

\ Gforth and 4tH are free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public License
\ as published by the Free Software Foundation; either version 2
\ of the License, or (at your option) any later version.

\ This program is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
\ GNU General Public License for more details.

\ You should have received a copy of the GNU General Public License
\ along with this program; if not, write to the Free Software
\ Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111, USA.

[UNDEFINED] um/mod [IF]
[UNDEFINED] d+ [IF]
include lib/ansdbl.4th
[THEN]

: d2*+                                 ( ud n -- ud+n c )
  over highbit and >r >r 2dup d+ r> u>d d+ r>
;

: um/mod                               ( ud u1 -- u2 u3 )
  0 swap CELL-BITS 1+ 0
  do >r over r@ u< 0= or if r@ - 1 else 0 then d2*+ r> loop
  drop swap 1 rshift or swap
;

: fm/mod                               ( d1 n1 -- n2 n3 )
  dup >r dup 0< if negate >r dnegate r> then
  over       0< if tuck + swap then um/mod
  r> 0< if swap negate swap then
;

: sm/rem                               ( d1 n1 -- n2 n3 )
  over >r dup >r abs -rot
  dabs rot um/mod
  r> r@ xor 0< if       negate       then
  r>        0< if  swap negate swap  then
;

: um*                                  ( u1 u2 -- ud )
  >r 0 swap
  CELL-BITS 0 do 0 over 0< if invert then j and d2*+ drop loop
  r> drop
;

: m*                                   ( n1 n2 -- d )
  2dup signs? >r                       \ save the flag.
  abs swap abs um*                     \ convert to unsigned and multiply.
  r> if dnegate then                   \ apply sign if needed.
;

: m*/                                  ( d1 n1 +n2 -- d2 )
  >r 0 over 0< if invert then >r abs -rot 0 over 0< if invert then r> xor r>
  swap >r >r dabs rot tuck um* 2swap um* swap >r 0 d+ r> -rot r@ um/mod -rot
  r> um/mod nip swap r> if dnegate then
;

: m+ 0 over 0< if invert then d+ ;     ( d1 n -- d2)
: mu* swap over * >r um* r> + ;        ( ud1 u -- ud2 )
: mu/mod >r 0 r@ um/mod r> swap >r um/mod r> ;         ( ud un -- rem dquot )
: ud* >r swap >r over over um* rot r> * + rot r> * + ; ( ud1 ud2 -- ud3)

aka ud* d*
[DEFINED] 4TH# [IF] hide d2*+ [THEN]
[THEN]
