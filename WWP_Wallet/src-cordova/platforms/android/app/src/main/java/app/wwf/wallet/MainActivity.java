/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package app.wwf.wallet;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import org.apache.cordova.*;

import java.util.Arrays;

import app.wwf.wallet.R;

public class MainActivity extends CordovaActivity
{
    WebView mWebView;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // gradiant 사용시
        if ( false ) {
            Window window = getWindow();
            Drawable background = getResources().getDrawable(app.wwf.wallet.R.drawable.gradiant);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                window.setNavigationBarContrastEnforced(false);
            }

            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);
            window.setBackgroundDrawable(background);

            setStatusBarStyle("lightcontent");
        }

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        if (appView == null) {
            init();
        }

        // setBgType2();

        mWebView = (WebView) appView.getView();
        mWebView.getSettings().setTextZoom(100);

        this.keepRunning = preferences.getBoolean("KeepRunning", true);

        mWebView = (WebView) appView.getView();
        mWebView.loadUrl(launchUrl);
    }

    public void setBgType1() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Window window = getWindow();
                Drawable background = getResources().getDrawable(app.wwf.wallet.R.drawable.gradiant);
                window.setStatusBarColor(Color.TRANSPARENT);
                window.setNavigationBarColor(Color.TRANSPARENT);
                window.setBackgroundDrawable(background);

                setStatusBarStyle("lightcontent");
            }
        });
    }

    public void setBgType2() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Window window = getWindow();
                Drawable background = getResources().getDrawable(R.drawable.color);
                window.setStatusBarColor(Color.TRANSPARENT);
                window.setNavigationBarColor(Color.TRANSPARENT);
                window.setBackgroundDrawable(background);

                //setStatusBarStyle("default");
                setStatusBarStyle("lightcontent");
            }
        });
    }

    public void setBgType3() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Window window = getWindow();
                Drawable background = getResources().getDrawable(R.drawable.white);
                window.setStatusBarColor(Color.TRANSPARENT);
                window.setNavigationBarColor(Color.TRANSPARENT);
                window.setBackgroundDrawable(background);

                setStatusBarStyle("default");
            }
        });
    }

    private void setStatusBarStyle(final String style) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (style != null && !style.isEmpty()) {
                Window window = getWindow();
                View decorView = window.getDecorView();
                WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, decorView);

                String[] darkContentStyles = {
                        "default",
                };

                String[] lightContentStyles = {
                        "lightcontent",
                };

                if (Arrays.asList(darkContentStyles).contains(style.toLowerCase())) {
                    windowInsetsControllerCompat.setAppearanceLightStatusBars(true);
                    windowInsetsControllerCompat.setAppearanceLightNavigationBars(true);
                    return;
                }

                if (Arrays.asList(lightContentStyles).contains(style.toLowerCase())) {
                    windowInsetsControllerCompat.setAppearanceLightStatusBars(false);
                    windowInsetsControllerCompat.setAppearanceLightNavigationBars(false);
                    return;
                }
            }
        }
    }
}
