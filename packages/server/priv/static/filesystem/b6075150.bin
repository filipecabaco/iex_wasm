\ 4tH library - LOCALS - Copyright 2014, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Typical use:
\ : recurse-locals
\   2 locals
\     :a @ dup . 1+ :b @ dup . 1+ cr
\     dup 180 < if recurse else 2drop then
\     :b ? :a ? cr
\   end-locals
\ ;
\ 1 10 recurse-locals

\ : subtract           ( n1 n2 --)
\   2 locals
\     :a @ :b @ - . cr
\   end-locals
\ ;
\ 5 2 subtract

[UNDEFINED] locals   [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
[UNDEFINED] /local   [IF]
512 constant /local                    \ size of local stack
[THEN]

/local array local                     \ locals stack

local /local + value lframe            \ pointer to current frame

: :a lframe 1 cells + ;                \ define local variable a
: :b lframe 2 cells + ;                \ define local variable b
: :c lframe 3 cells + ;                \ define local variable c
: :d lframe 4 cells + ;                \ define local variable d
: :e lframe 5 cells + ;                \ define local variable e
: :f lframe 6 cells + ;                \ define local variable f
: :g lframe 7 cells + ;                \ define local variable g
: :h lframe 8 cells + ;                \ define local variable h

: end-locals
  lframe dup local /local 1- + > E.LIBERR throw" Bad frame" @ to lframe
;
                                       \ initialize locals frame
: locals                               ( a1 a2 a3 .. ax x --)
  1+ negate cells lframe tuck + dup local < E.LIBERR throw" Out of locals"
  over >r >r begin cell- dup r@ > while tuck ! repeat
  to lframe r> r> swap !               \ check and set pointers, fill frame
;                                      \ first cell of frame is old fp!

[DEFINED] 4TH# [IF]
  hide /local
  hide local
[THEN]
[THEN]
