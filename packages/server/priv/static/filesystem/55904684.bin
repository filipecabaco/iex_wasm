( Hunt the Wumpus                            JCB 16:42 01/15/11)

include lib/range.4th
include lib/yesorno.4th
include lib/anscore.4th
include lib/choose.4th
include lib/key.4th
include lib/pickroll.4th

( 4tH conversion                             JLB 00:26 04/04/14)

create map  ( r -- addr )              \ address of room r
  1 , 4 , 7 , 0 , 2 , 9 , 1 , 3 , 11 , 2 , 4 , 13 , 0 , 3 , 5 ,
  4 , 6 , 14 , 5 , 7 , 16 , 0 , 6 , 8 , 7 , 9 , 17 , 1 , 8 , 10 ,
  9 , 11 , 18 , 2 , 10 , 12 , 11 , 13 , 19 , 3 , 12 , 14 , 5 , 13 , 15 ,
  14 , 16 , 19 , 6 , 15 , 17 , 8 , 16 , 18 , 10 , 17 , 19 , 12 , 15 , 18 ,
  19 , 19 , 19 ,                       \ impossible room for lost arrow
does> swap 3 * cells + ;

aka choose randrange
aka . room.                            \ print room number

variable you
variable wumpus
2 array pits                           \ these are 2VARIABLEs
2 array bats

: randroom  20 randrange ;
: @c+                                  ( addr -- n addr+cell )
    dup @c swap cell+ ;
: exits ( u -- u0 u1 u2 )              \ exits for room u
    map @c+ @c+ @c ;
: isexit ( e r -- f)                   \ is e an exit for room r
    map
    2dup @c = >r cell+
    2dup @c = >r cell+
    @c = r> or r> or
    ;
: nearyou ( r -- f )                   \ is room r next to player
    you @ isexit ;
: 2nearyou ( r0 r1 -- f )              \ is either room next to player
    >r nearyou r> nearyou or ;
: atyou ( r -- f )                     \ is player at room r
    you @ = ;
: 2atyou ( r0 r1 -- f )                \ is player at room
    >r atyou r> atyou or ;

: getroom                              \ input room number from console
    refill 0= parse bounds             \ kind of dirty but in TTY, it works
    0 >r
    begin
        2dup <>
    while
        dup c@ [char] 0 - r> 10 * + >r
        1+
    repeat
    2drop
    r>
;

: warn ( addr u f -- )                 \ if f, type line addr,u
    if cr type else 2drop then ;

variable gameover

: endgame ( addr u -- )
    cr type true gameover ! ;
: losegame ( addr u -- )
    endgame 
    cr ." HA HA HA - YOU LOSE!" cr ;
: wingame ( addr u -- )
    endgame
    cr ." HEE HEE HEE - THE WUMPUS'LL GETCHA NEXT TIME!!" ;

: wakewumpus ( -- )
    4 randrange dup 3 = if
        drop                           \ wumpus stays
    else
                                       \ wumpus moves
        cells wumpus @ map + @c wumpus !
    then
    wumpus @ atyou if
        s" TSK TSK TSK- WUMPUS GOT YOU!" losegame
    then
;

: moveplayer ( r -- c )                \ move player to room r, check for hazards
    you !
    wumpus @ atyou if
        cr ." OOPS! BUMPED A WUMPUS"
        wakewumpus
    then
    pits 2@ 2atyou if
        s" YYYIIIIEEEE . . . FELL IN PIT" losegame
    then
    bats 2@ 2atyou if
        cr ." ZAP--SUPER BAT SNATCH! ELSEWHEREVILLE FOR YOU!"
        randroom recurse
    then
;

: domove
    begin
        cr ." WHERE TO? " getroom
        dup nearyou 0=
    while
        cr ." -NOT POSSIBLE"
    repeat
    moveplayer
;

: doshoot
    begin
        cr ." NO. OF ROOMS (1-5)? "
        getroom
        dup 1 6 within
    until
    you @ swap                         \ arrow position on stack
    0 do
        cr ." ROOM #" i 0 .r ." ? "
        getroom 2dup isexit
        if nip else 2drop 20 then
        wumpus @ over = if
            s" AHA! YOU GOT THE WUMPUS!" wingame
        then
    loop
    gameover @ 0= if
        cr ." MISSED"
    then
    drop
;

: upper                                \ I would use this somewhere else
    dup 96 > if 32 - then ;

