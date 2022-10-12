include lib/fp3.4th
include lib/ftrunc.4th

fclear
10 set-precision

float array -1E
-1 s>f -1E f!
:redo -1E f@ ;

float array 0E
0 s>f 0E f!
:redo 0E f@ ;

float array -0E
0E fnegate -0E f!
:redo -0E f@ ;

\ Testing 
\ ======= 
.( a] Systems which do NOT provide support for floating point signed zero:) cr

0E                       FTRUNC 0E 0E F~ . cr              \ TRUE
s" 1E-9" s>float         FTRUNC 0E 0E F~ . cr              \ TRUE
s" -1E-9" s>float        FTRUNC 0E 0E F~ . cr              \ TRUE
s" -0.9E" s>float        FTRUNC 0E 0E F~ . cr              \ TRUE
-1E s" 1E-5" s>float  F+ FTRUNC 0E F= . cr                 \ TRUE
-1E s" -1E-5" s>float F+ FTRUNC -1E F= . cr                \ TRUE
s" 3.14E" s>float        FTRUNC s" 3E" s>float F= . cr     \ TRUE
s" 3.99E" s>float        FTRUNC s" 3E" s>float F= . cr     \ TRUE
s" 4E" s>float           FTRUNC s" 4E" s>float F= . cr     \ TRUE
s" -4E" s>float          FTRUNC s" -4E" s>float F= . cr    \ TRUE
s" -4.1E" s>float        FTRUNC s" -4E" s>float F= . cr    \ TRUE


.( b] Systems which support floating point signed zero:) cr

\ If result is TRUE (-1), problem may be with implementation of F~ 
\ Should print 0 to indicate system distinguishes between -0E and 0E
-0E 0E 0E F~ . cr

0E                       FTRUNC 0E 0E F~ . cr              \ TRUE
-0E                      FTRUNC -0E 0E F~ . cr             \ TRUE
s" 1E-9" s>float         FTRUNC 0E 0E F~ . cr              \ TRUE
s" -1E-9" s>float        FTRUNC -0E 0E F~ . cr             \ TRUE
s" -0.9E" s>float        FTRUNC -0E 0E F~ . cr             \ TRUE
-1E s" 1E-5" s>float  F+ FTRUNC -0E F= . cr                \ TRUE
-1E s" -1E-5" s>float F+ FTRUNC -1E F= . cr                \ TRUE
s" 3.14E" s>float        FTRUNC s" 3E" s>float F= . cr     \ TRUE
s" 3.99E" s>float        FTRUNC s" 3E" s>float F= . cr     \ TRUE
s" 4E" s>float           FTRUNC s" 4E" s>float F= . cr     \ TRUE
s" -4E" s>float          FTRUNC s" -4E" s>float F= . cr    \ TRUE
s" -4.1E" s>float        FTRUNC s" -4E" s>float F= . cr    \ TRUE

0E                       FTRUNC F. .( =>  0) cr
-0E                      FTRUNC F. .( => -0) cr
s" 1E-9" s>float         FTRUNC F. .( =>  0) cr
s" -1E-9" s>float        FTRUNC F. .( => -0) cr
s" -0.9E" s>float        FTRUNC F. .( => -0) cr
-1E s" 1E-5" s>float  F+ FTRUNC F. .( => -0) cr
-1E s" -1E-5" s>float F+ FTRUNC F. .( => -1) cr
s" 3.14E" s>float        FTRUNC F. .( =>  3) cr
s" 3.99E" s>float        FTRUNC F. .( =>  3) cr
s" 4E" s>float           FTRUNC F. .( =>  4) cr
s" -4E" s>float          FTRUNC F. .( => -4) cr
s" -4.1E" s>float        FTRUNC F. .( => -4) cr
