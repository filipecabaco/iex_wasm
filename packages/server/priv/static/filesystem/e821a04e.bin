\ Show a ppm/pgm bitmap as an ASCII image (drj, May 2012)
\ Plotting on the text page uses a  [col] [row] "plot" format
\ which is more intuitive here.  This is different than the 
\ graphics.4th library which uses a right-handed coordinate
\ system (assuming the z-axis comes out of the screen) which I 
\ find easier for x-y plots.

[UNDEFINED] show_image [IF]
[UNDEFINED] set_pixel [IF]  [ABORT]  [THEN]   \ graphics.4th
 
8 constant txtbits   \ number of ascii "colors"

variable start_x     variable start_y     \ viewing frame
variable end_x       variable end_y 
variable cursor_x    variable cursor_y    \ cursor for user

0 value cursor? 
: cursor_on ( -- ) 1 to cursor? ;
: cursor_off ( -- ) 0 to cursor? ;
 
0 value pixel_offset            
offset text_pixel ( n -- char )  \ two 8 bit sets "ascii colors" 
     char @ c,   char # c,   char % c,   char o c,  \ normal image
     char + c,   char : c,   char . c,       bl c,
         bl c,   char . c,   char : c,   char + c,  \ negative image
     char o c,   char % c,   char # c,   char @ c,    

: invert_text_pixel ( -- )    \ Good for dark background
     txtbits to pixel_offset ;

: normal_text_pixel ( -- )    \ Good for white background 
     0 to pixel_offset ;

: view_from ( x y -- )        \ define the viewing frame
     2dup
     start_y !   start_x ! 
     cursor_y !  cursor_x ! ;  

: current_view ( -- x y )     \ report the viewing frame
     start_x @ start_y @ ;

: (show_line) ( n -- )        \ primative assumes the g-stack
   end_x @  start_x @  do     \ holds the scaling factor
     dup i  pixel@ 
     c/pixel 1 > if color>n then 
     g@ /  pixel_offset +  text_pixel emit
  loop drop ;

: show_line ( n -- )
    pic_intensity @ 1+  txtbits / >g   \ keep the scale factor 
    start_y @ +  (show_line) 
    g> drop ;    

: show_image ( width height -- )  \ Display the image in ascii art
  start_y @  +  end_y ! 
  start_x @  +  end_x ! 
  pic_intensity @ 1+  txtbits / >g   \ keep the scale factor 
  cr 
  end_y @  start_y @  do 
    i cursor_y @ = cursor? and 
       if   ."    >"   i (show_line) ." <==" 
       else ."    !"   i (show_line) ." !"
       then cr
  loop  g> drop  
  cursor? if  cursor_x @  start_x @  - 4 + spaces ." A" then 
  cr ;


 [DEFINED] 4TH# [IF]
  hide start_x
  hide start_y
  hide end_x
  hide end_y
 [THEN]
[THEN]
