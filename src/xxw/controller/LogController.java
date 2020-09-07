package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.LogMapper;
import xxw.po.Log;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by lp on 2020/6/4.
 */
@Controller
@RequestMapping("/log")
public class LogController {
    @Autowired
    LogMapper logMapper;
    @RequestMapping("/insertLog")
    @ResponseBody
    public int insertLogs(String eventType,String  eventDate,String eventDesc,String userId,String userName){
        int i=0;
        Log log=new Log();
        log.setEventType(eventType);
        log.setEventDate(eventDate);
        log.setEventDesc(eventDesc);
        log.setUserId(userId);
        log.setUserName(userName);
        i=logMapper.inertLog(log);
        return i;
    }
    @RequestMapping("/getLogs")
    @ResponseBody
    public List<Log> getLogs(HttpServletResponse response){
        List<Log> logs=logMapper.getLogs();
        return logs;
    }
}
