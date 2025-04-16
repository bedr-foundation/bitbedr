# front

## Install

**Note**
https://serasome.com/@VueJS/q4xykc6UjJ

- [android studio](https://developer.android.com/studio)
- [JDK 14](https://github.com/portapps/oracle-jdk-portable/releases)
- [Gradle](https://gradle.org/releases)

***

## Setting (윈도우 환경변수 설정)

- ANDROID_SDK_ROOT : Android Studio -> SDK Location
- JAVA_HOME : JDK 설치경로
- Path 추가 : sdk/tools, sdk/platform-tools, gradle/bin, jdk/bin

***

## Init

``` bash
cd [PROJECT_ROOT]

vue create front

cd front
vue add cordova

cd src-cordova
cordova plugin add cordova-clipboard-api
cordova plugin add cordova-plugin-app-version
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-fingerprint-aio
cordova plugin add cordova-plugin-googleplus
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-qrscanner
cordova plugin add cordova-plugin-screen-orientation
cordova plugin add cordova-plugin-x-toast
cordova plugin add cordova-support-android-plugin
cordova plugin add es6-promise-plugin
cordova plugin add ionic-plugin-keyboard
cordova plugin add onesignal-cordova-plugin

### Change gradle file
plugins/cordova-plugin-qrscanner/src/android/qrscanner.gradle

```
compile -> implementation
```

cd ..
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install flowbite flowbite-vue
```

**Note**
[Flowbite](https://flowbite.com/docs/getting-started/vue/)
[vue.js vscode eslint & prettier](https://velog.io/@corner3499/Vue3-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EC%84%B1-ESLint-Prettier-%EC%84%A4%EC%A0%95-Bootstrap-%EC%A0%81%EC%9A%A9)

***

## Test

``` bash
npm run cordova-serve-android
```

***

## Build

``` bash
npm run cordova-build-android
```

