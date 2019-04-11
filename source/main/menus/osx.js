// @flow
import type { App, BrowserWindow } from 'electron';
import { dialog } from 'electron';
import { compact } from 'lodash';
import type { MenuActions } from './MenuActions.types';
import { getTranslation } from '../utils/getTranslation';

const id = 'menu';

export const osxMenu = (
  app: App,
  window: BrowserWindow,
  actions: MenuActions,
  isInSafeMode: boolean,
  translations: {},
  translation: Function = getTranslation(translations, id)
) => [
  {
    label: translation('daedalus'),
    submenu: compact([
      {
        label: translation('daedalus.about'),
        click() {
          actions.openAbout();
        },
      },
      {
        label: translation('daedalus.adaRedemption'),
        click() {
          actions.goToAdaRedemption();
        },
      },
      {
        label: translation('daedalus.blockConsolidationStatus'),
        accelerator: 'Command+B',
        click() {
          actions.goBlockConsolidationStatus();
        },
      },
      {
        label: translation('daedalus.networkStatus'),
        accelerator: 'Command+S',
        click() {
          actions.openNetworkStatus();
        },
      },
      {
        label: translation('daedalus.quit'),
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      },
    ]),
  },
  {
    label: translation('edit'),
    submenu: [
      {
        label: translation('edit.undo'),
        accelerator: 'Command+Z',
        role: 'undo',
      },
      {
        label: translation('edit.redo'),
        accelerator: 'Shift+Command+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: translation('edit.cut'),
        accelerator: 'Command+X',
        role: 'cut',
      },
      {
        label: translation('edit.copy'),
        accelerator: 'Command+C',
        role: 'copy',
      },
      {
        label: translation('edit.paste'),
        accelerator: 'Command+V',
        role: 'paste',
      },
      {
        label: translation('edit.selectAll'),
        accelerator: 'Command+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: translation('view'),
    submenu: [
      {
        label: translation('view.reload'),
        accelerator: 'Command+R',
        click: () => window.webContents.reload(),
      },
      {
        label: translation('view.toggleFullScreen'),
        accelerator: 'Ctrl+Command+F',
        click: () => window.setFullScreen(!window.isFullScreen()),
      },
      {
        label: translation('view.toggleDeveloperTools'),
        accelerator: 'Alt+Command+I',
        click: () => window.toggleDevTools(),
      },
    ],
  },
  {
    label: translation('helpSupport'),
    submenu: compact([
      {
        label: translation('helpSupport.gpuSafeMode'),
        type: 'checkbox',
        checked: isInSafeMode,
        click(item) {
          const gpuSafeModeDialogOptions = {
            buttons: [
              translation('helpSupport.gpuSafeModeDialogConfirm'),
              translation('helpSupport.gpuSafeModeDialogCancel'),
            ],
            title: isInSafeMode
              ? translation('helpSupport.gpuSafeModeDialogTitle')
              : translation('helpSupport.nonGpuSafeModeDialogTitle'),
            message: isInSafeMode
              ? translation('helpSupport.gpuSafeModeDialogMessage')
              : translation('helpSupport.nonGpuSafeModeDialogMessage'),
          };
          dialog.showMessageBox(gpuSafeModeDialogOptions, buttonId => {
            if (buttonId === 0) {
              if (isInSafeMode) {
                actions.restartWithoutSafeMode();
              } else {
                actions.restartInSafeMode();
              }
            } else {
              item.checked = false;
            }
          });
        },
      },
      {
        label: translation('helpSupport.downloadLogs'),
        click() {},
      },
      {
        label: translation('helpSupport.supportRequest'),
        click() {},
      },
      {
        label: translation('helpSupport.knownIssues'),
        click() {},
      },
    ]),
  },
];
