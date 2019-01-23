package com.socialutilities.modules.viewutil;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.KeyCharacterMap;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;


public class ViewUtilModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private final Handler uiHandler;
    private final Runnable enableImmersive;
    private final Runnable disableImmersive;

    public ViewUtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        uiHandler = new Handler(reactContext.getMainLooper());
        enableImmersive = () -> {
            Activity activity = getCurrentActivity();
            if(activity != null && Build.VERSION.SDK_INT >= 14){
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_IMMERSIVE
                                // Set the content to appear under the system bars so that the
                                // content doesn't resize when the system bars hide and show.
                                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                // Hide the nav bar and status bar
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                );
            }
        };

        disableImmersive = () -> {
            Activity activity = getCurrentActivity();
            if(activity != null && Build.VERSION.SDK_INT >= 14){
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                );
            }
        };
    }

    @Override
    public String getName() {
        return "ViewUtil";
    }

    @ReactMethod
    public double getNavBarHeight() {
        int resourceID = -1;
        Display display = null;
        DisplayMetrics displayMetrics = null;
        DisplayMetrics realDisplayMetrics = null;
        Resources resources = null;
        WindowManager windowManager = null;

        try {
            windowManager = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
            display = windowManager.getDefaultDisplay();
            displayMetrics = new DisplayMetrics();
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) {
                realDisplayMetrics = new DisplayMetrics();
                display.getMetrics(displayMetrics);
                display.getRealMetrics(realDisplayMetrics);
                if(displayMetrics.heightPixels != realDisplayMetrics.heightPixels) {
                    resources = reactContext.getResources();
                    resourceID = resources.getIdentifier("navigation_bar_height", "dimen", "android");
                    if (resourceID > 0 && ViewConfiguration.get(reactContext).hasPermanentMenuKey())
                        return (resources.getDimensionPixelSize(resourceID) / displayMetrics.density);
                    return 0;
                }
            }
            else {
                resources = reactContext.getResources();
                resourceID = resources.getIdentifier("config_showNavigationBar", "bool", "android");
                if (resourceID > 0 && resources.getBoolean(resourceID))
                    resourceID = resources.getIdentifier("navigation_bar_height", "dimen", "android");
                if (resourceID > 0 && ViewConfiguration.get(reactContext).hasPermanentMenuKey())
                    return (resources.getDimensionPixelSize(resourceID) / displayMetrics.density);
                return 0;
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return 0;
    }

    private boolean isTablet() {
        return (reactContext.getResources().getConfiguration().screenLayout
                & Configuration.SCREENLAYOUT_SIZE_MASK)
                >= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    @ReactMethod
    public void keepScreenAwake(){
        Objects.requireNonNull(getCurrentActivity()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow()
                        .addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });

    }

    @ReactMethod
    public void removeScreenAwake(){
        Objects.requireNonNull(getCurrentActivity()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow()
                        .clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }

    @ReactMethod
    public void enterFullScreen(){
        uiHandler.post(enableImmersive);
    }

    @ReactMethod
    public void disableFullScreen(){
        uiHandler.post(disableImmersive);
    }
}