: gameloop
    cr
    s" I SMELL A WUMPUS!" wumpus @ nearyou warn
    s" I FEEL A DRAFT!" pits 2@ 2nearyou warn
    s" BATS NEARBY!" bats 2@ 2nearyou warn
    cr ." YOU ARE IN ROOM " you @ room.
    cr ." TUNNELS LEAD TO " you @ exits room. room. room.
    cr ." SHOOT OR MOVE (S-M)? "
    begin
        key upper dup [char] M = over [char] S = or
    until
    dup emit [char] M = if
        domove
    else
        doshoot wakewumpus
    then
;

: cheat
    cr ." you " you @ room.
    ." wumpus " wumpus @ room.
    ." bats " bats 2@ room. room.
    ." pits " pits 2@ room. room.
;

: setup
    20 0 do i loop
    50 0 do
        randroom roll
    loop
    you ! wumpus ! bats 2! pits 2!
    14 0 do drop loop
;

: instructions
cr ." WELCOME TO 'HUNT THE WUMPUS'"
cr ."   THE WUMPUS LIVES IN A CAVE OF 20 ROOMS. EACH ROOM"
cr ." HAS 3 TUNNELS LEADING TO OTHER ROOMS. (LOOK AT A"
cr ." DODECAHEDRON TO SEE HOW THIS WORKS-IF YOU DON'T KNOW"
cr ." WHAT A DODECAHEDRON IS, ASK SOMEONE)"
cr
cr ."      HAZARDS:"
cr ."  BOTTOMLESS PITS - TWO ROOMS HAVE BOTTOMLESS PITS IN THEM"
cr ."      IF YOU GO THERE, YOU FALL INTO THE PIT (& LOSE!)"
cr ."  SUPER BATS - TWO OTHER ROOMS HAVE SUPER BATS. IF YOU"
cr ."      GO THERE, A BAT GRABS YOU AND TAKES YOU TO SOME OTHER"
cr ."      ROOM AT RANDOM. (WHICH MIGHT BE TROUBLESOME)"
cr
cr ."      WUMPUS:"
cr ."  THE WUMPUS IS NOT BOTHERED BY THE HAZARDS (HE HAS SUCKER"
cr ."  FEET AND IS TOO BIG FOR A BAT TO LIFT).  USUALLY"
cr ."  HE IS ASLEEP. TWO THINGS WAKE HIM UP: YOUR ENTERING"
cr ."  HIS ROOM OR YOUR SHOOTING AN ARROW."
cr ."      IF THE WUMPUS WAKES, HE MOVES (P=.75) ONE ROOM"
cr ."  OR STAYS STILL (P=.25). AFTER THAT, IF HE IS WHERE YOU"
cr ."  ARE, HE EATS YOU UP (& YOU LOSE!)"
cr
cr ."      YOU:"
cr ."  EACH TURN YOU MAY MOVE OR SHOOT A CROOKED ARROW"
cr ."    MOVING: YOU CAN GO ONE ROOM (THRU ONE TUNNEL)"
cr ."    ARROWS: YOU HAVE 5 ARROWS. YOU LOSE WHEN YOU RUN OUT."
cr ."    EACH ARROW CAN GO FROM 1 TO 5 ROOMS. YOU AIM BY TELLING"
cr ."    THE COMPUTER THE ROOM#S YOU WANT THE ARROW TO GO TO."
cr ."    IF THE ARROW CAN'T GO THAT WAY (IE NO TUNNEL) IT MOVES"
cr ."    AT RAMDOM TO THE NEXT ROOM."
cr ."      IF THE ARROW HITS THE WUMPUS, YOU WIN."
cr ."      IF THE ARROW HITS YOU, YOU LOSE."
cr
cr ."     WARNINGS:"
cr ."      WHEN YOU ARE ONE ROOM AWAY FROM WUMPUS OR HAZARD,"
cr ."     THE COMPUTER SAYS:"
cr ."  WUMPUS-  'I SMELL A WUMPUS'"
cr ."  BAT   -  'BATS NEARBY'"
cr ."  PIT   -  'I FEEL A DRAFT'"
cr
;

: game
    s" INSTRUCTIONS" yes/no? if
    instructions
    then
    begin
        setup
        0 gameover !
        begin
            gameloop 
            gameover @
        until
        s" PLAY AGAIN" yes/no? 0=
    until
;

game