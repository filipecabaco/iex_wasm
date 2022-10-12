\ Copyright 2004,2020 - J.L. Bezemer
\ Converts textfiles to blockfiles

\ -- INPUT FORMAT --
\ o Save your file as plain text, ASCII7, CR and/or LF terminated
\ -- INPUT FORMAT --

\ -- OUTPUT FORMAT --
\ o Comments are stripped, except parenthesis
\ o Double spacing is eliminated
\ o Long lines are wrapped, starting at the last space
\ o Tabs are replaced by a space
\ o Graphics are replaced by a caret
\ -- OUTPUT FORMAT --

\ -- BUGS & LIMITATIONS --
\ o Keywords split over two lines are not recognized
\ -- BUGS & LIMITATIONS --

include lib/row.4th
include lib/ascii7.4th
include lib/back.4th
include lib/split.4th

64 constant c/l                        \ characters per line
16 constant l/scr                      \ lines per screen
12 constant l/blk                      \ maximum fill per screen

c/l l/blk * constant c/blk
c/l l/scr * constant c/scr

true value newline?                    \ has a newline been performed?
variable written                       \ number of characters written

: comment true false r> drop ;         \ skip the comment
: directive bl parse ;                 \ parse parameter of directive
: quote [char] " parse ;
: bar [char] | parse ;
: parenthesis [char] ) parse ;
                                       \ keywords to check
create keywords
  ," char"        ' directive ,
  ," [char]"      ' directive ,
  ," [defined]"   ' directive ,
  ," [undefined]" ' directive ,
  ," ("           ' parenthesis ,
  ," .("          ' parenthesis ,
  ," c|"          ' bar ,
  ," s|"          ' bar ,
  ," .|"          ' bar ,
  ," ,|"          ' bar ,
  ,| c"|          ' quote ,
  ,| s"|          ' quote ,
  ,| ."|          ' quote ,
  ,| ,"|          ' quote ,
  ,| abort"|      ' quote ,
  ,| throw"|      ' quote ,
  ," \"           ' comment ,
  ," #!"          ' comment ,
  ," @goto"       ' comment ,
  NULL ,
                                       \ return fill current block
: current-block written @ c/scr mod ;  ( -- n)
: padding dup spaces written +! ;      ( n --)
: ?nip if swap then drop ;             ( n1 n2 f -- n1 | n2)
                                       \ pad object if true
: ?padding                    ( n f f --)
  to newline?                          \ update newline? flag
  if padding else drop then            \ if true pad, else drop count
;
                                       \ pad current line
: pad-line                    ( n --)
  newline? over c/l =         ( n f f) \ we have to pad a line partially?
  tuck and 0= swap ?padding   ( --)    \ and no newline issued?
;
                                       \ fill current block to capacity
: pad-block                   ( --)
  current-block c/scr over - swap      \ we have to fill a block partially?
  true ?padding                        \ pad it and signal newline issued
;  
                                       \ is the block filled up to the limit?
: ?block                      ( --)
  current-block c/blk = if pad-block then
;
                                       \ find special keywords and act on them
: comment?                    ( a n -- f f)
  dup 0> if                            \ if there is something to scan
    keywords 2 string-key row          \ find any keywords
    if nip nip cell+ @c execute else drop then true
  else                                 \ execute them and continue scan
    false                              \ else stop scanning
  then                                 \ (return false)
  >r drop drop false r>                \ drop the word and restore flag
;
                                       \ crop a line at comment
: crop                        ( a1 n1 -- a1 n2)
  begin
    >in @ >r                           \ save current >IN
    bl parse-word comment?             \ search for comments
  while
    drop r> drop                       \ drop >IN and second flag
  repeat
  r> swap                              \ retrieve >IN and swap flag
  ?nip -trailing                       \ adjust length accordingly
;
                                       \ write a line
: write-line                  ( a n --)
  ?block                               \ end of block?
  dup >r type r@ written +!            \ write the string
  c/l r> over mod - pad-line           \ pad the string
;
                                       \ split line at next space
: split-line                  ( a1 n1 -- a2 n2 a3 n3)
  over c/l 1- bl back -split       \ find last space
  2swap -trailing                      \ swap the lines and check length
; 
                                       \ is this a long line?
: long-line?                  ( a1 n1 -- a1 n1 f | a2 n2 a3 n3 -f)
  dup c/l 1- > dup 0= >r           \ is it longer than c/l-1 chars
  if                                   \ if so split the line
    split-line dup 0=                  \ and check for long words
    if drop drop r> 0= >r then         \ if long word, drop string
  then r>                              \ and invert the flag
;
                                       \ CONVERT prerequisites
: Usage abort" Usage: txt2blk textfile blockfile" ;
: Read-file refill ;
: PreProcess 0 written ! ;
: PostProcess pad-block ;

: Process
  tib count s>ascii7 crop              \ clean buffer and update length
  begin
    long-line? >r                      \ is it a long line?
    write-line r>                      \ write the line
  until                                \ repeat till all the sublines are done
;

include lib/convert.4th  
