\ Test application HanSoft & Partners - Internal use only

20 spaces ." How compatible is 4th with FORTH?" cr
22 spaces ." (c) 1982 by Ing W. Hofacker" cr
25 spaces ." (c) 1981 by FORTH Inc." cr

cr                                     \ Starting Forth page 130
." 10 0 do i . loop  => 0 .. 9" cr
: t1 10 0 do i . loop cr cr ; t1

." -243 -250 do i . loop => -250 .. -244" cr
: t2 -243 -250 do i . loop cr cr ; t2

." 7 multiplications  => 7, 14 .. 70" cr
: multiplications 11 1 do dup i * . loop drop cr ;
7 multiplications cr
                                       \ Starting Forth page 133
." 50 0 do i . 5 +loop => 0, 5 .. 45" cr
: t3 50 0 do i . 5 +loop cr cr ; t3

." -10 0 do i . -1 +loop => 0 .. -10" cr
: t4 -10 0 do  i . -1 +loop cr cr ; t4
                                       \ Starting Forth page 134
." 32767 1 do i . i +loop => 1, 2, 4, 8 .. 16384" cr
: t5 32767 1 do i . i +loop cr cr ; t5
                                       \ Starting Forth page 135
." 100 10 do i . -1 +loop => 10" cr
: t6 100 10 do i . -1 +loop cr cr ; t6

." More than doubled in 12 years" cr  \ Starting Forth page 140

variable double

: r% 50 */ 1+ 2/ ;
: compound swap dup 2* double !
  21 1 do
         cr ." Year " i 2 .r space
         over over r% + dup ." balance " .
         dup double @ >
            if cr cr ." More than doubled in "  i . ." years" cr leave
            then
  loop
  drop drop ;

1000 6 compound cr
                                       \ Starting Forth page 43
." 5 ones and 2 quarters" cr
: quarters 4 /mod . ." ones and " . ." quarters " cr ;

22 quarters

: poem cr
  11 1 do
     i . ." little " i 3 mod 0=
     if ." indians " cr then
  loop ." indian boys."
  cr ;
                                       \ Starting Forth page 132
poem cr

variable 'aloha

: hello ." Hello " ;
: goodbye ." Goodbye " ;
: aloha 'aloha @ execute ;
: coming ' hello 'aloha ! ;
: going ' goodbye 'aloha ! ;

." Hello Goodbye" cr
coming aloha going aloha cr cr         \ Starting Forth page 219

: soup ." soup " ;
: dessert ." dessert " ;
: chicken ." chicken " ;
: rice ." rice " ;
: entree chicken exit rice ;
: dinner soup entree dessert ;

." soup chicken dessert" cr
dinner cr cr                           \ Starting Forth page 230
                                       \ Starting Forth page 201
create sizes 18 , 21 , 24 , 27 , 30 , 255 ,

: category 6 0 do dup sizes I + @c < if drop i leave then loop ;

create "label"
      ," Reject"
      ," Small"
      ," Medium"
      ," Large"
      ," Extra large"
      ," Error"

: index ( n -- addr )
  + @c ;
: label "label" index count type ;
: eggsize category label ;

." Medium" cr
23 eggsize cr

9 string board                         \ Starting Forth page 214

: clear board 9 0 fill ; clear
: sqr board + ;
: bar ." | " ;
: dashes cr 9 0 do ." -" loop cr ;
: .box sqr c@ dup 0= if 2 spaces else
       dup 1 = if ." X " else
                  ." O " then then drop ;
: display cr 9 0 do I if I 3 mod 0= if dashes else bar then then
          I .box loop cr ;
: play 1- 0 max 8 min sqr c! ;
: x! 1 swap play display ;
: o! 2 swap play display ;

4 x! 3 o! cr

: ggd                                  \ FORTH page 40 t/m 43
  begin
    swap over mod dup 0=
  until drop . ;

." (27 21 => 3) " 27 21 ggd cr
." (625 6250 => 625) " 625 6250 ggd cr

: fib 0 1
  begin
    dup >r rot dup r> >
    while -rot dup rot + dup .
  repeat
  drop drop drop ;

." (20 fib => 1 2 3 5 8 13 21) "  20 fib cr cr

variable lines

: test mod 0= ;
: pprint dup 5 .r lines @ dup 0= if cr drop 4 else 1- then lines ! ;
: ptest dup 2/ 2
  do dup i test
     if 0 leave then
  loop
  dup if pprint else drop then drop ;
: prime cr 4 lines ! do i ptest loop cr ;

." All prime numbers from 1 to 199" cr
200 1 prime cr
