# Social Media Automation Platform - Complete Implementation Guide

## 🎯 Overview

Your web application is now live at: **https://agentic-3d0fc53c.vercel.app**

This is a comprehensive social media automation platform that allows you to:
1. Upload videos once and post to multiple platforms (TikTok, Facebook, Instagram, YouTube)
2. Generate videos automatically using AI
3. Schedule automated posting with daily/weekly frequency
4. Manage separate Chrome profiles for each social media account
5. Automate content creation and distribution

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 + React 18 + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM + SQLite (production-ready for PostgreSQL)
- **AI**: OpenAI GPT-4 + Replicate API
- **Automation**: Puppeteer + Node-cron
- **Hosting**: Vercel (web) + VPS/Cloud (for automation)

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Web Application                        │
│              (Hosted on Vercel - Live Now)                  │
│  - Video Upload Interface                                   │
│  - AI Video Generator                                       │
│  - Account Manager                                          │
│  - Schedule Manager                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   VPS/Cloud Server                          │
│              (You need to set this up)                      │
│  - Chrome/Chromium Browser                                  │
│  - Chrome Profiles (one per social account)                 │
│  - Puppeteer Automation Scripts                             │
│  - Cron Jobs for Scheduling                                 │
│  - Video Storage & Processing                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Social Media Platforms                         │
│    TikTok | Facebook | Instagram | YouTube                 │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Step-by-Step Implementation Plan

### Phase 1: Initial Setup (Day 1)

#### 1.1 Get a VPS/Cloud Server
**Recommended Providers:**
- **DigitalOcean**: $12/month (4GB RAM, 2 vCPUs)
- **Vultr**: $12/month (4GB RAM, 2 vCPUs)
- **Linode/Akamai**: $12/month (4GB RAM, 2 vCPUs)
- **AWS Lightsail**: $10/month (2GB RAM, 1 vCPU)
- **Hetzner**: €8/month (4GB RAM, 2 vCPUs) - Best value

**Minimum Requirements:**
- 4GB RAM (for Chrome instances)
- 2 CPU cores
- 40GB SSD storage
- Ubuntu 22.04 LTS

#### 1.2 Connect to Your Server
```bash
ssh root@your-server-ip
```

#### 1.3 Initial Server Setup
```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y git curl wget build-essential

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installations
node --version  # Should show v20.x
npm --version   # Should show v10.x
```

### Phase 2: Install Chrome and Dependencies (Day 1)

#### 2.1 Install Google Chrome
```bash
# Download Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# Install Chrome
apt install -y ./google-chrome-stable_current_amd64.deb

# Verify installation
google-chrome --version
```

#### 2.2 Install Chrome Dependencies
```bash
# Install required libraries for Chrome automation
apt install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2 \
  libxrandr2 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libcups2 \
  libpangocairo-1.0-0 \
  libcairo2 \
  libgdk-pixbuf2.0-0 \
  libgtk-3-0
```

### Phase 3: Deploy Application to VPS (Day 1-2)

#### 3.1 Clone Your Repository
```bash
cd /opt
git clone <your-repo-url> social-media-automation
cd social-media-automation
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Configure Environment Variables
```bash
# Create production environment file
nano .env

# Add the following (replace with your actual keys):
DATABASE_URL="file:/opt/social-media-automation/production.db"
NEXT_PUBLIC_APP_URL=https://agentic-3d0fc53c.vercel.app

# AI API Keys
OPENAI_API_KEY=sk-your-openai-key-here
REPLICATE_API_TOKEN=r8_your-replicate-token-here

# Chrome Profiles Path
CHROME_PROFILES_PATH=/opt/chrome-profiles

