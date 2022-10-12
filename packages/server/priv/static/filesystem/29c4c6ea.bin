\ Copyright (c) 2020, Slava Pestov, et al.
\ All rights reserved.

\ Redistribution and use in source and binary forms, with or without
\ modification, are permitted provided that the following conditions are met:

\ 1. Redistributions of source code must retain the above copyright notice,
\    this list of conditions and the following disclaimer.

\ 2. Redistributions in binary form must reproduce the above copyright notice,
\    this list of conditions and the following disclaimer in the documentation
\    and/or other materials provided with the distribution.

\ THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
\ INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
\ FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
\ DEVELOPERS AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
\ SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
\ PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
\ OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
\ WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
\ OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
\ ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
\ include lib/anstools.4th

\ 4tH implementation by Hans Bezemer, 2021

\ This library does NOT offer full Factor support. It just offers a selection
\ of constructs known in Factor, so SOME Factor techniques can be applied
\ in 4tH. If you'd REALLY like to program in Factor, program in Factor.
\ Don't program in 4tH. HB/20210629

\ Note this library is INCOMPATIBLE with the following libraries:
\ 1. anscore.4th      (2over)
\ 2. print.4th        (print)
\ 3. pickroll.4th     (pick)

[UNDEFINED] keep [IF]
[UNDEFINED] 3rot [IF] include lib/3dup3rot.4th [THEN]
                                       \ ** Aliases **
aka type print                         ( a n --)
aka execute call                       ( xt --)
aka false f                            ( -- -f)
aka true  t                            ( -- f)
                                       \ ** Shuffle words **
: dupd stow ;                          ( n1 n2 -- n1 n1 n2)
: swapd >r swap r> ;                   ( n1 n2 n3 -- n2 n1 n3)
: 2over >r over over r> -rot ;         ( n1 n2 n3 -- n1 n2 n3 n1 n2)
: pick >r over r> swap ;               ( n1 n2 n3 -- n1 n2 n3 n1)
                                       \ ** Conditional combinators **
: ?? rot unless swap then drop ;       ( f n1 n2 -- +f: n1 | -f: n2)
: if? ?? call ;                        ( f xt1 xt2 --)
: if* pick [: drop call ;] [: nip nip call ;] if? ;
                                       ( f xt1 xt2 -- )
: when    swap [: call ;] [: drop ;]      if? ;
: when*   over [: call ;] [: drop drop ;] if? ;
: unless? swap [: drop ;] [: call ;]      if? ;
: unless* over [: drop ;] [: nip call ;]  if? ;
                                       \ ** Preserving combinators **
: dip swap >r call r> ;                ( n xt -- n )
: 2dip swap [: dip ;]  dip ;           ( n1 n2 xt -- n1 n2)
: 3dip swap [: 2dip ;] dip ;           ( n1 n2 n3 xt -- n1 n2 n3)
: 4dip swap [: 3dip ;] dip ;           ( n1 n2 n3 n4 xt -- n1 n2 n3 n4)
                                       ( n f xt1 xt2 --)
: ?if pick [: drop [: drop ;] 2dip call ;] [: nip nip call ;] if? ;

: keep over [: call ;] dip ;           ( n xt -- n )
: 2keep [: 2dup ;] dip 2dip ;          ( n1 n2 xt -- n1 n2)
: 3keep [: 3dup ;] dip 3dip ;          ( n1 n2 n3 xt -- n1 n2 n3)
                                       \ ** Cleave combinators **
: bi  [:  keep ;] dip call ;           ( n xt1 xt2 -- n1 n2)
: 2bi [: 2keep ;] dip call ;           ( n1 n2 xt1 xt2 -- n3 n4 n5 n6)
: 3bi [: 3keep ;] dip call ;           ( n1 n2 n3 xt1 xt2 -- n4 .. n9 )
                                       ( n xt1 xt2 xt3-- n1 n2 n3)
: tri  [: [:  keep ;] dip  keep ;] dip call ;
: 2tri [: [: 2keep ;] dip 2keep ;] dip call ;
: 3tri [: [: 3keep ;] dip 3keep ;] dip call ;
                                       \ ** Spread combinators **
: bi*  [:  dip ;] dip call ;           ( n1 n2 xt1 xt2 -- n3 n4)
: 2bi* [: 2dip ;] dip call ;           ( n1 n2 n3 n4 xt1 xt2 -- n5 n6 n7 n8)

: tri*  [: [: 2dip ;] dip dip ;] dip call ;
: 2tri* [: 4dip ;] 2dip 2bi* ;
                                       \ ** Apply combinators **
: bi@  dup  bi* ;                      ( n1 n2 xt -- n3 n4)
: 2bi@ dup 2bi* ;                      ( n1 n2 n3 n4 xt -- n5 n6 n7 n8)

: tri@  dup dup  tri* ;
: 2tri@ dup dup 2tri* ;
                                       \ note: xt produces a flag
: both?   bi@ and ;                    ( n1 n2 xt -- f)
: either? bi@ or  ;                    ( n1 n2 xt -- f)
                                       \ ** Selected words **
: (each-integer)
  2over <
  [: [: nip call ;] 3keep [: 1+ ;] 2dip (each-integer) ;] [: 3drop ;] if?
;
                                       ( n xt -- 0 .. n-1)
: each-integer  [: 0 ;] 2dip (each-integer) ;
: times swap 0 ?do dup >r call r> loop drop ;
[THEN]                                 ( n xt --)

\ WHEN : If cond is not false, calls the true quotation. The cond value is
\ removed from the stack before the quotation is called. ( f xt --)

\ UNLESS? : f cond is false, calls the false quotation. See WHEN. ( f xt --)

\ IF* : If the condition is true, it is retained on the stack before the true
\ quotation is called. Otherwise, the condition is removed from the stack and
\ the false quotation is called.

\ WHEN* : Variant of IF* with no false quotation. ( f xt --)

\ UNLESS* : Variant of if* with no true quotation. ( f xt --)

\ ?IF : if the condition is false, the false quotation is called with
\ the default value N on the stack. Otherwise, the true quotation is called
\ with the condition F on the stack. ( n f xt1 xt2 --)

\ BI : Applies xt1 to n, then applies xt2 to n. ( n xt1 xt2 -- n1 n2)
\ NB: In this case xt ( n1 -- n2)

\ BI* : Applies xt1 to n1, then applies xt2 to n2. ( n1 n2 xt1 xt2 -- n3 n4)
\ NB: In this case xt ( n1 -- n2)

\ BI@ : Applies xt to n1, then applies xt to n2. ( n1 n2 xt -- n3 n4)
\ NB: In this case xt ( n1 -- n2)

\ TIMES : Performs xt n times. ( n xt --)

