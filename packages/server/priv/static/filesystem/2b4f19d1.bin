\ Simple Math Program  4tH - (c) 1995,2013 Hans Bezemer

[needs lib/enter.4th]
[needs lib/random.4th]

: add + ;                              ( possible operators )
: sub - ;
: mul * ;

: getnum random 100 mod ;              ( put a number on the stack )

: check                                ( checks right answer )
  execute dup                          ( calculate right answer )
  enter =                              ( get user response )
  if ." That's right: " . 1 +
    else ." You're wrong, the right answer is " .
  then
  cr cr
;

: makecalc                             ( create a calculation )
  randomize                            ( initialize randomizer )
  getnum getnum                        ( get two numbers )
  over over swap                       ( put them on the stack )
  random 3 mod                         ( select operator )
    dup 0=  if drop . ." + " . ." = " ' add else
    dup 1 = if drop . ." - " . ." = " ' sub else
        2 = if      . ." x " . ." = " ' mul
            then then then
  check
;

: calculations
  4 0 do makecalc loop
;

0                                      ( init number of calculations )
calculations                           ( execute calculations )

." Total: " . ." right answers!" cr cr cr
