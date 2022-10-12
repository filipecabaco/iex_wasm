\ 4tH - Stack optimizer - Copyright 2011,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This program will list all possible solutions to a predefined stack diagram

\ Typical use:
\   4th cxq stackopt.4th -d 7 abc abcabc
\ Typical result:
\   >r over over r@ rot rot r>

\ Note this is NOT a smart program. If you set the depth too high, more valid
\ (but not the most optimal) solutions will appear. You will typically start
\ with a low depth and increase it only when needed. The execution times will
\ increase exponentionally with increased depth.

[pragma] casesensitive                 \ pragma COMPARE

include lib/stsstack.4th               \ for >S, S@, S>
include lib/getopts.4th                \ for GET-OPTIONS

1024 constant /solstack                \ size solution stack
 256 constant /dsdstack                \ size data diagram stack
 256 constant /rsdstack                \ size return diagram stack
 256 constant /solution                \ size solution variable
  32 constant /dsdgram                 \ size data diagram
  32 constant /rsdgram                 \ size return diagram
   9 constant #depth                   \ maximum solution finding depth
   8 constant #stackop                 \ number of stack operations supported

/solstack buffer: solstack             \ solution stack
/dsdstack buffer: dsdstack             \ data diagram stack
/rsdstack buffer: rsdstack             \ return diagram stack

/solution string solution              \ solution variable
/dsdgram  string dsdgram               \ data diagram variable
/rsdgram  string rsdgram               \ return diagram variable

false value found!                     \ solution found?
    0 value max-depth                  \ maximum probing depth

variable cur-depth                     \ current probing depth

: addr 2dup chars + ;                  ( a n -- a n a+n)
: add >r addr r> swap c! 1+ ;          ( a1 n1 n2 -- a1 n1+1)
: tos addr 1- c@ ;                     ( a n -- a n c)
: 2os addr 1- 1- c@ ;                  ( a n -- a n c)
: 3os addr 3 - c@ ;                    ( a n -- a n c)
: d? over > if 1 throw then ;          ( a1 n1 n2 -- a1 n1)
: r? >r over r> swap 0> 0= if 1 throw then ;
                                       ( a1 n1 a2 n2 -- a1 n1 a2 n2)
aka 1- rem                             \ alias for 1-
                                       \ virtual stack instructions
: _dup  1 d? tos add ;                 \ virtual DUP ( a n -- a n+1)
: _over 2 d? 2os add ;                 \ virtual OVER ( a n -- a n+1)
: _swap 2 d? 2os >r tos >r rem rem r> add r> add ;
: _drop 1 d? rem ;                     \ virtual DROP ( a n -- a n-1)
: _rot  3 d? 3os >r tos >r 2os >r rem rem rem r> add r> add r> add ;
: _>r   1 d? tos -rot rem 2>r add 2r> ;
: _r>   r? 2>r rem addr c@ 2r> rot add ;
: _r@   r? 2>r tos 2r> rot add ;
                                       \ map stack instructions to names
create stackop
  ' _dup  , ," dup "
  ' _over , ," over "
  ' _swap , ," swap "
  ' _drop , ," drop "
  ' _rot  , ," rot "
  ' _>r   , ," >r "
  ' _r>   , ," r> "
  ' _r@   , ," r@ "
does>                                  ( a1 n1 a2 n2 -- a1 n3 a2 n4 f)
  swap 2* cells + dup >r @c catch      \ get and execute virtual instruction
  if                                   \ if an exception occurred
    r> drop false                      \ clear stack, signal don't recurse
  else                                 \ if execution successful
    r> cell+ @c count solution +place 2dup
    option-index 1+ args compare >r >r over r> swap r> 0<> or dup 0=
    if true to found! solution count type cr then
    cur-depth @ max-depth < and        \ add name, compare; if successful,
  then                                 \ type solution, signal don't recurse
;                                      \ check depth, signal don't recurse
                                       \ try all possible solutions
: try                                  ( a1 n1 a2 n2 a3 n3 --)
  1 cur-depth +! solstack >s rsdstack >s dsdstack >s
  #stackop 0 ?do                       \ signal depth, put strings on stack
    solstack s@ solution place         \ get current solution
    dsdstack s@ dsdgram  place         \ get current data diagram
    rsdstack s@ rsdgram  place         \ get current return diagram
    rsdgram count dsdgram count i stackop
    if 2swap solution count recurse else 2drop 2drop then
  loop -1 cur-depth +! solstack s> dsdstack s> rsdstack s> 2drop 2drop 2drop
;
                                       \ setup stacks and initial stack items
: setup                                ( --)
  solstack /solstack string-stack dsdstack /dsdstack string-stack
  rsdstack /rsdstack string-stack 0 cur-depth !
  option-index args pad 0 2dup try
;                                      \ simple, manual run
                                       ( --)
: simple-stackop setup found! 0= if ." No solutions found" cr then ;
                                       \ smart, automatic run
: smart-stackop                        ( --)
  #depth 1+ 1 do                       \ try all depths
    i dup to max-depth ." - Trying a " . ." word solution.." cr setup
    found! if leave else ." No solutions." cr then
  loop                                 \ quit after valid solution
;
                                       \ finally, enter loop
: get-depth                            ( --)
  get-argument number error? abort" Invalid depth"
  dup #depth > abort" Depth limit reached" to max-depth
;                                      \ get fixed depth option
                                       \ options list
create options char d , ' get-depth , NULL ,
                                       \ main entry
: stackopt                             ( --)
  options get-options option-index dup \ evaluate options
  2 + argn > abort" Usage: stackopt [-d depth] diagram-begin diagram-end"
  1 = if smart-stackop else simple-stackop then
;                                      \ check options and select mode

stackopt
