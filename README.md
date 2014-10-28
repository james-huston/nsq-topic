nsq-topic
=========

Create and delete NSQ topics from Node!

#Create a topic

Creating a topic is easy peasy. Just call the create method against your nsqd instance with the name of your topic and you are rocking and rolling.

	// point it to the http port on your nsqd server
	var nsqd = 'localhost:4151';
	var nsqTopic = require('nsq-topic');
	
	nsqTopic.create(nsqd, 'myTestTopic', function (err) {
		console.log('topic created');
	});
	
#Delete a topic

Delete topic functionality mirrors that of the NSQAdmin Go application. It first deletes the topic from all of the lookupd servers and then deletes it from all of the nsqd servers.

If the topic is not found on the lookupd server(s) then 

	// point it to the http port on your lookupd server
	var lookupd = ['localhost:4161'];
	var nsqTopic = require('nsq-topic');
	
	nsqTopic.delete(lookupd, 'myTestTopic', function (err) {
		console.log('topic deleted');
	});

#Running the tests

To run the tests for these modules you must have NSQ running, something like this:

	nsqlookupd &
	nsqd -broadcast-address=localhost -lookupd-tcp-address=localhost:4160 &


#License

The MIT License (MIT)

Copyright (c) 2014 James Huston

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.