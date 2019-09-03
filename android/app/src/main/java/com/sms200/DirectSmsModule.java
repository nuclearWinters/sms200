//DirectSmsModule.java
package com.sms200;
 
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import android.telephony.SmsManager;
import com.facebook.react.bridge.Callback;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.app.Activity;
import android.content.Context;
import com.facebook.react.bridge.Promise;

public class DirectSmsModule extends ReactContextBaseJavaModule {
 
    public DirectSmsModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }
 
    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() { 
        return "DirectSms";
    }
 
    @ReactMethod
    public void sendDirectSms(String phoneNumber, String msg, Promise promise) {
        final Activity activity = getCurrentActivity();
        try {      
            String SENT = "SMS_SENT";
            String DELIVERED = "SMS_DELIVERED";

            PendingIntent sentPI = PendingIntent.getBroadcast(activity, 0,
            new Intent(SENT), 0);
        
            PendingIntent deliveredPI = PendingIntent.getBroadcast(activity, 0,
            new Intent(DELIVERED), 0);

            //---when the SMS has been sent---
            activity.registerReceiver(new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            promise.resolve("sent");
                            break;
                        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                            promise.resolve("generic failure");
                            break;
                        case SmsManager.RESULT_ERROR_NO_SERVICE:
                            promise.resolve("no service");
                            break;
                        case SmsManager.RESULT_ERROR_NULL_PDU:
                            promise.resolve("null pdu");
                            break;
                        case SmsManager.RESULT_ERROR_RADIO_OFF:
                            promise.resolve("error radio");
                            break;
                    }
                }
            }, new IntentFilter(SENT));

            //---when the SMS has been delivered---
            activity.registerReceiver(new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            break;
                        case Activity.RESULT_CANCELED:
                            break;                        
                    }
                }
            }, new IntentFilter(DELIVERED));   

            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, msg, sentPI, null);

        } catch (Exception ex) {
            promise.resolve("error");
        } 
    }
}