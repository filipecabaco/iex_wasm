\ 4tH Sample Size Calculator - Copyright 2010,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
\ After http://www.surveysystem.com/sscalc.htm

include lib/zenfloat.4th
include lib/zenans.4th
include lib/zenfpio.4th
include lib/zenround.4th
include lib/row.4th
include lib/enter.4th
include lib/fenter.4th

create ConfLevel
  95 , ," 196e-2"
  99 , ," 258e-2"
  null ,
does>
  2 num-key row 0= abort" Enter a confidence level of 95% or 99%."
  nip cell+ @c count s>float
;

: ConfInt? fdup f0= abort" Enter a confidence interval between 1e-1 and 50." ;

\ ((zVal *zVal) * 0.25) / ((conInt / 100) *(conInt / 100))
: CalcSS                               ( pop cI cL -- ss)
  fdup f* 4 s>f f/ fswap 100 s>f f/ fdup f* f/ fswap fdup f0= 0=
  if fover 1 s>f f- fswap f/ 1 s>f f+ f/ else fdrop then fround
;

: SampleSize                           ( --)
  ." Enter population         : " enter s>f
  ." Enter confidence interval: " fenter ConfInt?
  ." Enter confidence level   : " enter  ConfLevel
  CalcSS
  ." Recommended sample size  : " f. cr
;

SampleSize
