\ ansi.4th

\ ANSI Terminal words for 4tH

\ Copyright (c) 1999--2002 Krishna Myneni
\ Creative Consulting for Research and Education

\ This software is provided under the terms of the GNU
\ General Public License.

\ Revisions: 
\    1999-06-10
\    1999-10-11 force cursor to 0 0 on page; define at-xy  KM
\    2000-01-23 replaced char with [char] for ANS Forth compatibility KM
\    2002-08-29 use 0,0 as top left for AT-XY in accord with ANS Forth  KM
\    2003-03-27 created 4tH version  HB
\    2004-01-09 added conditional inclusion HB
\    2004-07-15 added private declarations HB
\    2012-04-11 added [FORCE] directive HB

\ Colors

[UNDEFINED] at-xy [IF]
0 constant BLACK
1 constant RED
2 constant GREEN
3 constant YELLOW
4 constant BLUE
5 constant MAGENTA
6 constant CYAN
7 constant WHITE


: save_base ( -- | store current base and set to decimal )
	r> base @ >r >r decimal ;

: restore_base ( -- | restore original base )
	r> r> base ! >r ;

: ansi_escape ( -- | output escape code )
	27 emit [char] [ emit ;

: clrtoeol ( -- | clear to end of line )
	ansi_escape [char] K emit ;

: gotoxy ( x y -- | position cursor at col x row y, origin is 1,1 )
	save_base
	ansi_escape 0 .r [char] ; emit
	0 .r [char] H emit
        restore_base [FORCE] ;

: at-xy ( x y -- |  ANS compatible version of gotoxy, origin is 0,0 )
	save_base
	ansi_escape 1+ 0 .r [char] ; emit
	1+ 0 .r [char] H emit
        restore_base [FORCE] ;

: page ( -- | clear the screen and put cursor at top left )
	ansi_escape [char] 2 emit [char] J emit 0 0 at-xy ;

: cur_up ( n -- | move cursor up by n lines )
	save_base  
	ansi_escape 0 .r [char] A emit
        restore_base [FORCE] ;

: cur_down ( n -- | move cursor down by n lines )
	save_base 
	ansi_escape 0 .r [char] B emit 
        restore_base [FORCE] ;

: cur_left ( n -- | move cursor left by n columns )
	save_base
	ansi_escape 0 .r [char] D emit 
        restore_base [FORCE] ;

: cur_right ( n -- | move cursor right by n columns )
	save_base
	ansi_escape 0 .r [char] C emit 
        restore_base [FORCE] ;

: save_cursor ( -- | save current cursor position )
	ansi_escape [char] s emit ;

: restore_cursor ( -- | restore cursor to previously saved position )
	ansi_escape [char] u emit ;

: foreground ( n -- | set foreground color to n )
	save_base
	ansi_escape 30 + 0 .r [char] m emit 
        restore_base [FORCE] ;

: background ( n -- | set background color to n )
	save_base
	ansi_escape 40 + 0 .r [char] m emit 
        restore_base [FORCE] ;

: text_normal ( -- | set normal text display )
	ansi_escape [char] 0 emit [char] m emit ;

: text_bold ( -- | set bold text )
	ansi_escape [char] 1 emit [char] m emit ;

: text_underline ( -- | set underlined text )
	save_base
	ansi_escape [char] 4 emit [char] m emit
        restore_base [FORCE] ;

: text_blink ( -- | set blinking text )
	save_base
	ansi_escape [char] 5 emit [char] m emit
        restore_base [FORCE] ;

: text_reverse ( -- | set reverse video text )
	save_base
	ansi_escape [char] 7 emit [char] m emit
        restore_base [FORCE] ;

[DEFINED] 4TH# [IF]
  hide save_base
  hide restore_base
  hide ansi_escape
[THEN]
[THEN]

