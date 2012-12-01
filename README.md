#WebApp Bootloader
###Static assets loading and storing in localStorage with cache manifest preloading for offline use and efficient assets versioning.
###Template project, including sample "welcome" screen, assets loader and cache manifest + versioned resources index generator.

###Dependencies:
- jQuery
- Node.js (for building versioned cache manifest and versioned resources index files)

###Usage
####bootloader.ready(callback)
    add callbacks to be called when all resources are finished loaded
####bootloader.activate()
    injects deferred scripts (start app)
####Some "Getting started" instructions located in this sample app (run "node server" and open http://localhost:5000)

####Tested on WebKit

Copyright 2012, Eyal Weiss
This may be freely distributed under the MIT license.