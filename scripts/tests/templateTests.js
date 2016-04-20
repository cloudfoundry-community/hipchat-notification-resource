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

var should = require('should'),
  rewire = require('rewire'),
  sinon = require('sinon'),
  tokenReplacer = rewire('../tokenReplacement');

describe('Notifier template', function (done) {

  it("Should replace a build token", function () {
    var mockProcess = {
        env: {
          BUILD_ID: 12
        }
      },
      message = {},
      params = null;

    message.template = "Test message with ${BUILD_ID}",

      tokenReplacer.__set__({
        'process': mockProcess
      });

    tokenReplacer.replaceTokens(message, params, function (error, newMessage) {
      newMessage.should.equal("Test message with 12");
    });
  });

  it("Should replace all instances of the same build token", function () {
    var mockProcess = {
      env: {
        BUILD_ID: 12,
        BUILD_JOB_NAME: 'Super-Job'
      }
    };

    tokenReplacer.__set__({
      'process': mockProcess
    });

    var message = {};
    message.template = "${BUILD_ID} Job Name: ${BUILD_JOB_NAME} Build Id: ${BUILD_ID}";
    var params = null;

    tokenReplacer.replaceTokens(message, params, function (error, newMessage) {
      newMessage.should.equal("12 Job Name: Super-Job Build Id: 12");
    });
  });

  it("Should replace all instances of a param token", function () {
    var mockProcess = {
        env: {
          BUILD_ID: 12,
          BUILD_JOB_NAME: 'Super-Job'
        }
      },
      message = {},
      params = null;

    tokenReplacer.__set__({
      'process': mockProcess
    });

    message.template = "${PR_URL} Pull Request # ${PR_NUMBER}";
    message.params = {
      PR_URL: 'http://www.google.com/',
      PR_NUMBER: '1'
    };

    tokenReplacer.replaceTokens(message, params, function (error, newMessage) {
      newMessage.should.equal("http://www.google.com/ Pull Request # 1");
    });
  });

  it("Should replace all instances of the same param token", function () {
    var mockProcess = {
        env: {
          BUILD_ID: 12,
          BUILD_JOB_NAME: 'Super-Job'
        }
      },
      message = {},
      params = null;

    tokenReplacer.__set__({
      'process': mockProcess
    });

    message.template = "PR: ${PR_NUMBER} - ${PR_URL} Pull Request # ${PR_NUMBER}";
    message.params = {
      PR_URL: 'http://www.google.com/',
      PR_NUMBER: '1'
    };

    tokenReplacer.replaceTokens(message, params, function (error, newMessage) {
      newMessage.should.equal("PR: 1 - http://www.google.com/ Pull Request # 1");
    });
  });


});