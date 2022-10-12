\ LOCALS CATCH demo - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/locals.4th

\ This example lets deliberately crash a program using locals. It shows how
\ to incorporate the locals subsystem into a CATCH routine.

: local-catch                          ( xt -- n)
  lframe >r catch r> over              \ save frame, duplicate CATCH value
  if to lframe else drop then          \ restore frame, return CATCH value
;

: culprit                              ( n1 n2 --)
  2 locals                             \ save both in locals
    ." Sub : " :A ? :B ? cr            \ show the locals
  end-locals                           \ terminate scope
;

: victim                               ( n1 n2 --)
  2 locals                             \ save both in locals
    1 ['] culprit local-catch          \ take value on stack in account
    dup if ." Exception " . cr drop else drop then
    ." Main: " :A ? :B ? cr            \ save after crash?
    1 2 ['] culprit local-catch dup    \ take both values on stack in account
    if ." Exception " . cr drop drop else drop then
    ." Main: " :A ? :B ? cr            \ save after normal execution?
  end-locals
;

1 11 victim depth if ." Unbalanced stack!" cr then
