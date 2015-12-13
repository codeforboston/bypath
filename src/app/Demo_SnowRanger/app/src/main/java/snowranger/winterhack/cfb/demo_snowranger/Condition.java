package snowranger.winterhack.cfb.demo_snowranger;

import android.graphics.Bitmap;

import com.parse.ParseClassName;
import com.parse.ParseFile;
import com.parse.ParseObject;
import com.parse.ParseUser;
import com.parse.ParseGeoPoint;
import com.parse.ParseQuery;

/**
 * Created by pusgaonkar on 12/8/2015.
 */
@ParseClassName("Condition")
public class Condition extends ParseObject{
        public String getDescription() {
            return getString("description");
        }

        public void setDescription(String value) {
            put("description", value);
        }

        public ParseFile getImage(){
            return getParseFile("image");
        }

        public void setImage(ParseFile image)
        {
            put("image", image);
        }

        public ParseGeoPoint getLocation() {
            return getParseGeoPoint("location");
        }

        public void setLocation(ParseGeoPoint value) {
            put("location", value);
        }

        public static ParseQuery<Condition> getQuery() {
            return ParseQuery.getQuery(Condition.class);
        }
    }
