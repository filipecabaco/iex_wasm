\ CORDIC Demo for Forth 
\ Supports 16-bit sines and cosines for +/-90 degrees 
 
\ Requires core extension wordset 
\ Dependency on 2s complement arithetic, cell size greater than 15 bits 
 
\ Number format (where cells have w+1 bits) 
\  bit w-15: sign bits (all 0s or all 1s) 
\  bit 14: integer 
\  bits 13-0: fraction 
 
\ Original by Noel Henson. 
\ Refactored by Neal Bridges, Oct. 2006. 
\ and further ANSIfied by John Rible, 2006Oct20 
\ and finally ported to 4tH by Hans Bezemer 2009Apr30

[hex] 
4000 constant one 
ffff constant 16bits 
[decimal]
 
15 constant #cordic 
 
#cordic array cordic-table does> swap cells + ;
 
variable kk 
 
: reciprocal ( x y -- 1/x )  drop  one dup rot */ ; 
 
: arshift ( n1 i -- n2 ) 0 ?do 2/ loop ; 
 
: circle ( z x y -- x y ) 
   rot >r 0 begin                \ ds: x y i           rs: z 
     >r                          \ ds: x y             rs: z i 
     over r@ arshift             \ ds: x y dx          rs: z i 
     over r@ arshift             \ ds: x y dx dy       rs: z i 
     r> r@ swap dup >r           \ ds: x y dx dy z i   rs: z i
     cordic-table @              \ ds: x y dx dy z dz  rs: z i 
     swap 0< if                  \ ds: x y dx dy dz    rs: z i 
       >r >r negate              \ ds: x y -dx         rs: z i dz dy 
     else 
       negate >r negate >r       \ ds: x y dx          rs: z i -dz -dy 
     then + swap r> + swap       \ ds: x' y'           rs: z i ~dz 
     r> r> swap r> + >r          \ ds: x' y' i         rs: z' 
     1+ #cordic over = until     \ ds: x' y' i'        rs: z' 
   r> drop drop ; 
 
: fill-cordic ( x#cordic ... x0 ) 
    #cordic 0 do  i cordic-table ! loop ; 
 
: init-vars ( x#cordic ... x0 -- ) 
    fill-cordic  0 ( z) one ( x) 0 ( y) circle  reciprocal kk ! ; 
 
: sincos ( z -- x y )  kk @ ( x)  0 ( y) circle ; 
 
: sin ( angle -- magnitude )  sincos nip 16bits and ; 
: cos ( angle -- magnitude )  sincos drop 16bits and ; 
: tan ( angle -- tangent )    sincos one rot */ 16bits and ; 
 
: deg ( angle -- binangle )   one 90 */ ; 
: deg10ths ( angle -- binangle )  one 900 */ ; 
 
: .frac ( fraction_of_one -- )
  10000 one */ s>d <# # # # # [char] . hold #s #> type space ; 
 
[hex] 
: use-rad ( -- ) 1 2 4 8 10 20 40 80 100 200 3ff 7f5 0fae 1dac 3244 
    init-vars ; 
: use-deg ( -- ) 1 1 3 5 0a 14 29 51 0a3 146 28b 511  9fb 12e4 2000 
    init-vars ; 
[decimal]
 
\ use-rad  \ for radians angle*one/(pi/2) 
 use-deg  \ for degrees angle*one/90 
 
\ examples 
 45    dup . deg sin .frac 
105 cr dup . deg10ths sin .frac \ sin for 10.5 
 30 cr dup . deg cos .frac 
554 cr dup . deg10ths cos .frac \ cos for 55.4 
 30 cr dup . deg tan .frac 
  0 cr dup . deg dup sin .frac cos .frac 
 90 cr dup . deg dup sin .frac cos .frac 
cr