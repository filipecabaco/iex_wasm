\ 4tH library - Menu system - Copyright 2011,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] RunMenu [IF]
[UNDEFINED] NULL    [IF] include lib/constant.4th  [THEN]
[UNDEFINED] enter   [IF] include lib/enter.4th [THEN]

variable CurrentMenu                   \ address of current menu
variable RootMenu                      \ address of main menu (root menu)
                                       ( table var --)
aka ! AddMenu                          \ create a menu
                                       \ got to menu
: >Menu @ CurrentMenu ! ;              ( var --)
: >MainMenu RootMenu >Menu ;           ( --)
: MainMenu RootMenu AddMenu ;          ( table --)
                                       \ show a menu
: .Menu                                ( table -- n)
  ." ** " dup @c count type ."  **" cr cr cell+ >r 0
  begin                                \ print the menu titleSho
    r@ over 2* cells + @c dup NULL <>  \ as long as there are options
  while                                \ print the number and option title
    over 1+ 2 .r ." . " count type cr 1+
  repeat r> drop drop                  \ all options printed
  cr ." Choice: "                      \ now print the user prompt
;
                                       \ print the menu en process choice
: RunMenu                              ( --)
  >MainMenu                            \ goto the main menu
  begin
    stdout stdin use use               \ be sure we're using screen and
    begin                              \ keyboard
      CurrentMenu @ .Menu enter over over < over 0> 0= or
    while                              \ print menu and get the choice
      ." >> Wrong choice!" cr          \ check choice within range
    repeat nip                         \ drop the highest option
    2* cells CurrentMenu @ + @c catch if ." >> Oops!" cr then
  again                                \ get and execute the xt
;                                      \ from the menu table
[DEFINED] 4TH# [IF]
  hide CurrentMenu
  hide RootMenu
  hide .Menu
[THEN]
[THEN]
