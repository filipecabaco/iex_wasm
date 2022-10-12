\ ANS Forth compatibility layer for RetroForth 9.2.9.
\ Neal Bridges, August 2006.  neal@quartus.net  http://quartus.net
\ 4tH version DOUBLE DOT - Hans Bezemer, April 2007, 2011

[UNDEFINED] d.r [IF]
[UNDEFINED] num>char [IF] [NEEDS lib/dblsharp.4th] [THEN]

: (ud.) <d# d#s d#> ;
: ud.r  >r (ud.) r> over - spaces type ;
: ud. 0 ud.r space ;
: (d.) tuck dabs <d# d#s dsign d#> ;
: d.r >r (d.) r> over - spaces type ;
: d. 0 d.r space ;
: u.r swap u>d rot ud.r ;
: u. u>d ud. ;
[THEN]
