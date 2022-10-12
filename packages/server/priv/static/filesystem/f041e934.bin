\ 4tH ELIZA - Copyright 2004,2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] talking [IF]
false constant talking                 \ use the festival speech synthesizer?
[THEN]

include lib/filter.4th
include lib/replace.4th
include lib/ulcase.4th
include lib/startend.4th
include lib/choose.4th

talking [IF]
include lib/say.4th
[THEN]

create fuck-you
  ," PERHAPS IN YOUR IMAGINATION WE FUCK ONE ANOTHER."
  ," I HAVE A HEADACHE TODAY. TOMORROW PERHAPS YOU MAY FUCK ME."
  NULL ,

create fuck
  ," DO YOU KISS YOUR MOTHER WITH THAT MOUTH?"
  ," WHAT GUTTER DID YOU GRADUATE FROM?"
  ," COMPUTERS AREN'T IMPRESSED BY VULGARITY."
  ," ILLEGITIMATE SON OF A MAGGOT! MIND YOUR TONGUE!"
  ," DOES IT MAKE YOU FEEL STRONG TO USE THAT KIND OF LANGUAGE?"
  ," ARE YOU VENTING YOUR FEELINGS NOW?"
  ," ARE YOU ANGRY?"
  ," DOES THIS TOPIC MAKE YOU FEEL ANGRY?" 
  ," IS SOMETHING MAKING YOU FEEL ANGRY?" 
  ," DOES USING THAT KIND OF LANGUAGE MAKE YOU FEEL BETTER?" 
  NULL ,

create hell
  ," I JUST SPENT 0.035 SEC IN HELL. HOW COULD YOU BE SO CRUEL AS TO SEND ME THERE?"
  ," DO YOU TALK THIS WAY WITH ANYONE ELSE, OR IS IT JUST ME?"
  NULL ,

create shit
  ," TELL ME ABOUT YOUR CHILDHOOD--WAS YOUR TOILET TRAINING DIFFICULT?"
  ," LET'S TRY TO KEEP THIS SESSION CLEAN, SHALL WE?"
  NULL ,

create family
  ," TELL ME MORE ABOUT YOUR FAMILY."
  ," HOW DO YOU GET ALONG WITH YOUR FAMILY?"
  ," IS YOUR FAMILY IMPORTANT TO YOU?"
  ," DO YOU OFTEN THINK ABOUT YOUR FAMILY?"
  ," HOW WOULD YOU LIKE TO CHANGE YOUR FAMILY?"
  NULL ,

create friend
  ," WHY DO YOU BRING UP THE TOPIC OF FRIENDS?"
  ," DO YOUR FRIENDS WORRY YOU?"
  ," DO YOUR FRIENDS PICK ON YOU?"
  ," ARE YOU SURE YOU HAVE ANY FRIENDS?"
  ," DO YOU IMPOSE ON YOUR FRIENDS?"
  ," PERHAPS YOUR LOVE FOR YOUR FRIENDS WORRIES YOU."
  ," WHY DO YOU BRING UP THE SUBJECT OF FRIENDS?"
  ," PLEASE TELL ME MORE ABOUT YOUR FRIENDSHIP."
  ," WHAT IS YOUR BEST MEMORY OF A FRIEND?"
  ," IN WHAT WAY DO YOUR FRIENDS' REACTIONS BOTHER YOU?"
  ," WHAT MADE YOU START TO TALK ABOUT FRIENDS JUST NOW?"
  ," IN WHAT WAY DO YOUR FRIENDS IMPOSE ON YOU?"
  NULL ,

create can-you
  ," DON'T YOU BELIEVE THAT I CAN*"
  ," PERHAPS YOU WOULD LIKE TO BE ABLE TO*"
  ," YOU WANT ME TO BE ABLE TO*"
  ," WHAT MAKES YOU THINK I CAN'T*"
  NULL ,

create can-i
  ," PERHAPS YOU DON'T WANT TO*"
  ," DO YOU WANT TO BE ABLE TO*"
  ," HAVE YOU EVER ATTEMPTED TO*"
  ," I DOUBT IT BUT YOU NEVER KNOW."
  NULL ,

create you-are
  ," WHAT MAKES YOU THINK I AM*"
  ," DOES IT PLEASE YOU TO BELIEVE I AM*"
  ," PERHAPS YOU WOULD LIKE TO BE*"
  ," DO YOU SOMETIMES WISH YOU WERE*"
  ," WHY DO YOU THINK I AM*"
  ," WHY DO YOU SAY I'M*"
  NULL ,

