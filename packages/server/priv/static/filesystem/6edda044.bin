\ Fast iterative Levenshtein Distance library - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] levenshtein [IF]
[UNDEFINED] allocate    [IF] include lib/memcell.4th [THEN]
[UNDEFINED] E.LIBERR    [IF] include lib/throw.4th   [THEN]

: (s[]) >r over @ * r> + 1+ cells + ;  ( addr m n -- addr')

: levenshtein                          ( a1 n1 a2 n2 -- n3)
  rot over 0> over 0> and unless 2nip max ;then
  >r dup 1+ r@ 1+ * 1+ cells           ( a1 a2 n2 n R: n1)
  allocate E.LIBERR throw" Cannot allocate Levenshtein buffer" r@ over !
  over 0 ?do i over i 0 (s[]) ! loop   ( a1 a2 n2 addr R: n1)
  r@ 0 ?do   i over 0 i (s[]) ! loop   ( a1 a2 n2 addr R: n1)
  r@ 0 ?do                             ( a1 a2 n2 addr R: n1) 
    over 0 ?do                         ( a1 a2 n2 addr R: n1) 
      2swap over j chars + c@ over i chars + c@ = >r 2swap r>
      over i j    (s[]) @ swap -
      over i j 1+ (s[]) @ over < if 1- then
      over i 1+ j (s[]) @ over >= + over i 1+ j 1+ (s[]) !
    loop
  loop 2nip dup rot r> (s[]) @ swap    ( n3 addr)
  free E.LIBERR throw" Cannot free Levenshtein buffer"
;
[DEFINED] 4TH# [IF] hide (s[]) [THEN]
[THEN]

\ s" hydroxychloroquine" s" paracetamol" levenshtein . ( 15)

