const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

mongoose.connect('mongodb://jsjose:perdido04@ds247430.mlab.com:47430/powerful-api-jsjose');
mongoose.connection.once('open', () => {
	console.log('connected to database');
});

const init = async () => {
	// Registro API Swagger
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Paintings API Documentation',
					version: Pack.version
				}
			}
		}
	]);	
	// Graphiql is the in-browser IDE for exploring GraphQL
	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});
	// registro graphql plugin
	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
		}
	});
	server.route([
		{
			method: 'GET',
			path: '/api/v1/paintings',
			config: {
				description: 'Get all the paintings',
				tags: ['api', 'v1', 'painting']
			},
			handler: (req, reply) => {
				return Painting.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/paintings',
			config: {
				description: 'Get a specific painting by ID.',
				tags: ['api', 'v1', 'painting']
			},
			handler: (req, reply) => {
				const { name, url, technique } = req.payload;
				const painting = new Painting({
					name,
					url,
					technique
				});

				return painting.save();
			}
		}	
	]);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();