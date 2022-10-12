\ 4tH library - Mini Blackjack - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/shuffle.4th
include lib/cards.4th
include lib/yesorno.4th

\ This is a showcase for the libraries above. No money is involved here,
\ splitting is not supported and an ace is always 11 points.

: score 13 mod dup if 1+ 10 min else 11 + then ;
: next-card deal dup card space type cr score + ;
: player ." Player: " cr 0 begin next-card s" Hit" yes/no? 0= until cr ;
: dealer ." Dealer: " cr 0 begin next-card dup 16 > until cr ;
: won? dup 21 > if drop ." is bust!" else ." has " 0 .r ." ." then cr ;
: shuffle-deck new-deck deck /deck cshuffle ;
: minijack shuffle-deck player dealer ." Dealer " won? ." Player " won? ;

minijack
