\ 4tH library - PADDING - Copyright 2004,2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] .padding [IF]
: .filling                             ( a1 n1 n2 c --)
  >r over max over - >r type r>
  begin dup 0> while r@ emit 1- repeat drop r> drop
;

: lfill                                ( a1 n1 a2 n2 c -- a2 n1|n2)
  >r rot tuck max rot swap r> -rot 2dup 2>r rot >r
  >r over r> swap - 2dup chars + r> swap >r fill r> swap cmove 2r>
;
 
: rfill                                ( a1 n1 a2 n2 c -- a2 n1|n2)
  >r >r over >r dup >r swap cmove r> r> r> over max swap >r
  2dup r@ - r> swap >r chars + r> r> fill
;

: .padding bl .filling ;               ( a1 n1 n2 --)
: lpad bl lfill ; : rpad bl rfill ;    ( a1 n1 a2 n2 -- a2 n1|n2)
: slfill lfill 2dup >string ;          ( a1 n1 a2 n2 c -- a2 n1|n2)
: srfill rfill 2dup >string ;          ( a1 n1 a2 n2 c -- a2 n1|n2)
: slpad bl slfill ;                    ( a1 n1 a2 n2 -- a2 n1|n2)
: srpad bl srfill ;                    ( a1 n1 a2 n2 -- a2 n1|n2)
[THEN]
