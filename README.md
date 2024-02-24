# LibraryService
This microservice provides features related to books in a library.
This service is written in Typescript and uses the NestJs application framework.  Package management is done with Node.js.  Data storage is in MySQL, with Prisma providing ORM features.  The unit tests use Jest.

## Getting Started
This service can be run locally with a standalone MySQL installation.  A script is provided to handle creating the database schema, before starting the service.  Create '.env' to configure your local installation.
 - `npm run startup`

After the initial startup and schema deployment, the service can be started with 
 - `npm run start`

Alternately, the service can be run in a Docker container alongside a containerized MySQL instance.  With Docker installed and the engine started, use:
 - `docker compose up`

This will pull images with Node, install dependencies, build and copy relevant files, deploy the DB schema and start the service.  

Service will be available on localhost, port 3000 via either method.
 - http://localhost:3000/health

## Testing
The Library controller and service are covered by unit tests.  The tests use mocking to isolate the code under test as appropriate.  Tests can be executed with:
 - `npm run test`

Postman is a popular API testing tool, and a sample endpoint collection is provided in "Library.postman_collection.json" for convenience.

## Swagger API Documentation
The API docs are available in swagger.json or live in the running application at http://localhost:3000/api
The live version also supports running sample requests to the service.

## AI Integration
This service integrates with OpenAI's ChatGPT functionality to provide generated responses recommending new content given the description of existing content.  Provide your API key to use this funcitonality.
