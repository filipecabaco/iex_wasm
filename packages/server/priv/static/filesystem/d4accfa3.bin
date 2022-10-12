\ Taken from http://rosettacode.org 
\ 4tH version 2011,2012 Hans Bezemer

[UNDEFINED] st.add [IF]
[UNDEFINED] fdup   [IF] [ABORT] [THEN]
[UNDEFINED] fsqrt  [IF]
  [DEFINED] ZenFP  [IF] include lib/zenfsqrt.4th [THEN]
[THEN]

[UNDEFINED] f** [IF]
  [DEFINED] ZenFP
  [IF]   include lib/zenfalog.4th
  [ELSE] include lib/falog.4th
  [THEN]
[THEN]

struct
  field:       st_count
  float +field st_sum
  float +field st_qsum
  float +field st_rsum
  float +field st_prod
  float +field st_mean
  float +field st_nvar
end-struct /st_var

: f+! ( x addr -- ) dup >r f@ f+ r> f! ;
: st.variance ( stats -- var ) dup >r -> st_nvar f@ r> -> st_count @ s>f f/ ;
: st.amean ( stats -- amean )  dup >r -> st_sum  f@ r> -> st_count @ s>f f/ ;
: st.hmean ( stats -- hmean )  dup >r -> st_count @ s>f r> -> st_rsum f@ f/ ;
: st.rms ( stats -- rms ) dup >r -> st_qsum f@ r> -> st_count @ s>f f/ fsqrt ;
: st.stddev ( stats -- stddev ) st.variance fsqrt ;
: st.gmean dup >r -> st_prod f@ 1 s>f r> -> st_count @ s>f f/ f** ;
                                        ( stats -- gmean )
: st.clear
  >r 0 dup r@ -> st_count ! s>f
  fdup r@ -> st_sum  f!
  fdup r@ -> st_qsum f!
  fdup r@ -> st_rsum f!
  fdup r@ -> st_mean f!
  r@ -> st_nvar f! 1 s>f
  r> -> st_prod f! ;
 
: st.add ( x stats -- )
  >r 1 dup r@ -> st_count +!           \ update count
  s>f fover f/ r@ -> st_rsum f+!       \ update reciproke sum
  fdup r@ -> st_prod dup >r f@ f* r> f!
  fdup fdup f* r@ -> st_qsum f+!       \ update square sum
  fdup r@ -> st_sum f+!                \ update sum
  fdup r@ -> st_mean f@ f- fswap       ( delta x )
  fover r@ -> st_count @ s>f f/        ( delta x delta/n )
  r@ -> st_mean dup >r f+!             \ update mean ( delta x )
  r> f@ f- f* r> -> st_nvar f+! ;
                                       \ update nvar
[DEFINED] 4TH# [IF]
  hide st_count
  hide st_sum
  hide st_qsum
  hide st_rsum
  hide st_mean
  hide st_nvar
[THEN]
[THEN]
