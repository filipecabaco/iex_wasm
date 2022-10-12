\ jd.4th

\ Julian Day by Wil Baden

( 
In gathering old stuff, I came across the following, written long ago,
which I thought would be of interest.

The Julian Day is the number of days since 1 January 4713 BC.
)

\  Julian Day

: JD                ( dd mm yyyy -- julian-day )
    >R                            ( dd mm)( R: yyyy)
        3 -  DUP 0< IF  12 +  R> 1- >R  THEN
        306 *  5 +  10 /  +       ( day)
        R@  1461 4 */  +  1721116 +
           DUP 2299169 > IF
               3 +  R@ 100 / -  R@ 400 / +
           THEN
    R> DROP                               ( R: )
;

: BC 1- NEGATE ;


\ Here are some test values.

1  1 4713 BC JD . ( 0 ) cr
31 12 1 BC JD . ( 1721422 ) cr
1  1    1 JD . ( 1721423 ) cr
5 10 1582 JD . ( 2299160 ) cr
15 10 1582 JD . ( 2299161 ) cr
1  1 1933 JD . ( 2427074 Merriam-Webster dictionary ) cr
1  1 1965 JD . ( 2438762 Random House dictionary ) cr
23  5 1968 JD . ( 2440000 Winning Ways ) cr

(
--  
Wil Baden    Costa Mesa, California   Per neilbawd@earthlink.net
)


