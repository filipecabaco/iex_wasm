\ C:\BCC55>bcc32 sprintf.c
\ Borland C++ 5.5.1 for Win32 Copyright (c) 1993, 2000 Borland
\ SPRINTF.C:
\ Turbo Incremental Link 5.00 Copyright (c) 1997, 2000 Borland

\ C:\BCC55>sprintf

\ -1.23457E-08            -0.00000
\ -1.23457E+00            -1.23457
\ -9.00000E-01            -0.90000
\ -4.00000E-01            -0.40000

\ -1.E-08         -0.
\ -1.E+00         -1.
\ -9.E-01         -1.
\ -4.E-01         -0.

\ C:\BCC55>

include lib/fp4.4th
include lib/fsprintf.4th
include lib/escape.4th

fclear

float array a s" -1.234567E-8" s>float latest f! does> f@ ;
float array b s" -1.234567E0"  s>float latest f! does> f@ ;
float array c s" -0.9e0"       s>float latest f! does> f@ ;
float array d s" -0.4e0"       s>float latest f! does> f@ ;

68 string buf

cr
a 5 a 5 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
b 5 b 5 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
c 5 c 5 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
d 5 d 5 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr

cr
a 0 a 0 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
b 0 b 0 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
c 0 c 0 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
d 0 d 0 s" %#.*e\t\t%#.*f" s>escape buf sprintf type cr
