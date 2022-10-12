include lib/fp2.4th
include lib/zentrunc.4th

\ Testing
\ ======= 
\ a) Systems which do NOT provide support for floating point signed zero: 

0 s>f                    FTRUNC 0 S>F F= . cr              \ TRUE
1 -9                     FTRUNC 0 S>F F= . cr              \ TRUE
-1 -9                    FTRUNC 0 S>F F= . cr              \ TRUE
-9 -1                    FTRUNC 0 S>f F= . cr              \ TRUE
-1 S>F 1 -5              F+ FTRUNC 0 S>F F= . cr           \ TRUE
-1 S>F -1 -5             F+ FTRUNC -1 S>F F= . cr          \ TRUE
314 -2                   FTRUNC 3 S>F F= . cr              \ TRUE
399 -2                   FTRUNC 3 S>F F= . cr              \ TRUE
4 S>F                    FTRUNC 4 S>F F= . cr              \ TRUE
-4 S>F                   FTRUNC -4 S>F F= . cr             \ TRUE
-41 -1                   FTRUNC -4 S>F F= . cr             \ TRUE
