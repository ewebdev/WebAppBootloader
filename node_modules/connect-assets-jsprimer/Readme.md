connect-assets-jsprimer [![Build Status](https://secure.travis-ci.org/jgable/connect-assets-jsprimer.png)](http://travis-ci.org/jgable/connect-assets-jsprimer)
=======================

An NPM module that forces compilation of your javascript [connect-assets](https://github.com/TrevorBurnham/connect-assets) without referencing them in a view.

### Problems This Helps With

- You are using [requireJS](http://requirejs.org) and don't want to reference all your javascript files in the view.
- You have a javascript file that is dynamically loaded on your page but not in the view.

### Installation

`npm install connect-assets-jsprimer`

* There is a dependency on [CoffeeScript](http://coffeescript.org).  If you want a straight javascript version, you can compile it easily yourself.

### Usage

    assets = require 'connect-assets'
    jsPrimer = require 'connect-assets-jsprimer'
    
    # Snip ...
    
    app.use assets()
    jsPrimer assets

    # Optionally, you can pass in a log function to see progress
    # jsPrimer assets, console.log
    
### Copyright

Created by [Jacob Gable](http://jacobgable.com).  MIT License; no attribution required.