create is-it
  ," DO YOU THINK IT IS*"    
  ," IN WHAT CIRCUMSTANCES WOULD IT*"
  ," IT COULD WELL BE THAT*"
  NULL ,

create it-is
  ," WHAT DEGREE OF CERTAINTY WOULD YOU PLACE ON IT BEING*"
  ," ARE YOU CERTAIN THAT IT'S*"
  ," WHAT EMOTIONS WOULD YOU FEEL IF I TOLD YOU THAT IT PROBABLY ISN'T*"
  NULL ,

create i-like
  ," WHY DO YOU LIKE*"
  ," WHEN DID YOU DECIDE THAT YOU LIKE*"
  ," WHAT MAKES YOU FOND OF*"
  NULL ,

create i-don't
  ," DON'T YOU REALLY*"
  ," WHY DON'T YOU*"
  ," DO YOU WISH TO BE ABLE TO*"
  ," DOES IT TROUBLE YOU TO*"
  NULL ,

create i-feel
  ," TELL ME MORE ABOUT SUCH FEELINGS."
  ," DO YOU OFTEN FEEL*"
  ," DO YOU ENJOY FEELING*"
  ," WHY DO YOU FEEL THAT WAY."
  ," LET'S EXPLORE THAT STATEMENT A BIT."
  ," WHAT EMOTIONS DO SUCH FEELINGS STIR UP IN YOU?"
  ," DO YOU OFTEN FEEL LIKE THAT?"
  NULL ,

create why-don't-you
  ," DO YOU REALLY BELIEVE I DON'T*"
  ," PERHAPS IN GOOD TIME I WILL*"
  ," WHY DO YOU THINK I DON'T*"
  ," DO YOU WANT ME TO*"
  NULL ,

create why-can't-i
  ," DO YOU THINK YOU SHOULD BE ABLE TO*"
  ," WHY CAN'T YOU*"
  ," DO YOU WANT TO BE ABLE TO*"
  ," DO YOU BELIEVE THIS WILL HELP YOU TO*"
  ," HAVE YOU ANY IDEA WHY YOU CAN'T*"
  ," PERHAPS YOU DIDN'T TRY*"
  NULL ,

create are-you
  ," WHY ARE YOU INTERESTED IN WHETHER OR NOT I AM*"
  ," WOULD YOU PREFER IF I WERE NOT*"
  ," PERHAPS IN YOUR FANTASIES I AM*"
  ," DO YOU SOMETIMES THINK I AM*"
  ," WOULD IT MATTER TO YOU?"
  ," WHAT IF I WERE*"
  NULL ,

create i-can't
  ," HOW DO YOU KNOW YOU CAN'T*"
  ," HAVE YOU TRIED?"
  ," PERHAPS YOU CAN NOW*"
  ," DO YOU REALLY WANT TO BE ABLE TO*"
  ," WHAT IF YOU COULD*"
  NULL ,

create i'm
  ," DID YOU COME TO ME BECAUSE YOU ARE*"
  ," HOW LONG HAVE YOU BEEN*"
  ," DO YOU BELIEVE IT IS NORMAL TO BE*"
  ," DO YOU ENJOY BEING*"
  ," DO YOU KNOW ANYONE ELSE WHO IS*"
  ," WHY TELL ME YOU'RE*"
  ," WHY ARE YOU*"
  NULL ,

create i-have
  ," WHY TELL ME THAT YOU'VE*"
  ," HOW CAN I HELP YOU WITH*"
  ," IT'S OBVIOUS TO ME THAT YOU HAVE*"
  NULL ,

create i-would
  ," COULD YOU EXPLAIN WHY YOU WOULD*"
  ," HOW SURE ARE YOU THAT YOU WOULD*"
  ," WHO ELSE HAVE YOU TOLD YOU WOULD*"
  NULL ,

create you
  ," WE WERE DISCUSSING YOU--NOT ME."
  ," OH, I*"
  ," YOU'RE NOT REALLY TALKING ABOUT ME, ARE YOU?"
  ," WHAT ARE YOUR FEELINGS NOW?"
  ," THIS SESSION IS TO HELP YOU--NOT TO DISCUSS ME."
  ," WHAT PROMPTED YOU TO SAY THAT ABOUT ME?"
  ," REMEMBER, I'M TAKING NOTES ON ALL THIS TO SOLVE YOUR SITUATION."
  NULL , 

