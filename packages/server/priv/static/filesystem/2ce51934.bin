\ 4tH library - Fast Double Number Shift - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] dllshift  [IF]
[UNDEFINED] cell-bits [IF] include lib/constant.4th [THEN]
                                       \ can handle up to (cell-bits - 1)
: (rshift) over 0< if cell-bits over - -1 swap lshift ;then 0 ;
: (dlrshift) >r swap r@ rshift over cell-bits r@ - lshift or swap r> rshift ;
: (dllshift) dup >r lshift over cell-bits r@ - rshift or swap r> lshift swap ;
: (darshift) (rshift) >r (dlrshift) r> or ;

: (shift)                              ( d1 n xt -- d2)
  >r abs cell-bits 1- /mod r> rot >r   \ get #cellbit shifts and remainder
  swap 0 ?do >r cell-bits 1- r@ execute r> loop
  r> dup if swap execute ;then drop drop
;                                      \ execute remainder of shifts

: dlrshift ['] (dlrshift) (shift) ;    ( d n -- d>>n)
: dllshift ['] (dllshift) (shift) ;    ( d n -- d<<n)
: darshift ['] (darshift) (shift) ;    ( d n -- d/2^n)

aka dllshift dalshift                  ( d n -- d*2^n)

[DEFINED] 4TH# [IF]
  hide (dlrshift)
  hide (dllshift)
  hide (darshift)
  hide (rshift)
  hide (shift)
[THEN]
[THEN]
