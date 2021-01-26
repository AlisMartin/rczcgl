package xxw.controller;

import cn.hutool.db.Session;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xxw.mapper.FileMapper;
import xxw.mapper.FlowMapper;
import xxw.mapper.SysMessageMapper;
import xxw.mapper.UserMapper;
import xxw.po.*;
import xxw.util.DateUtils;
import xxw.util.StringUtil;

import javax.json.Json;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by lp on 2020/9/4.
 */
@Controller
@RequestMapping("/flow")
public class FlowController {
    @Autowired
    FlowMapper flowMapper;
    @Autowired
    UserMapper userMapper;
    @Autowired
    FileMapper fileMapper;
    @Autowired
    SysMessageMapper sysMessageMapper;
    @Autowired
    LogController logController;
    @RequestMapping("/getNodeInfo")
    @ResponseBody
    public List<NodeInfo> getNodeInfo(HttpServletRequest request){
        List<NodeInfo> list=flowMapper.getNodes();
        return  list;
    }
    @RequestMapping("/upNode")
    @ResponseBody
    public void upNode(HttpServletRequest request){
        String id=request.getParameter("id");
        String treeid=request.getParameter("treeid");
        String nodeId=request.getParameter("nodeId");
        String flowType=request.getParameter("flowType");
        flowMapper.upNode(id,nodeId,flowType,treeid);
    }

