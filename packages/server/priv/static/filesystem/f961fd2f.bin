\ High accuracy calculation of double-precision sin(x), 
\ using Taylor Series approximation when x is near 
\ a multiple of pi. 
 
\ Due to finite precision in the representation of x, 
\ the calculation of sin(x) can suffer a loss of 
\ significant digits when x is near pi. 
 
\ The Intel and AMD FPUs also suffer a loss of accuracy in 
\ the FSIN instruction, for an argument, x, which is 
\ near a multiple of pi, n*pi, for n>1. This function uses 
\ an 10th order Taylor Series approximation to compute sin(x) 
\ for those cases: 
 
\     sin(pi + delta) = -delta + delta^3/6 - delta^5/120 
 
\             + delta^7/5040 + ... 
 
\  Higher order terms are not used. 
 
\ For |delta| <= 1e-5, the accuracy in double precision 
\ will be 16 significant digits. 
 
\ Krishna Myneni, <krishn...@ccreweb.org> 

\ Compute sin(n*pi + rdelta) to high accuracy, where 
\ rdelta is an offset and n = 0,1,2, ... 

[UNDEFINED] fsin_near_pi [IF]
[UNDEFINED] fpow        [IF] include lib/fpow.4th [THEN]
: fsin_near_npi                        ( rdelta n -- r )
        2 mod if fnegate then 
        fdup  7 fpow 5040 s>f f/
        fover 5 fpow  120 s>f f/ f- 
        fover 3 fpow    6 s>f f/ f+ 
        f- 
;
[THEN]

\ fclear
\ s" 1e-10"  s>float 1 sin_near_npi fs. cr  ( -1e-10)
\ s" -1e-20" s>float 1 sin_near_npi fs. cr  ( 1e-20)
\ s" -1e-6"  s>float 1 sin_near_npi fs. cr  ( 9.99999999999833333e-7) 

