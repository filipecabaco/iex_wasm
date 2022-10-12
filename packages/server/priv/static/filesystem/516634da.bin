\ 4tH library - FLOAT STACK - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Typical allocation:
\   32 FLOATS CELL+ ARRAY MyStack

\ The "extra" cell is required by the stack pointer.
\ Typical initialization:
\   MyStack FSTACK

[UNDEFINED] FSTACK [IF]
[UNDEFINED] FDUP   [IF] [ABORT] [THEN]
: fstack dup cell+ swap ! ;            ( fstack --)
: fs@ @ float - f@ ;                   ( fstack -- f)
: >fs dup >r @ f! float r> +! ;        ( f fstack --)
: fs> >r float negate r@ +! r> @ f@ ;  ( fstack -- f)
: fsdepth dup @ swap - float / ;       ( fstack -- n)
[THEN]
