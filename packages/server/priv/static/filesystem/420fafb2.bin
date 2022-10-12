\ 4tH - 12 days of Xmas - Copyright 2013,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

12 constant #verse                     \ number of verses

create verse                           ( n --)
  ," Twelve drummers drumming" ," twelfth"
  ," Eleven pipers piping"     ," eleventh"
  ," Ten lords a-leaping"      ," tenth"
  ," Nine ladies dancing"      ," ninth"
  ," Eight maids a-milking"    ," eighth"
  ," Seven swans a-swimming"   ," seventh"
  ," Six geese a-laying"       ," sixth"
  ," Five golden rings"        ," fifth"
  ," Four calling birds"       ," fourth"
  ," Three french hens"        ," third"
  ," Two turtle doves"         ," second"
  ," partridge in a pear tree" ," first"
does>                                  \ show the first line
  ." On the " over #verse swap - 2* 1+ cells over + @c count type
  ."  day of Christmas, my true love gave to me" cr
  over #verse swap - #verse 1- swap    \ work out the loop parameters
  ?do 2 spaces dup i 2* cells + @c count type cr loop
  ."   A" over 1- if ." nd a" then space
  #verse 1- 2* cells + @c count type cr cr drop
;                                      \ now figure out the last line
                                       \ recite the 12 verses
: days-of-xmas 1+ 1 ?do i verse loop ;

#verse days-of-xmas