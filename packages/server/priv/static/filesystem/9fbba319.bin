\ 4tH demo - HTML - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/html.4th

%beginHTML
  s" ../apps/data/html4th.css" %styleSheet
  s" Hans Bezemer" s" This is a sample article" %htmlTitle
  s" First section" %subSection
    s" This is something else, isn't it? Some say, you cannot" %print
    s" quote" %double s" in HTML." %print s" But I have to" %print
    s" stress" %italic s" this, it is" %print s" not" %bold s" true!" %print
    s" Table demo" %subSection
      s" alerts" %setStyle
      %table begins
        s" h1" s" h2" s" h3" 3 %heads
        s" c01" s" c02" s" c03" 3 %cells
        s" c11" s" c12" s" c13" 3 %cells
        s" c21" s" c22" s" c23" 3 %cells
      %table ends
      %endStyle
    %endSection
    s" Description demo" %subSection
    %description begins
      s" Cell" s" A word-size integer in Forth" %describe
      s" Word" s" Equivalent of a function in Forth" %describe
      s" Address-unit" s" Smallest memory unit in Forth" %describe
    %description ends
    %endSection
  %endSection
  s" Second section" %subSection
    s" Well, this was only the beginning. You can go to" %print
    s" the 4tH homepage" s" http://freecode.com/projects/4th/" %link
    s" for more." %print
    s" More tables!" %subSection
      s" elegant" %setStyle
      %table begins
        s" h1" s" h2" s" h3" 3 %heads
        s" c01" s" c02" s" c03" 3 %cells
        s" c11" s" c12" s" c13" 3 %cells
        s" c21" s" c22" s" c23" 3 %cells
      %table ends
      %endStyle
    %endSection
    s" Enumeration demo" %subSection
      %enumerate begins
        s" This is the first item" %item
        s" This is the second item" %item
        s" This is the third item" %item
      %enumerate ends
    %endSection
    s" Itemize demo" %subSection
      %itemize begins
        s" This is the first item" %item
        s" This is the second item" %item
        s" This is the third item" %item
      %itemize ends
    %endSection
  %endSection
%endHTML
