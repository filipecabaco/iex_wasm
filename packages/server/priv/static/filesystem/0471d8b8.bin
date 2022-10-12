include lib/i18n.4th
                                       \ define language codes
create languages ," en" ," nl" ," de" ," fr" 
here languages - constant #languages   \ calculate number of languages
                                       \ define messages
create MSG.ERROR
  ," Error %ERR% has occurred"
  ," Fout %ERR% is opgetreden"
  ," Fehler %ERR% wurde ausgelöst"
  ," L'erreur %ERR% s'est produite"

create MSG.HACK
  ," User %USER% attempted to enter '%HOST%'"
  ," Gebruiker %USER% probeerde '%HOST%' binnen te dringen"
  ," Angriffsversuch auf '%HOST%' von Benutzer %USER%" 
  ," L'utilisateur %USER% a tenté d'entrer '%HOST%'"

languages #languages i18n.languages    \ declare languages to i18n
s" LANGUAGE" environ@ i18n.select drop to i18n.lang
                                       \ use $LANGUAGE to get information
15 s" ERR" i18n.let                    \ set numeric parameter %ERR%
MSG.ERROR i18n.msg type cr             \ expand the message and type it

s" root" s" USER" i18n.set             \ set string parameter %USER%
s" 192.168.60.5" s" HOST" i18n.set     \ set string parameter %HOST%
MSG.HACK i18n.msg type cr              \ expand the message and type it

s" 192.168.60.8" s" HOST" i18n.set     \ give parameter %HOST% another value
MSG.HACK i18n.msg type cr              \ expand the message and type it 

i18n.reset                             \ shut the i18n subsystem down

