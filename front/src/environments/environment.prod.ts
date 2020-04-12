// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {roles} from './security';

export const environment = {
  production: true,
  fake_api:   false,
  debug:      false,
  partner:    false,
  url_api:    'https://backend.ytseries.com',
  roles:      [roles.user],
};

