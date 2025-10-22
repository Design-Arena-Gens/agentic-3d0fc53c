import { CronJob } from 'cron';
import { prisma } from './prisma';
import { aiVideoGenerator } from './video-generator';
import { socialMediaPoster } from './social-poster';
import path from 'path';
import fs from 'fs/promises';

export class VideoScheduler {
  private jobs: Map<string, CronJob> = new Map();

  async initializeSchedules() {
    const schedules = await prisma.schedule.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    for (const schedule of schedules) {
      await this.createJob(schedule);
    }
  }

  async createJob(schedule: any) {
    try {
      // Parse cron expression
      const cronTime = this.getCronExpression(schedule);

      const job = new CronJob(cronTime, async () => {
        await this.executeSchedule(schedule);
      });

      this.jobs.set(schedule.id, job);
      job.start();

      console.log(`Schedule ${schedule.id} created with cron: ${cronTime}`);
    } catch (error) {
      console.error(`Error creating job for schedule ${schedule.id}:`, error);
    }
  }

  private getCronExpression(schedule: any): string {
    const [hour, minute] = schedule.time.split(':');

    if (schedule.frequency === 'daily') {
      return `${minute} ${hour} * * *`;
    } else if (schedule.frequency === 'weekly') {
      const days = JSON.parse(schedule.days || '[]').join(',');
      return `${minute} ${hour} * * ${days}`;
    }

    return schedule.frequency; // Custom cron expression
  }

  async executeSchedule(schedule: any) {
    try {
      console.log(`Executing schedule ${schedule.id}`);

      const platforms = JSON.parse(schedule.platforms || '[]');

      // Get social accounts
      const accounts = await prisma.socialAccount.findMany({
        where: {
          userId: schedule.userId,
          id: { in: platforms },
          isActive: true,
        },
      });

      if (accounts.length === 0) {
        console.log('No active accounts found for schedule');
        return;
      }

      // Generate AI video if prompt is provided
      let videoPath: string;

      if (schedule.aiPrompt) {
        const videoUrl = await aiVideoGenerator.generateVideo({
          prompt: schedule.aiPrompt,
        });

        const fileName = `ai-${Date.now()}.mp4`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        videoPath = path.join(uploadDir, fileName);
        await aiVideoGenerator.downloadVideo(videoUrl, videoPath);

        // Create video record
        const video = await prisma.video.create({
          data: {
            userId: schedule.userId,
            fileName,
            filePath: videoPath,
            fileSize: 0,
            status: 'ready',
            aiGenerated: true,
            prompt: schedule.aiPrompt,
          },
        });

        // Generate caption
        const caption = await aiVideoGenerator.generateCaption(schedule.aiPrompt);

        // Post to all platforms
        for (const account of accounts) {
          await prisma.post.create({
            data: {
              videoId: video.id,
              accountId: account.id,
              caption,
              scheduledFor: new Date(),
              status: 'pending',
            },
          });

          // Post video
          try {
            await socialMediaPoster.post({
              videoPath,
              caption,
              accountId: account.id,
              platform: account.platform as any,
            });

            await prisma.post.updateMany({
              where: {
                videoId: video.id,
                accountId: account.id,
                status: 'pending',
              },
              data: {
                status: 'posted',
                postedAt: new Date(),
              },
            });
          } catch (error) {
            console.error(`Error posting to ${account.platform}:`, error);

            await prisma.post.updateMany({
              where: {
                videoId: video.id,
                accountId: account.id,
                status: 'pending',
              },
              data: {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
              },
            });
          }
        }
      }

      console.log(`Schedule ${schedule.id} executed successfully`);
    } catch (error) {
      console.error(`Error executing schedule ${schedule.id}:`, error);
    }
  }

  async removeJob(scheduleId: string) {
    const job = this.jobs.get(scheduleId);
    if (job) {
      job.stop();
      this.jobs.delete(scheduleId);
    }
  }

  async updateJob(schedule: any) {
    await this.removeJob(schedule.id);
    await this.createJob(schedule);
  }
}

export const videoScheduler = new VideoScheduler();