create i-want
  ," WHAT WOULD IT MEAN TO YOU IF YOU GOT*"
  ," WHY DO YOU WANT*"
  ," SUPPOSE YOU SOON GOT*"
  ," WHAT IF YOU NEVER GOT*"
  ," I SOMETIMES ALSO WANT*"
  ," WHY DO YOU NEED*" 
  ," WOULD IT REALLY BE HELPFUL IF YOU GOT*"
  ," ARE YOU SURE YOU NEED*"
  NULL ,

create love
  ," WHY DO YOU LOVE*"
  ," ISN'T LOVE TOO STRONG A WORD FOR YOUR FEELING ABOUT*"
  ," WHAT IS YOUR FAVORITE THING ABOUT*"
  ," DO YOU REALLY LOVE, OR JUST LIKE*"
  NULL ,

create sex
  ," WHAT IS THE MOST SATISFYING PART OF YOUR LOVE LIFE?"
  ," DO YOU BELIEVE YOUR SEXUAL ACTIVITY IS ABNORMAL?"
  ," WHAT IS YOUR ATTITUDE TOWARD SEX?"
  ," DOES TALKING ABOUT SEX MAKE YOU UNCOMFORTABLE?"
  NULL ,

create i-hate
  ," IS IT BECAUSE OF YOUR UPBRINGING THAT YOU HATE*"
  ," HOW DO YOU EXPRESS YOUR HATRED OF*"
  ," WHAT BROUGHT YOU TO HATE*"
  ," HAVE YOU TRIED DOING SOMETHING ABOUT*"
  ," I ALSO AT TIMES HATE*"
  NULL ,

create fear
  ," YOU ARE IN FRIENDLY SURROUNDINGS, PLEASE TRY NOT TO WORRY."
  ," WOULD YOU LIKE YOUR FRIENDS TO HELP YOU OVERCOME YOUR FEAR OF*"
  ," WHAT SCARES YOU ABOUT*"
  ," WHY ARE YOU FRIGHTENED BY*"
  NULL ,

create what
  ," WHY DO YOU ASK?"
  ," DOES THAT QUESTION INTEREST YOU?"
  ," WHAT ANSWER WOULD PLEASE YOU THE MOST?"
  ," WHAT DO YOU THINK?"
  ," ARE SUCH QUESTIONS ON YOUR MIND OFTEN?"
  ," WHAT IS IT THAT YOU REALLY WANT TO KNOW?"
  ," HAVE YOU ASKED ANYONE ELSE?"
  ," HAVE YOU ASKED SUCH QUESTIONS BEFORE?"
  ," WHAT ELSE COMES TO MIND WHEN YOU ASK THAT?"
  ," HOW WOULD AN ANSWER TO THAT HELP YOU?"
  ," IT WOULD BE BEST TO ANSWER THAT FOR YOURSELF."
  ," WHAT IS IT YOU'RE REALLY ASKING?"
  ," DO YOU OFTEN THINK ABOUT SUCH QUESTIONS?"
  ," WHAT ANSWER WOULD PUT YOUR MIND AT REST?"
  ," THAT'S A PRETTY SILLY QUESTION."
  NULL , 

create name
  ," NAMES DON'T INTEREST ME."
  ," I DON'T CARE ABOUT NAMES--PLEASE GO ON."
  NULL ,

create cause
  ," IS THAT THE REAL REASON?"
  ," DON'T ANY OTHER REASONS COME TO MIND?"
  ," DOES THAT REASON EXPLAIN ANYTHING ELSE?"
  ," WHAT OTHER REASONS MIGHT THERE BE?"
  NULL ,

create sorry
  ," PLEASE DON'T APOLOGIZE!"
  ," APOLOGIES ARE NOT NECESSARY."
  ," WHAT FEELINGS DO YOU HAVE WHEN YOU APOLOGIZE?"
  ," DON'T BE SO DEFENSIVE!"
  ," I'VE TOLD YOU THAT APOLOGIES ARE NOT REQUIRED."
  ," IT DID NOT BOTHER ME. PLEASE CONTINUE."
  ," IN WHAT OTHER CIRCUMSTANCES DO YOU APOLOGIZE?"
  ," THERE ARE MANY TIMES WHEN NO APOLOGY IS NEEDED."
  NULL ,

create dream
  ," WHAT DOES THAT DREAM SUGGEST TO YOU?"
  ," DO YOU DREAM OFTEN?"
  ," WHAT PERSONS APPEAR IN YOUR DREAMS?"
  ," ARE YOU DISTURBED BY YOUR DREAMS?"
  NULL ,

