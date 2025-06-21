# Fastmail Bridge

A lightweight SMTP bridge service that enables platforms without native SMTP support (like Deno, Cloudflare Workers, and other serverless environments) to send emails through Fastmail.

## Features

- 🚀 Built with Bun and Hono for blazing-fast performance
- 🔒 Secure API key authentication
- 📧 Full email support (text/HTML, attachments, CC/BCC)
- 🐳 Docker support for easy deployment
- 🏥 Health check endpoint for monitoring
- 🔌 RESTful API design

## Prerequisites

Before you begin, ensure you have:

1. A Fastmail account
2. An app-specific password from Fastmail ([Create one here](https://www.fastmail.com/help/guides/app-passwords.html))
3. Either [Bun](https://bun.sh) installed locally or [Docker](https://www.docker.com/)

## Quick Start

### Option 1: Using Bun (Local Development)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fastmail-bridge.git
cd fastmail-bridge
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` with your Fastmail credentials:
```env
SMTP_USER=your-email@fastmail.com
SMTP_PASS=your-app-specific-password
API_KEY=generate-a-secure-api-key-here
```

5. Run the development server:
```bash
bun run dev
```

The server will start on http://localhost:3000

### Option 2: Using Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fastmail-bridge.git
cd fastmail-bridge
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials (see above)

4. Run with Docker Compose:
```bash
docker-compose up -d
```

## Deployment

### Deploy with Docker

1. Build the Docker image:
```bash
docker build -t fastmail-bridge .
```

2. Run the container:
```bash
docker run -d \
  -p 3000:3000 \
  -e SMTP_USER=your-email@fastmail.com \
  -e SMTP_PASS=your-app-password \
  -e API_KEY=your-secure-api-key \
  --name fastmail-bridge \
  fastmail-bridge
```

### Deploy to a VPS

1. SSH into your server
2. Clone the repository
3. Set up environment variables
4. Use Docker Compose or PM2 to run the service
5. Configure a reverse proxy (nginx/Caddy) with SSL

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | Fastmail SMTP server | `smtp.fastmail.com` |
| `SMTP_PORT` | SMTP port | `465` |
| `SMTP_SECURE` | Use TLS | `true` |
| `SMTP_USER` | Your Fastmail email address | Required |
| `SMTP_PASS` | App-specific password | Required |
| `API_KEY` | API authentication key | Required |
| `PORT` | Server port | `3000` |

## API Usage

### Send Email

**Endpoint:** `POST /api/send`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello from Fastmail Bridge",
  "text": "This is a plain text email",
  "html": "<p>This is an <strong>HTML</strong> email</p>",
  "from": "custom-sender@yourdomain.com",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "replyTo": "reply@example.com",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "encoding": "base64"
    }
  ]
}
```

**Required fields:** `to`, `subject`, and either `text` or `html`

**Response:**
```json
{
  "success": true,
  "messageId": "<message-id@fastmail.com>",
  "accepted": ["recipient@example.com"],
  "rejected": []
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy"
}
```

## Example Usage

### Using cURL
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test email from Fastmail Bridge"
  }'
```

### Using JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from JavaScript',
    html: '<p>This email was sent using <strong>Fastmail Bridge</strong></p>',
  }),
});

const result = await response.json();
console.log(result);
```

### Using Deno
```typescript
const response = await fetch('https://your-bridge.com/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Email from Deno',
    text: 'Sent from a Deno application!',
  }),
});
```

## Security Considerations

1. **API Key**: Always use a strong, randomly generated API key
2. **HTTPS**: Deploy behind a reverse proxy with SSL in production
3. **Environment Variables**: Never commit `.env` files to version control
4. **Rate Limiting**: Consider implementing rate limiting for production use
5. **Firewall**: Restrict access to trusted IPs if possible

## Troubleshooting

### SMTP Connection Failed
- Verify your Fastmail credentials
- Ensure you're using an app-specific password, not your account password
- Check that your Fastmail account has SMTP access enabled

### Authentication Errors
- Double-check your API key in the Authorization header
- Ensure the header format is exactly: `Authorization: Bearer YOUR_API_KEY`

### Email Not Sending
- Verify all required fields are present (`to`, `subject`, `text` or `html`)
- Check the server logs for detailed error messages
- Ensure the recipient email address is valid

## Contributing

Pull requests are welcome! Please ensure your code follows the existing style and includes appropriate error handling.

## License

MIT