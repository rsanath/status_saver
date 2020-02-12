package com.socialutilities;

import android.app.Application;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.socialutilities.modules.fs.FileSystemPackage;
import com.socialutilities.modules.settings.SettingsPackage;
import com.socialutilities.modules.share.SharePackage;
import com.socialutilities.modules.viewutil.ViewUtilPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNDeviceInfo(),
                    new RNGestureHandlerPackage(),
                    new RNI18nPackage(),
                    new VectorIconsPackage(),
                    new ReactVideoPackage(),
                    new SharePackage(),
                    new ViewUtilPackage(),
                    new FileSystemPackage(),
                    new SettingsPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
