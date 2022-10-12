\ Exponential Integral, fE1(x),  and Ivantsov function, fIv(x).
\ --
\ Reference for Exponential Integral:
\ [1] Walter Gautschi and William F. Cahill, "Exponential Integral and
\   Related Functions," in Handbook of Mathematical Functions, 
\   Miltion Abrmowitz and Stegun, eds., Dover Publications
\   New York, 1965, pp. 227-254.
\ --
\ References for Ivantsov function:
\ [2] GP Ivantsov, Doklady Akademmii Nauk SSSR [58] (1947) 567
\ [3] W. Kurz, D.J. Fisher, "Fundamental of Solidification, 4th Ed,"
\   Trans Tech Publications, 1998, pp. 242-244.
\  --
\ Notes: 
\ Two versions for the Exponential Integral, E1(x), are given. One is based
\ on a Taylor series expansion and converges faster as x<1, while the other
\ is based on a continued fraction is converges faster as x>1.
\ These are then combined into one Forth word. Clearly, other methods
\ such as approximate polynomials, etc., would be faster and more efficient; 
\ however, that was not the point of this particular programming exercise.
\ The code should work with both the zenfloat and ansfloat 4tH packages
\ as well as an ansforth system.  David Johnson 6/8/2009
\ --
\ ** For an ansforth system, the following are needed: **
\ include easy.4th ( which defines words: FLOAT, S>F, S>FLOAT, ARRAY )
\ include taylor.4th  ( from the 4tH library )

[UNDEFINED] ANSFP [IF]             \ Use the ZENFLOAT package
  include lib/fp1.4th
  include lib/zentaylr.4th
  include lib/zenfexp.4th
  include lib/zenfln.4th
[ELSE]                             \ Use the ANSFLOAT package
   include lib/fp3.4th
   include lib/taylor.4th
   include lib/flnflog.4th
   include lib/fexp.4th
[THEN]

fclear 9 set-precision

\ --Exponential Integral--
\   E1(x) = Integral from x to infinity of (exp(-t)/t)dt, or
\   E1(x) =  -Ei(-x)  (ref[1], p. 228) with x being real and x>0.

