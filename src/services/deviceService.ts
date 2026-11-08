import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';

export interface DeviceInfo {
  isNative: boolean;
  platform: 'android' | 'ios' | 'web';
  isAndroid: boolean;
  isOnline: boolean;
  storageTarget: string;
}

export class DeviceService {
  public static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  public static getPlatform(): 'android' | 'ios' | 'web' {
    const platform = Capacitor.getPlatform();
    if (platform === 'android') return 'android';
    if (platform === 'ios') return 'ios';
    return 'web';
  }

  public static isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  public static async getNetworkStatus(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch {
      return navigator.onLine;
    }
  }

  public static async checkStoragePermission(): Promise<boolean> {
    if (!this.isNative()) return true;
    try {
      const perm = await Filesystem.checkPermissions();
      if (perm.publicStorage === 'granted') return true;
      const request = await Filesystem.requestPermissions();
      return request.publicStorage === 'granted';
    } catch {
      return false;
    }
  }

  public static getStoragePath(fileName: string): string {
    if (this.isAndroid()) {
      return `/storage/emulated/0/Movies/JTEC/${fileName}`;
    }
    return `local://movies/jtec/${fileName}`;
  }
}
