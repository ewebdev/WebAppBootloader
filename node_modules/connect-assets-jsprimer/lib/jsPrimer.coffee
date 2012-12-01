fs = require "fs"
FileLoader = require "./FileLoader"

module.exports = 
  loadFiles: (assets, log) ->
    loader = new FileLoader assets, log
    loader.loadFiles()

  loadAndWatchFiles: (assets, log, changedCallback, doneWatching) ->
    loader = new FileLoader assets, log 

    loader.loadFiles()

    loader.watchFiles changedCallback, doneWatching