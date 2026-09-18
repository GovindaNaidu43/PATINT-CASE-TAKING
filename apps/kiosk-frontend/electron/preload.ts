import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('kioskAPI', {
  getKioskId: () => ipcRenderer.invoke('get-kiosk-id'),
  notifyReady: () => ipcRenderer.send('notify-ready'),
  onSessionEnd: (cb: () => void) => ipcRenderer.on('session-end', () => cb()),
});
