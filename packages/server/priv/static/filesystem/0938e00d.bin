\ 4tH library - SLURP textfile - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] slurp.new [IF]
[UNDEFINED] allocate  [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] ds.build  [IF] include lib/dstringt.4th [THEN]
\ include lib/anstools.4th

64 cells constant (/extend)            \ size of an extend
                                       ( line v -- line+1)
: (slurp.line) over th 0 parse rot ds.place 1+ ;
                                       \ extend the array
: (extend)                             ( n1 v n2 -- n1 v v n+z)
  (/extend) + dup >r resize E.LIBERR throw" Cannot resize slurp array"
  dup >r over + (/extend) ds.build r> dup r>
;                                      \ resize the allocated array
                                       \ initialize the array
: (slurp.init)                         ( -- v n)
  (/extend) dup allocate E.LIBERR throw" Cannot allocate slurp array"
  swap 2dup ds.build                   \ allocate and initialize dstring
; 
                                       \ slurp a file into an array
: slurp.new                            ( a n1 -- v n2)
  input open dup error? ?exit          \ open file, return on error
  use >r (slurp.init) 2>r 0            ( 0 R: h v n)
  begin                                \ zero lines read
    refill                             \ get a new line
  while                                \ if a new line, put it into dstring
    dup 2r@ rot > unless drop 2r> (extend) 2>r then (slurp.line)
  repeat                               \ expand array if needed
  2r> drop swap r> close               \ close the file, compose addr/count
;
                                       \ release the slurped file
: slurp.delete                         ( v n --)
  drop dup dup allocated bounds ?do i ds.free 1 cells +loop
  free E.LIBERR throw" Cannot free slurp array"
;                                      \ free the lines and array

[DEFINED] 4TH# [IF]
  hide (/extend)
  hide (extend)
  hide (slurp.line)
  hide (slurp.init)
[THEN]
[THEN]

\ s" slurptxt.4th" slurp.new error? abort" Cannot open file"
\ 2dup bounds ?do i ds.count type cr 1 cells +loop
\ slurp.delete

