\ 4tH - "It follows" - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/memcell.4th                \ for ALLOCATE
include lib/choose.4th                 \ for CHOOSE
include lib/constant.4th               \ for NULL

\ This program simulates the events of the movie "It follows". These rules
\ are applied by the algorithm:
\ - Heterosexual sex only (otherwise it becomes too weird);
\ - You can get a partner in a slightly better league, but not overly;
\ - Women have more chance on casual sex than men (twice as much);
\ - If a victim further down the line dies, it resumes with the previous one;
\ - Whatever a previous victim does in the sex department doesn't matter;
\ - Prostitution is out of the question;
\ - The new victim (previous or next) has a head start.

\ IMDB: http://www.imdb.com/title/tt3235888/

0 constant female                      \ a woman
1 constant male                        \ a man
                                       \ head start of victim
 5 constant caught  does> dup choose + ;
30 constant badluck does> choose ;     \ odds of having sex on a day

struct                                 \ structure describing a victim
  field: before                        \ pointer to previous victim
  field: sex                           \ sex of the victim
  field: appeal                        \ sex appeal of the victim
  field: node                          \ level of sexually transmitted demon
end-struct /victim                     \ total size of victim structure

variable current                       \ current victim
variable distance                      \ distance to go before IT catches up
variable day                           \ current day
variable bodycount                     \ count the number of kills
                                       \ initialize the first victim
: first-victim                         ( --)
  /victim allocate abort" Memory full" \ abort if not enough memory
  >r caught r@ -> appeal !             \ she's better than average
  female r@ -> sex    !                \ she is a girl (give her a chance)
  NULL   r@ -> before !                \ the very first victim (It follows 2?)
  0      r@ -> node   !                \ set to current and start the clock
  r> current ! caught distance ! 0 bodycount !
;
                                       \ create a new victim
: new-victim                           ( --)
  /victim allocate abort" Memory full" \ abort if not enough memory
  >r current @                         \ get current victim
  dup -> appeal @ 2 + choose 10 min r@ -> appeal !
  dup -> sex    @ male xor r@ -> sex    !
  dup -> node   @ 1+       r@ -> node   !
  r@ -> before ! r> current ! caught distance !
;                                      \ set to current and start the clock
                                       \ a victim is caught
: victim-caught                        ( --)
  current @ dup -> before @ current !  \ set to previous victim
  free abort" Bad pointer"             \ discard victim, abort on error
  caught distance ! 1 bodycount +!     \ start the clock
;                                      \ and increase the body count
                                       \ can a new victim be seduced?
: seduction?                           ( a --)
  dup -> sex @ 0= 1+ over -> appeal @ *
  badluck >                            \ calculate total appeal and see if
  if                                   \ it is enough to have sex
    new-victim -> sex @ if ." He " else ." She " then
    ." has sex." cr                    \ if so, create a new victim
  else                                 \ if not, it is a boring day
    drop ." It is a day like any other." cr
  then
;
                                       \ let's see what happens today
: today                                ( --)
  1 day +! -1 distance +!              \ new day, demon gets closer
  ." This is day " day ? cr            \ state what day it is
  current @ distance @                 \ see if it catches the victim
  if                                   \ if not, show status victim
    ." It follows victim #" dup -> node ? ." with only "
    distance ? ." miles to go." cr
    ." A " dup -> sex @ if ." boy" else ." girl" then
    ."  who I'd give a " dup -> appeal ? ." for sex appeal." cr
    seduction?                         \ and let's see if he/she
  else                                 \ gets lucky today
    ." Today victim #" -> node ? ." was caught." cr
    victim-caught                      \ the demon caught up and the
  then cr                              \ victim is dead - next please
;
                                       \ start the curse and follow it
first-victim begin today current @ NULL = day @ 365 = or until
." In the meanwhile " bodycount ?  ." people were killed." cr
                                       \ for a year or until it is broken