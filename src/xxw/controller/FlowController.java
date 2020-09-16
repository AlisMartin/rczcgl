package xxw.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.FlowMapper;
import xxw.po.FlowHistory;
import xxw.po.FlowInstance;
import xxw.po.NodeInfo;

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
        flowMapper.createFlow(flowInstance);
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/updateFLow")
    @ResponseBody
    public ResponseObject updateFLow(FlowHistory flowInstance){
        int i=0;
        flowMapper.updateFlow(flowInstance);
        return new ResponseObject(i,"","");
    }
    @RequestMapping("/createFLowHistory")
    @ResponseBody
    public ResponseObject createFLowHistory(FlowHistory flowHistory){
        int i=0;
        flowMapper.createFlowHistory(flowHistory);
        return new ResponseObject(i,"","");
    }

    @RequestMapping("/queryFlowInfos")
    @ResponseBody
    public List<FlowHistory> queryFlowInfos(HttpServletRequest request){
        //flowMapper.createFlowHistory(flowHistory);
        String flowType=request.getParameter("flowType");
        return flowMapper.queryFlowInfos(flowType);
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
        if(filetype.equals("è¯·é?‰æ‹©")||filetype.equals("null")){
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
        if(!filetype.isEmpty()&&!filetype.equals("ï¿½ï¿½Ñ¡ï¿½ï¿½")&&!filetype.equals("null")){
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
        if(filetype.equals("è¯·é?‰æ‹©")||filetype.equals("null")){
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
}
