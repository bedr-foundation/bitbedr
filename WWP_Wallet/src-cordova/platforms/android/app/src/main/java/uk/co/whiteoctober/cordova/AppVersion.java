package uk.co.whiteoctober.cordova;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Arrays;
import java.util.Base64;
import java.util.Locale;
import java.util.Random;
import java.util.TimeZone;

import app.wwf.wallet.MainActivity;

public class AppVersion extends CordovaPlugin {
  private static final String LOGTAG = "Pangsky";
  private static final String SR_CODE = "co_pang_sky_de";

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

    try {
      if (action.equals("getAppName")) {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        ApplicationInfo app = packageManager.getApplicationInfo(this.cordova.getActivity().getPackageName(), 0);
        callbackContext.success((String)packageManager.getApplicationLabel(app));
        return true;
      }
      if (action.equals("getPackageName")) {
        String pName = this.cordova.getActivity().getPackageName();
        callbackContext.success(pName);
        return true;
      }
      if (action.equals("getTimeZone")) {
        TimeZone timeZone = TimeZone.getDefault();
        String locationText = timeZone.getID();
        callbackContext.success(locationText);
        return true;
      }
      if (action.equals("getVersionNumber")) {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        callbackContext.success(packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionName);
        return true;
      }
      if (action.equals("getVersionCode")) {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        callbackContext.success(packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionCode);
        return true;
      }
      if (action.equals("getLanguage")) {
        String locale = Locale.getDefault().getLanguage();
        callbackContext.success(locale);
        return true;
      }
      if (action.equals("setBgColor")) {
        String setColor = args.getString(0);

        if ( false ) {
          MainActivity main = (MainActivity) this.cordova.getActivity();

          if (setColor.equals("#gradiant_color")) {
            // gradiant 사용시
            main.setBgType1();
          } else if (setColor.equals("#FFFFFF")) {
            main.setBgType3();
          } else {
            main.setBgType2();
          }
        } else {
          this.cordova.getActivity().getWindow().setStatusBarColor(Color.parseColor(setColor));

          // 일반 color 사용시
          if (setColor.equals("#FFFFFF")) {
            this.cordova.getActivity().runOnUiThread(() -> setStatusBarStyle("default"));
          } else {
            this.cordova.getActivity().runOnUiThread(() -> setStatusBarStyle("lightcontent"));
          }
        }

        return true;
      }
      if (action.equals("encodeString")) {
        String Data = args.getString(0);
        String output = "ERROR";

        try {
          Algorithm algorithm = Algorithm.HMAC256(SR_CODE);
          output = JWT.create()
                  .withClaim("useData", Data)
                  .sign(algorithm);
        } catch (JWTCreationException exception){
          //Invalid Signing configuration / Couldn't convert Claims.
        }

        if (output != "ERROR") {
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            callbackContext.success(Base64.getEncoder().encodeToString(output.getBytes()));
          }
        } else {
          callbackContext.success(output);
        }

        return true;
      }
      if (action.equals("decodeString")) {
        String Data = null;
        String token = args.getString(0);
        DecodedJWT jwt = null;
        String output = "ERROR";

        try {
          if (token != null) {
            byte[] decodedBytes = new byte[0];
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
              decodedBytes = Base64.getDecoder().decode(token);
            }
            String decodedString = new String(decodedBytes);

            token = decodedString;
          }
          jwt = JWT.decode(token);

          if (jwt.getClaims().get("useData") != null) {
            Data = jwt.getClaims().get("useData").asString();
          }
        } catch (JWTDecodeException exception){
          //Invalid token
          Log.w(LOGTAG, String.format("CONSOLE JWT Exception1: %s", exception.getMessage()));
        }

        if (Data != null) {
          try {
            Algorithm algorithm = Algorithm.HMAC256(SR_CODE);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withClaim("useData", Data)
                    .build(); //Reusable verifier instance
            DecodedJWT verify = verifier.verify(token);

            output = Data;
          } catch (JWTVerificationException exception) {
            //Invalid signature/claims
            Log.w(LOGTAG, String.format("CONSOLE JWT Exception2: %s", exception.getMessage()));
          }
        }

        callbackContext.success(output);
        return true;
      }

      return false;
    } catch (NameNotFoundException e) {
      callbackContext.success("N/A");
      return true;
    }
  }

  private String getChar() {
    String getList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY";

    Random random = new Random();
    int index = random.nextInt(getList.length());
    return String.valueOf(getList.charAt(index));
  }

  private void setStatusBarStyle(final String style) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      if (style != null && !style.isEmpty()) {
        Window window = cordova.getActivity().getWindow();
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
          return;
        }

        if (Arrays.asList(lightContentStyles).contains(style.toLowerCase())) {
          windowInsetsControllerCompat.setAppearanceLightStatusBars(false);
          return;
        }
      }
    }
  }
}
