\ Low Accuracy Calculations of the Error Function and
\ Complementary Error Function for real values.

\ Forth Scientific Library Algorithm #62

\ Environmental dependences:

\ 1. requires FLOATING and FLOATING EXT wordsets
\ 2. supports unified or separate floating point stack

\ Provides:

\  ERF1
\  ERFC1

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

\   1. The faster, lower accuracy methods are provided by ERF1 and ERF1C.
\      Errors for the provided words are given below, measured on a double
\      precision IEEE floating point system:

\      ERF1 :
\         -6 <= x <= 10.0, maximum relative error < 6e-4

\      ERFC1:
\         -6 <= x <= 1.0,    max. rel. error < 2e-5
\                            max. abs. error < 3e-5

\          1.0 <= x <= 10.0, max. rel. error < 2e-1
\                            max. abs. error < 3e-5

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
\                   in calculations across entire domain; revised
\                   maximum relative error for ERF1 based on tests.
\   2009-08-09  km  revised comments to conform to FSL requirements.
\                   Version 1.0.
\   2011-01-12  km  uncommented definition of ERFC1; revised comments 
\                   to give errors for ERF1, ERFC1; ver 1.02
\   2011-10-16  hb  converted faster, less accurate functions to 4tH,
\                   works with FP configuration 1 or higher.

( ERF               V1.02     12 January 2011 )

[UNDEFINED] erfc1   [IF]
[UNDEFINED] fover   [IF] [ABORT] [THEN]
[UNDEFINED] fexp    [IF]
  [UNDEFINED] ZenFP
  [IF]   include lib/fexp.4th
  [ELSE] include lib/zenfexp.4th
  [THEN]
[THEN]

\ Low accuracy method based on rational approximation [1].
\ Charles G. Montgomery 20 May 2009 placed in public domain

: fff ( f: x y z -- x x*[y+z] ) \ factor for Horner polynomial
  F+ FOVER F*  ;

\ The auxiliary func1 may be what you really need for some things.
: func1 ( f: x -- r )  \ exp(x*x)*erfc(x) for non-negative x
  47047 S>F 100000 S>F F/ F* 1 S>F F+ 1 S>F FSWAP F/ 0 S>F
  7478556 S>F 10000000 S>F F/ fff
  -958798 S>F 10000000 S>F F/ fff
  3480242 S>F 10000000 S>F F/ fff FSWAP FDROP ;

\ Error function for positive real arguments 
: erfc1_pos ( f: x -- erfc[x] ) \ for non-negative x only; abs error <= 2.5e-5
    FDUP func1 FSWAP FDUP F* FNEGATE FEXP F* ; ( erfc[x] )
 
: erfc1 ( f: x -- erfc[x] ) \ for all x, using erfc(-x) = 2 - erfc(x)
    FDUP F0< >R FABS erfc1_pos  R> IF 2 S>F FSWAP F-  THEN ;
 
: erf1_pos ( f: x -- erf[x] ) \ for non-negative x only; rel error <= 1e-4
    erfc1_pos FNEGATE 1 S>F F+  ;  \ erf(x) = 1 - erfc(x)

: erf1 ( f: x -- erf[x] ) \ for all x, using erf(-x) = -erf(x)
    FDUP F0< >R FABS erf1_pos R> IF FNEGATE THEN ;

[DEFINED] 4TH# [IF]
  hide fff
  hide func1
[THEN]
[THEN]

\ include lib/fp3.4th
\ fclear 100 set-precision

\ s" 0e"    s>float erf1 f. cr \ 0
\ s" 1e-1"  s>float erf1 f. cr \ 0.112462916
\ s" 2e-1"  s>float erf1 f. cr \ 0.222702589
\ s" 3e-1"  s>float erf1 f. cr \ 0.328626759
\ s" 4e-1"  s>float erf1 f. cr \ 0.428392355
\ s" 5e-1"  s>float erf1 f. cr \ 0.520499878
\ s" 1e"    s>float erf1 f. cr \ 0.842700793
\ s" 15e-1" s>float erf1 f. cr \ 0.966105146
\ s" 2e"    s>float erf1 f. cr \ 0.995322265
\ s" 25e-1" s>float erf1 f. cr \ 0.999593048
\ s" 3e"    s>float erf1 f. cr \ 0.999977910
\ s" 35e-1" s>float erf1 f. cr \ 0.999999257
\ s" 4e"    s>float erf1 f. cr \ 0.999999984

