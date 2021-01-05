package xxw.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xxw.mapper.FinanceMapper;
import xxw.po.AssetVO;
import xxw.po.AssetsInfo;
import xxw.po.Finance;
import xxw.po.User;
import xxw.util.DateUtils;
import xxw.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by wrh on 2020/9/27.
 */
@Controller
@RequestMapping("/finance")
public class FinanceController {
    @Autowired
    FinanceMapper financeMapper;
    @Autowired
    LogController logController;

    @RequestMapping("/getFinanceList")
    @ResponseBody
    public Map<String,Object> getFinanceList(@RequestBody JSONObject json){
        Map<String,Object> res = new HashMap<>();
        int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));
        int pageNumber = offset==0?1:offset/limit + 1;
        Page page = PageHelper.startPage(pageNumber, limit);
        List<Finance> info=financeMapper.getFinance();
        PageInfo pageInfo = new PageInfo<>(info);
        if(pageInfo.getList().size()>0){
            res.put("total",pageInfo.getTotal());
            res.put("rows",pageInfo.getList());
            return  res;
        }else{
            return null;
        }
    }
    @RequestMapping("/addOrUpdateFinance")
    @ResponseBody
    public ResponseObject addOrUpdateFinance(@RequestBody List<AssetVO> dto){
        Map<String, String> insertInfo = new HashMap<>();
        for (AssetVO assetVO : dto) {
            if (StringUtil.isNotEmpty(assetVO.getValue())) {
                insertInfo.put(assetVO.getName(), assetVO.getValue());
            }
        }
        int i;
        if (StringUtil.isEmpty(insertInfo.get("zcid"))){
            //获取session
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpSession session =   request.getSession();
            User user = (User)session.getAttribute("user");
            insertInfo.put("companyid", user.getComId());
            List<Finance> finances = financeMapper.getFinanceById(insertInfo.get("id"));
            if (finances.size()>0){
                return new ResponseObject(0, "融资编号已存在", "");
            }
//            UUID uuid = UUID.randomUUID();
            insertInfo.put("zcid",insertInfo.get("id"));
            i = financeMapper.insertFinance(insertInfo);

            String eventDesc="用户"+user.getUserName()+"新增融资信息";
            String eventType="新增融资";
            Date date =new Date();
            SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String realdate= dateFormat.format(date);
            //String realdate=date.toString();
            logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        }else {
            List<Finance> finances = financeMapper.getFinanceById(insertInfo.get("id"));
            if (finances.size()>0 &&  !insertInfo.get("zcid").equals(finances.get(0).getZcid())){
                return new ResponseObject(0, "融资编号已存在", "");
            }
            i = financeMapper.updateFinance(insertInfo);

            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpSession session =   request.getSession();
            User user = (User)session.getAttribute("user");
            String eventDesc="用户"+user.getUserName()+"修改融资信息";
            String eventType="修改融资";
            Date date =new Date();
            SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String realdate= dateFormat.format(date);
            //String realdate=date.toString();
            logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        }
        if (i == 1) {
            return new ResponseObject(1, "成功", "");
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }
    @RequestMapping("/delFinance")
    @ResponseBody
    public ResponseObject delFinance(@RequestBody JSONObject json){
        String id=json.getString("id");
        Integer a = financeMapper.delFinance(id);
        if (a == 1) {
            return new ResponseObject(1, "成功", "");
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }


    @Scheduled(cron = "0 30 02 ? * *")
    public void test2() {
        List<Finance> info=financeMapper.getFinance();
        List<Finance> reslist = new ArrayList<>();
        Date date1 = new Date();
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);
        // 将时分秒,毫秒域清零
        cal1.set(Calendar.HOUR_OF_DAY, 0);
        cal1.set(Calendar.MINUTE, 0);
        cal1.set(Calendar.SECOND, 0);
        cal1.set(Calendar.MILLISECOND, 0);
        date1 = cal1.getTime();

        for (Finance assetsInfo : info) {
            if (assetsInfo.getDays() != null && assetsInfo.getStopday() != null) {
                String stopday = assetsInfo.getStopday();
                Date date2;
                try {
                    date2 = new SimpleDateFormat("yyyy-MM-dd").parse(stopday);
                } catch (Exception e) {
                    e.printStackTrace();
                    continue;
                }

                Integer days = Integer.parseInt(assetsInfo.getDays());
                int betweenDay = DateUtils.daysBetween(date1, date2);
                assetsInfo.setDayorder(betweenDay);
                reslist.add(assetsInfo);
            }
        }
        int res = financeMapper.updateFinanceInfoDays(reslist);
        System.out.println("定时任务。。。计算到期时间" + (new Date()).toString() + "结果：" + res);
    }
}
