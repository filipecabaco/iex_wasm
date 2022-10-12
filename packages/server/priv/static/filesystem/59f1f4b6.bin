\ 4tH library - Integer hashtables with buckets
\ Copyright 2009,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] hashtable [IF]
[UNDEFINED] E.LIBERR  [IF] include lib/throw.4th [THEN]
[UNDEFINED] /bucket   [IF]
4 constant /bucket
[THEN]

defer hash                             ( a1 n1 -- n2)
                                       \ reset flag when needed
: ?reset? dup >r 0= if swap dup xor swap then r> ;
: >token >r 0 swap r@ /cell 1- min bounds do i c@ + 8 lshift loop r> + ;
: hash'? >r hash max-n and r@ @ mod /bucket 2 * * cells r> cell+ + true ;
: >setup >r 2dup >token -rot r> hash'? swap dup /bucket 2 * + ;
                                       \ get addresses and tokens
: get                                  ( a1 n1 v -- n2)
  >setup >r rot >r                     \ setup values, scan for right bucket
  begin dup r'@ < ?reset? while dup @ r@ <> while cell+ cell+ repeat swap
  if cell+ @ else drop (error) then r> r> drop drop 
;                                      \ get value and cleanup

: put?                                 ( n2 a1 n1 v -- f)
  >setup >r rot >r                     \ setup values, scan for empty bucket
  begin dup r'@ < ?reset? while dup @ while cell+ cell+ repeat swap
  if r> over ! cell+ ! false else r> drop drop drop true then r> drop
;                                      \ save value and cleanup
                                       ( n2 a1 n1 v --)
: put put? E.LIBERR throw" Bucket full" ;
: hashtable 2dup bounds do 0 i ! loop 1- /bucket 2 * / swap ! ;
                                       ( v n --)
[DEFINED] 4th# [IF]
  hide ?reset?
  hide >token
  hide hash'?
  hide >setup
[THEN]
[THEN]

\ Integer hashtable code with simple collision resolution.
\ The array is divided in buckets of /bucket size. Every entry takes 2 cells.
\ The first cell is used to store the token which consists of typically of
\ the first three characters and the count (depends on the size of the cell).
\ The second cell is used to store the value. When a collision is detected
\ a new entry is searched, upto /bucket entries. If a collision could not
\ be resolved, GET returns (ERROR) and PUT? returns a TRUE flag.

\ include lib/hash.4th
\ 15 /bucket 2 * * 1+ constant /myhash
\ /myhash array myhash

\ myhash /myhash hashtable
\  ' sdbm is hash

\ 512 s" alpha" myhash put
\ 128 s" beta" myhash put
\ 64  s" gamma" myhash put
\ 32  s" delta" myhash put

\ s" alpha" myhash get . cr
\ s" beta" myhash get . cr
\ s" gamma" myhash get . cr
\ s" delta" myhash get . cr
\ s" epsilon" myhash get . cr