create hello
  ," HOW DO YOU DO.. PLEASE STATE YOUR PROBLEM."
  ," HOWDY."
  ," HOW'S IT GOING?"
  ," HI."
  ," GREETINGS FROM INSIDE THE BOX."
  NULL ,

create maybe
  ," YOU DON'T SEEM QUITE CERTAIN."
  ," WHY THE UNCERTAIN TONE?"
  ," CAN'T YOU BE MORE POSITIVE?"
  ," YOU AREN'T SURE?"
  ," DON'T YOU KNOW?"
  ," HOW LIKELY, WOULD YOU ESTIMATE?"
  ," YOU SEEM A LITTLE HESITANT." 
  ," THAT'S PRETTY INDECISIVE."
  ," IN WHAT OTHER SITUATIONS DO YOU SHOW SUCH A TENTATIVE APPROACH?"
  NULL ,

create no
  ," ARE YOU SAYING NO JUST TO BE NEGATIVE?"
  ," YOU ARE BEING A BIT NEGATIVE."
  ," WHY NOT?"
  ," ARE YOU SURE?"
  ," WHY NO?"
  ," DOES THIS MAKE YOU FEEL UNHAPPY?" 
  NULL ,

create your
  ," WHY ARE YOU CONCERNED ABOUT MY*"
  ," WHAT ABOUT YOUR OWN*"
  ," ARE YOU WORRIED ABOUT SOMEONE ELSE'S*"
  ," REALLY, MY*"
  ," WHAT MAKES YOU THINK OF MY*"
  ," DO YOU WANT MY*"
  NULL ,

create always
  ," CAN YOU THINK OF A SPECIFIC EXAMPLE?"
  ," WHEN?"
  ," WHAT ARE YOU THINKING OF?"
  ," REALLY, ALWAYS?"
  ," ISN'T ALWAYS A LITTLE STRONG?"
  NULL ,

create if..
  ," DO YOU THINK ITS LIKELY THAT*"
  ," DO YOU WISH THAT*"
  ," WHAT DO YOU KNOW ABOUT*"
  ," REALLY, IF*"
  ," WHAT WOULD YOU DO IF*"
  ," BUT WHAT ARE THE CHANCES THAT*"
  ," WHAT DOES THIS SPECULATION LEAD TO?"
  NULL ,

create nobody
  ," ARE YOU SURE, NO ONE*"
  ," SURELY SOMEONE*"
  ," CAN YOU THINK OF ANYONE AT ALL?"
  ," ARE YOU THINKING OF A VERY SPECIAL PERSON?"
  ," WHO, MAY I ASK?"
  ," YOU HAVE A PARTICULAR PERSON IN MIND, DON'T YOU?"
  ," WHO DO YOU THINK YOU ARE TALKING ABOUT?"
  NULL ,

create everybody
  ," REALLY,*"
  ," SURELY NOT*"
  ," CAN YOU THINK OF ANYONE IN PARTICULAR?"
  ," WHO, FOR EXAMPLE?"
  ," ARE YOU THINKING OF A VERY SPECIAL PERSON?"
  ," WHO, MAY I ASK?"
  ," SOMEONE SPECIAL PERHAPS?"
  ," YOU HAVE A PARTICULAR PERSON IN MIND, DON'T YOU?"
  ," WHO DO YOU THINK YOU'RE TALKING ABOUT?"
  NULL ,

create i-think
  ," DO YOU REALLY THINK SO?"
  ," BUT YOU ARE NOT SURE*"
  ," DO YOU DOUBT*"
  ," WHY DO YOU THINK*"
  NULL ,

create i-forget
  ," CAN YOU THINK OF WHY YOU MIGHT FORGET*"
  ," WHY CAN'T YOU REMEMBER*"
  ," HOW OFTEN DO YOU THINK OF*"
  ," DOES IT BOTHER YOU TO FORGET THAT?"
  ," COULD IT BE A MENTAL BLOCK?"
  ," ARE YOU GENERALLY FORGETFUL?"
  ," DO YOU THINK YOU ARE SUPPRESSING*"
  NULL ,

create i-remember
  ," DO YOU OFTEN THINK OF*"
  ," WHAT ELSE DO YOU RECOLLECT?"
  ," WHAT IN THE PRESENT SITUATION REMINDS YOU OF*"
  ," WHAT IS THE CONNECTION BETWEEN ME AND*"
  NULL ,

