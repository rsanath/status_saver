package com.whatsappstatussaver.modules;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.ShareCompat;
import android.support.v4.content.FileProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;


public class ShareModule extends ReactContextBaseJavaModule {

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageShareModule";
    }

    @ReactMethod
    public void shareImage(String uriToImage, String message) {
        Activity context = getCurrentActivity();

        File cacheFile = new File(uriToImage);
        Uri uri = FileProvider.getUriForFile(context, "com.whatsappstatussaver.provider", cacheFile);
        Intent intent = ShareCompat.IntentBuilder.from(context)
                .setType("image/jpg")
                .setSubject(message)
                .setText(message)
                .setStream(uri)
                .setChooserTitle("Share via")
                .createChooserIntent()
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        context.startActivity(intent);
    }

    @ReactMethod
    public void shareVideo(String uriToImage, String message) {
        Activity context = getCurrentActivity();

        File cacheFile = new File(uriToImage);
        Uri uri = FileProvider.getUriForFile(context, "com.whatsappstatussaver.provider", cacheFile);
        Intent intent = ShareCompat.IntentBuilder.from(context)
                .setType("video/mp4")
                .setSubject(message)
                .setText(message)
                .setStream(uri)
                .setChooserTitle("Share via")
                .createChooserIntent()
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        context.startActivity(intent);
    }

}