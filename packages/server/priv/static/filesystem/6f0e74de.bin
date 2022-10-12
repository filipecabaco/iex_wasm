\ 4tH demo - LaTeX - Copyright 2010,2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[pragma] UseURLs
include lib/latex.4th

%texArticle
%beginTex
s" Hans Bezemer" s" My life with 4tH" true %texTitle

s" Foreword" %subSection
s" First I want to thank my parents, my teachers," %print
s" my girlfriend, my hairdresser and most of all" %print
s" my dog Snoopy, who never lost faith in me." %print

%endSection

s" The beginning" %subSection
s" It was late at night, I couldn't catch sleep." %print
s" So I decided to create a compiler in order to" %print
s" archieve world peace and love and harmony for" %print
s" all mankind." %print

s" Basic philosophy" %subSection
s" To make the best product on the market, give the" %print
s" best possible service to our paying customers and" %print
s" squeeze each and every penny out of their pockets." %print

%endSection
%endSection

s" Pedigree" %subSection

%enumerate begins
  s" Artic Forth" %item
  s" FPC" %item
  s" gForth" %item
%enumerate ends

%tablefloat begins
  %center begins
    %table begins
      s" | l | l | c |" %layout %line
      s" Name"        s" Platform" s" Year" 3 %cells %line
      s" Artic Forth" s" Spectrum" s" 1983" 3 %cells %line
      s" FPC"         s" MS-DOS"   s" 1991" 3 %cells %line
      s" 4tH"         s" Linux"    s" 1994" 3 %cells %line
    %table ends
  %center ends
  s" Some Forth implementations" %caption
%tablefloat ends

s" This goes to" %print s" Google" s" http://google.com" %link s" !" %print

%description begins
  s" Word" s" A function in Forth." %describe
  s" Flag" s" A boolean in Forth." %describe
  s" Cell" s" A native integer number in 4tH." %describe
%description ends

%listing begins
  ."   : rot >r swap r> swap ;    \ define ROT" cr
  ."   2 3 4 rot                  \ application of ROT" cr
%listing ends

%endSection
%endTex
