\ Example code lookup tables
\ Copyright 1997,2009 HanSoft & Partners

[needs lib/row.4th]

create MonthTable1
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

: Get-Month ( n -- )                       ( print title bar )
        1- MonthTable1 swap th @c count type cr
;

create MonthTable2
      1 , ,"  January "
      2 , ," February "
      3 , ,"   March  "
      4 , ,"   April  "
      5 , ,"    May   "
      6 , ,"   June   "
      7 , ,"   July   "
      8 , ,"  August  "
      9 , ," September"
     10 , ,"  October "
     11 , ," November "
     12 , ," December "
     NULL ,

: Search-Month    ( n --)
  MonthTable2 2 num-key row

  if
    nip cell+ @c count type
  else
    drop drop ." Not Found"
  then

  cr
;

4 Get-Month
5 Search-Month
13 Search-Month
