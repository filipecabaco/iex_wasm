\ (c) 1994,2009 Hans Bezemer; Guessing game 4tH

[needs lib/enter.4th]
[needs lib/random.4th]

: guesses                              ( n --)
  randomize                            \ initialize randomizer
  random 10 mod 1+ swap                \ random number
  ." Guess a number between 1 and 10" cr 
  begin                                \ repeat n times
    dup                                \ check number of guesses
  while                                \ when ok
    over enter                         \ get a number
    over over = abort" Guessed!"       \ abort when guessed
    ." Too " > if ." small" else ." big" then cr 1-
  repeat                               \ error if not guessed
  drop ." You didn't guess it, it was " . cr
;

3 guesses
