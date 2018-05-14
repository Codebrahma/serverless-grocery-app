Prerequisites:
1. Install AWS CLI
2. Add user based on AWS credentials which will be shared directly.
3. Auth will be currently based on AWS Cognito. Login / Registration will be handled by the front end auth module directly with the cognito. Lambda functions won't be responsible for auth. It requires an userId (AccessKeyId) based on which we will maintain the DB.
4. All other APIs will be curently running locally.
5. Front End would be developed locally and finally deployed on S3.

To setup Backend:

1. Install AWS DynamoDB locally and run the server which will default to port 8000.
2. Run createTable and populateTable using node command which will populate all groceries in the DB.
3. For the current version auth should be used with cognito.
4. ```npm install``` in the backend repository.
5. ```npm run start``` will start the serverless backend offline.

To setup Frontend:

1. ```npm install``` to install
2. ```npm run start``` to start
