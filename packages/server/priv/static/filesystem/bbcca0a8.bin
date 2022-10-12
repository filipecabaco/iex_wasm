\ 4tH automated VM test - Copyright 2005,2019 J.L Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/anstools.4th
include lib/throw.4th

0 value expected
0 value catch-me
     -2 constant badXT
     -1 constant badADR
     -1 constant badDEV
      0 constant sysVAR
(error) constant badSTR
(error) constant badCEL
variable tests

\ words for testing
: clear depth 0 ?do drop loop ;
: regs ." RP: " rp@ . ." SP: " sp@ . ;
: clog to catch-me begin catch-me execute again ;
: header dup >r type cr r> 0 do [char] = emit loop ;
: => 1 tests +! cr header ;
: evaluate expected swap dup E.BADRDX = if decimal then 2dup = ;

: test
  to expected                          \ save expected return value
  >r .s r> cr                          \ show stack contents
  catch evaluate                       \ execute the word
  if ." OK, throws " . drop .s         \ everything OK
  else ." Throws " . ." should be " .  \ does not meet expectations
  then cr regs cr clear                \ clean up
;

\ variables for testing
variable test_var
file test_file
defer test_defer
create test_create 444 , ," 4tH"
16 string test_string
5 array test_array
5 value test_value
5 +constant pliteral
5 *constant mliteral
5 /constant dliteral
0 /constant dliteral0
offset bstring 1 c,

