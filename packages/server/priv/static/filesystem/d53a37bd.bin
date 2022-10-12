\ 4tH library - Integer hashtables - Copyright 2009 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] hashtable [IF]
defer hash                             ( a1 n1 -- n2)
                                       ( a n -- v)
: hash' >r hash max-n and r@ @ mod 1+ cells r> + ;
: hashtable 1- dup >r over ! cell+ r> bounds do (error) i ! loop ;
: put hash' ! ;                        ( n2 a1 n1 v --)
: get hash' @ ;                        ( a1 n1 v -- n2)
: get? get error? ;                    ( a1 n1 v -- n2 f)

[DEFINED] 4th# [IF]
hide hash'
[THEN]
[THEN]

\ Very simple integer hashtable code without collision resolution.
\ Unused entries hold (ERROR). GET? returns FALSE if there is a collision.

\ include lib/hash.4th
\ 16 constant /myhash
\ /myhash array myhash

\ myhash /myhash hashtable
\ ' sdbm is hash

\ s" alpha" myhash get? . . cr
\ s" beta" myhash get? . . cr
\ 512 s" beta" myhash put
\ s" gamma" myhash get? . . cr
\ s" delta" myhash get? . . cr
\ s" beta" myhash get . cr

