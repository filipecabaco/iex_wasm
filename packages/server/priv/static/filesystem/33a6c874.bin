\ HAMURABI: Game of Hamurabi - Version 1.01 - Corona Data Systems, Inc.
\ ORIGINAL HAMURABI IN IMSAI 4K BASIC; THIS VERSION REWRITTEN 12/11/77
\ 4tH version - Copyright 2006 J.L. Bezemer

include lib/choose.4th
include lib/enter.4th

 100 value population                  \ total population
   5 value immigrant                   \ total immigration
   0 value starved                     \ total starvation
2800 value stored                      \ number of bushels stored
 200 value lost                        \ number of bushels eaten by rats
   3 value harvest/acre                \ yield harvest per acre
3000 value harvest                     \ total harvest
1000 value acres                       \ number of acres owned
   0 value value/acre                  \ going price per acre
                                       ( --)
: .hamurabi   cr ." HAMURABI . . ." cr ;
: ask type enter abs dup ;             ( -- n n)
: cannot? acres > over dup 2/ stored > swap population 10 * > or or ;
                                       ( n -- n f)
: .error                               ( --)
  .hamurabi
  ." THINK AGAIN - YOU ONLY HAVE " population . ." PEOPLE, " acres . 
  ." ACRES, AND " stored . ." BUSHELS IN STOREHOUSES." cr
;
                                       \ buy land
: buy                                  ( --)
  begin
    s" BUY HOW MANY ACRES? " ask       \ how much do you want to buy
    if dup value/acre * stored over over > 
      if drop drop .error else swap - to stored acres + to acres 0 then
    then                               \ calculate storage and acres owned
  0= until                             \ until a valid entry has been made
;
                                       \ sell land
: sell                                 ( --)
  begin
    s" SELL HOW MANY ACRES? " ask      \ how much do you want to sell
    if dup acres = abort" YOU SOLD ALL YOUR LAND." dup acres <
      if acres over - to acres value/acre * stored + to stored 0
      else .error then                 \ calculate storage and acres owned
    then
  0= until                             \ until a valid entry has been made
;
                                       \ how much food do you give
: feed                                 ( --)
  begin                                \ how much food do you give
    s" HOW MANY BUSHELS SHALL WE DISTRIBUTE AS FOOD? " ask 
    stored >                           \ if more food than stored
    if .error                          \ then issue an error
    else                               \ otherwise
      0 to immigrant                   \ immigration is zero
      stored over - to stored          \ substract distribution from stored
      20 / population swap - dup to starved
      0< if starved negate 2/ to immigrant 0 to starved then 0
    then                               \ if nobody starved, more immigration
  0= until                             \ until a valid entry has been made
;
                                       \ plant the land
: plant                                ( --)
  begin                                \ how much do you want to plant
    s" HOW MANY ACRES SHALL WE PLANT? " ask
    cannot? if .error                  \ not enough resources then error
    else
      stored over 2/ - to stored       \ subtract the bushels consumed     
      6 choose 1+ dup to harvest/acre  \ decide on harvest per acres
      * dup dup to harvest             \ calculate the harvest, lost, stored
      stored + 8 choose * 100 / dup to lost
      stored swap - + dup to stored
      acres + 20 * population / 100 / 1+ 50 min dup to immigrant
      population + starved - to population 0
    then    
  0= until                             \ until a valid entry has been made
;
                                       \ is there gonna be a plague?
: plague?                              ( --)
  10 choose 0= if                      \ one chance in ten and
    population 2/ to population        \ halves the population
    ." THE PLAGUE KILLED HALF THE PEOPLE." cr
  then                                 \ when it happens
;
                                       \ show the population statistics
: .population                          ( --)
  ." I BEG TO REPORT THAT LAST YEAR " starved . 
  ." PEOPLE STARVED AND " immigrant .
  ." PEOPLE CAME TO THE CITY." cr plague?
  ." THE POPULATION IS NOW " population . cr
;
                                       \ show the economy statistics
: .economy                             ( --)
  ." WE HARVESTED " harvest . ." BUSHELS AT " harvest/acre .
  ." BUSHELS PER ACRE." cr
  ." RATS DESTROYED " lost . ." BUSHELS LEAVING " stored .
  ." BUSHELS IN THE STOREHOUSES." cr
  ." THE CITY OWNS " acres . ." ACRES OF LAND." cr
  7 choose 17 + dup to value/acre
  ." LAND IS WORTH " . ." BUSHELS PER ACRE." cr
;
                                       \ play the game
: hamurabi                             ( --)
  ." HAMURABI - WHERE YOU GOVERN THE ANCIENT KINGDOM OF SUMERIA." cr
  ." THE OBJECT IS TO FIGURE OUT HOW THE GAME WORKS!!" cr
  ." (IF YOU WANT TO QUIT, SELL ALL YOUR LAND.)" cr
  begin                                \ main loop
    .hamurabi .population .economy .hamurabi
    buy sell feed plant                \ show reports, get entries
  again                                \ and loop again
;

hamurabi