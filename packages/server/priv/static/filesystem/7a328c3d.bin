( Program by Prof. Ting)

[NEEDS lib/enter.4th]

VARIABLE JULIAN ( Julian date of 1st of a year, from Jan. 1, 1950)
VARIABLE LEAP   ( 1 for a leap year, 0 otherwise. )
1461 CONSTANT 4YEARS ( number of days in 4 years )

: YEAR ( YEAR --, compute Julian date and leap year )
       1949 - 4YEARS 4 */MOD            ( days since 1/1/1949 )
       365 - JULIAN !                   ( 0 for 1/1/1950 )
       3 =                              ( modulus 3 for a leap year )
       IF     1 LEAP !                  ( leap year )
       ELSE   0 LEAP !                  ( normal year )
       THEN ;

: 1ST   ( MONTH -- 1ST, 1st of a month from Jan. 1 )
        DUP 1 =
        IF DROP 0                       ( 0 for Jan. 1 )
        ELSE    DUP 2 =
                IF      DROP 31         ( 31 for Feb. 1 )
                ELSE    DUP 3 =
                        IF      DROP 59 LEAP @ +     ( 59/60 for Mar. 1 )
                        ELSE    4 - 30624 1000 */
                                90 + LEAP @ +        ( Apr. 1 to Dec. 1 )
                        THEN
                THEN
        THEN
        ;

: DAY  ( DD MM YYYY -- JULIAN-DAY )
       YEAR                             ( Compute JULIAN and LEAP)
       1ST + 1-                         ( add DD to 1st of the month )
       JULIAN @ +                       ( add to Jan. 1 of the year )
       ;

: STARS 0 DO 42 EMIT LOOP ;             ( form the boarder )

create MonthTable
       ,"  January "
       ," February "
       ,"   March  "
       ,"   April  "
       ,"    May   "
       ,"   June   "
       ,"   July   "
       ,"  August  "
       ," September"
       ,"  October "
       ," November "
       ," December "

: header ( n -- )                       ( print title bar )
        cr cr 26 stars space
        1- MonthTable + @c COUNT TYPE
        space 27 stars cr cr
        ."      SUN     MON     TUE     WED     THU     FRI     SAT"
        cr cr                           ( print weekdays )
        ;

: BLANKS ( MONTH -- )                   ( skip days not in this month )
       1ST JULIAN @ +                   ( Julian date of 1st of month )
       7 MOD 8 * SPACES ;               ( skip colums if not Sunday   )

: .DAYS ( MONTH -- )                    ( print days in a month )
      DUP 1ST                           ( days of 1st this month )
      SWAP 1 + 1ST                      ( days of 1st next month )
      OVER - 0                          ( loop to print the days )
      DO I OVER +
        JULIAN @ + 7 MOD                ( which day in the week? )
        0= IF CR THEN                   ( start a new line if Sunday )
        I 1 + 8 .R                      ( print day in 8 column field )
      LOOP
      DROP ;                            ( discard 1st day in this month )

: MONTH ( N -- )                        ( print a month calendar )
      DUP
      HEADER DUP BLANKS                 ( print header )
      .DAYS ;                           ( print days   )

: CALENDAR ( YEAR --- )                 ( print year calendar )
      YEAR                              ( compute JULIAN and LEAP )
      13 1 DO I MONTH LOOP              ( print 12 month calendars )
      CR CR 64 STARS ;                  ( print last boarder )

: CHECKYEAR
  DUP 1950 <
  IF ." Wrong year" CR QUIT
  THEN
;

: CHECKMONTH                            ( check month in range )
  DUP 0<
  IF DROP 0
  ELSE DUP 12 >
    IF DROP 0
    THEN
  THEN ;

: PROMPT                                ( ask for parameters )
  ." Enter year : "
  ENTER CHECKYEAR
  ." Enter month: "
  ENTER CHECKMONTH
  DUP 0=
  IF DROP CALENDAR
  ELSE SWAP YEAR MONTH
  THEN CR
;

PROMPT
