\ Taken from http://rosettacode.org
\ 4tH version 2011, 2021 Hans Bezemer

\ A program that calculates the hour, sun hour angle, dial hour line angle
\ from 6am to 6pm for an operator entered location.

\ As the example the user is prompted for a location and inputs the latitude
\ and longitude 4d57m S 150d30m W (4.95 S 150.5 W) of Jules Verne's Lincoln
\ Island, aka Ernest Legouve Reef). With a legal meridian of 150d W.

include lib/fp2.4th
include lib/fenter.4th
include lib/zenconst.4th
include lib/zenfsin.4th
include lib/zenfasin.4th

: >radians ( deg -- rad ) 180 s>f f/ pi f* ;
: >degrees ( rad -- deg ) pi f/ 180 s>f f* ;

: sundial
  ." Enter latitude      : "
  fenter >radians fsin
  ." Enter longitude     : "
  fenter
  ." Enter legal meridian: "
  fenter f-   ( sin[latitude] longitude )

  cr ." Hour : HourAngle , DialAngle" cr
  7 -6 do
    i . ." : "
    fover fover fnegate i 15 * s>f f+
    fdup f. ." , "
    >radians ftan f* fatan >degrees f. cr
  loop fdrop fdrop ;

sundial
