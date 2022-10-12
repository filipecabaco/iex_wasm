\ 4tH library - Logtime formatter - Copyright 2012,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] .logtime [IF]
[UNDEFINED] today    [IF] include lib/time.4th [THEN]

32 string (logtime)                    \ buffer for logtime string
                                       \ returns 3 character month
create month-string                    ( n1 -- a n2)
  ," Jan"
  ," Feb"
  ," Mar"
  ," Apr"
  ," May"
  ," Jun"
  ," Jul"
  ," Aug"
  ," Sep"
  ," Oct"
  ," Nov"
  ," Dec"
does> swap 1 max 12 min 1- cells + @c count ;
                                       \ returns 3 character day
create day-string                      ( n1 -- a n2)
  ," Mon"
  ," Tue"
  ," Wed"
  ," Thu"
  ," Fri"
  ," Sat"
  ," Sun"
does> swap 0 max 6 min cells + @c count ;

: (00_) # # bl hold ;                  \ two digits and a space
: (00:) # # [char] : hold ;            \ two digits and a semi-colon
: (+time) 10000 * swap 100 * + + <# (00:) (00:) (00_) #> (logtime) +place ;
                                       \ initialize RFC 1123 format
: init-RFC1123                         ( --)
  (logtime) >r time dup posix>jday dup 7 mod day-string r@ place jdate
  swap rot <# bl hold (00_) [char] , hold #> r@ +place month-string r@ +place
  <# # # (00_) #> r@ +place posix>time (+time) s"  GMT"  r> +place
;
                                       \ initializes date format
: init-logdate                         ( --)
  today swap month-string (logtime) place
  swap 10000 * + <# # # (00_) (00_) #> (logtime) +place
;                                      \ get date and format it
                                       \ initializes date and time format
: init-logtime init-logdate now (+time) ;
: logtime (logtime) count ;            ( -- a n)
: .logtime logtime type ;              ( --)

[DEFINED] 4TH# [IF]
  hide (logtime)
  hide (+time)
  hide (00:)
  hide (00_)
[THEN]
[THEN]

\ init-rfc1123 .logtime cr depth .