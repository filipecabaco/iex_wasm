include lib/fp3.4th
include lib/fsl-util.4th
include lib/horner.4th
include lib/fexpint.4th 
include lib/fexp.4th 
include lib/flnflog.4th

\ test code =============================================
6 FLOATS 1+ ARRAY ArrayZ{
5 FLOATS 1+ ARRAY ArrayY{
5 FLOATS 1+ ARRAY ArrayW{
FLOAT ArrayZ{ FSL-ARRAY
FLOAT ArrayY{ FSL-ARRAY
FLOAT ArrayW{ FSL-ARRAY
:REDO ArrayZ{ (FSL-ARRAY) ;
:REDO ArrayY{ (FSL-ARRAY) ;
:REDO ArrayW{ (FSL-ARRAY) ;

\ initialize with data for real exponential integral
: horner_init ( -- )

      S" 0.00107857" s>float ArrayZ{ 5 } F!
     S" -0.00976004" s>float ArrayZ{ 4 } F!
      S" 0.05519968" s>float ArrayZ{ 3 } F!
     S" -0.24991055" s>float ArrayZ{ 2 } F!
      S" 0.99999193" s>float ArrayZ{ 1 } F!
     S" -0.57721566" s>float ArrayZ{ 0 } F!

                   1  s>f     ArrayY{ 4 } F!
     S" 8.5733287401" s>float ArrayY{ 3 } F!
    S" 18.059016973"  s>float ArrayY{ 2 } F!
     S" 8.6347608925" s>float ArrayY{ 1 } F!
     S" 0.2677737343" s>float ArrayY{ 0 } F!

                    1  s>f     ArrayW{ 4 } F!
      S" 9.5733223454" s>float ArrayW{ 3 } F!
     S" 25.6329561486" s>float ArrayW{ 2 } F!
     S" 21.0996530827" s>float ArrayW{ 1 } F!
      S" 3.9584969228" s>float ArrayW{ 0 } F!

;

: local_exp ( -- , f: x -- expint[x] )

        FDUP
        f1.0 F< IF
                    FDUP ArrayZ{  5 }Horner
                    FSWAP FLN F-
                ELSE
                    FDUP  ArrayY{ 4 }Horner
                    FOVER ArrayW{ 4 }Horner
                    F/
                    FOVER F/
                    FSWAP -1 s>f F* FEXP F*
                THEN
;

: do_both ( -- , f: x -- )
   FDUP FDUP
   ." X = " F.
   ." Horner: " local_exp F.
   ." ExpInt: " fexpint   F.
   CR
;

\ compare ExpInt as coded in V1.0 against the general purpose
\ Horner routine

: horner_test ( -- )
    horner_init

    CR
      s" 0.2" s>float do_both
      s" 0.5" s>float do_both
      1 s>f do_both
      2 s>f do_both
      5 s>f do_both
     10 s>f do_both
;
fclear
10 set-precision
horner_test
