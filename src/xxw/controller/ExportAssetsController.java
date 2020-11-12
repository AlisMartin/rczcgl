package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetsParam;
import xxw.po.User;
import xxw.service.ExportAssetsService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by lp on 2020/8/10.
 */
@Controller
@RequestMapping("/export")
public class ExportAssetsController {
    @Autowired
    AssetsMapper assetsMapper;
    @Autowired
    ExportAssetsService exportAssetsService;
    @Autowired
    LogController logController;
    @RequestMapping("/exportAssets")
    @ResponseBody
    public ResponseObject  exportAssets(HttpServletRequest request,HttpServletResponse response,AssetsParam assetsParam){
        //response.setContentType("text/html;charset=utf-8"); //如果是json数据,需要设置为("text/javascript;charset=utf-8");

        response.setCharacterEncoding("utf-8");
        String assetsType="";
        String filename="";
        if(assetsParam.getZctype().equals("1")){
            filename="土地资产";
            assetsType="土地资产";
        }else if(assetsParam.getZctype().equals("2")){
            filename="房屋资产";
            assetsType="房屋资产";
        }else{
            filename="海域资产";
            assetsType="海域资产";
        }

        String tempPath = request.getRealPath("/") + "exportAssetsInfo";
        File filePathTemp = new File(tempPath);
        if (!filePathTemp.isDirectory()) {
            filePathTemp.mkdirs();
        }

        long nameTime = System.currentTimeMillis();
        filename=filename+"信息报表"+nameTime+".xls";
        //获取session
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");

        exportAssetsService.exportAssetsInfo(assetsParam.getZctype(),tempPath,filename,user);

        //记录日志
        String desc="导出"+assetsType+"信息报表";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
//        User user=(User)request.getSession().getAttribute("user");

        logController.insertLogs("导出",realdate,desc,user.getId(),user.getUserName());
        //return "exportAssetsInfo/"+filename;
        return new ResponseObject(1,"","exportAssetsInfo/"+filename);
    }

    @RequestMapping("/exportSummary")
    @ResponseBody
    public ResponseObject  exportSummary(HttpServletRequest request,HttpServletResponse response){
        //response.setContentType("text/html;charset=utf-8"); //如果是json数据,需要设置为("text/javascript;charset=utf-8");
        //String comId=request.getParameter("comId");
        String zctype=request.getParameter("zctype");
        String comId=request.getParameter("gsmc");
        response.setCharacterEncoding("utf-8");
        String assetsType="";
        String filename="";
        if(zctype.equals("1")){
            filename="土地资产";
            assetsType="土地资产";
        }else if(zctype.equals("2")){
            filename="房屋资产";
            assetsType="房屋资产";
        }else if(zctype.equals("3")){
            filename="海域资产";
            assetsType="海域资产";
        }else if(zctype.equals("4")){
            filename="其他资产";
            assetsType="其他资产";
        }
        String tempPath = request.getRealPath("/") + "exportSummaryInfo";
        File filePathTemp = new File(tempPath);
        if (!filePathTemp.isDirectory()) {
            filePathTemp.mkdirs();
        }

        long nameTime = System.currentTimeMillis();
        filename=filename+"汇总信息报表"+nameTime+".xls";
        exportAssetsService.exportSummaryAssetsInfo(zctype, tempPath, filename, comId);

        //记录日志
        String desc="导出"+assetsType+"汇总信息报表";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        User user=(User)request.getSession().getAttribute("user");

        logController.insertLogs("导出",realdate,desc,user.getId(),user.getUserName());
        //return "exportAssetsInfo/"+filename;
        return new ResponseObject(1,"","exportSummaryInfo/"+filename);
    }

    @RequestMapping("/importAssets")
    @ResponseBody
    public ResponseObject importAssets(HttpServletRequest request,MultipartFile file,String zctype){
        int i=0;
        List<Map<String,String>> listdata=new ArrayList<>();
        listdata=exportAssetsService.importAssetsInfo(file,zctype);
        for(int z=0;z<listdata.size();z++){
            i=assetsMapper.insertAssetsInfo(listdata.get(z));
        }

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"导入资产信息";
        String eventType="导入资产信息";
        Date dates =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(dates);
        //String realdate=date.toString();ss
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());

        return  new ResponseObject(i,"","");
    }
}
