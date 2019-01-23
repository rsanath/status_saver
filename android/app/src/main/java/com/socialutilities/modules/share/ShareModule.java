package com.socialutilities.modules.share;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.ShareCompat;
import android.support.v4.content.FileProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.io.File;
import java.util.ArrayList;


public class ShareModule extends ReactContextBaseJavaModule {

    private static final String PROVIDER_NAME = "com.whatsappstatussaver.provider";

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MediaShareModule";
    }

    @ReactMethod
    public void shareMedia(String uriToMedia, String mimeType, String message) {
        Activity context = getCurrentActivity();

        File cacheFile = new File(uriToMedia);
        Uri uri = FileProvider.getUriForFile(context, PROVIDER_NAME, cacheFile);
        Intent intent = ShareCompat.IntentBuilder.from(context)
                .setType(mimeType)
                .setSubject(message)
                .setText(message)
                .setStream(uri)
                .setChooserTitle("Share Via")
                .createChooserIntent()
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        context.startActivity(intent);
    }

    @ReactMethod
    public void shareMedia(ReadableArray uriToMedia, String mimeType, String message) {
        Activity context = getCurrentActivity();

        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_SEND_MULTIPLE);
        intent.putExtra(Intent.EXTRA_SUBJECT, message);
        intent.setType(mimeType);

        ArrayList<Uri> files = new ArrayList<Uri>();

        for (int i = 0; i < uriToMedia.size(); i++) {
            File file = new File(uriToMedia.getString(i));
            Uri uri = FileProvider.getUriForFile(context, PROVIDER_NAME, file);
            files.add(uri);
        }

        intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, files);

        context.startActivity(intent);
    }
}