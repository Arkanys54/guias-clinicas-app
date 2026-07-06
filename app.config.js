const fs = require('fs');
const path = require('path');

const appJson = require('./app.json');

const GOOGLE_SERVICES_FILENAME = 'google-services.json';
const GOOGLE_SERVICES_FILE_RELATIVE_PATH = `./${GOOGLE_SERVICES_FILENAME}`;
const NOTIFICATION_ICON_PATH = './assets/images/android-icon-monochrome.png';

module.exports = () => {
  const config = JSON.parse(JSON.stringify(appJson.expo));
  const googleServicesFilePath = path.join(__dirname, GOOGLE_SERVICES_FILENAME);
  const hasGoogleServicesFile = fs.existsSync(googleServicesFilePath);

  config.plugins = [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: NOTIFICATION_ICON_PATH,
        color: '#0C4DA2',
        defaultChannel: 'alertas-clinicas',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
  ];

  config.notification = {
    icon: NOTIFICATION_ICON_PATH,
    color: '#0C4DA2',
  };

  config.extra = {
    ...config.extra,
    pushNotifications: {
      googleServicesConfigured: hasGoogleServicesFile,
    },
  };

  config.android = {
    ...config.android,
    permissions: [...new Set([...(config.android?.permissions ?? []), 'POST_NOTIFICATIONS'])],
  };

  if (hasGoogleServicesFile) {
    config.android.googleServicesFile = GOOGLE_SERVICES_FILE_RELATIVE_PATH;
  }

  return config;
};
