import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ChromeProfileManager {
  private basePath: string;

  constructor() {
    this.basePath = process.env.CHROME_PROFILES_PATH || '/tmp/chrome-profiles';
  }

  async initializeBasePath() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('Error creating chrome profiles directory:', error);
    }
  }

  getProfilePath(accountId: string): string {
    return path.join(this.basePath, accountId);
  }

  async createProfile(accountId: string): Promise<string> {
    await this.initializeBasePath();
    const profilePath = this.getProfilePath(accountId);

    try {
      await fs.mkdir(profilePath, { recursive: true });
      return profilePath;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async deleteProfile(accountId: string): Promise<void> {
    const profilePath = this.getProfilePath(accountId);

    try {
      await fs.rm(profilePath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  async profileExists(accountId: string): Promise<boolean> {
    const profilePath = this.getProfilePath(accountId);

    try {
      await fs.access(profilePath);
      return true;
    } catch {
      return false;
    }
  }

  async listProfiles(): Promise<string[]> {
    try {
      await this.initializeBasePath();
      const files = await fs.readdir(this.basePath);
      return files;
    } catch {
      return [];
    }
  }
}

export const chromeProfileManager = new ChromeProfileManager();
