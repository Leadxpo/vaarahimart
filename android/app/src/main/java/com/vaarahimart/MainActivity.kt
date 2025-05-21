package com.vaarahimart

import android.os.Bundle;
import android.os.Handler
import android.os.Looper
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "vaarahimart"

  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(null)

//      SplashScreen.show(this, true); // Pass 'true' for a full-screen splash screen, 'false' for non-fullscreen.
//      Handler(Looper.getMainLooper()).postDelayed({
//          SplashScreen.hide(this)  // Hide splash screen after initialization
//      }, 5000)  // Adjust the delay (in ms) as needed, 1000ms = 1 second
  }
        // block:start:android-permissions-handling
//override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
 //   super.onRequestPermissionsResult(requestCode, permissions, grantResults)
//   HyperSdkReactModule.onRequestPermissionsResult(requestCode, permissions, grantResults)
// }
// block:end:android-permissions-handling

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
