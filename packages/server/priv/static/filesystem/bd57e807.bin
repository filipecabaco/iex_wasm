\ spock_iv.4th

\ "Spock IV"
\ Version B-01-2012061618
\ (http://programandala.net/en.program.spock_iv)

\ A multilingual implementation of
\ "Rock, paper, scissors, lizard, Spock"
\ in the 4tH programming language
\ (http://www.xs4all.nl/~thebeez/4tH).

\ Based on the Gforth version by the same author:
\ http://programandala.net/en.program.spock

\ Copyright (C) 2012 Marcos Cruz (programandala.net)

\ Spock IV is free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public
\ License as published by the Free Software Foundation; either
\ version 2 of the License, or (at your option) any later version.

\ Spock IV is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
\ General Public License for more details.

\ You should have received a copy of the GNU General Public License
\ along with this program; if not, see http://www.gnu.org/licenses .

\ **************************************************************
\ Development history


(

2012-04-08 First version [A-00] based on version A-04-201204080150 of
"Spock!". First changes to try to compile it with 4tH.

2012-04-09 More changes.

2012-04-10 Solved how to do the compile-time calcutation of
'max_versus'.  Last changes. First successful compilation.
British English removed.

2012-04-12 Solved how to arrange the explanations: two tables: one for
texts in all languages, other for the index. The 'versus' calculation
is simpler now.

2012-04-13 Improved format for the explanations index. Fixed: some '@'
changed to '@C'. Fixed 'next_language': the 4tH's 'true' is 1. First
working version [A-01].

2012-04-14 Simpler 'seconds', with 'ms'; simpler '.game_winner'.
'init_once' moved to 'main'.

2012-04-15 A bit simpler game loop.

2012-04-16 Pauses modified in 'about'.

2012-05-02 Code revision. First beta version [B-00]. Published.

2012-06-14 Bug found by Hans Bezemer: the human always win.
2012-06-15 New debugging words.

2012-06-16 Problems identified and solved:

  1- Two wrong elements in the '>explanations' table:
  'paper rock commands * + , scissors_wins_paper ,'
  'rock paper commands * + , scissors_wins_paper ,'

  2- The 'winner' table was empty! In the Gforth version the
  setup was done automatically while creating the data
  structures.

  Beside, an alternative method is created, with a smaller
  '>explanations' table and a different searching. Version B-01.

2021-06-01 Interfaced i18n library:

  1- Changed "languages" to "#languages"
  2- Mapped "language" to "i18n.lang", VARIABLE became a VALUE
  3- Mapped "i18n.msg" to "language_string"
  4- Initialized i18n at "init_once"

)

\ **************************************************************
\ Stack notation

(

a      = memory address
a u    = start and length of a memory region, usually a string
c      = character
f      = 0: false; other: true
ff     = 0: false; 1: true
max    = signed 32-bit number
min    = signed 32-bit number
n      = signed 32-bit number
u      = unsigned 32-bit number
x      = undefined element
..     = range
"name" = space delimited text in the input stream
"text" = text in the input stream

)

\ **************************************************************
\ Requirements and common words

include lib/choose.4th          \ choose random randomize
include lib/range.4th           \ between
include lib/termansi.4th        \ page
include lib/row.4th             \ row num-key
include lib/ansfacil.4th        \ ms
include lib/ansdbl.4th          \ d=
include lib/i18n.4th            \ i18n.languages

false  [if]
  include lib/comus.4th           \ on off
[else]
  : on  ( a -- )  true swap !  ;
  : off  ( a -- )  false swap !  ;
[then]

false  [if]
  include lib/toolbelt.4th        \ ++
[else]
  : ++  ( a -- )  1 swap +!  ;
[then]

: at  ( n a1 -- a2 )  swap th  ;
: s@  ( a1 -- a2 u2 )  @c count  ;

\ **************************************************************
\ Languages

create languages ," es" ," eo" ," en"
here languages - constant #languages
                        \ i18n conforming declaration
0   enum spanish
    enum esperanto
constant english

aka i18n.lang language  \ Current language.
aka i18n.msg  language_string  ( a1 -- a2 u2 )
  \ a1 = Address of a table of multilingual strings.
  \ a2 u2 = String in the current language.

: language+  ( a1 -- a2 )
  \ a1 = Address of a multilingual element in a table.
  \ a2 = Actual address of the element in the current language.
  language th
  ;

\ Menu option to change the current language:
create (not_in_language$)
," No en castellano."
," Ne en Esperanto."
," Not in English."
: not_in_language$  ( -- a u )  (not_in_language$) language_string  ;
: .not_in_language  not_in_language$ type  ;

char + constant language_key  \ Key that changes the current language.
: next_language  ( u1 -- u2 )  1+ dup #languages < *  ;
: language++  language next_language to language ;

\ **************************************************************
\ Pauses and keyboard

true  [if]
  \ 4tH doesn't provide a way to read one single key press
  \ because it's not part of the C C89/C99 standard.
  \ We provide a fake 'key' that needs the return key:
  13 constant carriage_return
  : key  ( -- c )
    pad 1 accept drop  pad c@
    dup 0= carriage_return * +  \ Default, instead of zero.
    ;
[else]
  \ This alternative could solve the problem in theory,
  \ but it doesn't work as expected
  \ because the obsolete 'expect' is defined with 'accept':
  include lib/obsolete.4th  \ expect
  : key  ( -- c )  pad 2 expect pad 1+ c@  ;
[then]
: wait  key drop  ;

true  [if]
  : seconds  ( u -- )  1000 * ms  ;
[else]  \ Old version, without 'ms':
  : seconds  ( u -- )  time  begin  2dup time swap - <  until  2drop  ;
[then]

: .prompt  cr cr ." > "  ;

create (press_key$)
," Pulsa Intro para continuar."  \ Spanish.
," Premu la enig-klavon por plui."  \ Esperanto.
," Press Return to continue."  \ English.
: press_key$  ( -- a u )  (press_key$) language_string  ;
: press_key  press_key$ cr type .prompt wait  ;

\ **************************************************************
\ About

s" Spock IV" sconstant title$
: .title  title$ type cr cr  ;

create (long_title$)
," ¡Piedra, papel, tijera, lagarto, Spock!"  \ Spanish.
," Ŝtono, papero, tondilo, lacerto, Spock!"  \ Esperanto.
," Rock, paper, scissors, lizard, Spock!"  \ English.
: long_title$  ( -- a u )  (long_title$) language_string  ;
: .long_title  long_title$ type cr cr  ;

: copyright
  ." Copyright (C) 2012 Marcos Cruz (programandala.net)" cr cr
  ;
: license
  ." Spock IV is free software; you can redistribute it and/or" cr
  ." modify it under the terms of the GNU General Public" cr
  ." License as published by the Free Software Foundation; either" cr
  ." version 2 of the License, or (at your option) any later version." cr
  ;
: about  copyright 1 seconds license 3 seconds  ;
: splash  page .title about press_key  ;

\ **************************************************************
\ Commands

0
enum lizard
enum paper
enum rock
enum scissors
enum spock
constant commands  \ Number of commands.

create command_names
," lagarto" ," lacerto" ," lizard"
," papel" ," papero" ," paper"
," piedra" ," ŝtono" ," rock"
," tijera" ," tondilo" ," scissors"
," Spock" ," Spock" ," Spock"
: command_name  ( u1 -- a2 u2 )
  \ u1 = Command number.
  \ a2 u2 = Command name.
  #languages * language + command_names at s@
  ;
: .command_name  ( u -- )  command_name type  ;

\ **************************************************************
\ Score

10 constant max_score
variable your_score
variable my_score

create (your_score$)
," Tu puntuación"
," Viaj poentoj"
," Your score"
: your_score$  ( -- a u )  (your_score$) language_string  ;

create (my_score$)
," Mi puntuación"
," Miaj poentoj"
," My score"
: my_score$  ( -- a u )  (my_score$) language_string  ;

: .score  ( a u -- )  type s" : " type  ;
: .your_score  your_score$ .score your_score ?  ;
: .my_score  my_score$ .score my_score ?  ;
: .scores  cr cr .your_score cr .my_score cr  ;
: max?  ( a -- ff )  @ max_score =  ;
: you_win_game?  ( -- ff )  your_score max?  ;
: i_win_game?  ( -- ff )  my_score max?  ;

\ **************************************************************
\ Command selection

variable your_command
variable my_command
: choices  ( -- u1 u2 )  my_command @  your_command @  ;
char 0 constant "0"
: digit  ( u -- c )  "0" +  ;
: option  ( c -- u )  "0" -  ;
: command_key?  ( c -- ff )  "0" commands 1- digit between  ;
: language_key?  ( c -- ff )  language_key = dup  if  language++  then  ;
: valid_key?  ( c -- ff )  dup language_key? swap command_key? or  ;
: your_key  ( -- c )  0  begin  drop key dup valid_key?  until  ;
variable accusative  \ Show the Esperanto commands in accusative?
: esperanto?  ( -- ff )  language esperanto =  ;
: accusative?  ( -- ff )  esperanto? accusative @ and  ;
: (.accusative)  ( u -- )  spock =  if  ." -on"  else  ." n"  then  ;
: .accusative  ( u -- )  accusative?  if  (.accusative)  else  drop  then  ;
: .choice  ( u -- )  dup .command_name .accusative [char] . emit  ;
: .command_option  ( u -- )  dup cr . ." = " .choice  ;
: .command_options  commands 0  do  i .command_option  loop  ;
: .language_option  cr cr language_key emit ."  = " .not_in_language  ;
: .options  cr accusative off .command_options .language_option  ;

create (choose$)
," Elige:"
," Elektu:"
," Choose:"
: choose$  ( -- a u )  (choose$) language_string  ;
: .choose  choose$ type  ;

: menu  page .long_title .choose .options .prompt  ;
: your_choice  ( -- u)
  0  begin  drop menu your_key
  dup command_key?  until  option
  ;
: my_choice  ( -- u )  commands choose ;

create (you_choosed$)
," Has sacado"
," Vi elektis"
," You chose"
: you_choosed$  ( -- a u )  (you_choosed$) language_string  ;
: .you_choosed  you_choosed$ type space  ;

create (i_choosed$)
," Yo he sacado"
," Mi elektis"
," I chose"
: i_choosed$  ( -- a u )  (i_choosed$) language_string  ;
: .i_choosed  i_choosed$ type space  ;

: .your_choice  .you_choosed your_command @ accusative on .choice  ;
: .my_choice  .i_choosed my_command @ .choice  ;
: .choices  .your_choice cr .my_choice  ;

\ **************************************************************
\ Versus

commands commands * array winners
winners commands commands * cells erase

: >winner  ( u1 u2 -- a )
  \ Point to an element of the 'winners' table.
  \ u1 = Computer's command.
  \ u2 = Human's command.
  commands * + winners +
  ;
: winner  ( u1 u2 -- )
  \ Mark a combination of commands as winner (the computer wins).
  \ u1 = Computer's command.
  \ u2 = Human's command.
  >winner true swap !
  ;
: winner?  ( u1 u2 -- ff )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  >winner @
  ;

\ Setup the 'winners' table
\ with the combinations the computer wins
\ (first, computer's command; second, human's command):
lizard paper winner
lizard spock winner
paper rock winner
paper spock winner
rock lizard winner
rock scissors winner
scissors lizard winner
scissors paper winner
spock rock winner
spock scissors winner

create (i_win$)
," Yo gano."
," Mi venkis."
," I win."
: i_win$  ( -- a u )  (i_win$) language_string  ;

create (you_win$)
," Tú ganas."
," Vi venkis."
," You win."
: you_win$  ( -- a u )  (you_win$) language_string  ;

: i_win_round  i_win$ type  my_score ++  ;
: you_win_round  you_win$ type  your_score ++  ;

\ Explanations' pointers:
0
enum noone_wins
enum rock_wins_scissors
enum paper_wins_rock
enum scissors_wins_paper
enum lizard_wins_spock
enum rock_wins_lizard
enum scissors_wins_lizard
enum lizard_wins_paper
enum spock_wins_rock
enum paper_wins_spock
enum spock_wins_scissors
drop

create explanations  \ Multilingual string elements,
\ in the same order the pointers were defined:
\ Pointed by 'noone_wins':
," Empate."
," Remiso."
," Tie."
\ Pointed by 'rock_wins_scissors':
," La piedra rompe la tijera."
," La ŝtono rompas la tondilon."
," The rock crushes the scissors."
\ Pointed by 'paper_wins_rock':
," El papel envuelve la piedra."
," La papero envolvas la ŝtonon."
," The paper covers the rock."
\ Pointed by 'scissors_wins_paper':
," La tijera corta el papel."
," La tondilo tondas la paperon."
," The scissors cut the paper."
\ Pointed by 'lizard_wins_spock':
," El lagarto envenena a Spock."
," La lacerto venenas Spock-on."
," The lizard poisons Spock."
\ Pointed by 'rock_wins_lizard':
," La piedra aplasta el lagarto."
," La ŝtono premplatigas la lacerton."
," The rock crushes the lizard."
\ Pointed by 'scissors_wins_lizard':
," La tijera decapita el lagarto."
," La tondilo senkapigas la lacerton."
," The scissors decapitate the lizard."
\ Pointed by 'lizard_wins_paper':
," El lagarto come el papel."
," La lacerto manĝas la paperon."
," The lizard eats the paper."
\ Pointed by 'spock_wins_rock':
," Spock vaporiza la piedra."
," Spock vaporigas la ŝtonon."
," Spock vaporizes the rock."
\ Pointed by 'paper_wins_spock':
," El papel desautoriza a Spock."
," La papero senrajtigas Spock-on."
," The paper disproves Spock."
\ Pointed by 'spock_wins_scissors':
," Spock rompe la tijera."
," Spock rompas la tondilon."
," Spock smashes the scissors."

true [if]  \ First method.

: versus  ( u1 u2 -- u3 )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  \ u3 = Identifier of the commands combination.
  commands * +
  ;

create >explanations
\ First field: identifier of a commands combination.
\ Second field: element in the 'explanations' table.
lizard lizard commands * + , noone_wins ,
lizard paper commands * + , lizard_wins_paper ,
lizard rock commands * + , rock_wins_lizard ,
lizard scissors commands * + , scissors_wins_lizard ,
lizard spock commands * + , lizard_wins_spock ,
paper lizard commands * + , lizard_wins_paper ,
paper paper commands * + , noone_wins ,
paper rock commands * + , paper_wins_rock ,
paper scissors commands * + , scissors_wins_paper ,
paper spock commands * + , paper_wins_spock ,
rock lizard commands * + , rock_wins_lizard ,
rock paper commands * + , paper_wins_rock ,
rock rock commands * + , noone_wins ,
rock scissors commands * + , rock_wins_scissors ,
rock spock commands * + , spock_wins_rock ,
scissors lizard commands * + , scissors_wins_lizard ,
scissors paper commands * + , scissors_wins_paper ,
scissors rock commands * + , rock_wins_scissors ,
scissors scissors commands * + , noone_wins ,
scissors spock commands * + , spock_wins_scissors ,
spock spock commands * + , noone_wins ,
spock lizard commands * + , lizard_wins_spock ,
spock paper commands * + , paper_wins_spock ,
spock rock commands * + , spock_wins_rock ,
spock scissors commands * + , spock_wins_scissors ,
null ,

: >explanation  ( u1 -- u2 )
  \ u1 = Identifier of a commands combination.
  \ u2 = Element in the 'explanations' table.
  >explanations 2 num-key row  drop nip cell+ @c
  ;
: explanation  ( u -- a1 u1 )
  \ u = Identifier of a commands combination.
  \ a1 u1 = Explanation in the current language.
  >explanation #languages * language + explanations at s@
  ;
: .explanation  ( u1 u2 -- )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  versus explanation type
  ;

[else]  \ Alternative method in version B-01.

create >explanations
\ First field: lower command
\ Second field: higher command
\ Third field: element in the 'explanations' table.
lizard , paper , lizard_wins_paper ,
lizard , rock , rock_wins_lizard ,
lizard , scissors , scissors_wins_lizard ,
lizard , spock , lizard_wins_spock ,
paper , rock , paper_wins_rock ,
paper , scissors , scissors_wins_paper ,
paper , spock , paper_wins_spock ,
rock , scissors , rock_wins_scissors ,
rock , spock , spock_wins_rock ,
scissors , spock , spock_wins_scissors ,

: (>explanation)  ( u1 u2 -- u3 )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  \ u3 = Element in the 'explanations' table.
  \ a1 = Address of a first field in the '>explanations' table.
  \ a1' = Address of a first field in the '>explanations' table.
  \ a2 = Address of a second field in the '>explanations' table.
  \ a3 = Address of a third field in the '>explanations' table.
  2dup max >r min >r
  >explanations
  begin  ( a1 )
    dup @c swap cell+ dup @c  ( u1 a2 u2 )
    swap cell+ cell+ rot rot  ( a1' u1 u2 )
    2r@ d=
  until  cell- ( a3 ) @c  r> r> 2drop
  ;

: >explanation  ( u1 u2 -- u3 )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  \ u3 = Element in the 'explanations' table.
  2dup = if  2drop noone_wins  else  (>explanation)  then
  ;
: explanation  ( u1 u2 -- a3 u3 )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  \ a3 u3 = Explanation in the current language.
  >explanation #languages * language + explanations at s@
  ;
: .explanation  ( u1 u2 -- )
  \ u1 = Computer's command.
  \ u2 = Human's command.
  explanation type
  ;

[then]

: i_win_round?  ( -- f )  choices winner?  ;
: (.round_winner)
  i_win_round?  if  i_win_round  else  you_win_round  then
  ;
: tie?  ( -- ff )  choices =  ;
: .round_winner  tie? 0=  if  (.round_winner)  then  ;
: .result  choices .explanation space .round_winner  ;
: .results  page .choices cr cr .result .scores press_key  ;

\ **************************************************************
\ The end

false  [if]  \ Old method.

  \ This method is not suitable for languages that change the verb form
  \ in the needed sentences. In order to make it easier to add new
  \ languages, a different method is used.

  create (you_$)
  ," Has "
  ," Vi "
  ," You "
  : you_$  ( -- a u )  (you_$) language_string  ;

  create (i_$)
  ," He "
  ," Mi"
  ," I "
  : i_$  ( -- a u )  (i_$) language_string  ;

  create (won_what$)
  ," ganado la partida."
  ," venkis la ludon."
  ," won the game."
  : won_what$  ( -- a u )  (won_what$) language_string  ;
  : .won_what  won_what$ type  ;

  : who$  ( -- a u )  you_win_game?  if  you_$  else  i_$  then  ;
  : .who  who$ type  ;
  : .game_winner  .who .won_what  ;

[else]  \ New method.

  create (i_won_game$)
  ," He ganado la partida."
  ," Mi venkis la ludon."
  ," I won the game."
  : i_won_game$  ( -- a u)  (i_won_game$) language_string  ;

  create (you_won_game$)
  ," Has ganado la partida."
  ," Vi venkis la ludon."
  ," You won the game."
  : you_won_game$  ( -- a u)  (you_won_game$) language_string  ;

  : game_winner$  ( -- a u )
    you_win_game?  if  you_won_game$  else  i_won_game$  then
    ;
  : .game_winner  game_winner$ type  ;

[then]

: game_over  page .game_winner .scores  ;
: game_over?  ( -- ff )  you_win_game? i_win_game? or  ;

create (press_space$)
," Pulsa solo Intro para jugar de nuevo; cualquier otra cosa para terminar."
," Premu nur la enig-klavon por reludi; ion alian por fini."
," Press just Return to play again; anything else to finish."
: press_space$  ( -- a u )  (press_space$) language_string  ;
: .press_space  cr press_space$ type  ;

create (good_bye$)
," ¡Adiós!"
," Adiaŭ!"
," Bye!"
: good_bye$  ( -- a u )  (good_bye$) language_string  ;
: .good_bye  good_bye$ type cr  ;

: enough?  ( -- ff )  .press_space .prompt key carriage_return <>  ;
: farewell  page .good_bye 2 seconds quit ;

\ **************************************************************
\ Init

: init_once
  randomize languages #languages i18n.languages
  s" LANGUAGE" environ@ i18n.select drop to language
;

: init_game  your_score off  my_score off  ;

\ **************************************************************
\ Game

: i_play  my_choice my_command !  ;
: you_play  your_choice your_command !  ;
: turn  i_play you_play .results  ;
: game  init_game  begin  turn game_over?  until  game_over  ;
: main  init_once splash  begin  game enough?  until  farewell  ;

main

\ **************************************************************
\ Debugging tools

false [if]

: (.)  ( n -- )  dup ." (" 0 .r ." )"  ;
: hr  cr ." -------------------------------" cr  ;
: .explanations
  \ Show the results of all command combinations,
  \ sorted by language and command.
  page
  #languages 0 do  i to language
    commands 0 do
      commands 0 do
        i dup .command_name (.)
        ."  vs "
        j dup .command_name (.) ."  = "
        i j .explanation wait
      loop
    loop  hr wait
  loop
  ;

: (.explanations2)  ( u1 u2 -- )
  \ Show the result of two commands, in every language.
  \ u1 = Computer's command.
  \ u2 = Human's command.
  #languages 0 do  i to language
    2dup 2dup .command_name ."  vs " .command_name ." : "
    .explanation cr
  loop  2drop
  ;
: .explanations2
  \ Show the results of all command combinations,
  \ sorted by command and language.
  page
  commands 0 do
    commands 0 do
      i j (.explanations2) wait
    loop
  loop
  ;

: .names
  page
  commands 0 do
    i .
    #languages 0 do  i to language
        j .command_name space
    loop  cr
  loop hr wait
  ;

.names cr
.explanations cr
.explanations2 cr

[then]
