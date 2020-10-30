package xxw.util;

import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Timer;

/**
 * Created by 86188 on 2020/10/24.
 */
@Component
public class UpdateRSATask {
    private String path;
    private String privateKey;
    private String publicKey;
    public UpdateRSATask(String path,String privateKey,String publicKey){
        this.path=path;
        this.privateKey=privateKey;
        this.publicKey=publicKey;
    }
    public void init(){
        Timer task=new Timer();
        Calendar startTask = new GregorianCalendar();
        startTask.add(Calendar.SECOND,0);
        task.schedule(new RSATaskDetail(this.path,this.privateKey,this.publicKey),startTask.getTime(),3600000);
    }
}
