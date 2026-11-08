import { LocalNotifications } from '@capacitor/local-notifications';
import { DeviceService } from './deviceService';

export class NotificationService {
  private static permissionChecked = false;
  private static hasPermission = false;

  private static async ensurePermission(): Promise<boolean> {
    if (!DeviceService.isNative()) return false;
    if (this.permissionChecked) return this.hasPermission;

    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') {
        this.hasPermission = true;
      } else if (status.display === 'prompt') {
        const req = await LocalNotifications.requestPermissions();
        this.hasPermission = req.display === 'granted';
      } else {
        this.hasPermission = false;
      }
    } catch (err) {
      this.hasPermission = false;
    }

    this.permissionChecked = true;
    return this.hasPermission;
  }

  public static async notifyDownloadCompleted(title: string, resolution: string, localPath: string): Promise<void> {
    const permitted = await this.ensurePermission();
    if (!permitted) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Movie Download Complete',
            body: `${title} (${resolution}) is ready for offline playback.`,
            id: Math.floor(Date.now() % 100000),
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'beep.wav',
            attachments: undefined,
            extra: { path: localPath },
          },
        ],
      });
    } catch (err) {
      console.warn('[NotificationService] Local notification dispatch error:', err);
    }
  }

  public static async notifyDownloadFailed(title: string, reason: string): Promise<void> {
    const permitted = await this.ensurePermission();
    if (!permitted) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Download Failed',
            body: `Failed to download ${title}: ${reason}`,
            id: Math.floor(Date.now() % 100000),
            schedule: { at: new Date(Date.now() + 100) },
          },
        ],
      });
    } catch (err) {
      console.warn('[NotificationService] Notification error:', err);
    }
  }

  public static async notifyDownloadCancelled(title: string): Promise<void> {
    const permitted = await this.ensurePermission();
    if (!permitted) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Download Cancelled',
            body: `Download for ${title} was cancelled.`,
            id: Math.floor(Date.now() % 100000),
            schedule: { at: new Date(Date.now() + 100) },
          },
        ],
      });
    } catch (err) {
      console.warn('[NotificationService] Notification error:', err);
    }
  }
}
