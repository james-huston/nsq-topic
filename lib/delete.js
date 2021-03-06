var lookup = require('nsq-lookup');
var Batch = require('batch');
var request = require('superagent');
var debug = require('debug')('nsq-delete-topic');

/**
 * The general flow of this process should be similiar to what the
 * nsqadmin does when you delete a topic from the web admin. It will
 * first delete the topic from all of your nsqlookupd servers and then
 * it will go find all of the nsqd servers and delete from there.
 */

module.exports = deleteTopic;

function deleteTopic(nsqlookupd, topic, fn){
  var batch = new Batch();

  if ('string' === typeof(nsqlookupd)) {
    nsqlookupd = [nsqlookupd];
  }

  debug('lookup up servers', nsqlookupd);

  var nsdqNodes;

  /**
   * start by getting our nsdq nodes before we delete from the lookupd.
   * if we delete first from lookupd like we used to then the lookupd assumes
   * that the nsqd's don't have that topic anymore and doesn't return the list.
   * I believe this is something to do with tombstones. by grabbing the list
   * first we can refer to that when we hit the nsqd servers and avoid the
   * 404s that throw on nsqd's that don't have the topic we are killing.
   */
  lookup(nsqlookupd, function (err, nodes) {
    if (err) {
      debug('lookup error', err);
      return callback(err);
    }

    nsqlookupd.map(function(node) {
      debug('processing lookupd server', node);
      batch.push(function (done) {
        request
          .post(node + '/topic/delete?topic=' + topic)
          .end(function (err, res) {
            if (err) {
              debug('error deleting from lookupd', node, err);
              return done(err);
            }
            if (res.error) {
              debug('error from lookupd on delete', node, res.error);
              return done(err);
            }

            debug('lookupd request complete', err, res.status);
            done();
          });
      });
    });

    batch.end(function (err) {
      if (err) return fn(err);

      debug('lookupd complete, starting nsqd');
      deleteOnNsqd(nodes, topic, fn);
    });

  });
}

function deleteOnNsqd(nodes, topic, callback) {
  var batch = new Batch();

  nodes
    .filter(hasTopic(topic))
    .map(function(node){
      // loop through all of our nodes that contain this topic
      // and call the delete on each of them.
      debug('found nsdq node', node.broadcast_address, node.http_port);
      batch.push(function(done){
        var myNode = node.broadcast_address + ':' + node.http_port;

        debug('processing nsqd node', myNode, topic);
        request
          .post(myNode +
            '/topic/delete?topic=' + topic)
          .end(function(err, res){
            debug('nsqd request complete', myNode, topic);
            if (err) {
              debug('error deleting from nsqd', myNode, err);
              return done(err);
            }
            if (res.error) {
              debug('error returned from nsqd', myNode, res.error);
              return done(res.error);
            }
            debug('nsqd node completed', myNode, topic, res.status);
            done();
          });
      });
    });

  batch.end(callback);
}

function hasTopic(topic){
  return function(node){
    return node.topics.indexOf(topic) > -1;
  };
}
