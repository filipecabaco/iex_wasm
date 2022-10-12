\ Lightwright Dynamic Strings Demo - Copyright 2020 J.L. Bezemer
include lib/dstring.4th

struct
  field: a
  field: b
  field: c
  field: d
  field: e
end-struct /dstring                    \ define all dynamic strings
                                       \ allocate array and initialize it
/dstring array $ latest /dstring ds.build

s" Hello world" $ a ds.place           \ initialize dstring A
s" #Hello world" $ b ds.place          \ initialize dstring B
$ b ds.count type cr                   \ print dstring B

s" Hello world?" $ c ds.place          \ initialize dstring C
s" Hello world." $ d ds.place          \ initialize dstring D
$ d ds.count type cr                   \ print dstring D

s" Hello" $ e ds.place                 \ initialize dstring E
s"  world!" $ e ds+place               \ append to dstring E
$ e ds.count type cr                   \ print dstring E
ds.free . cr

ds.destroy depth .                     \ destroy *all* dstrings
