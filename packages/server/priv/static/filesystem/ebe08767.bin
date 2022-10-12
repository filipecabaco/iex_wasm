\ -- CHARSCAN -- Wil Baden  2002-03-17

\  **********************
\  *     Replacement    *
\  **********************

\ hunt contains? join

[UNDEFINED] hunt   [IF]
[UNDEFINED] search [IF] include lib/search.4th [THEN]
: HUNT                       ( str /str pat /pat -- str+I /str-i )
  search 0= if chars + 0 then ;
: CONTAINS?                  ( str_1 /str_1 str_2 /str_2 -- str_1 /str_1 flag )
  2>r 2dup 2r> search nip nip ;
: JOIN                       ( str_1 /str_1 str_2 /str_2 -- str_3 /str_3)
  >r >r 2dup chars +  r> swap r@ move  r> + ;
[THEN]
[THEN]