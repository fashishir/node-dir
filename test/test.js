﻿var path = require('path');

var chai = require('chai');
var expect = chai.expect;
chai.should();

var dir = require('..'),
    fixturesDir = path.join(__dirname, 'fixtures'),
    tdir = path.join(fixturesDir, 'testdir'),
    tdir2 = path.join(fixturesDir, 'testdir2');

describe('readfiles method', function() {

    it('should exec a callback on every file contents and exec a done callback', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            filenames.push(shortName);
            content.should.equal(expected);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
            ]);
            filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });

    it('should accept an string argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, 'ascii', function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });

    it('should accept an options argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            encoding: 'ascii'
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });

    it('if shortName option is true, only aggregate the base filename rather than the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            shortName: true
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            path.basename(filename).should.equal(filename);
            var shortName = filename.replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(filename);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file1.txt', 'file2.text', 'file3.txt', 'file4.text']);
            done();
        });
    });

    it('if recursive option is set to false, should not read files in subdirectories', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            recursive: false
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            filenames.push(shortName);
            content.should.equal(expected);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text'
            ]);
            filenames.sort().should.eql(['file1', 'file2']);
            done();
        });
    });

    it('if given a match option, should only read files that match it', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            match: /txt$/
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file1', 'file3']);
            done();
        });
    });

    it('match option should match pattern only to the filename itself, not the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            match: /^file/
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            filenames.push(shortName);
            content.should.equal(expected);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
            ]);
            filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });

    it('if match option should match pattern only to the filename itself, not the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            match: /^file/
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            filenames.push(shortName);
            content.should.equal(expected);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
            ]);
            filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });

    it('if given an exclude option, should only read files that do not match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
            exclude: /text$/
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file1', 'file3']);
            done();
        });
    });

    it('if given a matchDir option, should only read files in subdirectories that match it', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
            matchDir: /special/i
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file3', 'file4']);
            done();
        });
    });

    it('if given an excludeDir option, should only read files that are not in subdirectories that match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
            excludeDir: /^\./
        }, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            content.should.equal(expected);
            filenames.push(shortName);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            filenames.sort().should.eql(['file2', 'file3', 'file4']);
            done();
        });
    });

    it('can be called with a callback in which the filename argument is omitted', function(done) {
        dir.readFiles(
            tdir, function(err, content, next) {
            expect(err).to.equal(null);
            content.should.be.a('string');
            content.indexOf('begin content of').should.equal(0);
            next();
        }, function(err) {
            expect(err).to.equal(null);
            done();
        });
    });

    it('can be called with the done callback argument omitted', function(done) {
        var i = 0;
        dir.readFiles(
            tdir, function(err, content, next) {
            expect(err).to.equal(null);
            next();
            i++;
            if (i === 4) done();
        });
    });

    it('should pass the name and content of every filepath in a directory and subdirectories to a callback, and pass an array of the filepaths of every file in a directory and its subdirectories to a callback when complete', function(done) {
        dir.files(tdir, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
            ]);
            done();
        });
    });

});





describe('subdirs method', function() {
    it('should pass an array of the subdir paths of every subdir in a directory (recursive) to a callback', function(done) {
        dir.subdirs(tdir, function(err, dirs) {
            expect(err).to.equal(null);
            var relPaths = dirs.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir/subdir');
            done();
        });

    });
});

describe('paths method', function() {
    it('should pass an object with a files property and dirs property of the paths of every file and subdir, respectively, in a directory (recursive) to a callback', function(done) {
        dir.paths(tdir, function(err, paths) {
            expect(err).to.equal(null);
            paths.should.be.an('object');
            paths.should.not.be.an('array');
            expect(paths.files).to.exist;
            expect(paths.dirs).to.exist;
            var relFiles = paths.files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            var relPaths = paths.dirs.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir/file1.txt',
                'testdir/file2.text',
                'testdir/subdir/file3.txt',
                'testdir/subdir/file4.text'
            ]);
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir/subdir');
            done();
        });
    });

    describe('when called with combine argument set to true', function() {

        it('should pass an array of filepaths of all subdirs and files in a directory and its subdirs to a callback', function(done) {
            dir.paths(tdir, true, function(err, paths) {
                expect(err).to.equal(null);
                paths.should.be.an('array');
                var relPaths = paths.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relPaths.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
            });
            done();
        });

    });

});