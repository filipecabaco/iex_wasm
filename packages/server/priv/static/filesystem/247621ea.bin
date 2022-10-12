\ 4tH - Longest sequence of coin flips - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/gmskiss.4th                \ heavy duty randomizer
                                       \ randomize the sequence
randomize ." Doing one million coin flips.. Wait!" cr
                                       \ on stack max-overall, max-now, sideup
0 dup 1 1000000 0 ?do                  \ do one million flips
  kiss 1 and dup >r =                  \ do the flip, see if it's even
  if 1+ else max 1 then r>             \ if the same add one, otherwise reset
loop drop drop                         \ drop the current values
                                       \ report the longest sequence
." The longest sequence of any side up is " . cr
