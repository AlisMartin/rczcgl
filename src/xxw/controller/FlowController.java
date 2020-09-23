package xxw.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.FileMapper;
import xxw.mapper.FlowMapper;
import xxw.mapper.SysMessageMapper;
import xxw.mapper.UserMapper;
import xxw.po.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public ResponseObject createFLow(FlowHistory flowInstance){
        int i=0;
        String dusers=null;
        String usernames="";
        UUID uuid=UUID.randomUUID();
        flowInstance.setFlowId(uuid.toString());
        flowInstance.setNode("2");
        usernames=dbusers("2");
        flowInstance.setDusers(usernames);
        flowInstance.setStatus("1");
        flowInstance.setFile(flowInstance.getWjmc());
        flowMapper.createFlow(flowInstance);
        flowInstance.setUser(flowInstance.getFqr());
        flowInstance.setEndDate(flowInstance.getStartDate());
        flowInstance.setNode("1");
        flowMapper.createFlowHistory(flowInstance);
        return new ResponseObject(i,"",flowInstance);
    }
    @RequestMapping("/updateFLow")
    @ResponseBody
    public ResponseObject updateFLow(FlowHistory flowInstance){
        int i=0;
        int node=Integer.parseInt(flowInstance.getNode());
        if(flowInstance.getStatus().equals("2")||flowInstance.getStatus().equals("3")){
            flowInstance.setDusers("无");
        }else{
            String usernames=dbusers(node+"");
            flowInstance.setDusers(usernames);
        }

        flowInstance.setNode((node+1)+"");
        flowMapper.updateFlow(flowInstance);
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/createFLowHistory")
    @ResponseBody
    public ResponseObject createFLowHistory(FlowHistory flowHistory){
        int i=0;
        int node=Integer.parseInt(flowHistory.getNode());
        if(node>1){
            List<FlowHistory> list=   flowMapper.queryFlowHistoryInfo(flowHistory.getFlowId(),(node-1)+"");
            flowHistory.setStartDate(list.get(0).getEndDate());
        }

        flowMapper.createFlowHistory(flowHistory);

        if(flowHistory.getStatus().equals("2")||flowHistory.getStatus().equals("3")){
            flowHistory.setNode("4");
            String data=flowHistory.getEndDate();
            flowHistory.setStartDate(data);
            flowHistory.setEndDate(data);
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
    public List<FlowHistory> queryFlowInfos(HttpServletRequest request){
        //flowMapper.createFlowHistory(flowHistory);
        String flowType=request.getParameter("flowType");
        String flowId=request.getParameter("flowId");
        return flowMapper.queryFlowInfos(flowType,flowId);
    }
    @RequestMapping("/queryFile")
    @ResponseBody
    public ResponseObject queryFile(HttpServletRequest request){
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        if(filetype.equals("com")){
            return new ResponseObject(1,"",flowMapper.selectCom());
        }else if(filetype.equals("pos")){
            return new ResponseObject(1,"",flowMapper.selectPos(com));
        }else if(filetype.equals("type")){
            return  new ResponseObject(1,"",flowMapper.selectType(com,pos));
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
        if(filetype.equals("请�?�择")||filetype.equals("null")){
            filetype=null;
        }
        return new ResponseObject(1,"",flowMapper.selectPathId(com,pos,filetype));

    }

    @RequestMapping("/queryManagerFileList")
    @ResponseBody
    public List<Map<String,String>> queryManagerFileList(HttpServletRequest request){
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String fileDate=request.getParameter("fileDate");
/*
        if(!filetype.isEmpty()&&!filetype.equals("��ѡ��")&&!filetype.equals("null")){
            filetype=null;
        }*/
        return flowMapper.selectFile(com,pos,filetype,fileDate);

    }

    @RequestMapping("/insertFile")
    @ResponseBody
    public void insertFile(@RequestBody JSONObject json){
        String zcid = json.getString("zcid");
        String fileid = json.getString("fileid");
        flowMapper.updateFile(fileid, zcid);
    }

    @RequestMapping("/insertManagerFile")
    @ResponseBody
    public void insertManagerFile(HttpServletRequest request){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date=new Date();
        String year=sdf.format(date);
        String filetype=request.getParameter("filetype");
        if(filetype.equals("请�?�择")||filetype.equals("null")){
            filetype=null;
        }
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String filename=request.getParameter("filename");
        String pathId=request.getParameter("pathId");
        String filepath="";
        if(filetype==null){
            filepath="filemanager/"+year+"/"+com+"/"+pos;
        }else{
            filepath="filemanager/"+year+"/"+com+"/"+pos+"/"+filetype;
        }

        UUID uid=UUID.randomUUID();
        String id=uid.toString();
        flowMapper.insertManagerFile(id,filename,filepath,null,pathId,year);

    }

    @RequestMapping("/savefold")
    @ResponseBody
    public int savefole(HttpServletRequest request){
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        String type=request.getParameter("type");
        UUID uid=UUID.randomUUID();
        String id=uid.toString();
        flowMapper.savefilefold(com,pos,type,id);
        return 1;
    }

    @RequestMapping("/queryFileInfo")
    @ResponseBody
    public ResponseObject queryFileInfo(HttpServletRequest request){
        String fileName=request.getParameter("fileName");
        String fileId=request.getParameter("fileId");
        FileInfo fileInfo= fileMapper.queryFileByParam(fileName,fileId);
        return new ResponseObject(1,"",fileInfo);
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
    @RequestMapping("/insertSysMessage")
    @ResponseBody
    public void insertSysMessage(HttpServletRequest request,SysMessage sysMessage){
        if(!sysMessage.getNode().equals("4")){
            String duser=dbusers(sysMessage.getNode());
            sysMessage.setJsUser(duser);
        }

        sysMessageMapper.insertSysMessage(sysMessage);

    }

    @RequestMapping("/queryMessage")
    @ResponseBody
    public List<SysMessage> queryMessage(HttpServletRequest request){

        String jsuser=request.getParameter("jsuser");
        String show=request.getParameter("show");
        return sysMessageMapper.queryMessage(jsuser,show);

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

}
