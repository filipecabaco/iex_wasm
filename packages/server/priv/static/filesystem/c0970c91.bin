include lib/menu.4th                   \ ** Simple menu demonstration
                                       \ define a number of choices
: print_a_string ." Hello world" cr ;  \ stack diagrams must be neutral
: 23+45 23 45 + . cr ;                 \ unless you REALLY know what
: 67+89 67 89 + . cr ;                 \ you're doing
: Error . ;                            \ this one will trigger an error!
: ExitMenu depth . cr quit ;           \ this one quits the program
                                       \ >> define another menu
variable NextMenu                      \ define a menu variable
: >NextMenu NextMenu >Menu ;           \ this one switches to the menu
                                       \ define the Main Menu
create (MainMenu)                      \ menu table
  ," Main menu"                        \ menu title
  ," Print a string" ' print_a_string ,
  ," Show addition"  ' 23+45 ,         \ all menu choices
  ," Next menu"      ' >NextMenu ,     \ got to another menu
  ," Exit menu"      ' ExitMenu ,
  NULL ,                               \ terminate with a NULL

(MainMenu) MainMenu                    \ create the main menu

create (NextMenu)                      \ define another menu table
  ," Next menu"                        \ menu title
  ," Print a string" ' print_a_string ,
  ," Show addition"  ' 67+89 ,         \ all menu options
  ," Main menu"      ' >MainMenu ,     \ switch back to the Main Menu
  ," Error"          ' Error ,
  NULL ,                               \ terminate with a NULL 

(NextMenu) NextMenu AddMenu            \ create the menu by passing
                                       \ the table and the variable
RunMenu                                \ start the menu
