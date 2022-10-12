\ 4tH time encoding - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Encode or decode a time period mask (week based)
\ bit 0-6: weekdays, Sunday-Saturday
\ bit 7-30: hours, 0-23

include lib/constant.4th               \ for NULL
include lib/bits.4th                   \ for SET
include lib/istype.4th                 \ for IS-DIGIT
include lib/tokenize.4th               \ for SPLIT>
include lib/getopts.4th                \ for GET-OPTIONS

0 value encoding                       \ the encoding mask
                                       \ weekday table
create Weekdays                        \ 1st field: the mask
   1 , ," Sunday"    char S ,          \ 2nd field: the string
   2 , ," Monday"    char M ,          \ 3rd field: the daycode
   4 , ," Tuesday"   char T ,
   8 , ," Wednesday" char w ,
  16 , ," Thursday"  char t ,
  32 , ," Friday"    char f ,
  64 , ," Saturday"  char s ,
  NULL ,
                                       \ convert string to a valid hour
: s>hour number 0 max 24 min ;         ( a1 n1 -- n2)
: encoding+! encoding or to encoding ; ( n --)
                                       \ convert a daycode char to bitpattern
: weekday>bit                          ( c -- n f)
  Weekdays begin                       \ loop through the weekdays table
    dup @c NULL <>                     \ if not at the end of the table
  while
    over over 2 cells + @c <>          \ if the character doesn't match
  while
    3 cells +                          \ go to the next row
  repeat nip @c dup 0<                 \ return pattern and flag
;                                      \ true if not found
                                       \ convert a weekday string to pattern
: weekday>mask                         ( a1 n1 -- n2)
  0 >r begin                           \ set up mask
    dup                                \ if not a null string
  while                                \ extract character and look up
    over c@ weekday>bit if drop else r> or >r then chop
  repeat 2drop r>                      \ discard string, add pattern
;
                                       \ convert an hour range to a mask
: hours>mask                           ( a1 n1 -- n2)
  [: is-digit 0= ;] is is-type         \ split at first non-digit
  0 >r begin                           \ initialize mask
    dup 0>                             \ if still a string with valid length
  while                                \ split off first number and get delimiter
    split> s>hour 23 min >r over c@ [char] - =
    if chop split> s>hour r> r> -rot ?do i set loop else r> r> swap set then
    >r chop                            \ save mask, discard delimiter
  repeat 2drop r> 7 lshift
;
                                       \ decode the days
: .days                                ( n -- n)
  Weekdays 7 0 do                      \ loop through weekdays table
    over over @c and if dup cell+ @c count type space then 3 cells +
  loop drop                            \ is mask matches, print the string
;
                                       \ decode the hours
: .hours                               ( n -- n)
  dup 7 rshift 0                       \ get rid of the days, save pattern
  begin over while over 1 and if dup . then 1+ swap 2/ swap repeat
  drop drop                            \ check bit, display and shift
;                                      \ decode the mask
                                       ( --)
: decode encoding ." Weekdays: " .days cr ." Hours   : " .hours cr drop ;
: encode encoding ." Encoding: " . cr ;
: get-weekdays get-argument weekday>mask encoding+! ;
: get-hour-range get-argument hours>mask encoding+! ;
                                       \ show help
: get-help                             ( --)
  ." Usage: tpencode -w SMTwtfs -r range-range,hour -c number -e -d -h"
  cr abort
;
                                       \ get an existing encoding mask
: get-encoding
  get-argument number error? abort" Invalid encoding" to encoding
;                                      \ initialize the encoding
                                       \ available commandline options
create tpencode
  char d , ' decode ,                  \ show decoding
  char e , ' encode ,                  \ show encoding
  char w , ' get-weekdays ,            \ get weekdays valid
  char r , ' get-hour-range ,          \ get hours valid
  char c , ' get-encoding ,            \ enter an encoding
  char h , ' get-help ,                \ show help
  NULL ,
does> get-options ;

tpencode
