package xxw.util;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Timer;

/**
 * Created by 86188 on 2020/10/24.
 */
@Component
public class UpdateRSATask {
    @PostConstruct
    public void init(){
        Timer task=new Timer();
        Calendar startTask = new GregorianCalendar();
        startTask.add(Calendar.SECOND,0);
        task.schedule(new RSATaskDetail(),startTask.getTime(),1000);
    }
}
