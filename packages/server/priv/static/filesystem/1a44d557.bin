\ 4tH library - The natural exponent of an unsigned fixed point integer
\ Copyright 4tH version - 2021 J.L. Bezemer

\ https://www.quinapalus.com/efunc.html
\ "The C code examples here are given for any use with no warranty whatsoever"

\  int fxexp(int x) {
\  int t,y;

\  y=0x00010000;
\  t=x-0x58b91; if(t>=0) x=t,y<<=8;
\  t=x-0x2c5c8; if(t>=0) x=t,y<<=4;
\  t=x-0x162e4; if(t>=0) x=t,y<<=2;
\  t=x-0x0b172; if(t>=0) x=t,y<<=1;
\  t=x-0x067cd; if(t>=0) x=t,y+=y>>1;
\  t=x-0x03920; if(t>=0) x=t,y+=y>>2;
\  t=x-0x01e27; if(t>=0) x=t,y+=y>>3;
\  t=x-0x00f85; if(t>=0) x=t,y+=y>>4;
\  t=x-0x007e1; if(t>=0) x=t,y+=y>>5;
\  t=x-0x003f8; if(t>=0) x=t,y+=y>>6;
\  t=x-0x001fe; if(t>=0) x=t,y+=y>>7;
\  if(x&0x100)               y+=y>>8;
\  if(x&0x080)               y+=y>>9;
\  if(x&0x040)               y+=y>>10;
\  if(x&0x020)               y+=y>>11;
\  if(x&0x010)               y+=y>>12;
\  if(x&0x008)               y+=y>>13;
\  if(x&0x004)               y+=y>>14;
\  if(x&0x002)               y+=y>>15;
\  if(x&0x001)               y+=y>>16;
\  return y;
\  }

\ Returns the natural exponent of an unsigned fixed point integer

[UNDEFINED] fxexp [IF]
create (consts)
  26573 , 14624 , 7719 , 3973 , 2017 , 1016 , 510 ,
does> swap 1- cells + @c ;

65536 constant *fx                     \ scaling factor
/cell 4 - [IF] 2147483648 [ELSE] (error) [THEN] constant (fxhigh)
                                       \ unscaled maximum value: 11
: fxexp                                ( n*65536 -- exp[n]*65536)
  363409 *fx 8 4 0 do                  ( x t' y 8)
    >r >r over over - dup 0<
    if drop else rot drop swap r> r@ lshift >r then 2/ r> r> 2/
  loop drop nip                        ( x y)

  8 1 do
    over i (consts) - dup 0< if drop else rot drop swap dup i rshift + then
  loop 256 swap                        ( x 256 y)

  17 8 ?do >r over over and if r> dup i rshift + >r then 2/ r> loop nip nip
;                                      ( y)

\ int fxlog(unsigned int x) {
\ int t,y;

\  y=0xa65af;
\  if(x<0x00008000) x<<=16,              y-=0xb1721;
\  if(x<0x00800000) x<<= 8,              y-=0x58b91;
\  if(x<0x08000000) x<<= 4,              y-=0x2c5c8;
\  if(x<0x20000000) x<<= 2,              y-=0x162e4;
\  if(x<0x40000000) x<<= 1,              y-=0x0b172;
\  t=x+(x>>1); if((t&0x80000000)==0) x=t,y-=0x067cd;
\  t=x+(x>>2); if((t&0x80000000)==0) x=t,y-=0x03920;
\  t=x+(x>>3); if((t&0x80000000)==0) x=t,y-=0x01e27;
\  t=x+(x>>4); if((t&0x80000000)==0) x=t,y-=0x00f85;
\  t=x+(x>>5); if((t&0x80000000)==0) x=t,y-=0x007e1;
\  t=x+(x>>6); if((t&0x80000000)==0) x=t,y-=0x003f8;
\  t=x+(x>>7); if((t&0x80000000)==0) x=t,y-=0x001fe;
\  x=0x80000000-x;
\  y-=x>>15;
\  return y;
\  }
                                       \ unscaled maximum value: 32768
: fxln                                 ( n*65536 -- ln[n]*65536)
  726818 681391 rot 32768 5 0 do       ( t' y x v)
    over over < if swap 1 4 i - lshift lshift swap 2>r over - 2r> then
    1 3 i - lshift lshift 2>r swap 2/ swap 2r>
  loop drop rot drop                   ( y x)

  8 1 do                               ( y x)
    dup dup i rshift + dup (fxhigh) and
    unless rot i (consts) - swap rot then drop
  loop negate (fxhigh) + 15 rshift -
;

[DEFINED] 4TH# [IF]
  hide (consts)
  hide (fxhigh)
[THEN]
[THEN]

