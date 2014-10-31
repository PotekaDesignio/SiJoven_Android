package com.potekadesignio.sijoven;

import java.util.Locale;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.DialogInterface.OnClickListener;
import android.content.SharedPreferences.Editor;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnSystemUiVisibilityChangeListener;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

private static boolean doubleBackToExitPressedOnce = false;
	
	WebView myWebView;
	String currentUrl;
	private static final String TAG = "Main";

	
	final Handler myHandler = new Handler();
	SharedPreferences pref;
	private TextView myTextView;
	TextToSpeech ttobj;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) 
	{
		super.onCreate(savedInstanceState);
		
		requestWindowFeature(Window.FEATURE_NO_TITLE);
        /*
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                                WindowManager.LayoutParams.FLAG_FULLSCREEN);
		*/
		
		setContentView(R.layout.activity_main);
		
		pref = getApplicationContext().getSharedPreferences("bool_AceptaCondiciones", MODE_PRIVATE);
		
        /*
		boolean resultado = pref.getBoolean("bool_AceptaCondiciones", false);
        
        if(!resultado)
        {
            try
            {
            	ShowDisclaimer();
            }
            catch(Exception ex)
            {
            	Toast.makeText(this, ex.getMessage(), Toast.LENGTH_LONG).show();
            }
        }
        */
		
        IniciarApp();
	}
	
	@Override
	protected void onPostCreate(Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);

	}
	
	
	@Override
	public void onPause()
	{
	  if(ttobj !=null)
	  {
	     ttobj.stop();
	     ttobj.shutdown();
	  }
	  super.onPause();
	}
	
	public class JavaScriptInterface 
	{
		Context mContext;

	    JavaScriptInterface(Context c) 
	    {
	        mContext = c;
	    }
	    
	    @JavascriptInterface 
	    public void showToast(String webMessage)
	    {	    	
	    	final String msgeToast = webMessage;	    	
	    	 myHandler.post(new Runnable() 
	    	 {
	             @Override
	             public void run() 
	             {
	                 // This gets executed on the UI thread so it can safely modify Views
	                 myTextView.setText(msgeToast);
	             }
	         });
	    	 String[] separated = webMessage.split("_");
	    	 
	    	 if(separated.length > 1)
	    	 {
	    		 String strAccion = separated[0];
	    		 if(strAccion.equals("FACEBOOK"))
	    		 {
    			 	 //openFacebookActivity(separated);
	    		 }
	    		 
	    		 if(strAccion.equals("TWITTER"))
	    		 {
	    			 CompartirTwitter(separated);
	    		 }
	    		 if(strAccion.equals("LINK"))
	    		 {
	    			 Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(separated[1]));
	    			 startActivity(browserIntent);
	    		 }
	    		 if(strAccion.equals("LOAD"))
	    		 {
	    			 final ProgressDialog progDailog = ProgressDialog.show(mContext,"Si Joven", "Cargando data...",true,true);
	    			 Handler handler = new Handler();
	    			 handler.postDelayed(new Runnable() {
	    			     public void run() {
	    			    	 progDailog.dismiss();
	    			     }}, 3000);  // 3000 milliseconds
	    		 }
	    		 
	    	 }
	    	 else
	    	 {
		    	 Toast.makeText(mContext, webMessage, Toast.LENGTH_LONG).show();	    	 
	    	 }
	    }
	}
	
	public class JavaScriptInterfaceTalk 
	{
		Context mContext;

		JavaScriptInterfaceTalk(Context c) 
		{
	        mContext = c;
	    }
		
		@JavascriptInterface 
	    public void speakText(String webMessage)
		{	    	
	    	final String msgeToast = webMessage;	    	
	    	 myHandler.post(new Runnable() 
	    	 {
	             @Override
	             public void run() 
	             {
	                 // This gets executed on the UI thread so it can safely modify Views
	                 myTextView.setText(msgeToast);
	             }
	         });
	    	 MainActivity.this.speakText(mContext, webMessage);
	    }
    }
	
	public void speakText(Context mContext, String toSpeak)
	{
		ttobj.speak(toSpeak, TextToSpeech.QUEUE_FLUSH, null);
	}

	@Override
	public void onBackPressed() {
		
		String prefix = myWebView.getUrl().substring(myWebView.getUrl().length() - 10);
		
		if(prefix.equals("index.html"))
		{
			super.onBackPressed();
		}
		else
		{
			if(myWebView.canGoBack())
			{
				myWebView.goBack();
			}
	        else 
	        	super.onBackPressed();	
		}
	}
	
	public void ShowDisclaimer()
	{
		AlertDialog dialog = new AlertDialog.Builder(this).setMessage(R.string.disclaimer)
             .setPositiveButton(R.string.aceptar, new OnClickListener() {
             	
             	@SuppressLint("CommitPrefEdits")
				@Override
                public void onClick(DialogInterface dialog, int which) 
             	{
                     dialog.dismiss();
                     Editor editor = pref.edit();
                     editor.putBoolean("bool_AceptaCondiciones", true);
                     editor.commit();
                     
                 }
             }).setNegativeButton(R.string.cancelar, new OnClickListener() 
             {

                 @Override
                 public void onClick(DialogInterface dialog, int which) 
                 {
                     dialog.dismiss();
                     TerminarApp();
                 }
             }).create();
		
		dialog.setTitle(R.string.titulo_modal);
		dialog.setCancelable(false);
		
		dialog.show();
	}
	
	@SuppressLint({ "JavascriptInterface", "NewApi" })
	public void IniciarApp()
	{
		ttobj=new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() 
		{
			@Override
		  	public void onInit(int status) 
			{
				if(status != TextToSpeech.ERROR)
				{
					ttobj.setLanguage(Locale.getDefault());
		        }				
		     }
		});
		
		myWebView = (WebView) findViewById(R.id.webViewMain);
		myTextView = (TextView)findViewById(R.id.textView1);
					
		WebSettings webSettings = myWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		webSettings.setAllowUniversalAccessFromFileURLs(true);
		myWebView.getSettings().setUseWideViewPort(true);
		
		myWebView.setWebViewClient(new WebViewClient());
		
		myWebView.setScrollbarFadingEnabled(true);
		myWebView.setVerticalScrollBarEnabled(false);
		/*
		myWebView.setWebChromeClient(new WebChromeClient() {
	        public void onProgressChanged(WebView view, int progress) {
	            // Activities and WebViews measure progress with different scales.
	            // The progress meter will automatically disappear when we reach 100%
	            ((Activity)MainActivity.this).setProgress(progress * 1000);
	        }

	    });
		*/
		final ProgressDialog progDailog = ProgressDialog.show(this,"Si Joven", "Cargando data...",true,true);
		
		myWebView.setWebViewClient(new WebViewClient() {
			
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.i(TAG, "Processing webview url click...");
                view.loadUrl(url);
                return true;
            }

            public void onPageFinished(WebView view, String url) {
                Log.i(TAG, "Finished loading URL: " + url);
                progDailog.dismiss();
                
            }

            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e(TAG, "Error: " + description);
            }
        });
		
		final JavaScriptInterface  myJavaScriptInterface = new JavaScriptInterface (this);
		final JavaScriptInterfaceTalk  myJavaScriptInterfaceTalk = new JavaScriptInterfaceTalk (this);
		myWebView.getSettings().setJavaScriptEnabled(true);
		myWebView.addJavascriptInterface(myJavaScriptInterface, "AndroidFunctionToast");
		myWebView.addJavascriptInterface(myJavaScriptInterfaceTalk, "AndroidFunctionTalk");
		
		myWebView.loadUrl("file:///android_asset/html/index.html");
		
	}
	
	public void TerminarApp()
	{
		finish();
	}
	
	protected void CompartirTwitter(String[] message)
	{
		Intent myIntent = new Intent(MainActivity.this, TwitterActivity.class);
		myIntent.putExtra("MENSAJE_COMPARTIR", message[2]);
        startActivity(myIntent);
        
        overridePendingTransition(R.anim.activityfadein, R.anim.splashfadeout);
	}
	
}
