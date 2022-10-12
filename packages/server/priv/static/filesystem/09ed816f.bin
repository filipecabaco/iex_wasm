\ 4tH "Hook up" simulation - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/choose.4th
include lib/enter.4th
include lib/yesorno.4th
\ include lib/anstools.4th

\ This is a simulation of how men and women pair up, as seen on the Discovery
\ Channel documentary "Science of Sex Appeal". The persons themselves have
\ no idea of how attractive they are, but they will try to pair up with the
\ most attractive partner. In this simulation, the men take the initiative.
\ The women can accept or refuse the relationship, based on how attractive
\ their proposed partner is. 10 is a fox, 1 is a dog.

\ The males use a simple strategy: they go for the most attractive one, no
\ matter how attractive they are themselves. The females have a simple
\ strategy as well: they only accept a partner if he is one of most
\ attractive ones available.

\ A vital factor in this simulation is how "low you want to go". If the top
\ female is taken, are you prepared to take the second best. And if that
\ one is taken as well, do you go for the third best. That is the "clogging"
\ factor. If the "clogging" factor is low, a very good match is achieved. If
\ not, the match is less than perfect. Same for women, which is the
\ "acceptable" factor (which is negative - since positive factors do not
\ give a solution - you can't do better than having the best).

\ Once a pair has been made, they're out of the game. Again, this is a
\ simulation! In real life people are not that faithful, I guess ;-).

\ This simulation shows (surprisingly) that it is advantageous
\ for women to be a *little* bit pickier than men - but not too much.
\ Dropping their standards is not a good strategy for men, though.

 10 constant #pair                     \ the number of pairs
  3 value clog                         \ the "clogging" factor
 -2 value acceptable                   \ difference in attractiveness allowed
128 constant steady                    \ flag women in relationship
steady 1- constant hooked? does> and ; \ test women in relationship

aka 0= single?                         \ test if a person is single

#pair buffer: women does> swap chars + ;
#pair buffer: men   does> swap chars + ;
                                       \ find out who the hunk is
: hunk? 0 #pair 0 ?do i men c@ single? if i max then loop 1+ ;
: breakup #pair 0 ?do 0 dup i women c! i men c! loop ;
: #singles 0 #pair 0 ?do i men c@ single? if 1+ then loop clog min ;
                                       \ how many singles are available
: pick-woman                           ( n --)
  #pair 1- begin dup while dup women c@ while 1- repeat
  dup women c@ single? if over 1+ over women c! 1+ swap men c! else drop then
;
                                       \ show pairs
: .flirts                              ( --)
  ." Women" cr #pair 0 ?do i 1+ 2 .r i women c@ space 2 .r cr loop cr
  ." Men" cr #pair 0 ?do i 1+ 2 .r i men c@ space 2 .r cr loop cr cr
;
                                       \ are we going steady?
: steady?                              ( n1 n2 -- n3)
  #pair 0 ?do                          \ who is the current hunk
    i women c@ dup hooked?             \ is on top of stack
    if                                 \ if not hooked up or single
      over - acceptable >              \ if attractive male
      if                               \ then accept the offer
        steady i women dup c@ i 1+     \ and pair up
        over over ." Woman " . ." accepted man " . cr
        - abs >r c! swap r> + swap     \ keep track of the difference
      else                             \ otherwise
        0 i women over over c@ 1- men c! c!
      then                             \ both are single again
    else                               \ she's already taken
      drop                             \ or a wallflower
    then
  loop drop                            \ drop most attractive male
;
                                       \ let's chat them up
: flirt                                ( n --)
  begin                                \ how many are available for offers
    dup                                \ when there are still singles
  while
    #pair choose dup men c@ single?    \ let a single man choose 
    if pick-woman 1- else drop then    \ a hooked up man doesn't..
  repeat drop                          \ .. it's a simulation, remember?
;
                                       ( n1 -- n2)
: hookup begin hunk? #singles dup while flirt steady? repeat drop drop cr ;
                                       \ enter your own parameters
: picky                                ( --)
  ." Men choose   (1 = foxes only, 10 = dogs allowed): "
  enter 1 max 10 min to clog           \ enter what men accept
  ." Women choose (1 = hunks only, 10 = dogs allowed): "
  enter 1 max 10 min negate to acceptable
;                                      \ enter what women accept

: dating                               ( --)
  s" Are you picky" yes/no? if picky then
  ." Number of dates: " enter 0 over over cr
  ?do breakup hookup loop              \ like "50 first dates"
  10 * swap / ." Average difference: "
  <# # # [char] . hold #s #> type cr   \ show what the average difference was
;

dating