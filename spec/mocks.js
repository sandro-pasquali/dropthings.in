var redis = require("redis");
var client = redis.createClient();

describe('Mocking pub/sub', function() {
	var mock = sinon.mock(client);
	mock.expects('subscribe').withExactArgs('channel').once();
	
	it('tests that #subscribe is being called correctly', function() {
		client.subscribe('channel');
		client.subscribe('channel');
		expect(mock.verify()).to.be.true;
	});
});