var redis = require("redis");
var client1 = redis.createClient();
var client2 = redis.createClient();

//	Testing this
function nowPublish(channel, msg) {
	client2.publish(channel, msg);
};

describe('Testing pub/sub', function() {
	before(function() {
		sinon.spy(client1, "subscribe");
	});

	after(function() {
		client1.subscribe.restore(); 
	});
	
	it('tests that #subscribe works', function() {
		client1.subscribe("channel");
		expect(client1.subscribe.calledOnce);
	});
	
	it('tests that #nowPublish works', function(done) {
		var callback = sinon.spy();
		client1.subscribe('channel', callback);
		client1.on('subscribe', function() {
			nowPublish('channel', 'message');
			expect(callback.calledWith('message'));
			expect(client1.subscribe.calledTwice);
			done();
		});
	});
});