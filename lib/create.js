
module.exports = function (nsqd, topic, callback) {
  request
    .post('http://' + nsqd + '/topic/create?topic=' + topic)
    .end(callback);
};
