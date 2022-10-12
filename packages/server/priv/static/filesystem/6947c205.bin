\ -*- forth -*-

\ lisp.fs

\ A Lisp interpreter in Forth

\ Copyright (C) 1999 Mark Probst

\ This program is free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public License
\ as published by the Free Software Foundation; either version 2
\ of the License, or (at your option) any later version.

\ This program is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
\ GNU General Public License for more details.

\ You should have received a copy of the GNU General Public License
\ along with this program; if not, write to the Free Software
\ Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

\ utilities

32768 /cell / constant /heap

include lib/ansfile.4th                \ for OPEN-FILE
include lib/memcell.4th                \ for ALLOCATE
include lib/memchar.4th                \ for CALLOCATE
include lib/compare.4th                \ for COMPARE
\ include lib/anstools.4th

: string-new                           ( a u -- a u )
    dup >r callocate throw tuck r@ cmove r> ;

\ symbol table

struct
    field: symtab-namea
    field: symtab-nameu
    field: symtab-lisp
    field: symtab-next
end-struct symtab

variable symtab-first

: symtab-lookup                        ( namea nameu -- symbol )
    2>r symtab-first @
    begin
      dup
    while
      dup dup symtab-namea @ swap symtab-nameu @ 2r@ compare
      if
        symtab-next @
      else
        symtab-lisp @ 2r> 2drop exit
      then
    repeat
    drop 0 2r> 2drop ;

: symtab-add                           ( namea nameu lisp -- )
    >r >r >r symtab allocate throw
    dup symtab-namea r> swap !
    dup symtab-nameu r> swap !
    dup symtab-lisp  r> swap !
    dup symtab-next symtab-first @ swap !
    symtab-first ! ;

: symtab-save                          ( -- ptr )
    symtab-first @ ;

: symtab-restore                       ( ptr -- )
    symtab-first ! ;

\ lisp interpreter

0 constant lisp-pair-tag
1 constant lisp-number-tag
2 constant lisp-builtin-tag
3 constant lisp-symbol-tag
4 constant lisp-special-tag
5 constant lisp-compound-tag
6 constant lisp-max-tag

lisp-max-tag cells allocate throw value eval-dispatch
lisp-max-tag cells allocate throw value display-dispatch
lisp-max-tag cells allocate throw value eq?-dispatch

struct
    field: lisp-tag
end-struct lisp

struct
    field: pair-tag
    field: pair-car
    field: pair-cdr
end-struct lisp-pair

struct
    field: number-tag
    field: number-num
end-struct lisp-number

struct
    field: builtin-tag
    field: builtin-xt
end-struct lisp-builtin

struct
    field: symbol-tag
    field: symbol-namea
    field: symbol-nameu
end-struct lisp-symbol

struct
    field: special-tag
    field: special-xt
end-struct lisp-special

struct
    field: compound-tag
    field: compound-args
    field: compound-body
end-struct lisp-compound

: cons                                 ( car cdr -- lisp )
    >r >r lisp-pair allocate throw
    dup pair-tag lisp-pair-tag swap !
    dup pair-car r> swap !
    dup pair-cdr r> swap ! ;

: car                                  ( pair -- lisp )
    pair-car @ ;

: cdr                                  ( pair -- lisp )
    pair-cdr @ ;

: number#                              ( num -- lisp )
    >r lisp-number allocate throw
    dup number-tag lisp-number-tag swap !
    dup number-num r> swap ! ;

: builtin                              ( xt -- lisp )
    >r lisp-builtin allocate throw
    dup builtin-tag lisp-builtin-tag swap !
    dup builtin-xt r> swap ! ;

: symbol                               ( namea nameu -- lisp )
    >r >r lisp-symbol allocate throw
    dup symbol-tag lisp-symbol-tag swap !
    dup symbol-namea r> swap !
    dup symbol-nameu r> swap ! ;

: symbol-new                           ( namea nameu -- lisp )
    string-new symbol ;

: special                              ( xt -- lisp )
    >r lisp-special allocate throw
    dup special-tag lisp-special-tag swap !
    dup special-xt r> swap ! ;

: compound                             ( args body -- lisp )
    >r >r lisp-compound allocate throw
    dup compound-tag lisp-compound-tag swap !
    dup compound-args r> swap !
    dup compound-body r> swap ! ;

: lisp-display                         ( lisp -- )
    dup 0= if
      drop [char] ( emit [char] ) emit
    else
      dup lisp-tag @ cells display-dispatch + @ execute
    then ;

: lisp-display-pair                    ( lisp -- )
    [char] ( emit 32 emit
    begin
        dup car lisp-display 32 emit
        cdr
        dup 0=
    until
    drop
    [char] ) emit ;

