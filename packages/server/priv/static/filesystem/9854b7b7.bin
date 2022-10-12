\ xchar word test suite - UTF-8 only
include lib/xchar.4th
include lib/ttester.4th
include lib/compare.4th

[hex]

100 string (test-string)

T{ 0 xc-size => 1 }T
T{ 7f xc-size => 1 }T
T{ 80 xc-size => 2 }T
T{ 7ff xc-size => 2 }T
T{ 800 xc-size => 3 }T
T{ ffff xc-size => 3 }T
T{ 10000 xc-size => 4 }T
T{ 1fffff xc-size => 4 }T

  s" 恭喜发财!" (test-string) place
: test-string (test-string) count ;

T{ test-string drop xc@+ swap xc@+ swap xc@+ swap xc@+ swap xc@+ nip
  => 606D 559C 53D1 8D22 21 }T
T{ ffff pad 4 xc!+? => pad 3 + 1 true }T
T{ test-string drop xchar+ => test-string drop 3 + }T
T{ test-string drop xchar+ xchar- => test-string drop }T
T{ test-string +x/string => test-string 3 /string }T
T{ test-string x\string- x\string- => test-string 4 - }T
T{ test-string x-size => 3 }T
T{ test-string -trailing-garbage => test-string }T
T{ test-string 2 - -trailing-garbage => test-string 4 - }T
T{ 0 s>d <# s" Test" holds #> s" Test" compare => 0 }T
T{ 0 s>d <# 606D xhold #> s" 恭" compare => 0 }T

T{ 606D xc-width => 2 }T
T{ 41 xc-width => 1 }T
T{ 2060 xc-width => 0 }T
T{ test-string x-width => 9 }T
