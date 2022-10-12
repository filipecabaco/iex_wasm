\ 4tH library - RFC 3339 - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ NOTE: every call overwrites the internal buffer!

[UNDEFINED] rfc3339    [IF]
[UNDEFINED] posix>time [IF] include lib/time.4th [THEN]
[UNDEFINED] sign+      [IF] include lib/holds.4th [THEN]

32 string (rfc3339)                   \ RFC 3339 string buffer
                                      \ formatting words
: (####) <# # # # # #> ;              ( n1 -- a n2)
: (-##) <# # # [char] - hold #> ;     ( n1 -- a n2)
: (T##) <# # # [char] T hold #> ;
: (:##) <# # # [char] : hold #> ;     ( n1 -- a n2)
: (+##:00) dup abs <# # # [char] : hold # # sign+ #> ;
                                      \ assemble RFC 3339 body              
: (rfc3339-datetime)                  ( epoch -- a)
  dup >r posix>time r> posix>jday jdate (rfc3339) >r
  (####) r@  place (-##) r@ +place (-##) r@ +place
  (T##)  r@ +place (:##) r@ +place (:##) r@ +place r>
;
                                       \ add timezone
: (+tz) rot dup >r +place r> count ;   ( a1 a2 n2 -- a1 n1)
: rfc3339 (rfc3339-datetime) 0 tz 36 / (+##:00) (+tz) ;
: rfc3339-utc (rfc3339-datetime) s" Z" (+tz) ;
                                       ( epoch -- a n)
[DEFINED] 4TH# [IF]
  hide (####)
  hide (rfc3339)
  hide (-##)
  hide (T##)
  hide (:##)
  hide (+##:00)
  hide (rfc3339-datetime)
  hide (+tz)
[THEN]
[THEN]

