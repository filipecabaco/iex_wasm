\ 4tH library - Stem-Leaf plot - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] .stem-leaf [IF]
[UNDEFINED] sort       [IF] [ABORT] [THEN]
: .leaf                                ( l c f w s -- l c f w)
  >r >r                                \ save stem and width
  begin
    over @ over /mod r'@ =             \ still within this stem?
  while                                \ if so, go to the next item
    r@ .r >r cell+ over over > r> swap dup
  while                                \ end of aray reached?
    drop                               \ drop superfluous item
  repeat drop r> r> drop               \ clean up
;

: .stem-leaf                           ( clip array len .leaf .stem --)
  >r >r 2dup sort bounds dup @ >r over cell- @ >r
  rot r> over / 1+ over r> swap / r> -rot r> -rot
  ?do i over .r ."  |" i swap >r .leaf r> cr loop
  drop drop drop drop drop             \ print stems and leaves
;                                      \ clear stack, nothing useful left

[DEFINED] 4TH# [IF]
  hide .leaf
[THEN]
[THEN]