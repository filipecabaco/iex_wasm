\ Sample gtk application using gtk-server
\ Written by Jorge Acereda ( jacer...@users.sourceforge.net )
\ Converted to 4tH by Hans Bezemer

include lib/gtkserv.4th

: gtk-res ( -- x, evaluate gtk-server response )
  0 parse number error? abort" Invalid response" ;

: gtk-show ( widget -- )
  gtk{ ." gtk_widget_show " . }gtk ;

: gtk-window ( a n -- win )
  gtk{ ." gtk_window_new 0" }gtk gtk-res
  gtk{ ." gtk_window_set_title " dup . -rot "type" }gtk ;

: gtk-table ( homogeneous colums rows -- widget )
  gtk{ ." gtk_table_new " . . . }gtk gtk-res ;

: gtk-add ( widget container -- )
  gtk{ ." gtk_container_add " .  . }gtk ;

: gtk-label ( "label" -- widget )
  gtk{ ." gtk_label_new " "type" }gtk gtk-res ;

: gtk-attach ( bot top right left widget table -- )
  gtk{ ." gtk_table_attach_defaults " . . . . . . }gtk ;

: gtk-button ( "name" -- widget )
  gtk{ ." gtk_button_new_with_label " "type" }gtk gtk-res ;

: gtk-iteration ( -- , perform mainloop iteration )
  gtk{ ." gtk_main_iteration" }gtk ;

: gtk-check ( -- widget , check for activity )
  gtk{ ." gtk_server_callback 0" }gtk gtk-res ;

gtk-srv-start
s" title" gtk-window value win
1 30 30 gtk-table value tab
tab win gtk-add
s" Hello world" gtk-label value lab
7 3 29 1 lab tab gtk-attach
s" exit" gtk-button value but
27 23 28 20 but tab gtk-attach
lab gtk-show  but gtk-show  tab gtk-show  win gtk-show

: demo begin gtk-iteration gtk-check but =  until gtk-srv-stop ;

demo
