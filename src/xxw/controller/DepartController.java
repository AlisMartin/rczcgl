package xxw.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.DepartMapper;
import xxw.po.DepartTree;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/9/3.
 */
@Controller
@RequestMapping("/depart")
public class DepartController {
    @Autowired
    DepartMapper departMapper;
    ObjectMapper objectMapper=new ObjectMapper();
    @RequestMapping("/getnodes")
    @ResponseBody
    public JSONArray getNodes(HttpServletRequest request,HttpServletResponse response){
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/plain;charset=utf-8");
        String parentnode = request.getParameter("parentnode");
        String level = request.getParameter("level");
        List<DepartTree> nodelist = departMapper.getNodesInfo(parentnode,level);
        List<Map<String,Object>> list =new ArrayList<>();
        list=getchild(null,nodelist);

        String vbi=null;
        try {
             vbi= objectMapper.writeValueAsString(list);
            System.out.println("+++++++++"+vbi);
        }catch (Exception e){
            e.printStackTrace();
        }
        JSONArray jsonObject = JSONArray.parseArray(vbi);
        return jsonObject;
    }
    public List<Map<String,Object>> getchild(String pid,List<DepartTree> list){
        List<Map<String,Object>> childList = new ArrayList<Map<String, Object>>();
        for(DepartTree departTree:list){
            Map<String,Object> map = new HashMap<>();
            if(pid==null?departTree.getParentNodeId()==null:pid.equals(departTree.getParentNodeId())){
                map.put("text",departTree.getNodeName());
                map.put("id",departTree.getNodeId());
                map.put("parentNodeId",departTree.getParentNodeId());
                //if(departTree.getDepart())
                map.put("nodes",new Object[]{});
                map.put("depart",departTree.getDepart());
                childList.add(map);
            }
        }
        for(Map map:childList){
            List<Map<String,Object>> childlist=getchild(String.valueOf(map.get("id")),list);
            map.put("nodes",childlist);
        }
        return childList;
    }

    @RequestMapping("/getDepart")
    @ResponseBody
    public ResponseObject getDepartByDepart(HttpServletRequest request){
        String depart=request.getParameter("depart");
        String pnodeId=request.getParameter("pnodeId");
        List<DepartTree> list=departMapper.getDepart(depart,pnodeId);
        return new ResponseObject(1,"",list);
    }
}
