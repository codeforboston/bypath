package snowranger.winterhack.cfb.demo_snowranger;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.parse.Parse;
import com.parse.ParseFile;
import com.parse.ParseGeoPoint;
import com.parse.ParseObject;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;


public class Submit extends ActionBarActivity{

    //display image taken in previous activity -- accessed from local storage
    ImageView resultPhoto;
    //Bitmap for ImageView conversion
    Bitmap myBitmap;

    Button submitButton;
    Intent splashIntent, homeIntent;
    String imageFilePath;
    double latitude, longitude;

    EditText submitET;

    TextView submitTV, latlongTV;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_submit);

        homeIntent = new Intent(this, Splash.class);
        submitET = (EditText) findViewById(R.id.submitET);

        submitButton = (Button) findViewById(R.id.submitButton);
        resultPhoto = (ImageView) findViewById(R.id.submitImage);
        submitTV = (TextView) findViewById(R.id.submitTV);
        latlongTV = (TextView) findViewById(R.id.latlongTV);

        //Gets packaged elements from intent
        splashIntent = getIntent();
        imageFilePath = splashIntent.getStringExtra("imagePath");
        latitude = splashIntent.getDoubleExtra("latitude", 0.00);
        longitude = splashIntent.getDoubleExtra("longitude", 0.00);

        //Sets photo on open from local storage
        myBitmap = BitmapFactory.decodeFile(imageFilePath);
        resultPhoto.setImageBitmap(myBitmap);

        String gpsString = "Latitude: " + String.valueOf(latitude) + "\n"
                + "Longitude: " + String.valueOf(longitude);
        latlongTV.setText(gpsString);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_submit, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void backHome(View v){

        //Make JSON object to package info
        //JSONObject jSonObject = new JSONObject();

        //Make Condition object to package info
        Condition condition = new Condition();

        try{
            //add description
            condition.setDescription(submitET.getText().toString());

            //create new GeoPoint obj
            ParseGeoPoint geoPoint = new ParseGeoPoint();
            geoPoint.setLatitude(latitude);
            geoPoint.setLongitude(longitude);

            //add GeoPoint obj
            condition.setLocation(geoPoint);

            ParseFile parseFile = new ParseFile("image.png",convertImagetoByteArray(myBitmap));
            condition.setImage(parseFile);

            condition.saveInBackground();

            startActivity(homeIntent);

        }catch(Exception e){Log.e("Parse","Parse save error");e.printStackTrace();}

        /*try{
            //two fields for JSON object
            jSonObject.put("description", submitET.getText());
            jSonObject.put("imageString", convertImagetoJSON(myBitmap));

            //Toast.makeText(this, "successfully submitted report", Toast.LENGTH_SHORT).show();

            /*

            Send JSON Object up to servers

             */

            //start async json task to send object to server
        /*
            new jsonTask().execute();

            startActivity(homeIntent);
        }catch(JSONException ex){

            ex.printStackTrace();
        }*/
    }

    //converts image to json
    //bitmap converted to byte array
    public String convertImagetoJSON(Bitmap bmap){
        final int compressionQuality = 100;
        String encodedImageString;
        ByteArrayOutputStream byteArrayBitmapStream = new ByteArrayOutputStream();
        bmap.compress(Bitmap.CompressFormat.PNG, compressionQuality, byteArrayBitmapStream);
        byte[] bArray = byteArrayBitmapStream.toByteArray();
        encodedImageString = Base64.encodeToString(bArray, Base64.DEFAULT);

        return encodedImageString;
    }

    //converts image to json
    //bitmap converted to byte array
    public byte[] convertImagetoByteArray(Bitmap bmap){
        final int compressionQuality = 100;
        String encodedImageString;
        ByteArrayOutputStream byteArrayBitmapStream = new ByteArrayOutputStream();
        bmap.compress(Bitmap.CompressFormat.PNG, compressionQuality, byteArrayBitmapStream);
        byte[] bArray = byteArrayBitmapStream.toByteArray();

        return bArray;
    }


    private class jsonTask extends AsyncTask<String, Void, String>{

        @Override
        protected String doInBackground(String... params) {
            if(postMethod()){
            }else{
            }
            return null;
        }


    }

    //posting json info
    public boolean postMethod() {

        try {
            //set url address
            URL url = new URL("http://52.20.122.213:8000/");
            //get new httpUrlConnection from URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();


            //notify for json data
            connection.setRequestProperty("Content-Type", "application/json");
            //set method to post
            connection.setRequestMethod("POST");
            //unknown body length
            connection.setChunkedStreamingMode(0);
            //set connection for output
            connection.setDoInput (true);
            connection.setDoOutput (true);
            connection.setUseCaches (false);
            //connection.connect();


            //hardcoded json example
            JSONObject testObject = new JSONObject();
            try{
                testObject.put("lat", "test lat");
                testObject.put("long", "long test");
            }catch (JSONException e) {
                e.printStackTrace();
            }

            String jsonString = testObject.toString();


            //make output stream for url
            OutputStream os = connection.getOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
            //write to outputStream
            //os.write(testObject.toString().getBytes());
            osw.write(jsonString);
            //os.flush();


            DataOutputStream printOut = new DataOutputStream(connection.getOutputStream ());
            printOut.writeBytes(URLEncoder.encode(String.valueOf(jsonString.getBytes()), "UTF-8"));
            printOut.flush ();
            printOut.close ();


            if (connection.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
                throw new RuntimeException("Failed : HTTP error code : "
                        + connection.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (connection.getInputStream())));

            String output;
            System.out.println("Output from Server .... \n");

            while ((output = br.readLine()) != null) {
                System.out.println(output);
                Log.d("output", output);
            }

            connection.disconnect();

            return true;
        } catch (IOException ex) {
            ex.printStackTrace();
            return false;
        }
    }

}
/*

Attempt 1: OutputStreamWriter w/ String
Attempt 2: OutputStream w/ bytes
Attempt 3: DataOutputStream w/ String
Attempt 4: Post information to Parse

 */