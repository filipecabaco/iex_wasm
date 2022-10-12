\ Mersenne Twister Demo by Wil Baden, 2003-01-30.

[UNDEFINED] ANSFP [IF]
include lib/fp2.4th
[ELSE]
include lib/fp3.4th
[THEN]

include lib/mersenne.4th

[UNDEFINED] U.R [IF] include lib/dbldot.4th [THEN]

\  *******************************************************************
\  *                            MAIN DEMO                            *
\  *******************************************************************

4 ARRAY INIT 1110 837 564 291 INIT 4 BOUNDS ?DO I ! LOOP

: MAIN  CR
    100 set-precision
    INIT 4 init_by_array
    ." 1000 outputs of genrand_int32 " CR
    1000 0 DO
        genrand_int32 12 U.R
        I 5 MOD 4 = IF  CR  THEN
    LOOP CR
    ." 1000 outputs of genrand_real2 " CR
    1000 0 DO
        genrand_real2 FE.
        I 5 MOD 4 = IF  CR  THEN
    LOOP CR ;

MAIN