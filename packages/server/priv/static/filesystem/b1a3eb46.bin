\ 4tH "24 Game" - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: https://en.wikipedia.org/wiki/24_Game

include lib/cards.4th                  \ for DEAL
include lib/shuffle.4th                \ for CSHUFFLE
include lib/stack.4th                  \ for STACK
include lib/row.4th                    \ for ROW
\ include lib/anstools.4th               \ for .S

4 array numbers                        \ selected numbers
8 array mystack                        \ user stack

  0 enum NOERR                         \ No errors
    enum EMPTY                         \ Stack empty
    enum ENTRY                         \ Invalid entry
    enum NOUSE                         \ Not all numbers are used
    enum FAILS                         \ Solution is invalid
constant NONUM                         \ Not a valid number
                                       \ show the result
create .error                          ( n -- n)
  ," System error"
  ," Correct!"
  ," Stack empty"
  ," Invalid entry"
  ," Unused numbers"
  ," Incorrect"
  ," Invalid number"
does> swap -1 max 1+ cells + @c count type cr cr ;
                                       \ check off number
: number?                              ( n -- n f)
  true numbers 4 bounds do over i @ = if (error) i ! 0= leave then loop
;
                                       \ check for valid solution
: solution?                            ( --)
  mystack adepth 1 = if mystack a> 24 = if exit then then FAILS throw
;                                      \ correct depth and '24'?

: runit mystack adepth 2 < if EMPTY throw else execute then ;
: do-divide [: mystack a> mystack a> swap / mystack >a ;] runit ;
: do-minus  [: mystack a> mystack a> swap - mystack >a ;] runit ;
: do-plus   [: mystack a> mystack a> + mystack >a ;] runit ;
: do-multi  [: mystack a> mystack a> * mystack >a ;] runit ;
: stackit number? if NONUM throw else mystack >a then ;
: usage false numbers 4 bounds do i @ (error) <> if 0= leave then loop ;
: entry? dup 1 <> if ENTRY throw else drop c@ then ;
: unused? usage if NOUSE throw then ;
: .numbers ." These are your numbers: " numbers 4 bounds do i ? loop cr ;
                                       \ interpret the character parsed
create interpret                       ( c --)
  char / , ' do-divide ,
  char - , ' do-minus  ,
  char + , ' do-plus ,
  char * , ' do-multi ,
  NULL ,
does>                                  \ if it's a command, execute it
  2 num-key row if cell+ @c execute drop else drop [char] 0 - stackit then
;                                      \ if it's a number, stack it
                                       \ select four numbers
: select                               ( --)
  numbers 4                            \ set up loop
  begin                                \ did we assign all numbers?
    dup                                \ if not, get a card and use it
  while                                \ if it's not a face card
    deal card 1- chars + c@ dup [char] B <
    if [char] 0 - 15 and >r over over 1- th r> swap ! 1- else drop then
  repeat drop drop                     \ discard loop parameters
;
                                       \ run the expression
: run                                  ( --)
  begin bl parse-word dup while entry? interpret repeat
  2drop unused? solution?              \ check all used and valid solution
;
                                       \ play the game
: 24game                               ( --)
  ." You get nine chances to calculate '24' using four given numbers" cr
  ." and the operators '-', '+', '*' and '/' using an RPN expression." cr cr

  new-deck deck /deck cshuffle         \ shuffle the deck

  9 0 do                               \ let's go for nine rounds
    mystack stack select .numbers      \ clear stack and get the numbers
    ." Enter your expression : " refill
    drop ['] run catch .error          \ evaluate expression and show result
  loop
;

24game