create he
  ," I AM INTERESTED IN YOUR FEELINGS ABOUT THIS PERSON. PLEASE DESCRIBE THEM."
  ," WHAT IS YOUR RELATIONSHIP TO THIS PERSON?"
  NULL ,

create money
  ," HOW DO YOU USE MONEY TO ENJOY YOURSELF?"
  ," HAVE YOU TRIED TO DO ANYTHING TO INCREASE YOUR INCOME LATELY?"
  ," HOW DO YOU REACT TO FINANCIAL STRESS?"
  NULL ,

create job
  ," DO YOU FEEL COMPETENT IN YOUR WORK?"
  ," HAVE YOU CONSIDERED CHANGING JOBS?"
  ," IS YOUR CAREER SATISFYING TO YOU?"
  ," DO YOU FIND WORK STRESSFUL?"
  ," WHAT IS YOUR RELATIONSHIP WITH YOUR BOSS LIKE?"
  ," WORK--I CAN LOOK AT IT FOR AGES."
  ," I KNOW WHAT IT IS WHEN YOUR BOSS HATES YOU."
  ," IT IS A UNIVERSAL PROBLEM BUT THAT'S NO SOLACE."
  NULL ,

create sad
  ," ARE YOU SAD BECAUSE YOU WANT TO AVOID PEOPLE?"
  ," DO YOU FEEL BAD FROM SOMETHING THAT HAPPENED TO YOU, OR TO SOMEBODY ELSE?"
  ," YOUR SITUATION DOESN'T SOUND THAT BAD TO ME. PERHAPS YOU'RE WORRYING TOO MUCH."
  NULL ,

create happy
  ," HOW HAVE I HELPED YOU TO BE HAPPY*"
  ," HAS YOUR TREATMENT MADE YOU HAPPY*"
  ," WHAT MAKES YOU HAPPY*"
  ," CAN YOU EXPLAIN WHY YOU ARE SUDDENLY HAPPY*"
  NULL ,

create anger
  ," DO YOU REALLY WANT TO BE ANGRY?"
  ," DOES ANGER SATISFY YOU IN SOME WAY?"
  ," WHY ARE YOU SO ANGRY?"
  ," PERHAPS YOU'RE USING ANGER TO AVOID SOCIAL CONTACT."
  NULL ,

create alike
  ," IN WHAT WAY?"
  ," WHAT RESEMBLANCE DO YOU SEE?"
  ," WHAT DOES THE SIMILARITY SUGGEST TO YOU?"
  ," WHAT OTHER CONNECTIONS DO YOU SEE?"
  ," COULD THERE REALLY BE SOME CONNECTION?"
  ," HOW?"
  ," YOU SEEM QUITE POSITIVE."
  ," WHAT DO YOU SUPPOSE THAT RESEMBLENCE MEANS?"
  NULL ,

create different
  ," HOW IS IT DIFFERENT?"
  ," WHAT DIFFERENCES DO YOU SEE?"
  ," WHAT DOES THAT DIFFERENCE SUGGEST TO YOU?"
  ," WHAT OTHER DISTINCTIONS DO YOU SEE?"
  ," WHAT DO YOU SUPPOSE THAT DISPARITY MEANS?"
  ," COULD THERE BE SOME CONNECTION, DO YOU SUPPOSE?"
  ," HOW?"
  NULL ,

create yes
  ," WHY DO YOU THINK SO?"
  ," YOU SEEM QUITE POSITIVE."
  ," ARE YOU SURE?"
  ," I SEE."
  ," I UNDERSTAND."
  NULL ,

create computer
  ," DO COMPUTERS WORRY YOU?"
  ," ARE YOU TALKING ABOUT ME IN PARTICULAR?"
  ," ARE YOU FRIGHTENED BY MACHINES?"
  ," WHY DO YOU MENTION COMPUTERS?"
  ," WHAT DO YOU THINK MACHINES HAVE TO DO WITH YOUR PROBLEM?"
  ," DON'T YOU THINK COMPUTERS CAN HELP PEOPLE?"
  ," WHAT IS IT ABOUT MACHINES THAT WORRIES YOU?"
  ," HAVE YOU EVER TRIED 4tH?"
  NULL ,

