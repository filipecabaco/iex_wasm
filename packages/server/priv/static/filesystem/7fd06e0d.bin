\ 4tH demo - RTF - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/rtf.4th

%RTFarticle
%beginRTF
s" Hans Bezemer" s" My life with 4tH" true %RTFtitle

s" Foreword" %subSection
s" First I want to thank my parents, my teachers," %print
s" my girlfriend, my hairdresser and most of all" %print
s" my dog Snoopy, who never lost faith in me." %println

%endSection

s" The beginning" %subSection
s" It was late at night, I couldn't catch sleep." %print
s" So I decided to create a compiler in order to" %print
s" archieve world peace and love and harmony for" %print
s" all mankind." %println

s" Basic philosophy" %subSection
s" To make the best product on the market, give the" %print
s" best possible service to our paying customers and" %print
s" squeeze each and every penny out of their pockets." %println

%endSection
%endSection

s" Pedigree" %subSection

%enumerate begins
  s" Artic Forth" %enumeration
  s" FPC" %enumeration
  s" gForth" %enumeration
%enumerate ends

%tablefloat begins
  %center begins
    %table begins
      s" Name"        s" Platform" s" Year" 3 %cells
      s" Artic Forth" s" Spectrum" s" 1983" 3 %cells
      s" FPC"         s" MS-DOS"   s" 1991" 3 %cells
      s" 4tH"         s" Linux"    s" 1994" 3 %cells
    %table ends
  %center ends
  s" Some Forth implementations" %caption
%tablefloat ends

s" This goes to" %print s" Google" s" http://google.com" %link s" !" %println

%line
%description begins
  s" Word" s" A function in Forth." %describe
  s" Flag" s" A boolean in Forth." %describe
  s" Cell" s" A native integer number in 4tH." %describe
%description ends
%line

%listing begins
  s" : rot >r swap r> swap ;    \ define ROT" %println
  s" 2 3 4 rot                  \ application of ROT" %println
%listing ends

%endSection
%endRTF
