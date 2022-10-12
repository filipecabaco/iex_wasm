\ ==============================================================================

\          fwt_test - the test words for the fwt module in ffl

\             Copyright (C) 2010  Dick van Oudheusden

\ This library is free software; you can redistribute it and/or
\ modify it under the terms of the GNU General Public
\ License as published by the Free Software Foundation; either
\ version 2 of the License, or (at your option) any later version.

\ This library is distributed in the hope that it will be useful,
\ but WITHOUT ANY WARRANTY; without even the implied warranty of
\ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
\ General Public License for more details.

\ You should have received a copy of the GNU General Public
\ License along with this library; if not, write to the Free
\ Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

\ ==============================================================================

\  $Date: 2008-03-18 19:09:48 $ $Revision: 1.12 $

\ ==============================================================================

include lib/tst.4th
include lib/fwt.4th

.( Testing: fwt ) cr 

\ structure testing

struct
  #bytes/word +field    fwt1>1
end-struct  fwt1%

t{   fwt1%  2 ?s }t
t{ 0 fwt1>1 0 ?s }t

struct
  4 #bytes/word * +field fwt2>1
end-struct  fwt2%

t{   fwt2%  8 ?s }t
t{ 0 fwt2>1 0 ?s }t

struct
  #bytes/long +field    fwt3>1
end-struct  fwt3%

t{   fwt3%  4 ?s }t
t{ 0 fwt3>1 0 ?s }t

struct
  3 #bytes/long * +field fwt4>1
end-struct  fwt4%

t{   fwt4%  12 ?s }t
t{ 0 fwt4>1  0 ?s }t

struct
  #bytes/word +field    fwt5>1
  aligned nell +field   fwt5>2  \ align
  #bytes/word +field    fwt5>3
  #bytes/word +field    fwt5>4
  #bytes/long +field    fwt5>5
  aligned nell +field   fwt5>6
  #bytes/long +field    fwt5>7
  #bytes/long +field    fwt5>8
end-struct fwt5%

/nell 4 [=] [IF]
t{   fwt5%  26 ?s }t
t{ 0 fwt5>1  0 ?s }t
t{ 0 fwt5>2  2 ?s }t  \ in 4tH, ALIGNED does nothing
t{ 0 fwt5>3  6 ?s }t  \ so all following tests are
t{ 0 fwt5>4  8 ?s }t  \ decremented by 2
t{ 0 fwt5>5 10 ?s }t
t{ 0 fwt5>6 14 ?s }t
t{ 0 fwt5>7 18 ?s }t
t{ 0 fwt5>8 22 ?s }t
[THEN]

/nell 8 [=] [IF]
t{   fwt5%  34 ?s }t
t{ 0 fwt5>1  0 ?s }t
t{ 0 fwt5>2  2 ?s }t  \ in 4tH, ALIGNED does nothing
t{ 0 fwt5>3 10 ?s }t  \ so all following tests are
t{ 0 fwt5>4 12 ?s }t  \ decremented by 6
t{ 0 fwt5>5 14 ?s }t
t{ 0 fwt5>6 18 ?s }t
t{ 0 fwt5>7 26 ?s }t
t{ 0 fwt5>8 30 ?s }t
[THEN]


\ memory access testing

nell buffer: fwt1

1 fwt1 n!
t{ fwt1  w@      1 ?s }t
t{ fwt1 <w@      1 ?s }t

-2 fwt1 n!
t{ fwt1  w@  65534 ?s }t
t{ fwt1 <w@     -2 ?s }t

196607 fwt1 n!
t{ -2 fwt1 w!         }t
t{ fwt1  n@ 196606 ?s }t
t{ fwt1  w@  65534 ?s }t
t{ fwt1 <w@     -2 ?s }t

/nell 4 [=] [IF]
1 fwt1 n!
t{ fwt1  l@      1 ?s }t
t{ fwt1 <l@      1 ?s }t

-2 fwt1 n!
t{ fwt1  l@     -2 ?s }t
t{ fwt1 <l@     -2 ?s }t

t{ 196607 fwt1 l!     }t
t{ fwt1  n@ 196607 ?s }t
t{ fwt1  l@ 196607 ?s }t
t{ fwt1 <l@ 196607 ?s }t
[THEN]


/nell 8 [=] [IF]
1 fwt1 n!
t{ fwt1  l@           1 ?s }t
t{ fwt1 <l@           1 ?s }t

-2 fwt1 n!
t{ fwt1  l@  4294967294 ?s }t
t{ fwt1 <l@          -2 ?s }t

12884901886 fwt1 n!
t{ fwt1  n@ 12884901886 ?s }t
t{ fwt1  l@  4294967294 ?s }t
t{ fwt1 <l@          -2 ?s }t
[THEN]

\ ==============================================================================