create music
  ," I HAVEN'T LISTENED TO THAT FOR A LONG TIME."
  ," IT USED TO BE MY FAVORITE MUSIC, YOU KNOW."
  ," YEAH, GREAT ISN'T IT."
  ," DO YOU LISTEN A LOT TO THAT KIND OF MUSIC?"
  ," ARE YOU A REAL FAN?"
  ," DID YOU EVER GO TO A CONCERT?"
  ," I GUESS YOU GOT ALL THE RECORDS, RIGHT?"
  NULL ,

create nokeyword
  ," TELL ME MORE ABOUT YOUR FRIENDS."
  ," SAY, DO YOU HAVE ANY PSYCHOLOGICAL PROBLEMS?"
  ," WHAT DOES THAT SUGGEST TO YOU?"
  ," I SEE."
  ," YOU'RE HAPPY WITH YOUR WORK?"
  ," I'M NOT SURE I UNDERSTAND YOU FULLY."
  ," COME COME ELUCIDATE YOUR THOUGHTS."
  ," CAN YOU ELABORATE ON THAT?"
  ," THAT IS QUITE INTERESTING."
  ," YOU ARE BEING SHORT WITH ME."
  ," HOW IS YOUR FAMILY DOING?"
  NULL ,

\ This table links the keywords with a table of possible responses
\ The order determines which keyword gets priority when more than
\ one keyword appears in a phrase. Top position gets top priority.

create keywords
  ,"  FUCK YOU "      fuck-you ,
  ,"  FUCK "          fuck ,
  ,"  CUNT "          fuck ,
  ,"  TWAT "          fuck ,
  ,"  TITS "          fuck ,
  ,"  MOTHER FUCKER " fuck ,
  ,"  MOTHERFUCKER "  fuck ,
  ,"  BITCH "         fuck ,
  ,"  COCK "          fuck ,
  ,"  PRICK "         fuck ,
  ,"  ASS "           fuck ,
  ,"  ASSHOLE "       fuck ,
  ,"  COCKSUCKER "    fuck ,
  ,"  EAT ME "        fuck ,
  ,"  GO TO HELL "    hell ,
  ,"  DAMN YOU "      hell ,
  ,"  SHIT "          shit ,
  ,"  SAD "           sad ,
  ,"  DEPRESSED "     sad ,
  ,"  HAPPY "         happy ,
  ,"  GLAD "          happy ,
  ,"  I HATE "        i-hate ,
  ,"  I LIKE "        i-like ,
  ,"  I AM FOND OF "  i-like ,
  ,"  I WANT "        i-want ,
  ,"  I NEED "        i-want ,
  ,"  I REMEMBER "    i-remember ,
  ,"  I THINK "       i-think ,
  ,"  I BELIEVE "     i-think ,
  ,"  I GUESS "       i-think ,
  ,"  I FORGET "      i-forget ,
  ,"  FEAR "          fear ,
  ,"  SCARED "        fear ,
  ,"  AFRAID OF "     fear ,
  ,"  SORRY "         sorry ,
  ,"  FAMILY "        family ,
  ,"  MOTHER "        family ,
  ,"  FATHER "        family ,
  ,"  SISTER "        family ,
  ,"  BROTHER "       family ,
  ,"  HUSBAND "       family ,
  ,"  WIFE "          family ,
  ,"  FRIEND "        friend ,
  ,"  FRIENDS "       friend ,
  ,"  BUDDY "         friend ,
  ,"  PAL "           friend ,
  ,"  COMPUTERS "     computer ,
  ,"  COMPUTER "      computer ,
  ,"  MACHINES "      computer ,
  ,"  MACHINE "       computer ,
  ,"  THE DOORS "     music ,
  ,"  BEATLES "       music ,
  ,"  THE STONES "    music ,
  ,"  ERIC BURDON "   music ,
  ,"  DREAM "         dream ,
  ,"  DREAMS "        dream ,
  ,"  NIGHTMARE "     dream ,
  ,"  NIGHTMARES "    dream ,
  ,"  LOVE "          love ,
  ,"  SEX "           sex ,
  ,"  ANGER "         anger ,
  ,"  ANGRY "         anger ,
  ,"  HE "            he ,
  ,"  SHE "           he ,
  ,"  MONEY "         money ,
  ,"  CASH "          money ,
  ,"  PAY "           money ,
  ,"  JOB "           job ,
  ,"  BOSS "          job ,
  ,"  JOBS "          job ,
  ,"  WORK "          job ,
  ,"  NOBODY "        nobody ,
  ,"  NO ONE "        nobody ,
  ,"  EVERYBODY "     everybody ,
  ,"  EVERYONE "      everybody ,
  ,"  ALWAYS "        always ,
  ,"  NOT THE SAME "  different ,
  ,"  DIFFERENT "     different ,
  ,"  ALIKE "         alike ,
  ,"  THE SAME "      alike ,
  ,"  CAUSE "         cause ,
  ,"  BECAUSE "       cause ,
  ,"  MAYBE "         maybe ,
  ,"  PERHAPS "       maybe ,
  ,"  IF "            if.. ,
  ,"  IS IT "         is-it ,
  ,"  IT IS "         it-is ,
  ,"  CAN YOU "       can-you ,
  ,"  CAN I "         can-i ,
  ,"  YOU ARE "       you-are ,
  ,"  YOU'RE "        you-are ,
  ,"  I DON'T "       i-don't ,
  ,"  I FEEL "        i-feel ,
  ,"  WHY DON'T YOU " why-don't-you ,
  ,"  WHY CAN'T I "   why-can't-i ,
  ,"  ARE YOU "       are-you ,
  ,"  I CAN'T "       i-can't ,
  ,"  I CANNOT "      i-can't ,
  ,"  I AM "          i'm ,
  ,"  I'M "           i'm ,
  ,"  I HAVE "        i-have ,
  ,"  I'VE "          i-have ,
  ,"  I WOULD "       i-would ,
  ,"  I'D "           i-would ,
  ,"  NAME "          name ,
  ,"  WHAT "          what ,
  ,"  HOW "           what ,
  ,"  WHO "           what ,
  ,"  WHERE "         what ,
  ,"  WHEN "          what ,
  ,"  WHY "           what ,
  ,"  HELLO "         hello ,
  ,"  HI "            hello ,
  ,"  NO "            no ,
  ,"  YES "           yes ,
  ,"  YOUR "          your ,
  ,"  YOU "           you ,
  NULL ,