# Optional: Clerk Authentication (if you add user auth later)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
```

#### 3.4 Initialize Database
```bash
npx prisma generate
npx prisma db push
```

#### 3.5 Build Application
```bash
npm run build
```

### Phase 4: Setup Process Management (Day 2)

#### 4.1 Install PM2
```bash
npm install -g pm2
```

#### 4.2 Create PM2 Ecosystem File
```bash
cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [{
    name: 'social-automation',
    script: 'npm',
    args: 'start',
    cwd: '/opt/social-media-automation',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOFPM2
```

#### 4.3 Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4.4 Verify Application is Running
```bash
pm2 status
pm2 logs social-automation
```

### Phase 5: Setup Nginx Reverse Proxy (Day 2)

#### 5.1 Install Nginx
```bash
apt install -y nginx
```

#### 5.2 Configure Nginx
```bash
cat > /etc/nginx/sites-available/social-automation << 'EOFNGINX'
server {
    listen 80;
    server_name your-domain.com;  # Change this to your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOFNGINX

# Enable the site
ln -s /etc/nginx/sites-available/social-automation /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### 5.3 Setup SSL with Let's Encrypt (Optional but Recommended)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

### Phase 6: Configure Chrome Profiles (Day 2-3)

#### 6.1 Create Chrome Profiles Directory
```bash
mkdir -p /opt/chrome-profiles
chmod 755 /opt/chrome-profiles
```

#### 6.2 Add Social Media Accounts

**Via Web Interface:**
1. Go to https://agentic-3d0fc53c.vercel.app/dashboard
2. Click "Accounts" tab
3. Add each social media account:
   - Platform: Select (TikTok/Facebook/Instagram/YouTube)
   - Account Name: Your account username
   - Click "Add Account"

#### 6.3 Manual Chrome Profile Setup

For each social account, you'll need to log in once:

```bash
# Run Chrome with specific profile
google-chrome --user-data-dir=/opt/chrome-profiles/[account-id] --no-first-run

# In the Chrome window that opens:
# 1. Navigate to the social platform
# 2. Log in with your account
# 3. Complete any 2FA verification
# 4. Close Chrome
```

**Example for TikTok:**
```bash
google-chrome \
  --user-data-dir=/opt/chrome-profiles/tiktok-myaccount \
  --no-first-run \
  https://www.tiktok.com/login
```

### Phase 7: Setup Automated Video Generation (Day 3-4)

#### 7.1 Get AI API Keys

**OpenAI API (Required for Video Caption/Script Generation):**
1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Add to `.env` file as `OPENAI_API_KEY`

**Replicate API (For AI Video Generation):**
1. Go to https://replicate.com
2. Sign up or log in
3. Go to Account Settings → API Tokens
4. Copy your token
5. Add to `.env` file as `REPLICATE_API_TOKEN`

**Alternative Video Generation APIs:**
- **Runway ML**: https://runwayml.com (High quality, $12-95/month)
- **Synthesia**: https://synthesia.io (AI avatars, $22+/month)
- **D-ID**: https://www.d-id.com (Talking heads, $5.9+/month)
- **Pictory**: https://pictory.ai (Text to video, $19+/month)

#### 7.2 Test AI Video Generation
```bash
# Via web interface
# 1. Go to https://agentic-3d0fc53c.vercel.app/dashboard
# 2. Click "AI Generate" tab
# 3. Enter a prompt like:
#    "Create a 30-second motivational video about morning routines 
#     with energetic music and inspiring visuals"
# 4. Select style and duration
# 5. Click "Generate Video"
```

### Phase 8: Setup Automated Scheduling (Day 4-5)

#### 8.1 Create Automated Schedule

**Via Web Interface:**
1. Go to https://agentic-3d0fc53c.vercel.app/dashboard
2. Click "Schedule" tab
3. Click "Add Schedule"
4. Fill in:
   - Schedule Name: "Daily Morning Post"
   - Frequency: Daily
   - Time: 09:00
   - AI Prompt: "Create engaging content about [your niche]"
   - Select target platforms
5. Click "Create Schedule"

#### 8.2 Scheduler Configuration

The scheduler runs as part of your Node.js application and:
- Executes at scheduled times
- Generates videos using AI (if prompt provided)
- Posts to all selected platforms
- Logs all activities

#### 8.3 Monitor Scheduled Jobs
```bash
# View PM2 logs
pm2 logs social-automation

# View specific date logs
pm2 logs social-automation --lines 100
```

### Phase 9: Production Optimization (Day 5-7)

#### 9.1 Setup Database Backup
```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOFBACKUP'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /opt/social-media-automation/production.db $BACKUP_DIR/db_backup_$DATE.db
# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.db" -mtime +7 -delete
EOFBACKUP

chmod +x /opt/backup-db.sh

# Add to crontab (daily at 3 AM)
crontab -e
# Add line: 0 3 * * * /opt/backup-db.sh
```

#### 9.2 Upgrade to PostgreSQL (Recommended for Production)

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE social_automation;
CREATE USER automation_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE social_automation TO automation_user;
\q

# Update .env
# DATABASE_URL="postgresql://automation_user:secure_password@localhost:5432/social_automation"

# Migrate database
npx prisma db push
```

#### 9.3 Setup Monitoring

**Install Monitoring Tools:**
```bash
# Install htop for system monitoring
apt install -y htop

# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor Chrome processes
ps aux | grep chrome
```

**Setup Error Logging:**
```bash
# Create log directory
mkdir -p /var/log/social-automation

# Update PM2 config to log errors
pm2 restart social-automation --log /var/log/social-automation/app.log
```

#### 9.4 Setup Alerting (Optional)

Use services like:
- **Sentry** (https://sentry.io) - Error tracking
- **UptimeRobot** (https://uptimerobot.com) - Uptime monitoring
- **LogDNA** (https://logdna.com) - Log management

### Phase 10: Production Social Media API Integration (Day 7-14)

The current implementation uses browser automation (Puppeteer). For production scale, integrate official APIs:

#### 10.1 TikTok API
```bash
# Apply for TikTok API access
# https://developers.tiktok.com/
# Wait 2-7 days for approval

# Once approved, add to .env:
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
```

#### 10.2 Facebook/Instagram API
```bash
# Create Facebook App
# https://developers.facebook.com/
# Get Page Access Token

# Add to .env:
FACEBOOK_ACCESS_TOKEN=your_page_access_token
FACEBOOK_PAGE_ID=your_page_id
```

#### 10.3 YouTube API
```bash
# Enable YouTube Data API v3
# https://console.cloud.google.com/
# Create OAuth 2.0 credentials

# Add to .env:
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
```

## 🚀 Usage Instructions

### Upload and Post Videos

1. **Go to Dashboard**: https://agentic-3d0fc53c.vercel.app/dashboard
2. **Click "Upload Video"**
3. **Select video file** (MP4, MOV, AVI up to 500MB)
4. **Write caption** with hashtags
5. **Select platforms** (TikTok, Facebook, Instagram, YouTube)
6. **Click "Upload & Post"**

The system will:
- Upload video to server
- Create posts for each platform
- Queue for automatic posting
- Use Chrome profiles to post

### Generate Videos with AI

1. **Click "AI Generate" tab**
2. **Enter detailed prompt**:
   ```
   Example: "Create a 30-second video about healthy breakfast ideas. 
   Show colorful fruits, smoothie bowls, and avocado toast. 
   Use upbeat music and text overlay with quick tips. 
   Target audience: fitness enthusiasts aged 25-35."
   ```
3. **Select style**: Professional/Casual/Energetic/Minimal
4. **Choose duration**: 15s/30s/60s
5. **Click "Generate Video"**
6. Wait 2-5 minutes for generation
7. Video will appear in your uploads

### Setup Automated Posting

1. **Click "Schedule" tab**
2. **Click "Add Schedule"**
3. **Configure**:
   - Name: "Daily Fitness Tips"
   - Frequency: Daily
   - Time: 8:00 AM
   - AI Prompt: "Create fitness motivation video"
   - Platforms: Select all
4. **Activate schedule**

The system will:
- Generate video at scheduled time
- Create captions automatically
- Post to all platforms
- Log all activities

## 📊 Monitoring and Maintenance

### Daily Checks
```bash
# Check application status
pm2 status

# View recent logs
pm2 logs social-automation --lines 50

# Check disk space
df -h

# Check Chrome processes
ps aux | grep chrome | wc -l
```

### Weekly Maintenance
```bash
# Update system packages
apt update && apt upgrade -y

# Restart application
pm2 restart social-automation

# Clear old Chrome cache
rm -rf /opt/chrome-profiles/*/Cache/*
rm -rf /opt/chrome-profiles/*/Code\ Cache/*

# Check database size
ls -lh /opt/social-media-automation/production.db
```

### Monthly Tasks
- Review API usage and costs
- Check storage usage
- Update dependencies: `npm update`
- Review and optimize schedules
- Analyze posting performance

## 🔐 Security Best Practices

1. **Use Strong Passwords**
   - SSH key authentication only
   - Disable root login
   - Use fail2ban for brute force protection

2. **Firewall Configuration**
```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

3. **Environment Variables**
   - Never commit `.env` to git
   - Use encrypted environment variables
   - Rotate API keys regularly

4. **Database Security**
   - Use PostgreSQL with strong password
   - Regular backups
   - Encrypt sensitive data

5. **Chrome Profile Security**
   - Restrict directory permissions
   - Use separate profiles per account
   - Monitor for suspicious activity

## 💰 Cost Estimation

### Monthly Costs

**Infrastructure:**
- VPS/Cloud Server: $10-20/month
- Domain Name: $12/year (~$1/month)
- SSL Certificate: Free (Let's Encrypt)

**APIs:**
- OpenAI (GPT-4): $0.03/1K tokens (~$20-50/month for captions)
- Replicate (Video Gen): ~$50-200/month depending on volume
- Alternative: Runway ML: $12-95/month

**Total Monthly Cost: $80-270/month**

**Cost Optimization:**
- Use cheaper AI models (GPT-3.5)
- Generate videos in batches
- Use free tiers where available
- Optimize API calls

## 🐛 Troubleshooting

### Issue: Chrome won't start
```bash
# Check Chrome installation
google-chrome --version

# Install missing dependencies
apt install -y $(apt-cache depends google-chrome-stable | grep Depends | sed "s/.*ends:\ //" | tr '\n' ' ')

# Check permissions
chmod +x /usr/bin/google-chrome
```

### Issue: Puppeteer errors
```bash
# Install Puppeteer dependencies
npx puppeteer browsers install chrome

# Or use system Chrome
npm config set puppeteer_skip_chromium_download true
```

### Issue: Database locked
```bash
# Close any connections
pm2 restart social-automation

# Check database
sqlite3 production.db
# Run: PRAGMA integrity_check;
# Run: .quit
```

### Issue: Out of memory
```bash
# Check memory usage
free -h

# Increase swap space
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Issue: Posts not appearing
1. Check Chrome profile is logged in
2. Verify account is active
3. Check platform rate limits
4. Review error logs: `pm2 logs`

## 📈 Scaling Considerations

### When You Outgrow Single Server

**Option 1: Vertical Scaling**
- Upgrade to 8GB RAM server
- Add more CPU cores
- Increase storage

**Option 2: Horizontal Scaling**
```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌──▼──┐
│ Web │  │ Web │
│ App │  │ App │
└──┬──┘  └──┬──┘
   │        │
   └───┬────┘
       │
   ┌───▼────────┐
   │ PostgreSQL │
   │  Database  │
   └───┬────────┘
       │
   ┌───▼────────┐
   │ Job Queue  │
   │  (Redis)   │
   └────────────┘
```

**Option 3: Microservices**
- Web API (Vercel)
- Video Generator Service (Cloud Function)
- Posting Service (VPS)
- Queue Manager (Redis/BullMQ)
- Storage (S3/Cloudinary)

## 🎓 Advanced Features to Add

1. **Analytics Dashboard**
   - Track post performance
   - View engagement metrics
   - Monitor reach and impressions

2. **Content Calendar**
   - Visual scheduling
   - Drag-and-drop interface
   - Bulk operations

3. **Team Collaboration**
   - Multi-user support
   - Role-based access
   - Approval workflows

4. **Advanced AI**
   - Hashtag suggestions
   - Best time to post
   - Content recommendations
   - Trend analysis

5. **Mobile App**
   - React Native app
   - Push notifications
   - On-the-go posting

## 📞 Support and Resources

### Official Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://prisma.io/docs
- Puppeteer: https://pptr.dev

### Community
- GitHub Issues: [Your repo]/issues
- Discord: [Your server]
- Email: support@yourdomain.com

### Useful Tools
- Chrome DevTools
- PM2 Web Interface: `pm2 web`
- Prisma Studio: `npx prisma studio`

## ✅ Launch Checklist

### Before Going Live:

- [ ] VPS server provisioned and configured
- [ ] Chrome installed with all dependencies
- [ ] Application deployed and running
- [ ] Database initialized and backed up
- [ ] Nginx configured with SSL
- [ ] PM2 process manager setup
- [ ] Chrome profiles created for each account
- [ ] Logged into all social media accounts
- [ ] API keys configured and tested
- [ ] Test video upload successful
- [ ] Test AI generation working
- [ ] Test scheduled post working
- [ ] Monitoring and alerting setup
- [ ] Backup system configured
- [ ] Security measures implemented
- [ ] Documentation reviewed
- [ ] Team trained on usage

## 🎉 Congratulations!

Your social media automation platform is ready to use. Start small, test thoroughly, and scale gradually.

**Live Application**: https://agentic-3d0fc53c.vercel.app

For support or questions, refer to the README.md or create an issue in your repository.
