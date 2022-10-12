\ 4tH library - Discordian or Erisian calendar - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The Discordian or Erisian calendar is an alternative calendar used by some
\ adherents of Discordianism. It is specified on page 00034 of the Principia
\ Discordia.

[UNDEFINED] discordian [IF]
[UNDEFINED] oday       [IF] include lib/ordidate.4th [THEN]
[UNDEFINED] leapyear?  [IF] include lib/isdate.4th   [THEN]
[UNDEFINED] holds      [IF] include lib/holds.4th    [THEN]

create (season)                        ( day -- dday 'dseason)
  ,"  Chaos"
  ,"  Discord"
  ,"  Confusion"
  ,"  Bureaucracy"
  ,"  The Aftermath"                   \ calculate season, dday
does> over 73 / 4 min cells + swap 1- 73 mod 1+ swap ;

: (yold) 1166 + dup abs ;              ( year -- sign yold)
: (sttib) <# #s sign s" St. Tib's Day, YOLD " holds #> ;

: discordian                           ( d m y -- a n)
  oday rot drop dup >r leapyear?       \ take care of leapyear
  if dup 60 = if drop r> (yold) (sttib) exit then dup 60 > if 1- then then
  (season) r> (yold) <# #s sign drop s" , YOLD " holds @c count holds #s #>
;                                      \ compose the date in number buffer

[DEFINED] 4TH# [IF]
  hide (season)
  hide (yold)
  hide (sttib)
[THEN]
[THEN]