' lisp-display-pair display-dispatch lisp-pair-tag cells + !

: lisp-display-number                  ( lisp -- )
    number-num @ . ;

' lisp-display-number display-dispatch lisp-number-tag cells + !

: lisp-display-builtin                 ( lisp -- )
    [char] $ emit special-xt @ . ;

' lisp-display-builtin display-dispatch lisp-builtin-tag cells + !

: lisp-display-symbol                  ( lisp -- )
     dup symbol-namea @ swap symbol-nameu @ type ;

' lisp-display-symbol display-dispatch lisp-symbol-tag cells + !

: lisp-display-special                 ( lisp -- )
    [char] # emit special-xt @ . ;

' lisp-display-special display-dispatch lisp-special-tag cells + !

: lisp-display-compound                ( lisp -- )
    [char] & emit compound-body @ . ;

' lisp-display-compound display-dispatch lisp-compound-tag cells + !

: lisp-eval                            ( lisp -- lisp )
    dup if
      dup lisp-tag @ cells eval-dispatch + @ execute
    then ;

: lisp-eval-list                       ( lisp -- lisp )
    dup if
      dup car lisp-eval swap cdr recurse cons
    then ;

: lisp-bind-var                        ( name value -- )
    >r dup symbol-namea @ swap symbol-nameu @ r> symtab-add ;

: lisp-bind-vars                       ( names values -- )
    swap
    begin
      dup
    while
      2dup car swap car lisp-bind-var
      cdr swap cdr swap
    repeat
    2drop ;

: lisp-apply-compound                  ( func args -- lisp )
    symtab-save >r
    over compound-args @ swap lisp-bind-vars
    compound-body @ lisp-eval
    r> symtab-restore ;

: lisp-apply                           ( func args -- lisp )
    >r dup lisp-tag @ lisp-builtin-tag = if
      r> swap builtin-xt @ execute
    else
      r> lisp-apply-compound
    then ;

: lisp-eval-pair                       ( lisp -- lisp )
    >r
    r@ car lisp-eval
    dup lisp-tag @ lisp-special-tag = if
      r> cdr swap special-xt @ execute
    else
      r> cdr lisp-eval-list lisp-apply
    then ;

' lisp-eval-pair eval-dispatch lisp-pair-tag cells + !

: lisp-eval-number ( lisp -- lisp ) ;

' lisp-eval-number eval-dispatch lisp-number-tag cells + !

: lisp-eval-builtin ( lisp -- lisp ) ;

' lisp-eval-builtin eval-dispatch lisp-builtin-tag cells + !

: lisp-eval-symbol ( lisp -- lisp )
    dup symbol-namea @ swap symbol-nameu @ symtab-lookup ;

' lisp-eval-symbol eval-dispatch lisp-symbol-tag cells + !

: lisp-eval-special ( lisp -- lisp ) ;

' lisp-eval-special eval-dispatch lisp-special-tag cells + !

: lisp-eval-compound ( lisp -- lisp ) ;

' lisp-eval-compound eval-dispatch lisp-compound-tag cells + !

\ the reader

: lisp-read-char                       ( e a -- e a c )
    2dup <= if
      0
    else
      dup c@ swap 1+ swap
    then ;

aka 1- lisp-unread-char                ( e a -- e a )

: lisp-is-ws                           ( c -- flag )
    dup 10 = swap dup 13 = swap dup 9 = swap 32 = or or or ;

: lisp-skip-ws                         ( e a -- e a )
    lisp-read-char
    begin
      dup 0<> over lisp-is-ws and
    while
      drop lisp-read-char
    repeat
    if
      lisp-unread-char
    then ;

128 callocate throw value token-buffer

: lisp-read-token                      ( e a -- e a a u )
    lisp-skip-ws
    0 >r
    lisp-read-char
    begin
      dup [char] ) <> over 0<> and over lisp-is-ws 0= and
    while
      token-buffer r@ + c! r> 1+ >r lisp-read-char
    repeat
    if
      lisp-unread-char
    then
    token-buffer r> ;

defer lisp-read-lisp

: lisp-read-list                       ( e a -- e a lisp )
    lisp-skip-ws lisp-read-char
    dup [char] ) = swap 0 = or if
      0
    else
      lisp-unread-char lisp-read-lisp >r recurse r> swap cons
    then ;

: lisp-read-number                     ( e a -- e a lisp )
    lisp-read-token number number# ;

: lisp-read-symbol                     ( e a -- e a lisp )
    lisp-read-token string-new symbol ;

