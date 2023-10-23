/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        connectionString: "mongodb+srv://root:twilioauthroot@authdb.ypv0jtb.mongodb.net/?retryWrites=true&w=majority",
        secret: 'somewhere!@Behind@!The!@Walls@!Lies!@The@!Great!@Gatsby',
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'http://localhost:3000/api' // production api
    }
}

module.exports = nextConfig
