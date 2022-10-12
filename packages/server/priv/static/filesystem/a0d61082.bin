\ Example of cube using the "mirror-left" and "mirror-right" words. 
\    The blue line from different corner-corner orientations are 
\    better viewed using different mappings of 3D to 2D. 
 
 
include lib/gplot3d.4th
 
color_image 
255 whiteout 
center-plot 
                                 \ Line from top-left to bottom-right 
mirror-left                      \   is clearly visible. 
0 0 0  100  black cube 
0 0 0 3d>2d    100 100 100 3d>2d   blue line 
-50 0 0  red axis 
 
                                 \ Conversly, line from top-right to bottom left 
                                 \    is clearly visible. 
mirror-right 
0 150 0  100  black cube 
0 250 0 3d>2d    100 150 100 3d>2d  blue line 
-50 150 0  red axis 
 
s" cubemirs.ppm"  save_image

