#!/usr/bin/env python

import os
import sys
import re

if len(sys.argv) < 3:
    print "Usage: FILE_TO_INSPECT OUT_FILENAME"
    sys.exit(1)

FILE_TO_INSPECT=sys.argv[1]
OUT_FILE=sys.argv[2]

#read and parse
content = open(FILE_TO_INSPECT).read()

include_re = re.compile('\s*//@include\s+(.*)')
includes = re.findall(include_re, content)
injected_includes = {}
for include in includes:
    try:
        injected_includes[include] = open(include).read().replace('.pragma library', '')
    except:
        print "Could not find file: ", include
        sys.exit(1)

for include in includes:
    content = content.replace('//@include ' + include, injected_includes[include])

open(OUT_FILE, "w+").write(content)
print OUT_FILE



    

