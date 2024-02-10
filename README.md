# twilio-authy

A Next.js application that uses Twilio Authy for 2FA

- To run the application, clone the `twilio-authy-starter` branch of this repository in a directory of your choice using the command below:
  ```bash
  git clone https://github.com/DesmondSanctity/twilio-authy.git
  ```
- After cloning, run npm install to install all the dependencies needed
  ```bash
  npm install
  ```
- Some environment variables are needed for the project to run, create a `.env` file in the root directory of your project. Fill it with these details
  ```js
  MONGODB_URI=<MongoDB URL>
  JWT_SECRET=<JWT Secret Keys>
  accountSid=<Twilio Account SID>
  authToken=<Twilio Auth Token>
  serviceSid=<Authy Service SID>
  ```
- Finally run the dev command to start the application using this command

  ```bash
  npm run dev
  ```

- For deploying to production, after the deployment, update the next.config file with your production URL. If not, you might have issues running the app on production environment.

  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
   reactStrictMode: true,
   serverRuntimeConfig: {},
   publicRuntimeConfig: {
    apiUrl:
     process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api' // development api
      : '<your-production-url>/api', // production api
   },
  };

  module.exports = nextConfig;
  ```

Credits for this boilerplate go to [Jason Watmore](https://github.com/cornflourblue/next-js-13-mongodb-registration-login-example)