\ (i) As a Taylor series expansion of N terms.
\     E1(x) = -g - ln(x)-series{((-1)^N)(x^N))/(N*N!)}
\                      with g=0.5772156649... (Euler's constant)
: E1Low  ( f1 N -- f2 )
   >r fdup  fln  s" 577215665e-9" s>float f+  fswap
   fnegate fdup fdup                              \ setup for Taylor series
   1  r> 2 Do                                     \ initial of value N! is 1
     i  *  dup  i *  swap >r  +taylor  r>         \ N! and i*N! for series
   loop
   drop fdrop fdrop                    \ clean up Taylor series calculation
   f+  fnegate                         \ finish the approximation
;

\ (ii) As an Nth continued fraction.
\      E1(x) = exp(-x)(1/(x+),1/(1+), 1/(x+), 2/(1+), 2/(x+), ...)
FLOAT array px                        \ variable use for portability
: (E1high) ( r1 N -- r2 )    
    >r  fdup   px f!
    r@ 1+  s>f f+
    0 r> do
      I 0= if leave then       \ for consistent behavior in 4tH and ansforth
      I s>f fswap  f/   1 s>f  f+
      I s>f fswap  f/   px f@   f+
    -1 +loop
    1 s>f  fswap f/
 ;

: E1High ( f1 N -- f2)  >r fdup r> (E1high) fswap fexp f/ ;

: fE1 ( f1 -- f2 )           \ Expontial Integral, E1(x)
  fdup f0= abort" fE1: divide by zero"
  fdup f0< abort" fE1: negative float "
  fdup s" 67e-2" s>float f<  if 32 E1Low else 40 E1High then ;


\ --Invantsov Function--
\   fIv(x)= x*Exp(x)*E1(x)

: fIv ( f1 -- f2)
    fdup f0= abort" fIv: divide by zero"
    fdup f0< abort" fIv: negative float"
    fdup fdup s" 67e-2" s>float f<
    if 32 E1Low fswap fdup fexp f* f*
    else 40 (E1High) f* then
;

\ ----------Testing ---------------------
\ Test the Invantsov function: (note behavior relative to erf(x)).
true [if]                      \ ref [3] limited precision,see next Test.
   cr ."  x         fIv(x)        Compared to:"
   s" 1e-6" s>float fdup cr f.  space fIv  f.  ."    -----"
   s" 1e-2" s>float fdup cr f.  space fIv  f.  ."    0.04079"
   s" 1e-1" s>float fdup cr f.  space fIv  f.  ."    0.2015"
     1 s>f fdup cr f.   space fIv  f.  ."    0.5963"
    10 s>f fdup cr f.   space fIv f.    ."    0.9156"
   100 s>f fdup  cr f.  space fIv f.    ."    ------"
[then]

\ Test the exponential Integral, E1(x).
true [if]                            \ refs: [1] & mathworld.wolfram.com
  cr cr ."   x        fE1(x)       Compared to:" 
  s" 1e-7" s>float fdup cr f. space fE1 f.  ."   15.540880086"
  s" 1e-6" s>float fdup cr f. space fE1 f.  ."   13.238295893"  
  s" 1e-5" s>float fdup cr f. space fE1 f.  ."   10.935719800"
  s" 1e-4" s>float fdup cr f. space fE1 f.  ."    8.633224705"
  s" 1e-3" s>float fdup cr f. space fE1 f.  ."    6.331539364"
  s" 1e-2" s>float fdup cr f. space fE1 f.  ."    4.037929577"
  s" 1e-1" s>float fdup cr f. space fE1 f.  ."    1.822923958"
  s" 65e-2" s>float fdup cr f. space fE1 f. ."    0.411516976" \ ref [1]
  s" 66e-2" s>float fdup cr f. space fE1 f. ."    0.403586275" \ ref [1]
  s" 67e-2" s>float fdup cr f. space fE1 f. ."    0.395852563" \ ref [1]
  s" 1e0"   s>float fdup cr f. space fE1 f. ."    0.219383934" \ ref [1]
  s" 1e1"   s>float fdup cr f. space fE1 f. ."    4.156968930E-6"
  cr
[then]

\   ---- cut here -----
\ EXAMPLE (Ivantsov function): Snowflakes and Dendrites.
\ --
\ From [4], Kenneth Libbrecht, "The enigmatic snowflake"
\     PysicsWorld [21] (2008) p. 19 (physicsworld.com):
\  "In 1947 the Russian mathematician GP Invantov discovered a family of
\ dynamically stable solutions to the diffusion equations that shed 
\ considerable light on the growth of dendritic structures." .... 
\ "Interestingly, ice forms nearly the same dendritic structures whether it 
\ is grown from water vapour in air or from freezing liquid water. In the 
\ latter case, the growth is mainly limited by the diffusion of latent heat
\ generated at the solid-liquid interface.  In a snow crystal, on the other
\ hand, growth is mainly limited by the diffusion of water-vapour molecules 
\ through the surrounding air"
\ --
\ From [5], J.S. Langer, "Dendrites, Viscous Fingers, and the Theory
\     of Pattern Formation"  SCIENCE [243] (1989) p. 1150:
\ A description of the Invantsov solution is given as (and the paradox) --
\    Delta (dimensionless undercooling) = (Tmelting-T)/(L/C) 
\        and Peclet_No = Vel*Radius/[2*thermalDiffusivity] with
\       the Ivantsov solution as  Delta = Iv(Peclet_No)
\    where: 
\          L = Latent heat of freezing
\          C = Heat capacity of liquid 
\          a = Thermal diffusivity
\          Tm = equilibrium melting temperature and T=temperature of water 
\          Vel = ice crystal growth velocity
\          Radius = ice crystal tip radius
\ --
\  Experimental Results for H2O from [6] Y. Teraoka, A. Saito, S. Okawa, 
\      "Ice crystal growth in supercooled solution"
\       Int. J refrigeration [25] (2002) p. 218-225.  -- we find:
\        T=-3 deg C, Radius=1E-5 m, Vel=0.0002 m/s 
\ --
\ Looking up data for water we also find near freezing:
\                  L = 334  J/g
\                  C = 4 J/[g*K]
\                  a = 135E-9  [m^2]/s 
\ --
\ Thus  Delta = 3/(334/4) =  0.036
\  and  Peclet_No=(0.0002)(1E-5)/(2*135e-9) = 0.0074 
\  and from the  Ivantsov solution:  Delta=Iv(0.0074) which is:
true [IF]
 cr cr ."                 Growth of Ice Crystals:"
 cr ." Peclet Number = 0.0074"
 cr ." Iv(0.0074) = "  s" 74e-4" s>float fIv f. ." dimensionless undercooling"
 cr ."   as compared to 0.036 dimensionless undercooling experimentally"
 cr ."   with ice crystal growth vel=0.0002 m/s,"
 cr ."   ice crystal tip Radius=1x10-5 m, and"
 cr ."   water temperature of -3 deg. Celsius where"
 cr ."   dimensionless undercooling=(Tmelting-T)/(latent_heat/heat_capacity)"
 cr ."   and Peclet Number= Vel*Radius/(2*thermal_Diffusivity)"
 cr cr
[then]	
\     ---cut here---


