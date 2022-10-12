\ 4tH Depth of Field - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Derived from an Android program by Anton Katsarov <anton@katsarov.org>
\ http://code.webface.bg/dof-calculator.html
\ A small App that allows photographers to calculate Depth of Field.

\ BASIC ALGORITHM
\ ===============
\ dist = dist * 1000;
\ hyperFocal = (FocalLength * FocalLength) / (Aperture * Sensor);
\ near = (hyperFocal * dist) / (hyperFocal + (dist - FocalLength));
\ far  = (hyperFocal * dist) / (hyperFocal - (dist - FocalLength));

include lib/row.4th
include lib/getopts.4th
include lib/fp2.4th
\ include lib/anstools.4th

20 value sensor                        \ sensitivity of camera (1/1000)
50 value focal-length                  \ focal-length used 
80 value aperture                      \ aperture used (1/10)

fclear 5 set-precision                 \ initialize floating point library
                                       \ all supported apertures
create apertureItems                   ( in 1/10 units)
  ," f/1.0"  10 ,
  ," f/1.1"  11 ,
  ," f/1.2"  12 ,
  ," f/1.4"  14 ,
  ," f/1.6"  16 ,
  ," f/1.8"  18 ,
  ," f/2"    20 ,
  ," f/2.2"  22 ,
  ," f/2.5"  25 ,
  ," f/2.8"  28 ,
  ," f/3.2"  32 ,
  ," f/3.5"  35 ,
  ," f/4"    40 ,
  ," f/4.5"  45 ,
  ," f/5.0"  50 ,
  ," f/5.6"  56 ,
  ," f/6.3"  63 ,
  ," f/7.1"  71 ,
  ," f/8"    80 ,
  ," f/9"    90 ,
  ," f/10"  100 ,
  ," f/11"  110 ,
  ," f/13"  130 ,
  ," f/14"  140 ,
  ," f/16"  160 ,
  ," f/18"  180 ,
  ," f/20"  200 ,
  ," f/22"  220 ,
  ," f/32"  320 ,
  NULL ,
                                       \ all supported cameras
create Sensors                         ( in 1/1000 units)
  ," Canon 30D, 20D, 20Da, 10D"                         19 ,
  ," Canon 60D, 60Da, 50D, 40D"                         19 ,
  ," Canon D60, D30"                                    19 ,
  ," Canon Digital Rebel, XS, XSi, XT, XTi"             19 ,
  ," Canon Digital Rebel T4i, T3i, T3, T2i, T1i"        19 ,

  ," Canon 1000D, 500D, 450D, 400D, 350D, 300D"         19 ,
  ," Canon 1D (Mark II, Mark II N, Mark III, Mark IV)"  23 ,
  ," Canon 1Ds (Mark II, Mark III)"                     30 ,
  ," Canon 1D C, 1D X"                                  30 ,
  ," Canon 5D (Mark II, Mark III)"                      30 ,

  ," Canon 7D"                                          19 ,
  ," Contax N Digital"                                  30 ,
  ," Epson RD-1, RD-1S, RD-1X"                          20 ,
  ," Fujifilm S5 Pro, S3 Pro, S2 Pro, S1 Pro"           20 ,
  ," Fujifilm IS Pro"                                   20 ,

  ," Fujifilm X100, X-Pro1"                             20 ,
  ," Konica Minolta Maxxum 7D, Maxxum 5D"               20 ,
  ," Leica Digilux 3"                                   15 ,
  ," Leica M8, M8.2"                                    23 ,
  ," Leica M9, M9-P, M-Monochrom"                       30 ,

  ," Leica X1"                                          23 ,
  ," Mamiya ZD"                                         39 ,
  ," Nikon D300, D300s, D200, D100"                     20 ,
  ," Nikon D800, D800E, D700"                           30 ,
  ," Nikon D2X, D2Xs, D2H, D2Hs, D1H, D1X"              20 ,

  ," Nikon D90, D80, D70, D70s, D60, D50, D40, D40x"    20 ,
  ," Nikon D4, D3x, D3s, D3"                            30 ,
  ," Nikon D7000, D5100, D5000, D3200, D3100, D3000"    20 ,
  ," Nikon 1 J1, 1 V1"                                  11 ,
  ," Olympus E-620, E-600, E-520, E-510, E-500"         15 ,

  ," Olympus E-450, E-420, E-410, E-400, E-330, E-300"  15 ,
  ," Olympus E-30, E-5, E-3, E-1"                       15 ,
  ," Olympus E-PL3, E-PL2, E-PL1, E-PL1s"               15 ,
  ," Olympus E-PM1"                                     15 ,
  ," Olympus E-P3, E-P2, E-P1"                          15 ,

  ," Panasonic DMC-G10, DMC-G3, DMC-G2, DMC-G1"         15 ,
  ," Panasonic DMC-GF5, DMC-GF3, DMC-GF2, DMC-GF1"      15 ,
  ," Panasonic DMC-GH2, DMC-GH1, DMC-GX1"               15 ,
  ," Panasonic DMC-L10, DMC-L1"                         15 ,
  ," Pentax 645D"                                       50 ,

  ," Pentax K200D, K110D, K100D, K100D Super"           20 ,
  ," Pentax K2000, K20D, K10D"                          20 ,
  ," Pentax K-r, K-x, K7"                               20 ,
  ," Pentax K-01, K-30"                                 20 ,
  ," Pentax *ist D, DL, DL2, DS, DS2"                   20 ,
 
  ," Samsung GX-1L, GX-1S, GX-20, GX-10"                20 ,
  ," Samsung NX11, NX10, NX5"                           20 ,
  ," Samsung NX1000, NX210, NX200, NX100"               20 ,
  ," Sigma DP1, DP1s, DP1x, DP2, DP2 Merrill, DP2s"     18 ,
  ," Sigma SD1, SD1 Merrill"                            20 ,

  ," Sigma SD-15, SD-14, SD-10, SD-9"                   18 ,
  ," Sony A380, A350, A330, A300, A230, A200, A100"     20 ,
  ," Sony A700, A580, A560, A550, A500, A450, A390"     20 ,
  ," Sony A900, A850"                                   30 ,
  ," Sony NEX-5N, NEX-5, NEX-3"                         20 ,

  ," Sony NEX-C3, NEX-F3, NEX-7"                        20 ,
  ," Sony SLT series (A33,A35,A37,A55,A57,A65,A77)"     20 ,
  here Sensors - 2 / constant #Sensors
                                       \ all supported focal lengths
