const axios = require('axios');
const { URL } = require('url');

/**
 * AWS Lambda handler that demonstrates using Fixie for static IP addresses
 * Makes a request to httpbin.org through Fixie proxy to show the static IP
 */
exports.handler = async (event) => {
    console.log('Lambda function invoked');
    console.log('Event:', JSON.stringify(event, null, 2));

    // Check if FIXIE_URL is set
    if (!process.env.FIXIE_URL) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'FIXIE_URL environment variable not set',
                message: 'Please set FIXIE_URL in your environment variables'
            })
        };
    }

    try {
        // Parse the FIXIE_URL
        const fixieUrl = new URL(process.env.FIXIE_URL);
        const proxyAuth = fixieUrl.username + ':' + fixieUrl.password;
        const proxyHost = fixieUrl.hostname;
        const proxyPort = parseInt(fixieUrl.port) || 80;

        console.log(`Using Fixie proxy: ${proxyHost}:${proxyPort}`);

        // Use httpbin.org to demonstrate the static IP
        const apiUrl = 'https://httpbin.org/ip';

        console.log(`Making request to: ${apiUrl}`);

        // Make request through Fixie proxy
        const response = await axios.get(apiUrl, {
            proxy: {
                protocol: 'http',
                host: proxyHost,
                port: proxyPort,
                auth: {
                    username: fixieUrl.username,
                    password: fixieUrl.password
                }
            },
            timeout: 10000
        });

        console.log('Request successful');
        console.log('Response data:', response.data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Request successful via Fixie static IP',
                static_ip: response.data.origin,
                proxied_through: 'Fixie',
                note: 'The IP address shown is your Fixie static IP',
                full_response: response.data
            }, null, 2)
        };

    } catch (error) {
        console.error('Error making request:', error.message);
        console.error('Error details:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to make request',
                message: error.message,
                details: error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : 'No response data'
            }, null, 2)
        };
    }
};
