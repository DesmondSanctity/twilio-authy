/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
 serverRuntimeConfig: {},
 publicRuntimeConfig: {
  apiUrl:
   process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api' // development api
    : 'https://twilio-authy.vercel.app/api', // production api
 },
};

module.exports = nextConfig;
