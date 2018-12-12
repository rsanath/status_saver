package com.whatsappstatussaver.modules.share;

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

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageShareModule";
    }

    @ReactMethod
    public void shareImage(String uriToImage, String message) {
        System.out.println("Path is ");
        System.out.println(uriToImage);
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
    public void shareImages(ReadableArray uriToImages, String message) {
        Activity context = getCurrentActivity();

        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_SEND_MULTIPLE);
        intent.putExtra(Intent.EXTRA_SUBJECT, message);
        intent.setType("image/jpeg");

        ArrayList<Uri> files = new ArrayList<Uri>();

        for (int i = 0; i < uriToImages.size(); i++) {
            File file = new File(uriToImages.getString(i));
            Uri uri = FileProvider.getUriForFile(context, "com.whatsappstatussaver.provider", file);
            files.add(uri);
        }

        intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, files);

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

    @ReactMethod
    public void shareVideos(ReadableArray uriToVideos, String message) {
        Activity context = getCurrentActivity();

        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_SEND_MULTIPLE);
        intent.putExtra(Intent.EXTRA_SUBJECT, message);
        intent.setType("video/mp4");

        ArrayList<Uri> files = new ArrayList<Uri>();

        for (int i = 0; i < uriToVideos.size(); i++) {
            File file = new File(uriToVideos.getString(i));
            Uri uri = FileProvider.getUriForFile(context, "com.whatsappstatussaver.provider", file);
            files.add(uri);
        }

        intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, files);

        context.startActivity(intent);
    }

}