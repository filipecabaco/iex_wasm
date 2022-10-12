\ 4tH library - FLOAT LOCALS - Copyright 2014, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/fp1.4th

\ Typical use:

\ fclear
\ : recurse-flocals
\   2 flocals
\     f:a f@ fdup f. 1 s>f f+ f:b f@ fdup f. 1 s>f f+ cr
\     fdup 60 s>f f< if recurse else fdrop fdrop then
\     f:b f@ f. f:a f@ f. cr
\   end-flocals
\ ;
\ 1 s>f 10 s>f recurse-flocals

[UNDEFINED] flocals  [IF]
[UNDEFINED] fdup     [IF] [ABORT] [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
[UNDEFINED] /flocal  [IF]
1024 constant /flocal                  \ size of local stack
[THEN]

/flocal array flocal                   \ locals stack

flocal /flocal + value fframe          \ pointer to current frame

: f:a fframe cell+ ;                   \ define local variable a
: f:b fframe 1 floats + cell+ ;        \ define local variable b
: f:c fframe 2 floats + cell+ ;        \ define local variable c
: f:d fframe 3 floats + cell+ ;        \ define local variable d
: f:e fframe 4 floats + cell+ ;        \ define local variable e
: f:f fframe 5 floats + cell+ ;        \ define local variable f
: f:g fframe 6 floats + cell+ ;        \ define local variable g
: f:h fframe 7 floats + cell+ ;        \ define local variable h

: end-flocals
  fframe dup flocal /flocal 1- + > E.LIBERR throw" Bad frame" @ to fframe
;
                                       \ initialize locals frame
: flocals                              ( f1 f2 f3 .. fx x --)
  -1 * floats cell- fframe + dup flocal < E.LIBERR throw" Out of float locals"
  >r fframe begin float - dup r@ > while dup >r f! r> repeat
  drop r> fframe over ! to fframe      \ check and set pointers, fill frame
;                                      \ first cell of frame is old fp!

[DEFINED] 4TH# [IF]
  hide /flocal
  hide flocal
[THEN]
[THEN]
