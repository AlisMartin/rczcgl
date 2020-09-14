package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.FlowMapper;
import xxw.po.FlowHistory;
import xxw.po.FlowInstance;
import xxw.po.NodeInfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

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
    public List<String> queryFile(HttpServletRequest request){
        String filetype=request.getParameter("filetype");
        String com=request.getParameter("com");
        String pos=request.getParameter("pos");
        if(filetype.equals("com")){
            return flowMapper.selectCom();
        }else if(filetype.equals("pos")){
            return flowMapper.selectPos(com);
        }else if(filetype.equals("type")){
            return  flowMapper.selectType(com,pos);
        }else{
            return null;
        }

    }
}
