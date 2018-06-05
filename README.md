App Demo https://media.giphy.com/media/1sw6syoMDm6QEu9Stk/giphy.gif

**What this app about ?**

This is a mock grocery purchase app built on the serverless technology.

1. Serverless Lambda Functions were written to serve as a backend REST APIs.
2. Front End is done with React which uses those APIs

**Motivation**

To explore the limit of serverless framework

**Tech Stack**

![image](http://awscomputeblogmedia.s3.amazonaws.com/zombie_high_level_architecture_of_survivor_serverless_chat_app.png)

**Functionalities**

App will have users who can register / login

1. List of grocery items based on various categories (Eatable, drinkable, cookable, hyigene)
2. Add items to cart if that stock is present for a grocery item.
3. Checking out from a cart to place order
4. Payment for an order / Cancelling the order

**To be built**
1. A global search bar for item search
2. Chat functionality between users and customer support (Admin of the app)

**Prerequisites:**

1. Install AWS CLI
2. Add user based on AWS credentials which will be shared directly.
3. Auth will be currently based on AWS Cognito. Login / Registration will be handled by the front end auth module directly with the cognito. Lambda functions won't be responsible for auth. It requires an userId (AccessKeyId) based on which we will maintain the DB.
4. All other APIs will be working locally.
5. Front End would be developed locally and finally deployed on S3.

**Accounts Required to deploy on cloud**

1. Cognito user pool to be created which will manage users in the app. You need to specify it on the front end as mentioned later in the readme. Also For backend refer ```To Setup Backend point 10 ```
2. Deployment will use S3, API gateway and lambda functions along with DynamoDB. Ensure that you have access in your AWS on which it will be deployed

**To setup Backend:**
1. Choose a region as per AWS (Our App is ap-south-1).
2. Check out ```utils/config.js``` and change the region as per that. Choose db url locally or accordingly on Cloud. For more details look at https://docs.aws.amazon.com/general/latest/gr/rande.html
3. Install AWS DynamoDB for this region locally and run the server which will default to port 8000.
4. ```npm run initialize-db``` to create all db tables with populated value (Local / cloud depending upon the config url)
5. At any moment you can use  ```npm run reinitialize-db``` to flush all the data present in the tables.
6. For the current version auth should be used with cognito.
7. ```npm install -g serverless``` to install serverless globally
8. ```npm install``` in the backend repository.
9. ```npm run start``` will start the serverless backend offline.
10. Certain routes are protected by cognito pool. Change the `serverles.yaml` as per your cognito pool to have authenticated routes.

**To setup Frontend:**
1. Create .env file under ```packages/CB-serverless-frontend``` folder with below variables:
REACT_APP_REGION=XXXXXX
REACT_APP_URL=http://localhost:3000
REACT_APP_REGION=XXXXXX
REACT_APP_USER_POOL_ID=XXXXXX
REACT_APP_APP_CLIENT_ID=XXXXXX
REACT_APP_IDENTITY_POOL_ID=XXXXXX

you can use 4242 4242 4242 4242 for card number or refer stripe for more.

2. ```npm install``` to install
3. ```npm run start``` to start
