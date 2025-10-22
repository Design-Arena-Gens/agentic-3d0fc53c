# Social Media Automation Platform

A comprehensive web application for automating video uploads across multiple social media platforms (TikTok, Facebook, Instagram, YouTube) with AI-powered video generation and intelligent scheduling.

## Features

### 🎥 Multi-Platform Video Upload
- Upload once, post everywhere
- Support for TikTok, Facebook, Instagram, and YouTube
- Bulk posting with custom captions

### 🤖 AI Video Generation
- Generate videos from text prompts using AI
- Multiple style options (Professional, Casual, Energetic, Minimal)
- Customizable video duration
- Automatic caption generation

### 📅 Smart Scheduling
- Daily or weekly automated posting
- Custom time scheduling for optimal engagement
- AI-powered content generation on schedule
- Platform-specific configurations

### 🔐 Chrome Profile Management
- Separate Chrome profiles for each social account
- Secure session management
- Persistent login across automation runs

## Technology Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **AI Integration**: OpenAI GPT-4, Replicate API
- **Automation**: Puppeteer, Node-cron
- **Deployment**: Vercel

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env.local`):
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_key
CHROME_PROFILES_PATH=/path/to/chrome-profiles
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment to VPS/Cloud

### Prerequisites
- Node.js 18+ installed
- Chrome/Chromium browser installed
- PM2 for process management (optional but recommended)

### Setup Steps

1. **Install Chrome on your VPS:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y chromium-browser

# Or install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f
```

2. **Clone and setup the application:**
```bash
git clone <your-repo>
cd social-media-automation
npm install
npm run build
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual values
nano .env
```

4. **Initialize database:**
```bash
npx prisma generate
npx prisma db push
```

5. **Run with PM2:**
```bash
npm install -g pm2
pm2 start npm --name "social-automation" -- start
pm2 save
pm2 startup
```

6. **Set up Nginx reverse proxy (optional):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Usage Guide

### 1. Upload Videos
- Navigate to the Dashboard
- Click "Upload Video" tab
- Select your video file
- Add caption
- Choose target platforms
- Click "Upload & Post"

### 2. AI Video Generation
- Click "AI Generate" tab
- Enter detailed video prompt
- Select video style
- Choose duration
- Click "Generate Video"

### 3. Manage Social Accounts
- Click "Accounts" tab
- Add new accounts for each platform
- Each account gets a separate Chrome profile
- Activate/deactivate accounts as needed

### 4. Set Up Schedules
- Click "Schedule" tab
- Create new schedule
- Set frequency (daily/weekly) and time
- Optionally add AI prompt for automatic video generation
- Select target platforms

## Chrome Profile Setup

1. Add a social account in the Accounts section
2. The system creates a dedicated Chrome profile
3. You'll need to manually log in to the social media platform once
4. After login, the session is saved in the Chrome profile
5. Future automation runs will use the saved session

## API Keys Required

### OpenAI (for AI video generation)
- Sign up at https://platform.openai.com
- Create an API key
- Add to `.env` as `OPENAI_API_KEY`

### Replicate (for AI video generation)
- Sign up at https://replicate.com
- Get your API token
- Add to `.env` as `REPLICATE_API_TOKEN`

## Production Considerations

### Security
- Use environment variables for all secrets
- Implement proper authentication (currently using demo mode)
- Encrypt stored credentials
- Use HTTPS in production

### Scaling
- Upgrade to PostgreSQL for production
- Implement job queues (Bull, BullMQ) for video processing
- Use cloud storage (S3, Cloudinary) for video files
- Consider microservices architecture for high volume

### Social Media APIs
The current implementation uses browser automation. For production, consider:
- **TikTok**: TikTok API for Business
- **Facebook**: Facebook Graph API
- **Instagram**: Instagram Graph API (requires Business account)
- **YouTube**: YouTube Data API v3

### Monitoring
- Set up error tracking (Sentry)
- Monitor cron jobs
- Track API usage and rate limits
- Set up alerts for failed posts

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
