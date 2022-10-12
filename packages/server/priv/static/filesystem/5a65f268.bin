\ 4tH library - GTK server Unix IPC - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/gtkipc.4th

\ Sample gtk application using gtk-server
\ Written by Jorge Acereda ( jacer...@users.sourceforge.net )
\ Converted to 4tH by Hans Bezemer

: gtk-res ( -- x, evaluate gtk-server response )
  0 parse number error? abort" Invalid response" ;

: gtk-show ( widget -- )
  gtk{ s" gtk_widget_show" s>msg n>msg }gtk ;

: gtk-window ( a n -- win )
  gtk{ s" gtk_window_new 0" s>msg }gtk gtk-res
  gtk{ s" gtk_window_set_title" s>msg dup n>msg -rot 's'>msg }gtk ;

: gtk-table ( homogeneous colums rows -- widget )
  gtk{ s" gtk_table_new" s>msg n>msg n>msg n>msg }gtk gtk-res ;

: gtk-add ( widget container -- )
  gtk{ s" gtk_container_add" s>msg n>msg n>msg }gtk ;

: gtk-label ( "label" -- widget )
  gtk{ s" gtk_label_new" s>msg 's'>msg }gtk gtk-res ;

: gtk-attach ( bot top right left widget table -- )
  gtk{ s" gtk_table_attach_defaults" s>msg n>msg n>msg n>msg n>msg n>msg n>msg }gtk ;

: gtk-button ( "name" -- widget )
  gtk{ s" gtk_button_new_with_label" s>msg 's'>msg }gtk gtk-res ;

: gtk-iteration ( -- , perform mainloop iteration )
  gtk{ s" gtk_main_iteration" s>msg }gtk ;

: gtk-check ( -- widget , check for activity )
  gtk{ s" gtk_server_callback 0" s>msg }gtk gtk-res ;

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
