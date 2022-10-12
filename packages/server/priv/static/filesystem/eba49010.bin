\ Taken from http://rosettacode.org 
\ 4tH version 2010,2011 Hans Bezemer

[UNDEFINED] .longjday  [IF]
[UNDEFINED] jdate [IF]
include lib/time.4th
[THEN]

: .-0 <# # # [char] - hold #> type ;
: (type) swap cells + @c count type ;

create (months)
  ," January"
  ," February"
  ," March"
  ," April"
  ," May"
  ," June"
  ," July"
  ," August"
  ," September"
  ," October"
  ," November"
  ," December"
does> (type) ;

create (weekdays)
  ," Monday"
  ," Tuesday"
  ," Wednesday"
  ," Thursday"
  ," Friday"
  ," Saturday"
  ," Sunday"
does> (type) ;
                                       ( jday --)
: .shortjday jdate 0 .r .-0 .-0 ;
                                       ( jday --)
: .longjday
  dup 7 mod (weekdays) ." , " jdate >r 1- (months) space 0 .r ." , " r> .
;

[DEFINED] 4TH# [IF]
  hide .-0
  hide (type)
  hide (months)
  hide (weekdays)
[THEN]
[THEN]

\ time tz posix>jday .shortjday cr
\ time tz posix>jday .longjday  cr