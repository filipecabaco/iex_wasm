\ 4tH library - CP437 to HTML codes - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] CP437>HTML         [IF]
[UNDEFINED] CP437|ISO8859|HTML [IF] [ABORT]             [THEN]
[UNDEFINED] row                [IF] [needs lib/row.4th] [THEN]

aka CP437|ISO8859|HTML CP437>HTML
does>                                  ( c -- a n)
  over if
    3 num-key row                      \ search table
    if                                 \ if HTML code drop original
      nip cell+ cell+ @c count         \ output HTML code
    else                               \ else drop dummy code
      drop <# [char] ; hold #s [char] # hold [char] & hold #>
    then
  else swap                            \ return null string
  then
;
[THEN]
