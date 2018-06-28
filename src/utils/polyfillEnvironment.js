/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * This file is loaded as a part of user bundle
 *
 */
import { NativeModules } from 'react-native';

require('../hot/client/importScriptsPolyfill');

if (process.env.NODE_ENV !== 'production') {
  let protocol;
  let origin;

  // In order to ensure hot client has a valid URL we need to get a valid origin
  // from URL from which the bundle was loaded. When using iOS simulator/Android emulator
  // or Android device it will be `localhost:<port>` but when using real iOS device
  // it will be `<ip>.xip.io:<port>`.
  const { scriptURL } = NativeModules.SourceCode;
  if (scriptURL) {
    [protocol, , origin] = scriptURL.split('/');
  }

  if (protocol && origin) {
    global.DEV_SERVER_ORIGIN = `${protocol}//${origin}`;

    // Webpack's `publicPath` needs to be overwritten with `DEV_SERVER_ORIGIN` otherwise,
    // it would still make requests to (usually) `localhost`.
    __webpack_require__.p = `${global.DEV_SERVER_ORIGIN}/`; // eslint-disable-line no-undef
  }
}
