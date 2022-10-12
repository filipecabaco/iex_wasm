\ ==============================================================================

\                 frc - the fraction module in the ffl

\               Copyright (C) 2006  Dick van Oudheusden
  
\ This library is free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public
\ License as published by the Free Software Foundation; either
\ version 2 of the License, or (at your option) any later version.

\ This library is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
\ General Public License for more details.

\ You should have received a copy of the GNU General Public
\ License along with this library; if not, write to the Free
\ Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

\ ==============================================================================
 
\  $Date: 2006/12/10 07:47:29 $ $Revision: 1.5 $
\  $Date: 2007/01/11 12:45:41 $ $Revision: 4tH version, Hans Bezemer

\ ==============================================================================

[UNDEFINED] E.DIVBY0 [IF]
include lib/throw.4th
[THEN]

[UNDEFINED] /fraction [IF]

( frc = Fraction module )
( The frc module implements words for using fractions. Note: to reduce         )
( normalizing of fractions, the input is validated and normalized, but the     )
( resulting output is NOT normalized. This is left to the next fraction word.  )
  
( Fraction structure )

struct 
  1 +field num                         \ numerator
  1 +field denom                       \ denominator
end-struct /fraction

( General module words )

: ?divby0 over 0= if E.DIVBY0 throw then ;

: gcd                                  ( n1 n2 - n:gcd = Calculate gcd )
  abs swap abs                         \ both positive
  
  2dup < IF                            \ smallest on top
    swap
  THEN
  
  BEGIN                                \ BEGIN
    2dup mod                           \   r = a % b
    dup if dup then
  WHILE                                \ WHILE r>0
    rot drop                           \  a=b b=r
  REPEAT                               \ REPEAT
  nip                                  \ return b
;

: lcm                                  ( n1 n2 - n:lcm = Calculate lcm )
  abs swap abs                         \ both positive
  2dup gcd
  >r * r> /                            \ a * b / gcd(a,b)
;

( Structure creation, initialisation and destruction )

: 2vnorm                               ( n:num n:denom - n:num n:denom )
  dup 0> 0= if e.assert throw then
  over 0= IF
    drop 1
  ELSE
    2dup gcd
    tuck /
    >r / r>
  THEN
;

: 2vinit                               ( w:frc - = Initialise the fraction to 0)
  0 over num !
  1 swap denom !
;

( Calculation module words )

: 2v+                                  ( n1 d1 n2 d2 -- n3 n3)
  2vnorm 2swap 
  2vnorm                               \ Normalize both fractions
  rot
  2dup = IF                            \ denom1 = denom2 ?
    drop 
    >r + r>                            \   num = num1 + num2
  ELSE                                 \ ELSE
    2dup * >r                          \   denom = denom1 * denom2
    rot *
    >r * r> +                          \   num = num1 * denom2 + num2 * denom1
    r>
  THEN
;

: 2v-                                  ( n1 d1 n2 d2 -- n3 n3)
  2vnorm 2swap 
  2vnorm 2swap                         \ Normalize both fractions
  rot
  2dup = IF                            \ denom1 = denom2 ?
    drop 
    >r - r>                            \   num = num1 + num2
  ELSE                                 \ ELSE
    2dup * >r                          \   denom = denom1 * denom2
    rot *
    >r * r> -
    r>                                 \   num = num2 * denom1 - num1 * denom2
  THEN
;

: 2v*                                  ( n1 d1 n2 d2 -- n3 n3)
  2vnorm 2swap 
  2vnorm                               \ Normalize both fractions
  rot *                                \ denom = denom1 * denom2
  >r * r>                              \ num = num1 * num2
;

: 2v/                                  ( n1 d1 n2 d2 -- n3 n3)
  2vnorm 2swap 
  2vnorm 2swap                         \ Normalize both fractions
  ?divby0                              \ Divide by zero check
  >r * swap                            \ num   = num2 * denom1
  r> * swap                            \ denom = denom2 * num1 
  
  dup 0< IF                            \ numerator has the sign
    negate swap
    negate swap
  THEN
;

: 2vinvert                              ( n:num n:denom - n:num n:denom)
  2vnorm                                \ Normalize fraction 
  ?divby0                               \ Divide by zero check
  swap                                  \ invert
  
  dup 0< IF                             \ numerator has the sign
    negate swap
    negate swap
  THEN
;

: 2vnegate                              ( n:num n:denom - n:num n:denom)
  2vnorm
  swap negate swap
;

: 2vabs                                ( n:num n:denom - n:denom n:num )
  2vnorm
  swap abs swap
;

( Conversion module words )

: 2v>s                                 ( n:num n:denom - c-addr u )
  2vnorm
  <#
  dup 1 <> IF
    #s drop
    [char] / hold
  ELSE
    drop
  THEN
  dup abs #s 
  sign
  #>
;

: 2v.
  2v>s type space
;

( Compare module words )

: 2v=                                  ( n:num2 n:denom2 n:num1 n:denom1 - n  )
  2v- drop 0=
;

: 2v<                                  ( n:num2 n:denom2 n:num1 n:denom1 - n  )
  2v- drop 0<
;

: 2v>                                  ( n:num2 n:denom2 n:num1 n:denom1 - n  )
  2v- drop 0>
;

( Structure words )

: 2vnum@                               ( w:frc - n:num = Get the numerator )
  num @
;

: 2vdenom@                             ( w:frc - n:den = Get the denominator )
  denom @
;

: 2v@                                  ( w:frc - n:num n:denom  )
  dup  2vnum@ 
  swap 2vdenom@
;
  
: 2v!                                  ( n:num n:denom w:frc)
  >r
  2vnorm
  
  r@ denom !
  r> num   !
;

: 2vmove                               ( w:frc2 w:frc1 - = Move frc2 in frc1 )
  over 2vnum@   over num !
  swap 2vdenom@ swap denom !
;

( Inspection )

: 2vdump                               ( w:frc - = Dump the fraction )
  ." frc:" dup . cr
  ."   num  :" dup num   ? cr
  ."   denom:"     denom ? cr
;

[DEFINED] 4TH# [IF]
hide lcm
hide gcd
hide ?divby0
[THEN]
[THEN]

\ ==============================================================================
