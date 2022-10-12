\ 4tH library - TABS - Copyright 2006 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] tab [IF]
9 constant tab

\ expand all tabs in string
: detab                                ( a1 n1 n2 -- a1 n3) 
  >r >r 0                              \ save tabs and count
  begin
    r@ over >                          \ while string
  while
    2dup chars + c@ tab =              \ if character is a tab
    if 
      r@ over - -rot                   ( c a n)
      r'@ over over mod - 1- >r        ( c a n)
      2dup chars + >r rot r>           ( a n c a+n)
      r@ over dup >r chars + rot       ( a n a+n a+n+c c)
      cmove r> r@ 1+ blank             \ move remainder and blank
      r@ + r> r> + >r                  \ update counts
    then
    1+                                 \ next character
  repeat
  r> r> drop drop                      \ drop tab and original length
;

\ insert tabs into string
: entab                                ( a1 n1 n2 -- a1 n3)
  over over / over * 0 swap            \ calculate offsets
  ?do                                  \ test all tab positions
    i 1- over over swap - 2>r rot      \ detect tabs
    begin 2r@ > while dup r@ chars + c@ bl = while r> 1- >r repeat
    -rot r> r> over - swap 1+ >r over + r> swap dup
    if                                 \ if tab has been found
      2>r swap rot dup r@ chars + dup tab swap c!
      char+ r> 1+ r> 1- rot over chars over +
      swap >r >r swap >r >r swap       \ replace first space by tab
      r> - dup r> - r> r> rot cmove rot
    else 2drop                         \ move string or drop tab
    then dup negate                    \ next tab position
  +loop drop                           \ drop tab size
;
[THEN]
