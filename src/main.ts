import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { usePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

usePreset(Lara);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
