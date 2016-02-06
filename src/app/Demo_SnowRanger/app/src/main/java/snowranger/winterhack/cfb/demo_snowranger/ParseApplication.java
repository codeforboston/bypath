package snowranger.winterhack.cfb.demo_snowranger;

import android.app.Application;

import com.parse.Parse;
import com.parse.ParseObject;

/**
 * Created by pusgaonkar on 12/12/2015.
 */
public class ParseApplication extends Application{

    @Override
    public void onCreate() {
        super.onCreate();

        Parse.enableLocalDatastore(this);
        ParseObject.registerSubclass(Condition.class);
        Parse.initialize(this, "ikx3kRNF4RME6dqQblg2t06q5ETzRsklLOOHC7QD", "M2hsjU3i7XGqIebu23X3QsnAr5aUH3zWu1SP5UMn");
    }
}
