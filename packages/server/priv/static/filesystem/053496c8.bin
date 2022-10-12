\ 4th version by J.L. Bezemer, 2014

include lib/kpre.4th

s" 0,9"   s" ^0,?9$" match-reg .  cr
s" 0:9"   s" ^0,?9$" match-reg .  cr
s" 09"    s" ^0,?9$" match-reg .  cr
s" 009"   s" ^0,?9$" match-reg .  cr
s" 0,,9"  s" ^0,?9$" match-reg .  cr cr

s" abcdefg"          s" abcdefg$"  match-reg .  cr
s" ababababab"       s" ab*a$"     match-reg .  cr
s" aaaaaaaaba"       s" a*ba$"     match-reg .  cr
s" aaaaaabac"        s" ab*a$"     match-reg .  cr
s" abbd"             s" ab*d$"     match-reg .  cr
s" abbde"            s" ab*d$"     match-reg .  cr cr

s" -1234.56"       s" -?%9+\.?%9*$"   match-reg . cr
s" -1234"          s" -?%9+\.?%9*$"   match-reg . cr
s" 1234.56"        s" -?%9+\.?%9*$"   match-reg . cr
s" 1234"           s" -?%9+\.?%9*$"   match-reg . cr
s" 1234.ab"        s" -?%9+\.?%9*$"   match-reg . cr
s" 1234,23"        s" ^-?%9+\.?%9*$"  match-reg . cr
s" PRExyz23"       s" ^PRE.*23$"      match-reg . cr
s" -.23"           s" ^-?%9+\.?%9*$"  match-reg . cr depth .
