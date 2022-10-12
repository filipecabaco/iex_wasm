\ 4tH library - HEAPSORT - Copyright 2010,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] heapsort [IF]
[UNDEFINED] precedes [IF]
defer precedes                         ( n1 n2 a -- f)
[THEN]
[UNDEFINED] exchange [IF]
defer exchange                         ( n1 n2 a --)
[THEN]

: siftDown                             ( a e s -- a e s)
  swap >r swap >r dup                  ( s r)
  begin                                ( s r)
    dup 2* 1+ dup r'@ <                ( s r c f)
  while                                ( s r c)
    dup 1+ dup r'@ <                   ( s r c c+1 f)
    if                                 ( s r c c+1)
      over over r@ precedes if swap then
    then drop                          ( s r c)
    over over r@ precedes              ( s r c f)
  while                                ( s r c)
    tuck r@ exchange                   ( s r)
  repeat                               ( s r)
  drop drop r> swap r> swap            ( a e s)
;

: heapsort                             ( a n --)
  over >r                              ( a n)
  dup 1- 1- 2/                         ( a c s)
  begin                                ( a c s)
    dup 0< 0=                          ( a c s f)
  while                                ( a c s)
    siftDown 1-                        ( a c s)
  repeat drop                          ( a c)

  1- 0                                 ( a e 0)
  begin                                ( a e 0)
    over 0>                            ( a e 0 f)
  while                                ( a e 0)
    over over r@ exchange              ( a e 0)
    siftDown swap 1- swap              ( a e 0)
  repeat                               ( a e 0)
  drop drop drop r> drop
;

[DEFINED] 4TH# [IF]
  hide siftDown
[THEN]
[THEN]
