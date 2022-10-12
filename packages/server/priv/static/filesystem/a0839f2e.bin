\ Lunar Lander by Diomidis Spinellis, Chipmunk Basic version
\ I know it stinks as a game, but see it as a relic from old times.
\ Ingemar Ragnemalm, PhD
\ Image processing, Mac shareware games
\ E-mail address: ingemar@isy.liu.se or ingemar@lysator.liu.se
\ 4tH version Copyright 2006,2007 Hans Bezemer

include lib/ansfacil.4th
include lib/enter.4th

: ready                                ( --)
  ." Ready for detachment" cr
  ." -- COUNTDOWN --" cr
  0 10 do i . sync 500 ms -1 +loop cr
  ." You have left the spacecraft." cr
  ." Try to land with velocity less than 5 m/sec." cr cr
;

: meter                                ( g v h f -- g v h f)
  ." Meter readings" cr 
  ." --------------" cr
  dup ." Fuel (gal): " . cr over >r rot r>
  0= if ." Landing v" else ." V" then
  dup ." elocity (m/sec): " . cr rot
  dup ." Height (m): " . cr cr rot
;

: boost                                ( f -- f u)
  dup dup 0> if
    begin
      drop ." How much fuel will you use? " enter
      dup 0< dup if
        ." No cheating please! Fuel must be >= 0." cr
      else 
        drop over over < dup 
        if ." Sorry, you have not got that much fuel!" cr then
      then 0=
    until cr 
  then 
;

: calculate                            ( g v1 h1 f1 u -- g v2 h2 f2 flag)
  tuck - >r >r                         \ calculate new fuel      F = F - U
  over - r> swap >r >r                 \ calculate new height    H = H - V
  over + 10 * r> 2* - 10 /             \ calculate new velocity
  r> r> over 0> 0=                     \ return height and fuel
;                                      \ V = (((V + G) * 10) - (U * 2)) / 10

: report                               ( g v h f --)
  drop drop 4 >
  if ." You have crashed."
  else ." Congratulations! This was a very good landing."
  then drop cr cr
;

: lander
  begin
    ready
    2 70 1000 500                        \ G-force, velocity, height, fuel
    begin
      meter boost calculate
    until
    >r 0 max r> meter report
    ." Do you want to play again? (0 = no, 1 = yes) " enter
    0= dup abort" Have a nice day." cr
  until
;

lander
