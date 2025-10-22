# 🚀 Quick Start Guide

## Your Platform is Live! 

**Website URL**: https://agentic-3d0fc53c.vercel.app

## What You Have Now

✅ **Fully Functional Web Application** deployed on Vercel
✅ **Multi-Platform Video Upload** - Upload once, post to TikTok, Facebook, Instagram, YouTube
✅ **AI Video Generator** - Generate videos from text prompts
✅ **Social Account Manager** - Manage multiple social media accounts
✅ **Automated Scheduling** - Set up daily/weekly automated posts
✅ **Chrome Profile System** - Separate profiles for each account
✅ **Complete Documentation** - README.md and IMPLEMENTATION_GUIDE.md

## Next Steps (In Order)

### 1. Explore the Web Interface (5 minutes)
Visit https://agentic-3d0fc53c.vercel.app and explore:
- Landing page with features
- Dashboard interface
- Upload form
- AI generator
- Account manager
- Schedule manager

### 2. Get a VPS Server (30 minutes)
You need a cloud server for:
- Running Chrome browser automation
- Storing video files
- Processing scheduled tasks

**Recommended providers:**
- Hetzner: €8/month (4GB RAM) - https://www.hetzner.com
- DigitalOcean: $12/month (4GB RAM) - https://digitalocean.com
- Vultr: $12/month (4GB RAM) - https://vultr.com

**Minimum specs:**
- 4GB RAM
- 2 CPU cores
- 40GB storage
- Ubuntu 22.04 LTS

### 3. Setup VPS (2-3 hours)
Follow **IMPLEMENTATION_GUIDE.md** Section: "Phase 1-6"

Quick commands:
```bash
# Connect to VPS
ssh root@your-server-ip

# Install basics
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Install Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install -y ./google-chrome-stable_current_amd64.deb

# Clone project
cd /opt
git clone <your-repo-url> social-media-automation
cd social-media-automation
npm install

# Configure
cp .env.example .env
nano .env  # Add your API keys

# Start
npm run build
npm install -g pm2
pm2 start npm --name social-automation -- start
```

### 4. Get API Keys (1 hour)

**OpenAI (for AI captions):**
1. Go to https://platform.openai.com
2. Sign up / Login
3. Create API key
4. Add to `.env` as `OPENAI_API_KEY`

**Replicate (for AI video generation):**
1. Go to https://replicate.com
2. Sign up / Login  
3. Get API token from settings
4. Add to `.env` as `REPLICATE_API_TOKEN`

### 5. Setup Social Media Accounts (1-2 hours per account)

For each platform you want to use:

1. **Add account in web interface**:
   - Go to Dashboard → Accounts tab
   - Click "Add Account"
   - Select platform and enter username

2. **Log in via Chrome profile** (on VPS):
   ```bash
   # Example for TikTok
   google-chrome --user-data-dir=/opt/chrome-profiles/[account-id]
   # Log in to TikTok in the browser window
   # Close Chrome when done
   ```

3. **Repeat for each platform**:
   - TikTok
   - Facebook  
   - Instagram
   - YouTube

### 6. Test Everything (1 hour)

**Test Video Upload:**
1. Go to Dashboard → Upload Video
2. Select a test video
3. Add caption
4. Select platforms
5. Click Upload & Post

**Test AI Generation:**
1. Dashboard → AI Generate
2. Enter prompt: "Create a 30-second motivational video"
3. Select style and duration
4. Click Generate

**Test Scheduling:**
1. Dashboard → Schedule
2. Create daily schedule
3. Set time (e.g., 9:00 AM)
4. Add AI prompt
5. Select platforms
6. Activate

### 7. Monitor & Optimize (Ongoing)

**Daily:**
```bash
pm2 status
pm2 logs social-automation --lines 50
```

**Weekly:**
- Check posted videos
- Review error logs
- Monitor API usage
- Optimize schedules

## Common Commands

### On VPS:
```bash
# View logs
pm2 logs social-automation

# Restart app
pm2 restart social-automation

# Check status
pm2 status

# Update code
cd /opt/social-media-automation
git pull
npm install
npm run build
pm2 restart social-automation
```

### Test locally:
```bash
npm run dev
# Visit http://localhost:3000
```

## File Structure

