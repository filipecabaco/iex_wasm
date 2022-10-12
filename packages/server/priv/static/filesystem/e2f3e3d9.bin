\ ppm2txt.4th 
\  Simple example conversion from image file to an ascii art file. 
\    Usage:  ppm2txt [-ic] pagewidth  input.ppm  output.txt 
\               with -i = invert the image, and -c = low contrast
 

include lib/graphics.4th 
include lib/getopts.4th    \ get-options 
include lib/gshrink.4th    \ shrink ( -- ) 
include lib/gaspect.4th    \ hshrink ( -- ) 
include lib/gpic2txt.4th   \ show_image ( x1 x2 y1 y2 -- ) 
                           \    hi-contrast? ( flag -- ) 
                           \    normal-view? ( flag -- ) 
 
 
true value hicontrast     \ true to use two ascii grayscales 
true value normalview     \ true=positive image; false=negative view 
 
: lower-contrast ( -- ) false to hicontrast ; \ use one ascii grayscale 
: invert-view ( -- ) false to normalview ;    \ inverted view of image 
 
create options 
  char c , ' lower-contrast , 
  char i , ' invert-view , 
  NULL , 
 
: sizeit ( x2 y2 pagewidth -- x2new y2new )    \ reduce image to fit pagewidth 
   >r begin 
       over r@ > dup >r   if shrink 2/ swap 2/ swap then 
   r> false = until r> drop ; 
 
: saveit ( x2 y2 a n -- )         \ save current ascii image display 
  output open error?              \ value for file 
  abort" File could not be opened"    \ save handle 
  dup use >r                          \ redirect to file 
  >r >r 0 r> 0 r> show_image          \ show image from 0 x2 0 y2 
  r> close ;                          \ close file 
 
: convert ( -- ) 
   options get-options        \ commandline options 
   hicontrast hi-contrast?    
   normalview  normal-view?    
   argn 3 option-index +  < abort" Usage: ppm2txt [-ic] pgwidth infile outfile" 
   option-index 1 + args  get_image 
   pic_width @  pic_height @  hshrink 2/   \ correct the aspect ratio!! 
   option-index args number error? abort" pagewidth invalid"  sizeit 
   option-index 2 + args saveit ; 
 
convert 

