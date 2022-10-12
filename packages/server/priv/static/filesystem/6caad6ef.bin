\ Find Easter Sunday for a Given Year.
\ Algorithm by Lilius & Clavius (16th Century)
\ Comments by Knuth - Art of Computer Programming 1.3.2 ex 14 (2nd set)
\     Code by Charlton - 21Apr95.

[UNDEFINED] easterSunday [IF]
\ Algorithm E (Date of Easter) )

\ Let Y be the year for which the date of Easter be required.

\ E1. [Golden number] Set G <- (y mod 19) + 1. (G is the so called
\     "golden number" of the year in the 19-year Metonic cycle)

: goldenNumber ( y--g )  19 MOD  1+ ;


\ E2. [Century] Set C <- [Y/100] + 1. (When Y is not a multiple of 100,
\     C is the century number; ie, 1984 is in the twentieth century.)

: century ( y--c )  100 /  1+ ;


\ E3. [Corrections] Set X <- [3C/4] - 12, Z <- [(8C + 5)/25] - 5. (X
\     is the number of years, such as 1900, in which leap year was
\     dropped in order to keep in step with the sun. Z is a special
\     correction designed to synchronize Easter with the moon's orbit.)

: corrections ( c--x z )  DUP 3 *  4 /  12 -
                          SWAP 8 *  5 +  25 /  5 - ;


\ E4. [Find Sunday] Set d <- [5Y/4] - X - 10. [March ((-D) mod 7)
\     actually will be a Sunday.] )

: findSunday ( x y--d )  5 *  4 /  SWAP -  10 - ;


\ E5. [Epact] Set E <- (11G + 20 + Z - X) mod 30. If E = 25 and the
\     golden number G is greater than 11, or if E = 24, then increase
\     E by 1. (E is the so-called "epact," which specifies when a
\     full moon occurs.)

: epact ( z x g--e )  DUP >R  11 *  20 +
                      ROT  +  SWAP  -  30 MOD
                      DUP 25 =  R> 11 >  AND
                      OVER 24 = OR
                      IF  1+  THEN ;


\ E6. [Find full moon] Set N <- 44 - E. If N < 21 then set N <- N + 30.
\     (Easter is supposedly the "fisrt Sunday following the first full
\     moon which occurs on or after March 21." Actually pertubations in
\     the moon's orbit do not make this strictly true, but we are
\     concerned here with the "calendar moon" rather than the actual
\     moon. The Nth of March is a calendar full moon.)

: findFullMoon ( e--n )  44 SWAP -
                         DUP 21 < IF  30 + THEN ;


\ E7. [Advance to sunday] Set N <- N + 7 - ((D + N) mod 7).

: advanceToSunday ( n d--n )  OVER +  7 MOD  -  7 + ;


\ E8. [Get month] If N > 31, the date is (N - 31)APRIL; otherwise the
\     date is N MARCH. )

: getMonth ( n--d m )  DUP 31 > IF  31 -  4  ELSE  3  THEN ;


: easterSunday ( y--d m y)  DUP >R   goldenNumber 
                                  R@  century corrections
                             OVER R@  findSunday >R
                             SWAP ROT epact findFullMoon
                                  R>  advanceToSunday
                                      getMonth R> ;
[DEFINED] 4TH# [IF]
hide goldenNumber
hide century
hide corrections
hide findSunday
hide epact
hide findFullMoon
hide advanceToSunday
hide getMonth 
[THEN]
[THEN]
