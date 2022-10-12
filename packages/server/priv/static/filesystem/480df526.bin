\ Reference:  zenfloat.arc and rtfv5.pdf on taygeta
\ Martin Tracy's Zenfloat - apparently released to public domain 
\ in the 1984 Forml proceedings
\ A commented version found in Tim Hendtlass's "Real Time Forth"
\ Physics Department, Swinburne University of Technology, Australia.
\ See: rtfv5.pdf  on taygeta ftp server.  
\ Reformated here with code from zenforth.arc for comparison.
\ Only changes are the use of the constant zfsize instead of using 6553.
\ Converted to 4tH by David Johnson, 2009-05-18
\ Several fixes by Hans Bezemer and David Johnson

[UNDEFINED] F+      [IF]
[UNDEFINED] UM*     [IF] include lib/mixed.4th [THEN]
[UNDEFINED] E.FPERR [IF] include lib/throw.4th [THEN]

max-n 10 / constant zfsize
     true  constant ZenFP
        0  constant S>F
  2 cells  constant float
    float +constant float+
    float *constant floats

: TRIM                                 ( dn n -- f)
  >r                                   \ exponent to return stack
  tuck dabs                            \ save sign, make double positive
  begin
    over 0< over 0<> or                \ MSB low word set
  while                                \ or top 16 bits not=0?
    0 10 um/mod >r                     \ divide by 10
    10 um/mod nip r> r> 1+ >r          \ and increase exponent
  repeat
  rot d+- drop r>                      \ apply sign and final exponent
;

: F+                                   ( f1 f2 -- f3 )
  rot 2dup - dup 0<                    \ work out difference in exponents
  if                                   \ top number has the larger exponent
    negate rot >r nip >r swap r>       \ keep larger and diff, swap mantissas
  else                                 \ top has a smaller or equal exponent
    swap >r nip                        \ keep larger (on RS) and diff
  then                                 \ convert larger to double, top >r
  >r dup abs u>d rot d+- r> dup 0
  ?do
    >r d10* r> 1-                      \ mantissa * 10, decrement exponent
    over abs zfsize >                  \ would another *10 cause overflow?
    if leave then                      \ prematurely terminate loop if so
  loop
  r> over + >r                         \ calculate final exponent
  if rot drop                          \ top  were +ve lose bottom
  else rot dup abs u>d rot d+- d+
  then r> trim                         \ top  were -ve, make double and add on
;                                      \ get final exponent and trim

: FNEGATE >r negate r> ;
: F- fnegate f+ ;                      \ add negative of the top value
: FABS >r abs r> ;                     \ abs the mantissa
: F>S dup 0< if abs 0 ?do 10 / loop else 0 ?do 10 * loop then ;
: D>F 0 trim ;                         ( d -- f)
                                       \ loop until exponent is zero
: F*                                   ( f1 f2 -- f3 )
  rot + >r                             \ calc exp of answer,save on RS
  2dup xor >r                          \ save xor of mantissa (sign of answer)
  abs swap abs um*                     \ make mantissas positive and multiply
  r> d+- r> trim                       \ apply sign and get exponent and trim
;
                                       \ first check and check if 2OS is zero
: F/                                   ( f1 f2 -- f3 )
  over 0= E.FPERR throw" Divide by zero"
  2>r over 0= 2r> rot if 2drop exit then
  rot swap - >r                        \ get exponent of answer, put on RS
  2dup xor -rot                        \ get sign of answer, tuck down on DS
  abs dup zfsize min rot abs u>d       \ make number +ve, divisor < 6553
  begin                                \ would divisor * 10 be < dividend?
    2dup d10* nip >r >r over r> r> rot u<
  while d10* r> 1- >r                  \ yes, divisor * 10, 1- answer exp
  repeat
  2swap drop um/mod                    \ now do the division
  nip 0 rot d+- r> trim                \ lose rem apply sign get exp & trim
;

: F0= drop 0= ;                        ( f -- bool)
: F0< drop 0< ;                        ( f -- bool)
: F0> drop 0> ;                        ( f -- bool)
: F< F- F0< ;                          ( f1 f2 -- bool)
: F= F- F0= ;                          ( f1 f2 -- bool)

\ Check zfsize
\ cr ." zfsize is " zfsize . ." compared to " -1 1 um*  10 um/mod nip 2 / . cr
\ cr ."  i 1/i          i+0.123456789"

[DEFINED] 4TH# [IF]
  hide zfsize
  hide trim
[THEN]
[THEN]
