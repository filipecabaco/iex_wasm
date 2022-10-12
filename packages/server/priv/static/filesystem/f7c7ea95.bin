\ 4tH - WEB4tH webserver (RFC 2616) - Copyright 2013 J.L. Bezemer

\ Inspired by NWEB 2.3, copyright 2012-08-19
\ by Nigel Griffiths (nag@uk.ibm.com)

\ The party providing the Content (the "Provider") grants You a nonexclusive,
\ worldwide, irrevocable, royalty-free, copyright license to edit, copy,
\ reproduce, publish, publicly display and/or perform, format, modify and/or
\ make derivative works of, translate, re-arrange, and distribute the Content
\ or any portions thereof and to sublicense any or all such rights and to
\ permit sublicensees to further sublicense such rights, for both commercial
\ and non-commercial use, provided You abide by the terms of this Agreement.
\ You understand that no assurances are provided that the Content does not
\ infringe the intellectual property rights of any other entity. Neither IBM
\ nor the provider of the Content grants a patent license of any kind, whether
\ expressed or implied or by estoppel. As a condition of exercising the rights
\ and licenses granted under this Agreement, You assume sole responsibility to
\ obtain any other intellectual property rights needed.

\ ** This server will only work in conjunction with an INETD server **

\ Example configurations (assuming you've made a standalone executable):

\ Using port 80:

\  /etc/services
\  http  80/tcp  www   # WorldWideWeb HTTP

\  /etc/inetd.conf
\  http  stream  tcp  nowait  root  /usr/local/bin/web4th  web4th /home/pi/web4th /home/pi/web4th/web4th.log

\ Using port e.g. 8888:

\  /etc/services
\  web4th  8888/tcp

\  /etc/inetd.conf
\  web4th  stream  tcp  nowait  root  /usr/local/bin/web4th  web4th /home/pi/web4th /home/pi/web4th/web4th.log

include lib/logger.4th                 \ for >LOGGER
include lib/row.4th                    \ for ROW
include lib/basename.4th               \ for EXTENSION
include lib/ansfacil.4th               \ for MS
include lib/files.4th                  \ for SIZE
\ include lib/anstools.4th               \ for .S

 42 constant M.ERROR                   \ log an error message
 44 constant M.LOG                     \ log an information message
403 constant M.FORBIDDEN               \ log "forbidden URL" message
404 constant M.NOTFOUND                \ log "not found" message
501 constant M.NOTIMPLEM               \ log "not implemented" message

8096 constant /buffer                  \ size of the transfer buffer
/buffer buffer: buffer                 \ allocate the transfer buffer
                                       \ composes the log message
255 string >log                        ( a1 n1 a2 n2 a3 n3 --)
  does> dup >r place r@ +place r@ +place r> count 0 args basename-ext >logger
;                                      \ and sends it to the system logger
                                       \ some tiny utility words
: <>dot c@ [char] . <> ;               ( a -- f)
: halt close-logfile abort ;           ( --)
: index.html? 0= if 2drop s" index.html" then ;
: .section do dup i cells + @c count type cr loop ;
: .page rot 4 0 .section cr 10 4 .section drop >log halt ;
                                       ( a1 n1 a2 n2 x a3 n3 --)
: Error! s" ERROR: " >log halt ;       ( a1 n1 a2 n2 --)
: Log! s" INFO: " >log ;               ( a1 n1 a2 n2 --)
                                       \ handle 403 error
create Forbidden!                      ( a1 n1 a2 n2 --)
  ," HTTP/1.1 403 Forbidden"
  ," Content-Type: text/html"
  ," Content-Length: 159"
  ," Connection: close"
  ," <html><head>"
  ," <title>403 Forbidden</title>"
  ," </head><body>"
  ," <h1>Forbidden</h1>"
  ," You don't have permission to access the requested URL on this server."
  ," </body></html>"
does> s" FORBIDDEN: " .page ;
                                       \ handle 404 error
create NotFound!                       ( a1 n1 a2 n2 --)
  ," HTTP/1.1 404 Not Found"
  ," Content-Type: text/html"
  ," Content-Length: 137"
  ," Connection: close"
  ," <html><head>"
  ," <title>404 Not Found</title>"
  ," </head><body>"
  ," <h1>Not Found</h1>"
  ," The requested URL was not found on this server."
  ," </body></html>"
does> s" NOT FOUND: " .page ;
                                       \ handle 501 error
create NotImplemented!                 ( a1 n1 a2 n2 --)
  ," HTTP/1.1 501 Not Implemented"
  ," Content-Type: text/html"
  ," Content-Length: 163"
  ," Connection: close"
  ," <html><head>"
  ," <title>501 Not Implemented</title>"
  ," </head><body>"
  ," <h1>Not Implemented</h1>"
  ," This server does not have the ability to fulfill the request."
  ," </body></html>"
does> s" NOT IMPLEMENTED: " .page ;
                                       \ log a message
create log                             ( a1 n1 a2 n2 n3 --)
  M.ERROR     , ' Error! ,             \ select the proper handling routine
  M.LOG       , ' Log! ,
  M.FORBIDDEN , ' Forbidden! ,
  M.NOTFOUND  , ' NotFound! ,
  M.NOTIMPLEM , ' NotImplemented! ,
  NULL ,
does> 2 num-key row if nip cell+ @c execute else halt then ;
                                       \ retrieve the mime type from extension
create get-mime                        ( a1 n1 -- a1 n1 a2 n2)
  ," gif"  ," image/gif"
  ," jpg"  ," image/jpg"
  ," jpeg" ," image/jpeg"
  ," png"  ," image/png"
  ," ico"  ," image/ico"
  ," zip"  ," application/zip"
  ," pdf"  ," application/pdf"
  ," gz"   ," application/x-gzip"
  ," tar"  ," application/x-tar"
  ," htm"  ," text/html"
  ," html" ," text/html"
  ," css"  ," text/css"
  ," js"   ," text/javascript"
  ," txt"  ," text/plain"
  ," 4th"  ," text/plain"
  ," c"    ," text/plain"
  NULL ,
does>                                  \ get extension and search it
  >r 2dup extension r> 2 string-key row
  if                                   \ if found, return it
    cell+ @c count 2nip
  else                                 \ if not found, return a 403 error
    drop 2nip s" file extension type not supported: " M.FORBIDDEN log
  then
;
                                       \ check if the webserver top dir is OK
create check-top-dir                   ( a n --)
  ," /"    ," /bin" ," /tmp" ," /dev"
  ," /etc" ," /lib" ," /usr" ," /sbin"
  NULL ,                               \ these are not allowed
does>                                  \ sure, you may cheat: your fault!
  1 string-key row                     \ if not allowed, log message and exit
  if drop s" bad top directory: " M.ERROR log else drop 2drop then
;
                                       \ check if parent directory is accessed
: check-parent-dir                     ( a n -- a n)
  2dup 1-                              \ save original filename and adjust
  begin dup while over dup <>dot swap char+ <>dot or while chop repeat nip
  if s" parent directory path names not supported: " M.FORBIDDEN log then
;                                      \ check for "double dots", if so: 403
                                       \ now actually transfer the file
: send-header                          ( n2 a1 n1 -- a1 n1)
  get-mime ." HTTP/1.1 200 OK" cr ." Date: " init-rfc1123 .logtime cr
  ." Server: Web4th/1.0" cr ." Content-Type: " type cr ." Content-Length: "
  rot 0 .r  cr ." Connection: close" cr
;
                                       \ transfer the file
: transfer-file                        ( h --)
  cr dup use 0                         \ prepare msg, use file, setup count
  begin                                \ fill the entire buffer
    buffer /buffer accept dup          \ if something has been read
  while                                \ transfer the contents, update count
    buffer over type >r r@ + r> /buffer over =
  while                                \ if full buffer has been read
    drop                               \ drop the number of bytes read
  repeat drop sync                     \ in this iteration, empty buffer
  s"  bytes transferred" rot <# #s #> M.LOG log close 1000 ms
;                                      \ wait for the socket to drain
                                       \ compose full pathname, get size
: get-file-info                        ( a1 n1 -- a2 n2 n3)
  1 args buffer place over c@ [char] / <> if s" /" buffer +place then
  buffer +place buffer count 2dup size error?
  if drop s" failed to open file: " M.NOTFOUND log then
;                                      \ get size, abort on error
                                       \ check and get resource information
: get-resource                         ( -- a n)
  bl parse-word dup index.html?        \ replace by index.html if required
  2dup s" /" compare index.html?       \ get information and send header
  check-parent-dir get-file-info -rot send-header
;
                                       \ implementation of the methods
: do-get get-resource 2dup s" SEND: " M.LOG log input open transfer-file ;
: do-head get-resource s" HEAD: " M.LOG log ;
                                       \ supported methods
create operation                       ( a n --)
  ," get"  ' do-get ,                  \ GET supported
  ," head" ' do-head ,                 \ HEAD supported
  NULL ,
does>                                  \ find method, if found: execute
  2 string-key row if >r 2drop r> cell+ @c execute halt exit then
  drop s" method not implemented: " M.NOTIMPLEM log
;                                      \ else send "not implemented" message
                                       ( a n --)
: process-request s" request: " M.LOG log bl parse-word operation ;
                                       \ handle a HTTP request
: web4th                               ( --)
  argn 3 < abort" Usage: web4th root-dir log-file"
  2 args use-logfile 1 args check-top-dir refill buffer /buffer 1- accept drop
  if tib count -trailing dup if process-request exit then 2drop then
  s" (empty)" s" failed to read browser request " M.NOTIMPLEM log
;                                      \ check options, get request,
                                       \ exit if no request found
web4th
