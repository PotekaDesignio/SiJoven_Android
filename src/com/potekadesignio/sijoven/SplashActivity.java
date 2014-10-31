package com.potekadesignio.sijoven;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.view.WindowManager;

public class SplashActivity extends Activity {

private static final int SPLASH_DISPLAY_TIME = 4000; // splash screen delay time
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                                WindowManager.LayoutParams.FLAG_FULLSCREEN);

		setContentView(R.layout.activity_splash);

		new Handler().postDelayed(new Runnable() {
	        public void run() {

	            Intent intent = new Intent();
	            intent.setClass(SplashActivity.this, MainActivity.class);

	            SplashActivity.this.startActivity(intent);
	            SplashActivity.this.finish();

	            // transition from splash to main menu
	            overridePendingTransition(R.anim.activityfadein,
	                    R.anim.splashfadeout);

	        }
	    }, SPLASH_DISPLAY_TIME);
	}
}