create allFocal
    8 ,  ," 8 mm"
   10 ,  ," 10 mm"
   17 ,  ," 17 mm"
   20 ,  ," 20 mm"
   22 ,  ," 22 mm"
   24 ,  ," 24 mm"
   28 ,  ," 28 mm"
   35 ,  ," 35 mm"
   50 ,  ," 50 mm"
   70 ,  ," 70 mm"
   80 ,  ," 80 mm"
  100 ,  ," 100 mm"
  135 ,  ," 135 mm"
  150 ,  ," 150 mm"
  200 ,  ," 200 mm"
  210 ,  ," 210 mm"
  300 ,  ," 300 mm"
  350 ,  ," 350 mm"
  400 ,  ," 400 mm"
  600 ,  ," 600 mm"
  800 ,  ," 800 mm"
  NULL ,
                                       \ show FP number in meters
: .m 1000 s>f f/ f. ." m" ;            ( f --)
                                       \ calculate depth of field
: calc-dof                             ( f -- f1 f2)
  1000 s>f f*                          ( dist)
  focal-length s>f fdup f*             ( dist hyper)
  aperture s>f 10 s>f f/ sensor s>f 1000 s>f f/ f* f/
  fover fover f*                       ( dist hyper d*h)
  frot focal-length s>f f-             ( hyper d*h d-f)
  frot fswap                           ( d*h hyper d-f)
  fover fover f+                       ( d*h hyper d-f -near)
  frot frot f-                         ( d*h -near -far)
  frot fswap fover                     ( -near d*h -far d*h)
  fswap f/ frot frot fswap f/          ( far near)
;
                                       \ show depth of field
: report-dof                           ( f1 f2 --)
  ." Near limit of acceptable sharpness: " fdup .m cr
  ." Far limit of acceptable sharpness : " fover f0<
  if ." Infinity" else fover .m then cr
  ." Total depth of field              : " f- fdup f0<
  if                                   \ infinity if far < 0
    ." Infinity" fdrop
  else                                 \ negligable if depth between 0 and 1
    0 s>f fover f< >r fdup 1 s>f f< r> and
    if ." Negligible" fdrop else .m then
  then cr                              \ which is less than 1 mm
;
                                       \ list all cameras
: list-camera                          ( --)
  #Sensors 0                           \ we know how many cameras there are
  ?do i dup 1+ 2 .r ." . " 2 cells * Sensors + @c count type cr loop cr
;                                      \ so a simple loop will do this time
                                       \ list all apertures
: list-aperture                        ( --)
  apertureItems                        \ address of table
  begin dup @c dup NULL <> while count type cr 2 cells + repeat drop drop cr
;                                      \ list entire table
                                       \ list of all apertures
: list-focal-length                    ( --)
  allFocal                             \ address of table
  begin dup @c NULL <> while cell+ dup @c count type cr cell+ repeat drop cr
;                                      \ list of all focal lengths
                                       \ list which table
create lists                           ( a n --)
  ," camera"   ' list-camera ,
  ," aperture" ' list-aperture ,
  ," length"   ' list-focal-length ,
  NULL ,
does>                                  \ try to find string and execute
  2 string-key row if cell+ @c execute else ." No such list" cr abort then
  drop drop                            \ clean up the string
;                                      \ the corresponding word
                                       \ enter the focal length
: get-focal-length                     ( --)
  get-argument number error? abort" Invalid focal length"
  allFocal 2 num-key row               \ try to find the focal length
  if @c to focal-length else ." No such focal length" cr abort then drop
;                                      \ abort if it isn't found
                                       \ enter the aperture
: get-aperture                         ( --)
  get-argument apertureItems 2 string-key row
  if cell+ @c to aperture else ." No such aperture" cr abort then drop drop
;
                                       \ enter the camera
: get-camera                           ( --)
  get-argument number error? abort" Invalid camera"
  dup #Sensors > over 0> 0= or abort" No such camera"
  2 cells * Sensors + cell- @c to sensor
;                                      \ get the camera by its number
                                       \ enter a list and show it
: get-list get-argument lists ;        ( --)
                                       \ list of all CLI options
create options
  char f , ' get-focal-length ,        \ enter the focal length
  char c , ' get-camera ,              \ enter the camera type
  char a , ' get-aperture ,            \ enter the aperture
  char l , ' get-list ,                \ list an item
  NULL ,
                                       \ calculate and show depth of field
: depth-of-field                       ( --)
  options get-options option-index dup 1+ argn >
  abort" Usage: dof -l list -c camera# -f focal-length -a f/aperture distance"
  args s>float calc-dof report-dof
;

depth-of-field
