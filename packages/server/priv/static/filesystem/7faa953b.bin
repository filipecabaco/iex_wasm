\ Dell simulator - Copyright 2014 J.L Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: http://www.rachellegardner.com/dont-be-the-smartest-person-in-the-room/
\      http://www.forbes.com/pictures/fljl45lkm/michael-dell-never-be-the-smartest-person-in-the-room/

include lib/choose.4th                 \ for CHOOSE
include lib/enter.4th                  \ for ENTER
\ include lib/anstools.4th

struct                                 \ define a person
  field: IQ                            \ has an IQ
  field: Room#                         \ and resides in a room
end-struct /Person

256 constant #Person                   \ to impose a proper limit

variable #Rooms                        \ number of user selected rooms
variable #Persons                      \ number of user selected persons
variable #Moves                        \ number of user selected iterations
                                       \ allocate the array of persons
#Person /Person * array Persons does> swap /Person * + ;
                                       \ find first person in room
: FindAttendee                         ( n -- a)
  >r 0 Persons                         \ start at the beginning
  begin
    dup #Persons @ Persons <           \ have we had all persons?
  while                                \ if not, is he attending?
    dup -> Room# @ r@ <>
  while
    /Person +                          \ try the next person
  repeat r>                            \ retrieve room number
;
                                       \ who is the smarted guy in the room?
: FindSmartestInRoom                   ( n -- a)
  FindAttendee >r dup /Person +        ( a1 a2 R: room)
  begin
    dup #Persons @ Persons <           \ have we had all persons?
  while                                \ if not, is he the smartest one so far
    dup -> Room# @ r@ =
    if over -> IQ @ over -> IQ @ < if nip dup then then
    /Person +                          \ try the next person
  repeat
  r> drop drop                         \ clean up the stack and return address
;                                      \ of the smartest person
                                       \ who is smarter than this?
: FindSmarter                          ( n -- a f)
  >r 0 Persons dup /Person +           ( a1 a2 R: IQ)
  begin
    dup #Persons @ Persons <           \ have we had all persons?
  while                                \ if not, is he the smartest one so far
    dup -> IQ @ r@ > if nip dup then
    /Person +                          \ try the next person
  repeat
  drop dup -> IQ @ r> >                \ return address and a flag if found
;
                                       \ count the number of persons in a room
: MeetingSize                          ( n1 -- n2)
  >r 0 dup Persons                     \ init count and start at beginning
  begin
    dup #Persons @ Persons <           \ have we had all persons?
  while                                \ if in correct room, increment count
    dup -> Room# @ r@ = if swap 1+ swap then
    /Person +                          \ try the next person
  repeat
  r> drop drop
;
                                       \ get another room, but this one
: FindAnotherRoom                      ( n1 -- n2)
  begin #Rooms @ choose over over = while drop repeat nip
;
                                       ( n --)
: PrintRoom 100 + <# # # [char] . hold #s #> type ;
                                       \ print a preformatted room#
: intro                                \ print the introduction
  ." Try never to be the smartest person in the room. And if you are," cr
  ." I suggest you invite smarter people.. or find a different room." cr
  cr
  ." One thing is clear: those who said it, weren't the smartest people" cr
  ." in any room. Because this is what happens.." cr
  cr
  ." You choose the number of persons, the number of rooms and the number" cr
  ." of iterations. Then watch what happens." cr cr
;
                                       \ enter parameters
: enter-limits
  ." No. of persons: " enter #Person min #Persons !
  ." No. of rooms  : " enter 2 max #Rooms !
  ." No. of moves  : " enter #Moves !
;
                                       \ randomly select IQ and rooms
: organize-meetings
  #Persons @ 0 ?do                     \ for all persons
    50 choose 100 + i Persons -> IQ !  \ get an IQ and a room
    #Rooms @ choose i Persons -> Room# !
  loop
;
                                       \ now apply these brain-dead rules
: move-it
  #Rooms @ 0 ?do                       \ for all rooms
    i MeetingSize dup 0>               \ get the number of people in the room
    if                                 \ and print that number
      ." In room# " i PrintRoom ."  are " . ." people." cr
      i FindSmartestInRoom 4 choose 0> ( a f)
      if                               \ are you the smartest in the room?
        ." The person with an IQ of " dup -> IQ ? ." goes to room# "
        i FindAnotherRoom dup PrintRoom swap -> Room# !
      else                             \ then either find another room
        -> IQ @ dup ." The smartest guy has an IQ of " . cr FindSmarter
        if                             \ or invite some smarter people
          i ." So a person from room# " over -> Room# @ PrintRoom
          ."  with an IQ of " over -> IQ ? ." is invited."
          swap -> Room# !
        else                           \ bad luck, you're the brainiac, man!
          drop ." A smarter person is invited, but no one is available."
        then
      then 
    else                               \ an empty meeting room was found
      drop ." Room# " i PrintRoom ."  is empty."
    then cr
  loop
;
                                       \ now put it all together
: stupid-remark                        ( --)
  intro                                \ show the background
  enter-limits                         \ enter the parameters
  organize-meetings                    \ throw some meetings
  cr #Moves @ 0 ?do ." Step# " i 1+ . cr cr move-it cr loop
;                                      \ let's see what happens

stupid-remark
