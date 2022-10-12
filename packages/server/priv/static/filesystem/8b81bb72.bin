\ Forth Dimensions III/5, page 152 - M. Burton

include lib/yesorno.4th                \ for YES/NO?
include lib/shuffle.4th                \ for SHUFFLE
include lib/enter.4th                  \ for ENTER

variable moves                         \ Number of reverses so far
10 array a                             \ Reserve a ten cell array
                                       \ Game instructions
: instruct                             ( --)
  cr cr 18 spaces ." The game of REVERSE"
  cr cr s" Would you like instructions" yes/no?
  if ." The object of the game is to arrange a random list"
     cr ." of nine numbers into ascending numerical order in"
     cr ." as few moves as possible by reversing a subset of"
     cr ." the list. For example, given the random list," cr
     cr ."        5  2  4  8  7  3  9  1  6" cr
     cr ." reversing a subset of 4 would yield the list," cr
     cr ."        8  4  2  5  7  3  9  1  6" cr
     cr ." To quit the game, simply reverse 0." cr cr
  then
;
                                       \ Initialize array
: ainit 10 1 do i dup i cells a + ! loop ;
                                       \ Print array
: a.                                   ( --)
  ." The list is now..." cr cr 6 spaces
  10 1 do i cells a + @ 3 .r loop cr
;
                                       \ Get amount to reverse
: getin                                ( -- n)
  begin
    cr ." Reverse how many? " enter
    dup 0< over 9 > or dup if ." Only 0 through 9 is allowed." cr then
    0=
  until cr
;
                                       \ Reverse a subset of array
: areverse                             ( n --)
  dup 2/ 1+ 1
  do
    dup i - 1+
    dup cells a + @ swap i cells a + @
    swap cells a + ! i cells a + !
  loop drop
;
                                       \ Check for ascending sequence
: acheck 1 10 1 do i dup cells a + @ = and loop ;
                                       \ Play the game
: reversal                             ( --)
  instruct ainit
  begin
    a cell+ 9 shuffle 0 moves !
    begin a. getin dup if areverse 1 moves +! acheck else 1 then until
    a. cr ." You made " moves ? ."  reversals." cr
    cr s" Care to play again" yes/no? 0=
  until cr ." Thanks for playing REVERSE.." cr cr
;

reversal