    @RequestMapping("/createFLow")
    @ResponseBody
    public ResponseObject createFLow(FlowHistory flowInstance,HttpServletRequest request){
        int i=0;
        UUID uuid=UUID.randomUUID();
        flowInstance.setFlowId(uuid.toString());
       // flowInstance.setNode("2");
       // duserId=getUserIds("2");
       // flowInstance.setDusers(duserId);
        if(flowInstance.getFlowType().equals("1")){
            flowInstance.setStatus("3");
            flowInstance.setUser(flowInstance.getJsr());
            flowInstance.setJsr(flowInstance.getJsr());
            flowInstance.setEndDate(flowInstance.getStartDate());
        }else{
            flowInstance.setStatus("1");
        }

        //flowInstance.setFile(flowInstance.getWjmc());
        flowMapper.createFlow(flowInstance);
        //usernames=dbusers("2");
       // flowInstance.setdName(usernames);
        //flowInstance.setUser(flowInstance.getFqrName());
        flowInstance.setEndDate(flowInstance.getStartDate());
       // flowInstance.setNode("1");
        //flowInstance.setUserId(flowInstance.getFqr());
        flowInstance.setFlowOrder(1);
        flowMapper.createFlowHistory(flowInstance);
        HttpSession session=request.getSession();
        User user=(User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"发起流程";
        String eventType="发文";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return new ResponseObject(i,"",flowInstance);
    }
    @RequestMapping("/updateFLow")
    @ResponseBody
    public ResponseObject updateFLow(FlowHistory flowInstance,HttpServletRequest request){
        int i=0;
        flowMapper.updateFlow(flowInstance);
        HttpSession session=request.getSession();
        User user=(User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"审批发文";
        String eventType="审批";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/updateFLowStatus")
    @ResponseBody
    public ResponseObject updateFLowStatus(HttpServletRequest request){
        int i=0;
        String flowIds=request.getParameter("flowIds");
        if(flowIds.indexOf(",")>-1){
            String[] flowIdArray=flowIds.split(",");
            for(String flowId:flowIdArray){
                flowMapper.updateFlowStatus(flowId,"4");
            }
        }else{
            flowMapper.updateFlowStatus(flowIds,"4");
        }

        HttpSession session=request.getSession();
        User user=(User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"撤回发文";
        String eventType="审批";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/createFLowHistory")
    @ResponseBody
    public ResponseObject createFLowHistory(FlowHistory flowHistory){
        int i=0;
        if(flowHistory.getStatus().equals("2")||flowHistory.getStatus().equals("3")){
            String data=flowHistory.getEndDate();
            flowHistory.setStartDate(data);
            flowHistory.setEndDate(data);
            flowHistory.setNodeOrder(flowHistory.getNodeOrder()+1);
            flowMapper.createFlowHistory(flowHistory);
        }else{
            List<FlowHistory> list=   flowMapper.queryFlowHistoryInfo(flowHistory.getFlowId(),null,flowHistory.getNodeOrder());
            flowHistory.setStartDate(list.get(0).getEndDate());
            flowHistory.setNodeOrder(flowHistory.getNodeOrder()+1);
            flowMapper.createFlowHistory(flowHistory);
        }
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/updateFLowHistory")
    @ResponseBody
    public ResponseObject updateFLowHistory(FlowHistory flowHistory){
        int i=0;
        flowMapper.createFlowHistory(flowHistory);
        return new ResponseObject(i,"","");
    }

    @RequestMapping("/queryFlowInfos")
    @ResponseBody
    public List<FlowHistory> queryFlowInfos(HttpServletRequest request,@RequestBody JSONObject json){
        //flowMapper.createFlowHistory(flowHistory);
        String flowType=json.getString("flowType");
        String flowId=json.getString("flowId");
        String fqr=json.getString("fqr");
        String duser=json.getString("duser");
        List<FlowHistory> flowInfoList=flowMapper.queryFlowInfos(flowType,flowId,fqr,duser);
        for(FlowHistory flowHistory:flowInfoList){
            if(!"".equals(flowHistory.getFqr())&&flowHistory.getFqr()!=null){
                String cluser=getUserNames(flowHistory.getFqr());
                flowHistory.setFqrName(cluser);
            }
            if(!"".equals(flowHistory.getUser())&&flowHistory.getUser()!=null){
                String cluser=getUserNames(flowHistory.getUser());
                flowHistory.setUsername(cluser);
            }
            if(!"".equals(flowHistory.getJsr())&&flowHistory.getJsr()!=null){
                String cluser=getUserNames(flowHistory.getJsr());
                flowHistory.setDusers(cluser);
            }
        }
        return flowInfoList;
    }

    @RequestMapping("/queryHistoryFlowInfos")
    @ResponseBody
    public List<FlowHistory> queryHistoryFlowInfos(HttpServletRequest request,@RequestBody JSONObject json){
        //flowMapper.createFlowHistory(flowHistory);
        String flowType=json.getString("flowType");
        String flowId=json.getString("flowId");
        String fqr=json.getString("fqr");
        String duser=json.getString("duser");
        List<FlowHistory> flowInfoList=flowMapper.queryHistoryFlowInfos(flowType,flowId,fqr,duser);
        for(FlowHistory flowHistory:flowInfoList){
         /*   if(flowHistory.getStartDate()!=null){
              flowHistory.setOrderTime(DateUtils.StringToUtilDate(flowHistory.getStartDate(),"yyyy-MM-dd hh:mm:ss"));  ;
            }*/

            if(!"".equals(flowHistory.getFqr())&&flowHistory.getFqr()!=null){
                String cluser=getUserNames(flowHistory.getFqr());
                flowHistory.setFqrName(cluser);
            }
            if(!"".equals(flowHistory.getUser())&&flowHistory.getUser()!=null){
                String cluser=getUserNames(flowHistory.getUser());
                flowHistory.setUsername(cluser);
            }
            if(!"".equals(flowHistory.getJsr())&&flowHistory.getJsr()!=null){
                String cluser=getUserNames(flowHistory.getJsr());
                flowHistory.setDusers(cluser);
            }
        }
        return flowInfoList;
    }

    @RequestMapping("/queryFile")
    @ResponseBody
    public ResponseObject queryFile(HttpServletRequest request){
        String departId=request.getParameter("departId");
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        if(filetype.equals("com")){
            return new ResponseObject(1,"",flowMapper.selectCom(departId));
        }else if(filetype.equals("pos")){
            return new ResponseObject(1,"",flowMapper.selectPos(com,departId));
        }else if(filetype.equals("type")){
            return  new ResponseObject(1,"",flowMapper.selectType(com,pos,departId));
        }else{
            return null;
        }

    }
    @RequestMapping("/queryPathId")
    @ResponseBody
    public ResponseObject queryPathId(HttpServletRequest request){
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        return new ResponseObject(1,"",flowMapper.selectPathId(com,pos,filetype));

    }

    @RequestMapping("/delMl")
    @ResponseBody
    public void delMl(HttpServletRequest request){
        String pathId=request.getParameter("pathId");
        flowMapper.delFold(pathId);

    }

    @RequestMapping("/queryManagerFileList")
    @ResponseBody
    public List<Map<String,String>> queryManagerFileList(HttpServletRequest request){
        String departId=request.getParameter("departId");
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String fileDate=request.getParameter("fileDate");
        String pathId=request.getParameter("pathId");
        String fileName=request.getParameter("fileName");
        return flowMapper.selectFile(com,pos,filetype,fileDate,pathId, StringUtil.formatLike(fileName),departId);
    }
    @RequestMapping("/queryManagerFileListByJson")
    @ResponseBody
    public List<Map<String,String>> queryManagerFileList(HttpServletRequest request,@RequestBody JSONObject json){
        String departId=json.getString("departId");
       /* String departId=request.getParameter("departId");
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String fileDate=request.getParameter("fileDate");
        String pathId=request.getParameter("pathId");
        String fileName=request.getParameter("fileName");*/
        return flowMapper.selectFile(null,null,null,null,null,null,departId);
    }

    @RequestMapping("/insertFile")
    @ResponseBody
    public void insertFile(@RequestBody JSONObject json){
        String zcid = json.getString("zcid");
        String fileid = json.getString("fileid");
        flowMapper.updateFile(fileid, zcid);
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"上传附件";
        String eventType="上传附件";
        Date dates =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(dates);
        //String realdate=date.toString();ss
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
    }

    @RequestMapping("/insertManagerFile")
    @ResponseBody
    public ResponseObject insertManagerFile(HttpServletRequest request){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date=new Date();
        String year=sdf.format(date);

     /*   if(filetype.equals("请选择")||filetype.equals("null")){
            filetype=null;
        }*/
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String filetype=request.getParameter("filetype");
     /*   if(pos.equals("请选择")||pos.equals("null")){
            pos=null;
        }*/

        String filename=request.getParameter("filename");
        String pathId=request.getParameter("pathId");
        String filepath="";
        if(filetype==null&&pos!=null){
            filepath="filemanager/"+year+"/"+com+"/"+pos;
        }
        if(filetype!=null){
            filepath="filemanager/"+year+"/"+com+"/"+pos+"/"+filetype;
        }
        if(pos==null&&filetype==null){
            filepath="filemanager/"+year+"/"+com;
        }
        List<AssetsFile> assetsFiles = new ArrayList<>();
        assetsFiles = flowMapper.selectFileByName(StringUtil.formatLike(filename));
        if (assetsFiles.size() > 0){
            return new ResponseObject(0,"文件名称重复",null);
        }

        Integer order=flowMapper.selectFileOrder(null,pathId,null);
        if(order==null){
            order=0;
        }
        order=order+1;
        UUID uid=UUID.randomUUID();
        String id=uid.toString();
        flowMapper.insertManagerFile(id,filename,filepath,null,pathId,year,order+"");


        HttpSession session=request.getSession();
        User user=(User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"上传文件到文件库";
        String eventType="文件上传";
        Date dates =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(dates);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());


        return new ResponseObject(1,"添加成功",null);

    }

    @RequestMapping("/savefold")
    @ResponseBody
    public int savefole(HttpServletRequest request){
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String type=request.getParameter("type");
        String departId=request.getParameter("departId");
        UUID uid=UUID.randomUUID();
        String id=uid.toString();
        flowMapper.savefilefold(com,pos,type,id,departId);

        HttpSession session=request.getSession();
        User user=(User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"文件库添加目录";
        String eventType="文件库添加目录";
        Date dates =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(dates);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return 1;
    }

    @RequestMapping("/queryFileInfo")
    @ResponseBody
    public ResponseObject queryFileInfo(HttpServletRequest request){
        String fileName=request.getParameter("fileName");
        String fileId=request.getParameter("fileId");
        String pathId=request.getParameter("pathId");
        String filearray[];
        List<FileInfo>  filelist=new ArrayList<>();
        if(fileId.indexOf(',')>-1){
            filearray=fileId.split(",");
            for(int i=0;i<filearray.length;i++){
                FileInfo fileInfo= fileMapper.queryFileByParam(fileName,filearray[i],pathId);
                filelist.add(fileInfo);
            }
        }else{
            FileInfo fileInfo= fileMapper.queryFileByParam(fileName,fileId,pathId);
            filelist.add(fileInfo);
        }

        return new ResponseObject(1,"",filelist);
    }

    @RequestMapping("/queryQmPic")
    @ResponseBody
    public ResponseObject queryQmPic(HttpServletRequest request){
        String filePath=request.getParameter("filePath");
        List<FileInfo>  filelist=fileMapper.queryQmPicByParam(filePath);
        return new ResponseObject(1,"",filelist);
    }

    public String dbusers(String node){
        String dusers="";
        String usernames="";
        List<NodeInfo> nodeInfolist=flowMapper.getNodes();
        for(NodeInfo nodeInfo:nodeInfolist){
            if(nodeInfo.getNodeId().equals(node)){
                dusers=nodeInfo.getUserId();
            }
        }
        String userarray []=dusers.split(",");
        for(int j=0;j<userarray.length;j++){
            String username=userMapper.queryUser(null, null, userarray[j]).getUserName();
            usernames=usernames+username+",";
        }
        //User b=userMapper.queryUser(null,null,a);
        if(!usernames.isEmpty()){
            usernames=usernames.substring(0,usernames.length()-1);
        }
        return  usernames;
    }
    public String getUserIds(String node){
        String dusers="";
        List<NodeInfo> nodeInfolist=flowMapper.getNodes();
        for(NodeInfo nodeInfo:nodeInfolist){
            if(nodeInfo.getNodeId().equals(node)){
                dusers=nodeInfo.getUserId();
            }
        }
        return dusers;
    }
    public String getUserNames(String ids){
        String names="";
        if(ids.indexOf(",")>-1){
            String  idarray []=ids.split(",");
            for(int i=0;i<idarray.length;i++){
                User user=userMapper.queryUser(null,null,idarray[i]);
                names=names+user.getUserName()+",";
            }
            return  names;
        }else{
            User user=userMapper.queryUser(null,null,ids);
            names=user.getUserName();
            return  names;
        }

    }
    @RequestMapping("/insertSysMessage")
    @ResponseBody
    public void insertSysMessage(HttpServletRequest request,SysMessage sysMessage){
        sysMessage.setFlowtype("flow");
        sysMessageMapper.insertSysMessage(sysMessage);

    }

    @RequestMapping("/queryMessage")
    @ResponseBody
    public List<SysMessage> queryMessage(HttpServletRequest request,@RequestBody JSONObject json){
        String jsuser = json.getString("jsuser");
        String show = json.getString("show");
        List<SysMessage> messageList=sysMessageMapper.queryMessage(jsuser,show);
        for(SysMessage sysMessage:messageList){
            if(!"".equals(sysMessage.getJsId())&&sysMessage.getJsId()!=null){
                String cluser=getUserNames(sysMessage.getJsId());
                sysMessage.setJsId(cluser);
            }
            if(!"".equals(sysMessage.getTsId())&&sysMessage.getTsId()!=null){
                String cluser=getUserNames(sysMessage.getTsId());
                sysMessage.setTsId(cluser);
            }
        }
        /*String jsuser=request.getParameter("jsuser");
        String show=request.getParameter("show");*/
        return messageList;

    }
    @RequestMapping("/updateMessage")
    @ResponseBody
    public void updateMessage(HttpServletRequest request){

        String flowId=request.getParameter("flowId");
        String show=request.getParameter("show");
        String node=request.getParameter("node");
        String duser=request.getParameter("duser");
        sysMessageMapper.updateSysMessage(show,flowId,node,duser);

    }
    @RequestMapping("/getQm")
    @ResponseBody
    public List<FlowHistory> getQm(HttpServletRequest request){
        String flowId=request.getParameter("flowId");
        String node=request.getParameter("node");
        return flowMapper.queryFlowHistoryInfo(flowId,null,null);
    }

    @RequestMapping("/delFileById")
    @ResponseBody
    public ResponseObject delFileById(HttpServletRequest request){

        int i=0;
        String fileId=request.getParameter("fileId");
        i=fileMapper.delById(fileId);
        return new ResponseObject(i,"","")  ;
    }
}
