package xxw.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.LogMapper;
import xxw.po.Log;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map getLogs(@RequestBody JSONObject json){
        Map<String, Object> res = new HashMap<>();
        int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));
        int pageNumber = offset==0?1:offset/limit + 1;
        Page page = PageHelper.startPage(pageNumber, limit);
        List<Log> logs=logMapper.getLogs();
        PageInfo pageInfo = new PageInfo<>(logs);
        if (pageInfo.getList().size() > 0) {
            res.put("total", pageInfo.getTotal());
            res.put("rows", pageInfo.getList());
            return res;
        } else {
            return null;
        }

    }
}
