\ PAPER generator from Starting Forth Chapter 12
\ 4tH version - Copyright 2003,2004 J.L. Bezemer
\ Based on a iForth version - Copyright Marcel Hendrix

78 CONSTANT RMARGIN         \ right margin
 3 CONSTANT #variants

include lib/print.4th
include lib/choose.4th

\ The data for the PAPER writer
\ More data can be added without changing "magic constants."

\ Add strings at will.

create intros   \ in-order sentence openers
   ," In this paper we will demonstrate that"
   ," On the one hand, studies have shown that"
   ," On the other hand, however, practical experience indicates that"
   ," In summary, then, we propose that"
   NULL ,
        
\ Add sets of 3 lines at will.

create filler   \ random skeleton phrase, use one of every set
   ," by using"             
   ," by applying available resources towards"      
   ," with structured deployment of"    

   ," coordinated with"         
   ," to offset"
   ," balanced by"
   
   ," it is possible for even the most" 
   ," it becomes not unfeasible for all but the least"  
   ," it is necessary for all"          
   
   ," to function as"           
   ," to generate a high level of"
   ," to avoid"
   NULL ,

\ Add strings at will.

create 1st-adjective    \ random adjective #1
  ," integrated"  ," total"           ," systematized" ," parallel"
  ," functional"  ," responsive"      ," optimal"      ," synchronized"
  ," compatible"  ," qualified"       ," partial"      ," stand-alone"
  ," random"      ," representative"  ," optional"     ," transient"
  NULL , 

\ Add strings at will.

create 2nd-adjective    \ random adjective #2
  ," management"        ," organization" ," monitored"    ," reciprocal"          
  ," digital"           ," logistical"   ," transitional" ," incremental"         
  ," third generation"  ," policy"       ," decision"     ," undocumented"        
  ," context-sensitive" ," fail-safe"    ," omni-range"   ," unilateral"          
  NULL ,

\ Add strings at will.

create noun         \ random noun 
  ," criteria"        ," flexibility" ," capability"   ," mobility"
  ," programming"     ," concepts"    ," time phasing" ," projections"
  ," hardware"        ," through-put" ," engineering"  ," out-flow"
  ," superstructures" ," interaction" ," congruence"   ," utilities"
  NULL ,

filler MANY #variants / VALUE #phrases 
intros MANY VALUE #intros   

: .STRING   TH @C COUNT PRINT ;
: DUH?      FILLER SWAP #variants * TH #variants CHOOSE .STRING ;
: BABBLE    DUP MANY CHOOSE .STRING ;
: PHRASE    DUH? 1st-adjective BABBLE 2nd-adjective BABBLE noun BABBLE ;
: INTRO     NL intros SWAP .STRING ; ( paragraph# -- )
: ENDS      [CHAR] . SHOW NL ;
: SENTENCE  #phrases 0 DO I PHRASE LOOP ENDS ;
: PAPER     #intros  0 DO I INTRO SENTENCE LOOP ; 

PAPER ( try it out )
