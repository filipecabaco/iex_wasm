\ 4tH library - Integer hashtables with binary search
\ Copyright 2015, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] hashtable [IF]
[UNDEFINED] bsearch   [IF] include lib/bsearch.4th [THEN]
[UNDEFINED] E.LIBERR  [IF] include lib/throw.4th [THEN]
defer hash                             ( a1 n1 -- n2)

: (key) 2 cells + swap 2* cells + ;    ( n a1 -- a2)
: (val) (key) cell+ ;                  ( n a1 -- a2)

: (find)                               ( a1 n1 a2 -- n2 n3 a2 f)
  ['] b-compare defer@ >r ['] get-key defer@ >r
  [: (key) @ ;] is get-key
  [: over over < negate -rot > + ;] is b-compare
  >r hash dup r@ dup @ bsearch r> swap
  r> is get-key r> is b-compare        \ save/restore execution semantics
;
                                       ( v n --)
: hashtable over 0 swap ! 2/ 1- swap cell+ ! ;
: get (find) if (val) @ else drop drop (error) then nip ;
                                       ( a1 n1 v -- n2)
: put                                  ( n2 a1 n1 v --)
  (find) if                            \ if value found
    (val) nip !                        \ don't hestitate, poke value
  else                                 \ if not, check for room
    dup @ over cell+ @ = E.LIBERR throw" Hashtable full"
    over over @ swap - dup             \ compute index places to move
    if >r over over (key) dup 2 cells + r> 2* cells smove else drop then
    1 over +! (key) tuck ! cell+ !     \ increment used, write value and key
  then
;

[DEFINED] 4TH# [IF]
  hide (key)
  hide (val)
  hide (find)
[THEN]
[THEN]
