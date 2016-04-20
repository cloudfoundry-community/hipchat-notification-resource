// (c) Copyright 2016 Hewlett Packard Enterprise Development LP
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var argv = require('yargs').argv,
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  diff = require('gulp-diff'),
  gutil = require('gulp-util'),
  filter = require('gulp-filter'),
  eslint = require('gulp-eslint'),
  beautify = require('gulp-jsbeautifier');

var dropRoot = '../../release/',
  dropFolder = 'workers',
  sourceLocation = '.',
  dropLocation = dropRoot + dropFolder;


// Task: lint-and-beautify
// Performs in-place linting & beautification of the *src* files. We perform
// this in-place so that the checked in code is clean and consistent.
gulp.task('lint-and-beautify', function () {
  // Beautify Config: src/.jsbeautifyrc
  // Linting Config: src/.estlintrc
  return gulp
    .src(['**/*.js', '!node_modules/**/*.js'])
    .pipe(beautify({
      config: '.jsbeautifyrc'
    }))
    .pipe(diff())
    .pipe(diff.reporter({
      quiet: !argv['fail-on-beautify'],
      fail: argv['fail-on-beautify']
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('.'));
});