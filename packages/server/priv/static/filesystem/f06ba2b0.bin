\ 4tH "I Knew an Old Lady Who Swallowed a Fly" - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Present a program which emits the lyrics to the song
\ "I Knew an Old Lady Who Swallowed a Fly", taking advantage
\ of the repetitive structure of the song's lyrics. This song
\ has multiple versions with slightly different lyrics.

0 enum ONCE enum EVERY constant DIE    \ enumerate the possible behavior

create animals                         \ create a table with the lyrics
  ," horse"  die ,   ," She's dead, of course!"
  ," donkey" once ,  ," It was rather wonky. To swallow a donkey;"
  ," cow"    once ,  ," I don't know how. To swallow a cow;"
  ," goat"   once ,  ," She just opened her throat. To swallow a goat;"
  ," pig"    once ,  ," Her mouth was so big. To swallow a pig;"
  ," dog"    once ,  ," What a hog. To swallow a dog;"
  ," cat"    once ,  ," Fancy that. To swallow a cat;"
  ," bird"   once ,  ," Quite absurd. To swallow a bird;"
  ," spider" every , ," That wriggled and jiggled and tickled inside her;"
  ," fly"    every , ," But I don't know why she swallowed the fly, "
here animals - 3 / 1- constant #animals
                                       \ calculate the number of rows
:redo animals swap 3 cells * + ;       \ return address of the row
: show @c count type ;                 \ show a field in the table
                                       \ recite why it was swallowed
: why?                                 ( n --)
  #animals swap ?do                    \ the fly never ate anything ;-)
    ." She swallowed the " i animals show ."  to catch the "
    i 1+ animals dup show ." ," cr cell+ dup @c EVERY =
    if cell+ show cr else drop then    \ show who ate what and why
  loop ." Perhaps she'll die." cr cr   \ same problem every time..
;
                                       \ recite the entire song
: recite                               ( --)
  -1 #animals do                       \ let's start with the fly
    ." I know an old lady who swallowed a " i animals dup show
    ." ." cr cell+ dup cell+ show cr @c DIE <> if i why? then
  -1 +loop                             \ the horse is fatal
;

recite
