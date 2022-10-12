\ 4tH library - STRING STACK - Copyright 2004,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Memory layout after initialization:

\ +-----------+
\ | variables |
\ +-----------+
\ |   stack   |
\ +-----------+
\ |  circular |
\ |   buffer  |
\ +-----------+

\ Note the buffer wraps around when there's not enough space left in the
\ buffer to accommodate the string pushed on the stack. When the string
\ is larger than the entire buffer, it is truncated. Underflow and overflow
\ are detected and will abort.

\ Typical use:
\   256 constant /my
\   /my buffer: my
\   my /my string-buffer
\   s" Hello world!" my >s
\   my s> type cr

[UNDEFINED] string-stack [IF]
[UNDEFINED] n!           [IF] include lib/ncoding.4th [THEN]
[UNDEFINED] E.LIBERR     [IF] include lib/throw.4th   [THEN]
[UNDEFINED] #str-items   [IF]
  8 constant #str-items
[THEN]

struct
  nell +field (sbp)                    \ string buffer pointer
  nell +field (sb^)                    \ end of string buffer
  nell +field (ssp)                    \ string stack pointer
  #str-items nells +field (sst)        \ string stack
end-struct (/ss)                       \ size of header

(/ss) chars +constant (+sb0)           \ begin of string buffer

: string-stack                         ( a n --)
  dup (/ss) 128 chars + < E.LIBERR throw" String stack too small"
  over >r chars + r@ -> (sb^) n! r@ -> (sst) nell- r@ -> (ssp) n!
  r@ (+sb0) r> -> (sbp) n!
;
                                       ( s -- n)
: sfree >r r@ -> (sb^) n@ r> -> (sbp) n@ - 1- ;
: sdepth >r r@ -> (ssp) n@ r> -> (sst) - nell / 1+ ;

: >s                                   ( a n s --)
  >r r@ sdepth #str-items = E.LIBERR throw" String stack full"
  r@ -> (sb^) n@ r@ (+sb0) - 1- min    \ sanitize length
  dup r@ sfree > if r@ (+sb0) dup r@ -> (sbp) n! else r@ -> (sbp) n@ then
  dup r@ -> (ssp) nell over n+! n@ n! over 1+ chars r> -> (sbp) n+!
  place                                \ update pointers and store string
;
                                       ( s -- a n)
: s@ dup sdepth 0= E.LIBERR throw" String stack empty" -> (ssp) n@ n@ count ;
: s> dup >r s@ nell negate r> -> (ssp) n+! ;

[DEFINED] 4TH# [IF]
  hide (/ss)
  hide (ssp)
  hide (sst)
  hide (sbp)
  hide (sb^)
  hide (+sb0)
[THEN]
[THEN]

