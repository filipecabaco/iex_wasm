\ 4tH library - Factor like sequences - Copyright 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ include lib/anstools.4th

[UNDEFINED] each    [IF]
[UNDEFINED] stack   [IF] include lib/stack.4th    [THEN]
[UNDEFINED] E.USER  [IF] include lib/throw.4th    [THEN]
[UNDEFINED] reduce  [IF] include lib/hiorder.4th  [THEN]
[UNDEFINED] free    [IF] include lib/memcell.4th  [THEN]
[UNDEFINED] ds.free [IF] include lib/dstringt.4th [THEN]

[UNDEFINED] seqdepth [IF]
  8 constant seqdepth                  \ maximum sequence depth
[THEN]

seqdepth array (seqstk) latest stack   \ initialize user stack
aka @ length                           ( seq -- n)
                                       \ count a sequence
: seq.count dup cell+ swap length ;    ( seq -- v n)
                                       \ allocate a sequence
: (seq.alloc)                          ( xt -- seq)
  >r depth (seqstk) a> - r> execute dup 1+ cells
  allocate E.LIBERR throw" Cannot allocate sequence" over over !
;                                      \ get count and allocate
                                       \ is sequence empty?
: empty? length 0= ;                   ( seq -- f)
: { depth (seqstk) >a ;                ( -- U: n)
: } [: ;] (seq.alloc) >r cells r@ + r@ swap ?do i ! -1 cells +loop r> ;
                                       ( x1 ... xn U: n -- seq )
: iota >r { r> 0 ?do i loop } ;        ( n -- seq)
                                       \ create a string sequence
: }s                                   ( x1 ... xn U: n -- seq )
  [: 2/ ;] (seq.alloc) >r cells r@ + r@ swap
  ?do i ds.init i ds.place -1 cells +loop r>
;                                      \ save dynamic strings
                                       \ retrieve nth element
: nth                                  ( seq n -- a)
  over @ over > if 1+ th ;then E.LIBERR throw" Index sequence out of range"
;                                      \ retrieve last element
                                       ( seq -- a|f)
: ?last  dup length dup if th ;then 2drop false ;
: ?first dup length if cell+  ;then  drop false ;
                                       ( seq -- a|f)
: each   swap seq.count foreach ;      ( seq xt --)
: map!   swap seq.count map     ;      ( seq xt --)
: reduce! rot seq.count reduce  ;      ( seq n1 xt -- n2)
: sum 0 [: + ;] reduce! ;              ( seq -- n)
                                       \ resize a sequence
: set-length                           ( seq1 n -- seq2)
  dup >r 1+ resize E.LIBERR throw" Cannot resize sequence" r> over !
;
                                       \ find first occurance equal to n
: index                                ( n seq -- idx)
  seq.count >r >r 0 swap               \ set up loop
  begin over r'@ < while over cells r@ + @ over = except >r 1+ r> repeat
  drop rdrop rdrop                      \ clean up
;
                                       \ find first occurance returning true
: find                                 ( seq xt -- idx)
  swap seq.count >r >r 0 swap          \ set up loop
  begin over r'@ < while over cells r@ + @ over execute except >r 1+ r> repeat
  drop rdrop rdrop                     \ clean up
;
                                       \ raise an exception
: (?cond) dup 0= E.LIBERR throw" Quotation missing in 'cond'" ;

: cond                                 \ .. seq -- ..' seq
  dup >r                               \ save sequence
  [:                                   \ if length sequence > 2
    dup length 1 >                     \ there is a separate test to be made
    if ?first (?cond) -rot 2>r stow @ execute 2r> rot ;then
    drop true                          \ if not, drop the sequence and
  ;]                                   \ return true flag

  find dup r@ length <                 \ was a true flag returned?
  if r@ swap nth @ ?last (?cond) @ execute else drop then r>
;                                      \ if so, execute last quotation
                                       ( sseq -- f)
: sfree dup [: cfree E.LIBERR throw" Cannot free string" ;] each free ;
                                       \ free a string sequence
[DEFINED] 4TH# [IF]
  hide (seq.alloc)
  hide (?cond)
[THEN]
[THEN]

