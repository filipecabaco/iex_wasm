\ Standard ANS-94 test COMPARE

[PRAGMA] ANSCOMPARE
include lib/compare.4th
include lib/ttester.4th

: s1 s" abcdefghijklmnopqrstuvwxyz" ;
: s6 s" This is the end" ;

T{ s1        s1 COMPARE =>  0  }T 
T{ s1  PAD SWAP CMOVE   =>     }T    \ Copy s1 to PAD 
T{ s1  PAD OVER COMPARE =>  0  }T 
T{ s1     PAD 6 COMPARE =>  1  }T 
T{ PAD 10    s1 COMPARE => -1  }T 
T{ s1     PAD 0 COMPARE =>  1  }T 
T{ PAD  0    s1 COMPARE => -1  }T 
T{ s1        s6 COMPARE =>  1  }T 
T{ s6        s1 COMPARE => -1  }T

: "abdde" S" abdde" ; 
: "abbde" S" abbde" ; 
: "abcdf" S" abcdf" ; 
: "abcdee" S" abcdee" ;

T{ s1 "abdde"  COMPARE => -1 }T 
T{ s1 "abbde"  COMPARE =>  1 }T 
T{ s1 "abcdf"  COMPARE => -1 }T 
T{ s1 "abcdee" COMPARE =>  1 }T

: s11 S" 0abc" ; 
: s12 S" 0aBc" ;

T{ s11 s12 COMPARE =>  1 }T 
T{ s12 s11 COMPARE => -1 }T
