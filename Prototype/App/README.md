# money-mouse

## How to test

1. [Install NPM](http://blog.teamtreehouse.com/install-node-js-npm-linux)
2. `cd` into this directory
3. Run `npm install` (this shouldn't install any extra software on your computer, it'll just modify the current directory).
4. Run `npm install -g exp` (this will install Expo globally, and you may need to use `sudo`).
5. Install the Expo app on your phone.
6. Run `npm run bsb-watch` from this directory (in a separate terminal). If this fails, please run `npm run bsb-version` and make sure it's 2.2.3.
7. Run `exp start` from this directory.
8. Scan the QR code with the Expo app.

## To build the .apk

```
exp build:android
```