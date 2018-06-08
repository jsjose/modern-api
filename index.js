const hapi = require('hapi');
const mongoose = require('mongoose');

const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

mongoose.connect('mongodb://jsjose:perdido04@ds247430.mlab.com:47430/powerful-api-jsjose');
mongoose.connection.once('open', () => {
	console.log('connected to database');
});

const init = async () => {
        	server.route({
			method: 'GET',
			path: '/',
			handler: function(request, reply) {
				return '<h1>My modern api</h1>';
			}
		});

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();
