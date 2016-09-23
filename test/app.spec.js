var request = require('supertest');

describe('loading express', function () {
    var server;

    beforeEach(function() {
        server = request.agent("http://localhost:9000");
    });

    it('responds to /service/api', function (done){
        server.get('/service/api').expect(200, done);
    });

});

