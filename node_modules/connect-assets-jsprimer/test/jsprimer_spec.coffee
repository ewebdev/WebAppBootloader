fs = require "fs"

should = require "should"

FileLoader = require "../lib/FileLoader"

describe "FileLoader", ->

    assetsMock = null
    loader = null
    toEditFilePath = process.cwd() + "/test/assets/js/new.coffee"
    removeNewFiles = ->
        if fs.existsSync toEditFilePath
            fs.unlinkSync toEditFilePath

    beforeEach ->
        removeNewFiles()

        assetsMock = 
            instance: 
                options:
                    helperContext:
                        js: (path) ->
                            # TODO: Something?
                    src: process.cwd() + "/test/assets"

        loader = new FileLoader assetsMock

    afterEach ->
        removeNewFiles()

    it "can instantiate", ->
        should.exist loader

    it "can load files from connect-assets src directory", ->
        fileNames = ["one", "two", "three", "model/book", "view/shelf", "controller/library"]
        called = 0
        loader.assetJS = (path) ->
            called++
            (path in fileNames).should.equal true

        loader.loadFiles()
        called.should.equal fileNames.length

    it "skips files with leading '.'", ->
        filesLoaded = []
        loader.assetJS = (path) ->
            filesLoaded.push path

        loader.loadFiles()
        (".hidden.swp" in filesLoaded).should.equal false
        ("test/.hidden.swp" in filesLoaded).should.equal false

    it "can monitor when files change", (done) ->
        fileNames = ["one", "two", "three", "model/book", "view/shelf", "controller/library"]
        called = 0
        loader.assetJS = (path) ->
            called++
        fileChangedCallback = (err, changedFilePath) ->
            throw err if err
            
            changedFilePath.should.equal toEditFilePath

            called.should.equal (fileNames.length + 1)

            done()

        loader.loadFiles()

        called.should.equal fileNames.length

        loader.watchFiles fileChangedCallback, (err, watcher) ->
            fs.writeFile toEditFilePath, "blah = 123\nother = 456", (err) ->
                throw err if err
                # Should have triggered the fileChangedCallback
        