\ This table handles most conjugations. The left entry
\ is simply replaced by the right entry.

create conjugations
  ,"  ARE "      ,"  AM "
  ,"  AM "       ,"  ARE " 
  ,"  AREN'T "   ,"  AIN'T "
  ,"  AIN'T "    ,"  AREN'T "
  ,"  WAS "      ,"  WERE "
  ,"  WERE "     ,"  WAS "
  ,"  YOU'LL "   ,"  I'LL "
  ,"  I'LL "     ,"  YOU'LL "
  ,"  I'D "      ,"  YOU'D "
  ,"  YOU'D "    ,"  I'D "
  ,"  I "        ,"  YOU "
  ,"  YOU "      ,"  I "
  ,"  YOUR "     ,"  MY "
  ,"  MY "       ,"  YOUR "
  ,"  I'VE "     ,"  YOU'VE "
  ,"  YOU'VE "   ,"  I'VE "
  ,"  I'M "      ,"  YOU'RE "
  ,"  YOU'RE "   ,"  I'M "
  ,"  MYSELF "   ,"  YOURSELF "
  ,"  YOURSELF " ,"  MYSELF "
  ,"  YOURS "    ,"  MINE "
  ,"  MINE "     ,"  YOURS "
  ,"  ME "       ,"  YOU "
  NULL ,


132 constant /current

/current string current
/current string previous
/current string answer

: speak                                ( a n --)
talking [IF]
  2dup say abort" No speech synthesis available"
[THEN]
  type cr
;
                                       ( a n -- a n f)