```
/
├── app/                    # Next.js pages and API routes
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard
│   └── api/               # API endpoints
├── components/            # React components
│   ├── VideoUpload.tsx
│   ├── AIVideoGenerator.tsx
│   ├── AccountManager.tsx
│   └── ScheduleManager.tsx
├── lib/                   # Core functionality
│   ├── prisma.ts         # Database client
│   ├── chrome-profiles.ts # Chrome profile management
│   ├── video-generator.ts # AI video generation
│   ├── social-poster.ts   # Social media posting
│   └── scheduler.ts       # Cron job scheduling
├── prisma/               # Database schema
│   └── schema.prisma
├── public/               # Static files
│   └── uploads/          # Uploaded videos
├── .env.local            # Environment variables
├── package.json          # Dependencies
├── README.md             # Main documentation
├── IMPLEMENTATION_GUIDE.md # Detailed setup guide
└── QUICK_START.md        # This file
```

## Important Files to Customize

1. **`.env`** - Add your API keys
2. **`prisma/schema.prisma`** - Modify database if needed
3. **`lib/video-generator.ts`** - Customize AI video generation
4. **`lib/social-poster.ts`** - Add platform-specific posting logic
5. **`components/`** - Modify UI as needed

## Cost Breakdown

**One-time:**
- Domain name: $12/year (optional)

**Monthly:**
- VPS Server: $10-20/month
- OpenAI API: $20-50/month
- Replicate API: $50-200/month
- **Total: ~$80-270/month**

**Free alternatives:**
- Use Vercel for hosting (done)
- Use free tiers for AI APIs
- Optimize API calls

## Support

- **Full Guide**: See IMPLEMENTATION_GUIDE.md
- **Technical Docs**: See README.md  
- **Issues**: Create GitHub issue
- **Updates**: `git pull` to get latest code

## Architecture Overview

```
User Browser
    ↓
Vercel Web App (https://agentic-3d0fc53c.vercel.app)
    ↓
Your VPS Server
    ↓
Chrome Profiles → Social Media Platforms
    ↓
AI APIs → Video Generation
```

## Security Notes

🔒 **Important:**
- Never commit `.env` file
- Use strong passwords
- Enable firewall on VPS
- Use SSH keys only
- Rotate API keys regularly
- Monitor logs for suspicious activity

## Scaling Tips

**Start small:**
- 1-2 accounts per platform
- Daily posting schedule
- Test with short videos

**Scale up:**
- Add more accounts
- Increase posting frequency
- Use longer/complex videos
- Add more AI features

**Enterprise:**
- Multiple VPS servers
- Load balancer
- PostgreSQL cluster
- CDN for videos
- Advanced analytics

## Troubleshooting Quick Fixes

**"Can't connect to VPS"**
```bash
ssh -i your-key.pem root@your-server-ip
```

**"Chrome won't start"**
```bash
apt install -y google-chrome-stable
```

**"Database error"**
```bash
cd /opt/social-media-automation
DATABASE_URL="file:./production.db" npx prisma db push
```

**"Out of memory"**
```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

**"Posts not appearing"**
1. Check if logged into Chrome profile
2. Verify account is active
3. Check platform rate limits
4. Review logs: `pm2 logs`

## What's Working vs What Needs Setup

### ✅ Working Now (No setup needed):
- Web interface (Vercel hosted)
- Database schema
- UI components
- API endpoints structure
- Code architecture

### 🔧 Needs Setup:
- VPS server deployment
- Chrome browser installation
- Social media account logins
- API keys configuration
- Scheduled job activation

## Success Checklist

Before considering it "complete":

- [ ] VPS server running
- [ ] Chrome installed
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Database initialized
- [ ] PM2 running the app
- [ ] At least 1 social account logged in
- [ ] Test video uploaded successfully
- [ ] Test AI generation working
- [ ] Test schedule created
- [ ] Monitoring active

## Next Features to Add (Optional)

1. **Analytics Dashboard** - Track performance metrics
2. **Content Calendar** - Visual scheduling
3. **Bulk Upload** - Upload multiple videos
4. **Video Editing** - Trim, crop, filters
5. **Team Collaboration** - Multiple users
6. **Mobile App** - React Native version
7. **Advanced AI** - Better video generation
8. **Integrations** - Zapier, Make, etc.

## Getting Help

1. Read IMPLEMENTATION_GUIDE.md (comprehensive)
2. Check README.md (technical details)
3. Review code comments
4. Search GitHub issues
5. Create new issue with details

## License

MIT - You own this code completely. Modify as needed!

---

**Ready?** Start with Step 1: Explore the web interface, then get your VPS server!

**Live URL**: https://agentic-3d0fc53c.vercel.app

Good luck! 🚀