:noname                                ( e a -- e a lisp )
    lisp-skip-ws lisp-read-char
    dup 0= if
      drop 0
    else
      dup [char] ( = if
        drop lisp-read-list
      else
        dup [char] 0 >= swap [char] 9 <= and if
          lisp-unread-char lisp-read-number
        else
          lisp-unread-char lisp-read-symbol
        then
      then
    then ; is lisp-read-lisp

: lisp-load-from-string                ( a u -- lisp )
    over + swap 0 >r
    begin
      lisp-skip-ws 2dup >
    while
      r> drop lisp-read-lisp lisp-eval >r
    repeat
    2drop r> ;

8192 callocate throw value read-buffer

: lisp-load-from-file                  ( a u -- lisp )
    r/o open-file
    if
      drop 0
    else
      >r read-buffer 8192 r@ read-file
      if
        r> 2drop 0
      else
        r> close-file drop
        read-buffer swap lisp-load-from-string
      then
    then ;

\ specials

: lisp-special-quote                   ( lisp -- lisp )
    car ;

s" quote" string-new ' lisp-special-quote special symtab-add

: lisp-special-lambda                  ( lisp -- lisp )
    dup car swap cdr car compound ;

s" lambda" string-new ' lisp-special-lambda special symtab-add

: lisp-special-define                  ( lisp -- lisp )
    dup car swap cdr car lisp-eval lisp-bind-var 0 ;

s" define" string-new ' lisp-special-define special symtab-add

0 constant lisp-false
0 0 cons value lisp-true

s" t" string-new lisp-true symtab-add

: lisp-special-cond                    ( lisp -- lisp )
    dup car car lisp-eval if
      car cdr car lisp-eval
    else
      cdr dup if
         recurse
      then
    then ;

s" cond" string-new ' lisp-special-cond special symtab-add

\ builtins

: lisp-builtin-+                       ( lisp -- lisp )
    0 swap
    begin
      dup
    while
      dup car number-num @ rot + swap cdr
    repeat
    drop number# ;

s" +" string-new ' lisp-builtin-+ builtin symtab-add

: lisp-builtin--                       ( lisp -- lisp )
    dup car number-num @ swap cdr dup 0= if
      drop negate number#
    else
      swap
      begin
        over car number-num @ - swap cdr swap
        over 0=
      until
      nip number#
    then ;

s" -" string-new ' lisp-builtin-- builtin symtab-add

: lisp-builtin-*                       ( lisp -- lisp )
    1 swap
    begin
      dup
    while
      dup car number-num @ rot * swap cdr
    repeat
    drop number# ;

s" *" string-new ' lisp-builtin-* builtin symtab-add

: lisp-builtin-<                       ( lisp lisp -- lisp )
    dup car number-num @ swap cdr car number-num @
    < if
        lisp-true
      else
        lisp-false
    then ;

s" <" string-new ' lisp-builtin-< builtin symtab-add

: lisp-builtin-cons                    ( lisp -- lisp )
    dup car swap cdr car cons ;

s" cons" string-new ' lisp-builtin-cons builtin symtab-add

: lisp-builtin-car                     ( lisp -- lisp )
    car car ;

s" car" string-new ' lisp-builtin-car builtin symtab-add

: lisp-builtin-cdr                     ( lisp -- lisp )
    car cdr ;

s" cdr" string-new ' lisp-builtin-cdr builtin symtab-add

: lisp-builtin-eq?                     ( lisp -- lisp )
    dup car swap cdr car 2dup = if
      2drop lisp-true
    else
      2dup lisp-tag @ swap lisp-tag @ <> if
        2drop lisp-false
      else
        dup lisp-tag @ cells eq?-dispatch + @ execute
      then
    then ;

s" eq?" string-new ' lisp-builtin-eq? builtin symtab-add

' lisp-false eq?-dispatch lisp-pair-tag cells + !

: lisp-eq?-number                      ( lisp lisp -- lisp )
    number-num @ swap number-num @ = if
      lisp-true
    else
      lisp-false
    then ;

' lisp-eq?-number eq?-dispatch lisp-number-tag cells + !

' lisp-false eq?-dispatch lisp-builtin-tag cells + !

: lisp-eq?-symbol                      ( lisp1 lisp2 -- lisp )
    dup symbol-namea @ swap symbol-nameu @ rot
    dup symbol-namea @ swap symbol-nameu @
    compare if
      lisp-false
    else
      lisp-true
    then ;

' lisp-eq?-symbol eq?-dispatch lisp-symbol-tag cells + !

' lisp-false eq?-dispatch lisp-compound-tag cells + !

: lisp-builtin-display                 ( lisp -- lisp )
    car lisp-display 0 ;

s" display" string-new ' lisp-builtin-display builtin symtab-add

\ Tiny 4tH interface

argn 2 < abort" Usage: lisp filename" 1 args lisp-load-from-file drop cr