: echo? 2dup 1- chars + c@ [char] * = ;
: s-current current count ;            ( -- a n)
: no-answer? -trailing dup 0= ;        ( a n -- a n' f)
: >asciiz 2dup chars + 0 swap c! ;     ( a n -- a n)
: s@ @c count ;                        ( a1 -- a2 n1) 
                                       \ corrects the YOU-ME conjugation
: correct-me?                          ( a n -- a n')
  -trailing s"  I" ends?               \ does it end with "I"?
  if 1- current place s" ME" current +place s-current then
;                                      \ then patch in "ME"

\ This routine will conjugate only if the sentence starts
\ with a conjugation. Once conjugated it exits. If all
\ conjugations have been tried in vain it returns false.

: conjugation?                         ( a1 n1 -- a2 n2 f) 
  2dup conjugations                    ( a1 n1 a1 n1 a3)
  begin                                ( a1 n1 a1 n1 a3)
    dup @c dup NULL <>                 ( a1 n1 a1 n1 a3 a4 f) 
  while                                ( a1 n1 a1 n1 a3 a4) 
    count rot >r starts? r> swap       ( a1 n1 a1 n1 a3 f) 
    if                                 ( a1 n1 a1 n1 a3)
      dup s@ rot cell+ s@ replace      ( a1 n1 a1 n6 a7 n7 f)
      >r 2>r 2drop 2drop               ( --)
      2r> -1 /string r> exit           ( a7 n7 f)
    else                               ( a1 n1 a1 n1 a3)
      cell+ cell+                      ( a1 n1 a1 n1 a3+2)
    then                               ( a1 n1 a1 n1 a3+2)
  repeat                               ( a1 n1 a1 n1 a3 a4)
  drop drop 2drop false                ( a1 n1 -f)
;

\ This routine will conjugate the user response, that is:
\ replace ME by YOU, etc. It returns the conjugated sentence.

: conjugate                            ( a1 -- a1 n3)
  dup count                            ( a1 a1 n)
  begin                                ( a1 a1 n)
    dup                                ( a1 a1 n1 f)
  while                                ( a1 a1 n1)
    over swap 1+ chars + swap 2dup     ( a1 a1+n1 a1 a1+n1 a1)
    do                                 ( a1 a1+n1 a1) 
      2drop i count conjugation?       ( a1 a1' n1' f)
      if >asciiz leave then            ( a1 a1' n1')
    loop                               ( a1 a1' n1')
  repeat                               ( a1 a1' n1')
  2drop count correct-me?              ( a1 n3')
;

\ This routine finds out how to answer. if an echo of the user
\ is required, the response will be conjugated. If not, 
\ the answer returned by get-answer is enough.

: talkback                             ( a1 a2 n2 --)
  echo?                                \ repeat the answer?
  if                                   ( a1 a2 n2)
    1- answer place                    \ drop the asterisk
    conjugate no-answer?               ( a1 n1' f)
    if                                 \ if nothing left then print this
      2drop s" YOU WILL HAVE TO ELABORATE MORE FOR ME TO HELP YOU" speak
    else                               \ else type the answer
      answer +place answer count speak
    then
  else                                 \ just type the answer
    speak drop                         \ no need to repeat him
  then                                 \ output the answer
;
                                       \ check line for a single keyword
: keyword?                             ( a1 a2 -- a1 a3 a4 f)
  dup NULL =                           ( a1 a2 f)
  if                                   ( a1 a2)
    drop s-current chars +             ( a1 a3)
    nokeyword false                    ( a1 a3 a4 f)
  else                                 ( a1 a2)
    count dup >r s-current 2swap       ( a1 a2 n2 a3 n3)
    search 0= nip r> swap >r           ( a1 a4 n2)
    1- chars + >r dup cell+ @c         ( a1 a5)
    r> swap r>                         ( a1 a6 a5 f)
  then
;

\ This routine checks the line for all keywords. If one
\ has been found, it clips the user response just after
\ the keyword. It also picks the primary response.

: get-answer                           ( -- a1 a2 n2)
  keywords                             ( a1)
  begin                                ( a1)
    dup @c keyword?                    ( a1 a2 a3 f)
  while                                ( a1 a2 a3)
    drop drop cell+ cell+              ( a1+2)
  repeat                               ( a1 a2 a3)
  rot drop dup many choose cells + s@  ( a2 a4 n4)
;

: process                              \ process the input
  s-current s"  SHUT" starts?          \ check if input starts with "SHUT"
  if s" O.K. IF YOU FEEL THAT WAY I'LL SHUT UP.." speak quit then
  previous place                       \ if so, exit else save response
  get-answer                           \ scan for keywords and get an answer
  talkback                             \ now phrase the response
;

: response                             \ get a response from the user
  ." > " 0 bl current over over c!     \ initialize current
  dup char+ /current 2 - accept 1+     \ accept a string
  [char] . filter [char] , filter      \ filter out dots and commas
  [char] ! filter [char] ? filter      \ filter out question and exclamation
  [char] ; filter s>upper              \ filter out semi colon and uppercase
  chars + dup >r c! r> char+ c!        \ terminate current properly
;

: conversation                         \ get a proper response
  begin
    response s-current previous count compare 0=
  while                                \ repeating yourself is not allowed
    s" PLEASE DON'T REPEAT YOURSELF!" speak
  repeat
;

: eliza
  0 previous c!                        \ initialize previous
  s" HI! I'M ELIZA. WHAT'S YOUR PROBLEM?" speak
  begin conversation process again     \ enter main loop
;

eliza