\ encapsulated 4tH primitives
: _drop drop ;
: _dup dup ;
: _dup_ ['] _dup clog ;
: _swap swap ;
: _rot rot ;
: _over over ;
: _over_ ['] _over clog ;
: _+ + ;
: _- - ;
: _* * ;
: _/ / ;
: _mod mod ;
: _/mod /mod ;
: _2* 2* ;
: _2/ 2/ ;
: _literal -1 ;
: _literal_ ['] _literal clog ;
: _pliteral pliteral ;
: _mliteral mliteral ;
: _dliteral dliteral ;
: _dliteral0 [FORCE] dliteral0 ;
: _branch0 if then ;
: _do do loop ;
: _call ;
: _call_ recurse 0 drop ;              \ prevent tail recursion!
: _exit exit ." Unreachable!" cr ;
: _exit_ badXT >r ;
: _variable test_var ;
: _variable_ ['] _variable clog ;
: _value test_value ;
: _value_ ['] _value clog ;
: _offset bstring ;
: _r@ r@ ;
: _r@_ ['] _r@ clog ;
: _r'@ r'@ ;
: _r'@_ ['] _r'@ clog ;
: _r"@ r"@ ;
: _r"@_ ['] _r"@ clog ;
: _! ! ;
: _+! +! ;
: _@ @ ;
: _?do ?do loop ;
: _+loop do i +loop ;
: _+loop_ do +loop ;
: _0= 0= ;
: _0<> 0<> ;
: _= = ;
: _<> <> ;
: _> > ;
: _< < ;
: _min min ;
: _max max ;
: _abs abs ;
: _negate negate ;
: _invert invert ;
: _or or ;
: _and and ;
: _xor xor ;
: _shift shift ;
: _0> 0> ;
: _0< 0< ;
: _spaces spaces ." |" cr ;
: _. . cr ;
: _.r .r cr ;
: _emit emit cr ;
: _radix octal . cr decimal ;
: _to to test_value ;
: _vector test_defer ;
: _execute execute ;
: _@c @c ;
: _@cn _@c . cr ;
: _@cs _@c dup count type cr ;
: _time time ;
: _time_ ['] _time clog ;
: _c@ c@ ;
: _c! c! ;
: _# <# # #> ;
: _#S <# #S #> ;
: _#> <# #S drop #> ;
: _#>_ ['] _#S clog ;
: _hold <# # # [char] . hold #S [char] $ hold #> 2dup type cr ;
: _hold_ <# hold #> ;
: _environ FIRST ;
: _environ_ ['] _environ clog ;
: _sp@ sp@ ;
: _sp@_ ['] _sp@ clog ;
: _rp@ rp@ ;
: _rp@_ ['] _rp@ clog ;
: _argn ARGN ;
: _argn_ ['] _argn clog ;
: _throw throw ;
: _catch catch ;
: _sign dup abs <# #s sign #> type cr ;
: _sign_ <# #s sign #> ;
: _type type cr ;
: _count count ;
: _count_ ['] _count clog ;
: _fill fill ;
: _number number ;
: _number_ 1 base ! _number ;
: _s" s" Hello world!" ;
: _s"_ ['] _s" clog ;
: _args args ;
: _args' 0= _args ;
: _args_ ['] _args' clog ;
: _use use ;
: _omit omit ;
: _parse parse 2dup type cr ;
: _parse' [char] ; parse drop ;
: _parse_ ['] _parse' clog ;
: _cmove cmove ;
: _smove smove ;
: _place place ;
: _-trailing -trailing 2dup type ." |" cr ;
: _open open dup to test_file ;
: _close close ;
: _refill refill ;
: _refill_ ['] _refill clog ;
: _accept accept ;
: _seek seek ;
: _tell tell ;
: _delete-file delete-file ;
: _environ@ environ@ ;

\ tests
0 tests !
s" 4tH VM automated testing, J.L. Bezemer 2005,2019" header cr

s" DROP" =>
1 ' _drop E.NOERRS test
  ' _drop E.SEMPTY test

s" DUP" =>
1 ' _dup  E.NOERRS test
  ' _dup  E.SEMPTY test
1 ' _dup_ E.SOVFLW test

s" SWAP" =>
1 2 ' _swap E.NOERRS test
  2 ' _swap E.SEMPTY test

s" ROT" =>
1 2 3 '
 _rot E.NOERRS test
  2 3 ' _rot E.SEMPTY test

s" OVER" =>
1 2 ' _over  E.NOERRS test
  2 ' _over  E.SEMPTY test
1 2 ' _over_ E.SOVFLW test

s" +" =>
4 2 ' _+ E.NOERRS test
  2 ' _+ E.SEMPTY test

s" -" =>
4 2 ' _- E.NOERRS test
  2 ' _- E.SEMPTY test

s" *" =>
4 2 ' _* E.NOERRS test
  2 ' _* E.SEMPTY test

s" /" =>
4 2 ' _/ E.NOERRS test
  2 ' _/ E.SEMPTY test
1 0 ' _/ E.DIVBY0 test

s" MOD" =>
4 2 ' _mod E.NOERRS test
  2 ' _mod E.SEMPTY test
1 0 ' _mod E.DIVBY0 test

s" /MOD" =>
4 3 ' _/mod E.NOERRS test
  3 ' _/mod E.SEMPTY test
2 0 ' _/mod E.DIVBY0 test

s" 2/" =>
6 ' _2/ E.NOERRS test
  ' _2/ E.SEMPTY test

s" LITERAL" =>
' _literal  E.NOERRS test
' _literal_ E.SOVFLW test

s" PLITERAL" =>
1 ' _pliteral E.NOERRS test
' _pliteral E.SEMPTY test

s" MLITERAL" =>
1 ' _mliteral E.NOERRS test
' _mliteral E.SEMPTY test

s" DLITERAL" =>
10 ' _dliteral E.NOERRS test
' _dliteral E.SEMPTY test
10 ' _dliteral0 E.DIVBY0 test

s" BRANCH0" =>
-1 ' _branch0 E.NOERRS test
   ' _branch0 E.SEMPTY test

s" DO/LOOP" =>
1 0 ' _do E.NOERRS test
  0 ' _do E.SEMPTY test

s" ?DO" =>
1 0 ' _?do E.NOERRS test
  0 ' _?do E.SEMPTY test

s" +LOOP" =>
1 0 ' _+loop  E.NOERRS test
1 0 ' _+loop_ E.SEMPTY test

s" CALL" =>
' _call  E.NOERRS test
' _call_ E.ROVFLW test

s" EXIT" =>
' _exit  E.NOERRS test
' _exit_ E.BADTOK test

s" VARIABLE" =>
' _variable  E.NOERRS test
' _variable_ E.SOVFLW test

s" VALUE" =>
' _value  E.NOERRS test
' _value_ E.SOVFLW test

s" R@" =>
' _r@  E.NOERRS test
' _r@_ E.SOVFLW test

s" R'@" =>
' _r'@  E.NOERRS test
' _r'@_ E.SOVFLW test

s| R"@| =>
' _r"@  E.NOERRS test
' _r"@_ E.SOVFLW test

s" !" =>
1 test_var ' _! E.NOERRS test
  1 badADR ' _! E.BADVAR test
  test_var ' _! E.SEMPTY test

s" +!" =>
1 test_var ' _+! E.NOERRS test
  1 badADR ' _+! E.BADVAR test
  test_var ' _+! E.SEMPTY test

s" @" =>
test_var ' _@ E.NOERRS test
  badADR ' _@ E.BADVAR test
         ' _@ E.SEMPTY test

s" 0=" =>
-1 ' _0= E.NOERRS test
   ' _0= E.SEMPTY test

s" 0<>" =>
-1 ' _0<> E.NOERRS test
   ' _0<> E.SEMPTY test

s" =" =>
4 2 ' _= E.NOERRS test
  2 ' _= E.SEMPTY test

s" <>" =>
4 2 ' _<> E.NOERRS test
  2 ' _<> E.SEMPTY test

s" >" =>
4 2 ' _> E.NOERRS test
  2 ' _> E.SEMPTY test

s" <" =>
4 2 ' _< E.NOERRS test
  2 ' _< E.SEMPTY test

s" MIN" =>
4 2 ' _min E.NOERRS test
  2 ' _min E.SEMPTY test

s" MAX" =>
 4 2 ' _max E.NOERRS test
   2 ' _max E.SEMPTY test

s" ABS" =>
-5 ' _abs E.NOERRS test
   ' _abs E.SEMPTY test

s" NEGATE" =>
5 ' _negate E.NOERRS test
  ' _negate E.SEMPTY test

s" INVERT" =>
5 ' _invert E.NOERRS test
  ' _invert E.SEMPTY test

s" OR" =>
 3 1 ' _or E.NOERRS test
   1 ' _or E.SEMPTY test

s" AND" =>
 3 1 ' _and E.NOERRS test
   1 ' _and E.SEMPTY test

s" XOR" =>
 3 1 ' _xor E.NOERRS test
   1 ' _xor E.SEMPTY test

s" SHIFT" =>
 3 1 ' _shift E.NOERRS test
   1 ' _shift E.SEMPTY test

s" 0>" =>
5 ' _0> E.NOERRS test
  ' _0> E.SEMPTY test

s" 0<" =>
 5 ' _0< E.NOERRS test
   ' _0< E.SEMPTY test

s" SPACES" =>
 5 ' _spaces E.NOERRS test
   ' _spaces E.SEMPTY test

s" ." =>
 5 ' _. E.NOERRS test
   ' _. E.SEMPTY test

s" .R" =>
 5 2 ' _.r E.NOERRS test
   2 ' _.r E.SEMPTY test

s" EMIT" =>
char & ' _emit E.NOERRS test
       ' _emit E.SEMPTY test

s" RADIX" =>
16 ' _radix E.NOERRS test

s" TO" =>
5 ' _to E.NOERRS test
  ' _to E.SEMPTY test

s" VECTOR" =>
:noname ; is test_defer
' _vector E.NOERRS test
:noname test_defer ; is test_defer
' _vector E.ROVFLW test
badXT is test_defer
' _vector E.BADTOK test

s" OFFSET" =>
     0 ' _offset E.NOERRS test
badSTR ' _offset E.BADSTR test
       ' _offset E.SEMPTY test

s" EXECUTE" =>
' _call ' _execute E.NOERRS test
        ' _execute E.SEMPTY test
  badXT ' _execute E.BADTOK test

s" @C" =>
test_create       ' _@cn E.NOERRS test
test_create cell+ ' _@cs E.NOERRS test
            badXT ' _@c  E.BADTOK test
                  ' _@c  E.SEMPTY test

s" TIME" =>
' _time  E.NOERRS test
' _time_ E.SOVFLW test

s" C!" =>
char & test_string ' _c! E.NOERRS test
         char & hi ' _c! E.NOERRS test
   char & hi char+ ' _c! E.BADADR test
     char & badADR ' _c! E.BADADR test
       test_string ' _c! E.SEMPTY test

s" C@" =>
test_string ' _c@ E.NOERRS test
         hi ' _c@ E.NOERRS test
   hi char+ ' _c@ E.BADADR test
     badADR ' _c@ E.BADADR test
            ' _c@ E.SEMPTY test

s" #" =>
5 ' _# E.NOERRS test
  ' _# E.SEMPTY test

s" #S" =>
5 ' _#S E.NOERRS test
  ' _#S E.SEMPTY test

s" #>" =>
5 ' _#>  E.SEMPTY test
5 ' _#>_ E.SOVFLW test

s" HOLD" =>
5 ' _hold  E.NOERRS test
5 ' _hold_ E.SEMPTY test

s" ENVIRON" =>
' _environ  E.NOERRS test
' _environ_ E.SOVFLW test

s" SP@" =>
' _sp@  E.NOERRS test
' _sp@_ E.SOVFLW test

s" RP@" =>
' _rp@  E.NOERRS test
' _rp@_ E.SOVFLW test

s" ARGN" =>
' _argn  E.NOERRS test
' _argn_ E.SOVFLW test

s" THROW" =>
E.USER ' _throw E.USER   test
       ' _throw E.SEMPTY test

s" CATCH" =>
' _call ' _catch E.NOERRS test
        ' _catch E.SEMPTY test
  badXT ' _catch E.BADTOK test

s" SIGN" =>
-5 ' _sign  E.NOERRS test
-5 ' _sign_ E.SEMPTY test

s" TYPE" =>
s" Hello" ' _type E.NOERRS test
        1 ' _type E.SEMPTY test
 badADR 1 ' _type E.BADADR test

s" COUNT" =>
test_string ' _count  E.NOERRS test
            ' _count  E.SEMPTY test
   hi char+ ' _count  E.BADADR test
     badADR ' _count  E.BADADR test
test_string ' _count_ E.SOVFLW test

s" FILL" =>
test_string 8 char & ' _fill E.NOERRS test
         hi 1 char & ' _fill E.NOERRS test
   hi char+ 1 char & ' _fill E.BADADR test
     badADR 8 char & ' _fill E.BADADR test
            8 char & ' _fill E.SEMPTY test

s" NUMBER" =>
s" 1960" ' _number  E.NOERRS test
s" Bye!" ' _number  E.NOERRS test
       4 ' _number  E.SEMPTY test
s" 1960" ' _number_ E.BADRDX test

s| S"| =>
' _s"  E.NOERRS test
' _s"_ E.SOVFLW test

s" ARGS" =>
   0 ' _args  E.NOERRS test
argn ' _args  E.BADSTR test
   1 ' _args_ E.SOVFLW test

s" OMIT" =>
s" ;;;;;;;4tH;;;" tib place
char ; ' _omit E.NOERRS test
       ' _omit E.SEMPTY test

s" PARSE" =>
char ; ' _parse  E.NOERRS test
       ' _parse  E.SEMPTY test
       ' _parse_ E.SOVFLW test

s" PLACE" =>
s" This is my 4tH" test_string ' _place E.NOERRS test
        s" This is my 4tH"     ' _place E.SEMPTY test
          badADR 4 test_string ' _place E.BADADR test
     s" This is my 4tH" badADR ' _place E.BADADR test

s" CMOVE" =>
   test_string count pad swap ' _cmove E.NOERRS test
            test_string count ' _cmove E.SEMPTY test
test_string count badADR swap ' _cmove E.BADADR test
     badADR test_string count ' _cmove E.BADADR test
    test_string count hi swap ' _cmove E.BADADR test
         hi test_string count ' _cmove E.BADADR test

s" SMOVE" =>
sysVAR test_array 5 ' _smove E.NOERRS test
       test_array 5 ' _smove E.SEMPTY test
test_array badCEL 5 ' _smove E.BADVAR test
badCEL test_array 5 ' _smove E.BADVAR test
test_array sysVAR 5 ' _smove E.BADVAR test
  test_array last 5 ' _smove E.BADVAR test
  last test_array 5 ' _smove E.BADVAR test

s" -TRAILING" =>
   s"         " ' _-trailing E.NOERRS test
   s" Hello!  " ' _-trailing E.NOERRS test
   s"  Hello! " ' _-trailing E.NOERRS test
              4 ' _-trailing E.SEMPTY test
       badADR 4 ' _-trailing E.BADADR test

s" USE" =>
stdout ' _use E.NOERRS test
       ' _use E.SEMPTY test
badDEV ' _use E.BADDEV test
     4 ' _use E.IOERR  test

s" OPEN" =>
      badADR 4 input ' _open E.BADADR test
       s" remove.me" ' _open E.SEMPTY test
s" remove.me" output ' _open E.NOERRS test

s" CLOSE" =>
test_file ' _close E.NOERRS test
          ' _close E.SEMPTY test
   badDEV ' _close E.BADDEV test

s" REFILL" =>
s" remove.me" input open dup use to test_file
' _refill  E.NOERRS test
' _refill_ E.SOVFLW test

s" SEEK" =>
5 test_file ' _seek E.NOERRS test
  test_file ' _seek E.SEMPTY test
5 stdin     ' _seek E.BADDEV test
5 4         ' _seek E.IOERR  test
5 badDEV    ' _seek E.BADDEV test

s" TELL" =>
test_file ' _tell E.NOERRS test
          ' _tell E.SEMPTY test
stdin     ' _tell E.BADDEV test
4         ' _tell E.IOERR  test
badDEV    ' _tell E.BADDEV test

s" ACCEPT" =>
test_string 16 ' _accept E.NOERRS test
            16 ' _accept E.SEMPTY test
test_file close

s" DELETE-FILE" =>
s" remove.me" ' _delete-file E.NOERRS test
              ' _delete-file E.SEMPTY test

s" ENVIRON@" =>
s" PATH" ' _environ@ E.NOERRS test
   0 dup ' _environ@ E.NOERRS test
         ' _environ@ E.SEMPTY test

cr tests @ . ." tokens tested" cr
