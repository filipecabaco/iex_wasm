\ Copyright Chris Jakeman, 1997

\ Design Note: (UD/MOD) achieves division by repeated doubling and occasional
\ addition.  Recursion is used to provide two matching loops used as follows.
\ The divisor ud2 is saved on the return stack and doubled in the first loop.
\ The remainder ud3 is given the initial value ud1 and the quotient u4 is
\ initially 0.
\ A second loop is now executed the same number of times as the first,
\ doubling u4 with each cycle and comparing ud3 with the appropriate ud2i
\ taken from the return stack.
\ For example, to divide 7 by 2 use:
\        7 0  2 0  (UD/MOD)
\ The stack values at points X and Y in the second loop will be:
\     X: u4 ud3  ud2                         Y: ud3  u4
\        0  7 0  8 0  TRUE  => no action =>     7 0  0
\        0  7 0  4 0  FALSE =>  action   =>     3 0  1
\        2  3 0  2 0  FALSE =>  action   =>     1 0  3

[UNDEFINED] d/mod  [IF]
[UNDEFINED] mu/mod [IF] include lib/mixed.4th [THEN]
                                       \ gives quotient u4 and remainder ud3.
: (ud/mod)                             ( ud1 ud2 -- ud3 u4 )
  2dup 2>r                             \ save value of ud2i in this cycle.
  2over 2over du<                      \ if ud2i is now > ud1 or
  over highbit and                     \ ud2i cannot double again ...
  or if                                \ cease recursion.
    2drop 0                            \ set ud3=ud1, u4=0 and let recursion
  else                                 \ unwind.
    2dup d+                            \ double ud2i
    recurse                            \ and repeat
    2*                                 \ as recursion unwinds,
  then                                 \ double u4 (initially u4=0).
  rot rot                              \ bury u4 under ud3.
  2r>                                  \ fetch ud2i for this cycle.
  2over 2over du<                      \ x
  if                                   \ if ud3 < ud2i ...
    2drop rot                          \ tidy up.
  else                                 \ else do the work ...
    dnegate d+                         \ ud3 = ud3 - ud2i
    rot 1+                             \ increment u4.
  then                                 \ y
;
                                       ( ud1 ud2 -- ud3 ud4)
: ud/mod dup if (ud/mod) u>d else d>u mu/mod 2>r u>d 2r> then ;

: d/mod                                ( d1 d2 -- d3 d4)
  >r over r> tuck signs? >r            \ signs different?
  2over d0< >r 2dup d0< r> and >r      \ signs both negative?
  2swap dabs 2swap dabs ud/mod         \ make unsigned and divide
  r> if 2>r dnegate 2r> then           \ apply sign to remainder if required
  r> if dnegate then                   \ apply sign to quotient if required
;

[DEFINED] 4TH# [IF]
  hide (ud/mod)
[THEN]
[THEN]

\ include lib/todbl.4th
\ include lib/dbldot.4th

\ s" -222222222225" s>double
\ s" -111111111111" s>double
\ d/mod d. d. cr depth .

