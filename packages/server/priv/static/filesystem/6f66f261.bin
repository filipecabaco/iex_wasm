\ 4tH library - CARDS - Copyright 2010,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] card [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
offset pips
  char A c, char 2 c, char 3 c, char 4 c, char 5 c,
  char 6 c, char 7 c, char 8 c, char 9 c, char T c,
  char J c, char Q c, char K c,

offset suits                           \ diamonds, hearts, clubs, spades
  char D c, char H c, char C c, char S c,

   52 constant /deck                   \ size of a deck
/deck constant #cards                  \ number of cards
/deck buffer:  deck                    \ deck of cards
      variable dealt                   \ cards dealt
    2 string   card                    \ buffer for card string
does> swap 13 /mod swap >r over swap suits over c! char+ r> pips swap c! 2 ;
                                       ( c -- a n)
: new-deck 52 0 do i deck i chars + c! loop 0 dealt ! ;
: cards-left 52 dealt @ - ;            ( -- n)

: deal                                 ( -- n)
  cards-left 0= E.LIBERR throw" Deck empty!"
  deck dealt @ chars + c@ 1 dealt +!
;

[DEFINED] 4TH# [IF]
  hide pips
  hide suits
  hide dealt
[THEN]
[THEN]

\ new-deck #cards 0 do deal card type space cards-left . loop cr depth .
