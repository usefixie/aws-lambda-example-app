# AWS Lambda + Fixie Static IP Example

This is a simple AWS Lambda function that demonstrates how to use Fixie to make HTTP requests from static IP addresses. The function makes requests to httpbin.org through Fixie's proxy to show the static IP address in action.

**Note:** While this example uses AWS SAM for automated deployments and local testing, the Lambda handler code in `src/index.js` is framework-agnostic. You can use it with other deployment frameworks like [Serverless Framework](https://www.serverless.com/), [Terraform](https://www.terraform.io/), [CDK](https://aws.amazon.com/cdk/), or even paste it directly into the AWS Lambda console UI.

## Prerequisites

1. **AWS SAM CLI** - For local testing
   ```bash
   # Install via Homebrew (macOS)
   brew install aws-sam-cli

   # Or via pip
   pip install aws-sam-cli
   ```

2. **Node.js** - Version 18.x or later
   ```bash
   node --version  # Should be v18.x or later
   ```

3. **Fixie Account** - Sign up at [app.usefixie.com/signup](https://app.usefixie.com/signup)

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd ~/Code/aws-lambda-example
cd src
npm install
cd ..
```

### Step 2: Configure Your Fixie URL

Edit `env.json` and replace the placeholder with your actual Fixie URL:

```json
{
  "IpCheckFunction": {
    "FIXIE_URL": "http://fixie:your-actual-token@your-actual-subdomain.usefixie.com:80"
  }
}
```

To get your Fixie URL:
1. Go to [app.usefixie.com](https://app.usefixie.com)
2. Create a new proxy (if you haven't already)
3. Copy your `FIXIE_URL` from the dashboard
4. Paste it into `env.json`

### Step 3: Test Locally with SAM CLI

**Option 1: Invoke the function directly**

```bash
sam local invoke IpCheckFunction --env-vars env.json
```

This will output the Lambda function's response showing your static IP address from httpbin.org.

**Option 2: Start a local API Gateway**

```bash
sam local start-api --env-vars env.json
```

Then in another terminal, make requests to check your static IP:

```bash
curl http://localhost:3000/ip
{
  "message": "Request successful via Fixie static IP",
  "static_ip": "YOUR_FIXIE_IP",
  "proxied_through": "Fixie",
  "note": "The IP address shown is your Fixie static IP",
  "full_response": {
    "origin": "YOUR_FIXIE_IP"
  }
}%
```

### Step 4: Verify Static IP Usage

Check the terminal window where `sam local start-api` is running. You'll see logs showing the Lambda function is using Fixie:

```
Invoking src/index.handler (nodejs18.x)
Lambda function invoked
Using Fixie proxy: your-subdomain.usefixie.com:80
Making request to: https://httpbin.org/ip
Request successful
```

And response for `curl http://localhost:3000/ip` will include one of your Fixie's static IPs

You can also check your Fixie dashboard at [app.usefixie.com](https://app.usefixie.com) to see the request logs and see the traffic going through your static IPs.

## What the Function Does

1. **Reads FIXIE_URL** from environment variables
2. **Parses the proxy credentials** (username, password, host, port)
3. **Makes an HTTPS request** to httpbin.org/ip through the Fixie proxy
4. **Returns the static IP address** that httpbin.org sees (which is Fixie's static IP!)

## Troubleshooting

### "FIXIE_URL environment variable not set"

Make sure you've:
1. Created a Fixie account and proxy
2. Updated `env.json` with your actual Fixie URL
3. Passed the `--env-vars env.json` flag when running `sam local invoke` or `sam local start-api`

### "Error making request"

Check that:
1. Your Fixie URL is correct (including the token)
2. You have an active internet connection
3. Your Fixie account is active and not over quota

### SAM CLI not found

Install AWS SAM CLI:
```bash
brew install aws-sam-cli
```

## Deploying to AWS

To deploy this function to AWS Lambda:

```bash
# Build the function
sam build

# Deploy (first time)
sam deploy --guided

# Subsequent deploys
sam deploy
```

During deployment, you'll be prompted to provide your `FIXIE_URL` as a parameter.

## Support

- Email: team@usefixie.com
- Documentation: [usefixie.com/documentation](https://usefixie.com/documentation)
