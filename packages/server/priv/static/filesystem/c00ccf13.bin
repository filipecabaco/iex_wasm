\ Bitmap (ppm, ppg) conversion to ASCII image  (drj, Aug 2017)
\ Plotting on the text page uses a  [xcol] [yrow] "plot" format. 
\ Random switching between two ASCII grayscale palettes is used
\ to enchance the image contrast. 
 
[UNDEFINED] show_image [IF] 
[UNDEFINED] set_pixel  [IF] [ABORT] [THEN]   \ graphics.4th
[UNDEFINED] unbiased   [IF] include lib/rndubias.4th [THEN]  \ unbiased ( -- 0 1 )
 
8 constant txtbits   \ number of ascii "colors" 
txtbits 1-  constant txtbits-

defer Image-type              \ n1=text pixel offset
: normal-view ( n1 -- n1 ) ;
: negative-view ( n1 -- n2 )  txtbits- swap - ;

defer Pset
: Pset1 ( n1 -- n2 ) Image-type ;                        \ Use only palette-1
: Pset12 ( n1 -- n2 ) Image-type unbiased txtbits * + ;  \ Use both sets

\ Modify pallettes to match txtbits and desired contrast. 
offset text_pixel ( n -- char )  \ two 8 bit sets "ascii colors" 
      char M c,   char # c,   char % c,   char o c,  \ ASCII palette-1 
      char + c,   char : c,   char . c,       bl c, 
      char B c,   char @ c,   char & c,   char c c,  \ ASCII palette-2 
      char = c,   char ; c,   char ' c,       bl c, 
 
: (show_line) ( n xstart xend scaling_factor -- ) 
   >r
   swap do 
     dup i  pixel@ 
     c/pixel 1 > if color>n then 
     r"@ / Pset text_pixel emit 
   loop drop 
   r> drop ; 
 
: show_line ( n xstart xend -- ) 
      pic_intensity @ 1+  txtbits /  (show_line) ;

: show_image ( xstart xend  ystart yend -- )  
    pic_intensity @ 1+  txtbits / >r      \ Find scaling_factor  
     swap do  
        2dup i rot rot r"@  (show_line) cr 
    loop cr r> drop drop drop ; 
 
: normal-view? ( flag -- )
     if    ' normal-view  is Image-type  
     else  ' negative-view is Image-type   
     then ;

: hi-contrast? ( flag -- )
     if    ' Pset12 is Pset
     else  ' Pset1 is Pset
     then ;

randomize             \ set the defaults
true normal-view?
true hi-contrast?

  [DEFINED] 4TH# [IF]
    hide txtbits
    hide txtbits-
    hide Image-type
    hide normal-view  
    hide negative-view
    hide Pset
    hide Pset1
    hide Pset12 
    hide (show_line)
  [THEN]
[THEN]
