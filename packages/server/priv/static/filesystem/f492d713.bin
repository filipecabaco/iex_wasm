\ High Accuracy Calculations of the Error Function and
\   Complementary Error Function for real values.

\ Forth Scientific Library Algorithm #62

\ Environmental dependences:

\ 1. requires FLOATING and FLOATING EXT wordsets
\ 2. supports separate floating point stack

\ Provides:

\  ERF
\  ERFC

\ compiled by Krishna Myneni from postings on comp.lang.forth by 
\ Andrew P. Haley, Charles G. Montgomery, and Marcel A. Hendrix 
\ Thread Root Message ID: <gPTPl.42433$v8.19515@bignews3.bellsouth.net>

\ Disclaimer:

\ THIS SOFTWARE IS PROVIDED BY THE AUTHORS ``AS IS'' AND ANY EXPRESS OR
\ IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
\ WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
\ DISCLAIMED. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY DIRECT,
\ INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
\ (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
\ SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
\ HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
\ STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
\ IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
\ POSSIBILITY OF SUCH DAMAGE.

\ Notes:

\   1. The slower, higher accuracy methods are provided by ERF and ERFC.
\      Errors for the provided words are given below, measured on a double 
\      precision IEEE floating point system:

\      ERF:
\         -6 <= x <= 10.0,   max. rel. error < 4e-16

\      ERFC:
\         -6 <= x <= 10.0,   max. rel. error < 4e-15 

\ References:

\ [1] M. Abramowitz and I. A. Stegun, Handbook of Mathematical Functions
\     with Formulas, Graphs, and Mathematical Tables, Dover, New York,
\     1964; 7.1.25

\ [2] C. W. Clenshaw, Chebyshev Series for Mathematical Functions,
\     Mathematical Tables, vol. 5, National. Physical Laboratory, H.M.S.O.,
\     London, 1962 

\ [3] http://en.wikipedia.org/wiki/Clenshaw_algorithm

\ Revisions:
\   2009-07-23  km  use APH's revised segmentation for calculation of
\                   ERF and ERFC, to avoid numerical loss of precision
\                   in calculations across entire domain.
\   2009-08-09  km  revised comments to conform to FSL requirements.
\                   Version 1.0.
\   2011-01-12  km  revised comments to give errors for ERF, ERFC; ver 1.02
\   2011-10-19  hb  converted slower, more accurate functions to 4tH,
\                   works with FP configuration 3 or higher.

( ERF               V1.02     12 January 2011 )

\ High-accuracy method based on Chebyshev polynomials. 
\ by Andrew P. Haley, and placed in public domain.

\ Clenshaw [2] gives Chebyshev coefficients for

\    erf(x) = x/4 * sum(k=0..N) { a[2k] * T[2k](x/4) }  -4 <= x <= 4

\ and

\    erfc(x) = exp(-x2)/(x*sqrt pi) * sum(k=0..N) { a[2k] * T[2k](4/x) }
\                                                 x >= 4

\ where erfc(x) = 1 - erf(x)

\ To obtain a less precise but faster approximation to these
\ functions the Chebyshev series may be truncated.

\ We use Clenshaw's coefficients for erfc x >= 4, but use specially
\ generated approximations in the ranges -2 <= x <= 2 for erf and for
\ erfc in the range 2 <= x <= 4.

[UNDEFINED] erfc  [IF]
  [DEFINED] ZenFP [IF] [ABORT] [THEN]
[UNDEFINED] fexp  [IF] include lib/fexp.4th    [THEN]
[UNDEFINED] f>    [IF] include lib/fequals.4th [THEN]

float array 2x

\ Evaluate a series in Chebyshev polynomials of the first kind.

\ Clenshaw's recurrence is [3]:

\    b[r] = 2x*b[r+1] - b[r+2] + a[r]

\    f[x] = 1/2 (b[0] - b[2])

\ a0 is address of the zeroth coefficient, and the last. The zeroth
\ coefficient in the table should be divided by two.

: chebev ( a0 an) ( F: x - y)
  over >r
  2 s>f f* 2x f!
  0 s>f fdup

  cells over cell- +
  do                                   ( b[r+2] b[r+1] )
    fdup 2x f@ f*
    frot f-
    i @c count s>float f+ -1
  +loop

  2x f@ f2/ f* fswap f- r> @c count s>float f+
;

\ The last few coefficients for erf are removed because they don't
\ contribute much useful accuracy.  If you're using IEEE double
\ precision, which has at best 16.25 decimal digits, you can remove
\ the last few coefficients without significant loss of accuracy.

create erf_coeffs
     ," +1.48311056408480362305e+00"
     ," -6.02142146773189901654e-01"
     ," +1.37989661379663136323e-01"
     ," -2.78325425294443761376e-02"
     ," +4.84159904486692746016e-03"
     ," -7.31727937169617309608e-04"
     ," +9.72419688646380992648e-05"
     ," -1.14985131160713699893e-05"
     ," +1.22264871568695297335e-06"
     ," -1.17982030625916872056e-07"
     ," +1.04140181841372967700e-08"
     ," -8.46595175993108677117e-10"
     ," +6.37622701329835012648e-11"
     ," -4.47231003766536866963e-12"
     ," +2.93465969598216991847e-13"
     ," -1.80880039707634947850e-14"
     ," +1.05096274309418376464e-15"
     ," -5.77485224456989086893e-17"
\     ," +3.00957037511526508273e-18"
\     ," -1.49145785641888477345e-19"
\     ," +7.04512761980799395177e-21"
here ' erf_coeffs - constant /erf_coeff

\    erfc(x) = exp(-x2)/(x*sqrt pi) * sum(k=0..N) { a[2k] * T[2k](4/x) }
\                                                 x >= 4

\    From Clenshaw

create erfc_coeffs
    ," +0.98535263612877246193e0"
    ," -0.01433974027177497552e0"
    ," +0.00029736169220261895e0"
    ," -0.00000980351604336237e0"
    ," +0.00000043313342034728e0"
    ," -0.00000002362150026241e0"
    ," +0.00000000151549676581e0"
    ," -0.00000000011084939856e0"
    ," +0.00000000000904259014e0"
    ," -0.00000000000080947054e0"
    ," +0.00000000000007853856e0"
    ," -0.00000000000000817918e0"
    ," +0.00000000000000090715e0"
    ," -0.00000000000000010646e0"
    ," +0.00000000000000001315e0"
    ," -0.00000000000000000170e0"
\    ," +0.00000000000000000023e0"
\    ," -0.00000000000000000003e0"
here ' erfc_coeffs - constant /erfc_coeff

\ erfc(x) = exp(-x2)/(x*sqrt pi) * sum(k=0..N) { a[k] * T[k](x-3) }
\                                 2 <= x <= 4

\ Coefficients specially generated for this program.

create erfc_coeffs2
     ," +0.94527701009067617778e+00"
     ," +3.17049565101290913120e-02"
     ," -6.73843163544725938991e-03"
     ," +1.23559784757597021029e-03"
     ," -2.06258409386934785687e-04"
     ," +3.21465835918538975707e-05"
     ," -4.74521240392225710897e-06"
     ," +6.69458188091390037841e-07"
     ," -9.08366988906448634126e-08"
     ," +1.19085967623897923140e-08"
     ," -1.51371242892998039880e-09"
     ," +1.87074264411699517115e-10"
     ," -2.25295145776339602484e-11"
     ," +2.64893125290031939759e-12"
     ," -3.04550625183817820911e-13"
     ," +3.42854718946481738893e-14"
     ," -3.78388196540724875713e-15"
     ," +4.09821531703203301077e-16"
     ," -4.35997253185852896000e-17"
     ," +4.55999402005552146398e-18"
\     ," -4.69202690718497228320e-19"
\     ," +4.75298359746767356516e-20"
\     ," -4.74296215874657703189e-21"
here ' erfc_coeffs2 - constant /erfc_coeff2

\ The real axis is split into three intervals:

\   domain 1:  x < -2
\   domain 2:  -2 <= x < 2
\   domain 3:  x >= 2

\ erf(x) and erfc(x) are computed in the three domains, using
\ the high-precision words for erfc(x) in domain 3, and erf(x)
\ in domain 2, and the relations between erfc(x), erf(x), and

\ The real axis is split into three intervals:

\   domain 1:  x < -2
\   domain 2:  -2 <= x < 2
\   domain 3:  x >= 2

\ erf(x) and erfc(x) are computed in the three domains, using
\ the high-precision words for erfc(x) in domain 3, and erf(x)
\ in domain 2, and the relations between erfc(x), erf(x), and
\ erfc(-x) and erf(-x).

\ erf(x), domain 2: -2 <= x < 2
: erf_d2 ( F: x -- y)
   2 s>f f/  fdup
   fdup f* 2 s>f f* 1 s>f f-
   erf_coeffs /erf_coeff chebev

   f* ;

\ erfc(x), domain 3: x >= 2

: erfc_d3 ( F: x -- y)

    fdup
    fdup f* fnegate fexp fover
    s" 1.772453850905516027298167483314" s>float f* f/  fswap

    fdup 4 s>f f> if
      4 s>f fswap f/
      fdup f* 2 s>f f* 1 s>f f-
      erfc_coeffs /erfc_coeff chebev
    else
      3 s>f f-
      erfc_coeffs2 /erfc_coeff2 chebev
    then

    f* ;

: erf_d1 ( F: x -- y)
    \ Compute erfc in domain 3; Use erf(-x) = -erf(x) = erfc(x) - 1
    fabs erfc_d3 1 s>f f-
;

: erf_d3 ( F: x -- y)
   \ Compute erfc in domain 3; Use erf(x) = 1 - erfc(x)
   erfc_d3 1 s>f fswap f-
;

: erfc_d2 ( F: x -- y)
   \ Compute erf in domain 2; Use erfc(x) = 1 - erf(x)
   erf_d2 1 s>f fswap f-
;

: erfc_d1 ( F: x -- y)
   \ Compute erfc in domain 3; Use erfc(-x) = 2 - erfc(x)
   fabs erfc_d3 2 s>f fswap f-
;

: erf ( F: x -- y)
   fdup -2 s>f f< IF  erf_d1
   ELSE fdup 2 s>f f< IF erf_d2  ELSE  erf_d3  THEN
   THEN
;

: erfc ( F: x -- y)
   fdup -2 s>f f< IF  erfc_d1
   ELSE fdup 2 s>f f< IF erfc_d2  ELSE  erfc_d3  THEN
   THEN
;

[DEFINED] 4TH# [IF]
  hide 2x
  hide chebev
  hide erf_coeffs
  hide /erf_coeff
  hide erfc_coeffs
  hide /erfc_coeff
  hide erfc_coeffs2
  hide /erfc_coeff2
  hide erf_d1
  hide erf_d2
  hide erf_d3
  hide erfc_d1
  hide erfc_d2
  hide erfc_d3
[THEN]
[THEN]