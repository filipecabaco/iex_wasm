\ dsqrt.4th --- written by Hugh Aguilar --- copyright (c) 2009,2015 BSD license

[UNDEFINED] dsqrt  [IF]
[UNDEFINED] um/mod [IF] include lib/mixed.4th [THEN]

: (dsqrt) ( Darg -- Uroot )            \ first estimate (Darg must be positive)
  d2/ 1 >r begin 2dup d0= 0= while
    d2/ d2/ r> 2* >r repeat
  2drop r> ;

: (uavg)  ( Ua Ub -- Umean )           \ rounds down
  u>d rot u>d d+                       \ -- Dsum
  d2/ drop ;                           \ -- Usum/2
                                       \ the high word is always zero
: dsqrt   ( Darg -- Uroot )            \ square root
  2dup d0= if drop exit then
  2dup (dsqrt) begin >r                \ -- Darg r: -- estimate
    2dup r@ um/mod nip                 \ -- Darg new-estimate
    r@ (uavg)                          \ -- Darg root
    dup r> - abs 2 < until             \ -- Darg root
  nip nip ;

[DEFINED] 4TH# [IF]
  hide (dsqrt)
  hide (uavg)
[THEN]
[THEN]

\ include lib/dbldot.4th
\ -1 [hex] 3fffffff decimal dsqrt u.
\ 0 [hex] 40000000 decimal dsqrt u.
\ 0 [hex] 40000001 decimal dsqrt u.