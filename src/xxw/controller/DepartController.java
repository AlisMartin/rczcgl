package xxw.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xxw.mapper.DepartMapper;
import xxw.po.DepartTree;
import xxw.po.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

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
                map.put("px",departTree.getPx());
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
        String pxs=request.getParameter("px");

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");



        if(pxs!=null){
            int px=Integer.parseInt(pxs);
            List<DepartTree> list=departMapper.getDepart(depart,pnodeId,px,user.getComId());
            return new ResponseObject(1,"",list);
        }else{
            String [] authArray;
            if(user.getAuth().indexOf(",")>-1) {
                List<DepartTree> list=new ArrayList<>();
                authArray = user.getAuth().split(",");
                boolean flag=true;
                for (int i = 0; i < authArray.length; i++) {
                    if (authArray[i].equals("8") || authArray[i].equals("9") || authArray[i].equals("10")) {
                        flag=false;
                        break;
                    }else{
                        flag=true;
                    }
                }
                if(flag){
                    list=departMapper.getDepart(depart,pnodeId,null,user.getComId());
                }else{
                    list=departMapper.getDepart(depart,pnodeId,null,null);
                }
                return new ResponseObject(1,"",list);
            }else{
                List<DepartTree> list=new ArrayList<>();
                if(user.getAuth().equals("8")||user.getAuth().equals("9")||user.getAuth().equals("10")){
                    list=departMapper.getDepart(depart,pnodeId,null,null);
                }else{
                    list=departMapper.getDepart(depart,pnodeId,null,user.getComId());
                }

                return new ResponseObject(1,"",list);
            }

        }


    }

    @RequestMapping("/insertNode")
    @ResponseBody
    public ResponseObject insertNode(HttpServletRequest request){
        String name=request.getParameter("name");

        String depart=request.getParameter("depart");
        String parentId=request.getParameter("parentId");
        UUID uuid= UUID.randomUUID();
        String id=uuid.toString();
        String pxs=request.getParameter("px");
        if(pxs!=null){
            int px=Integer.parseInt(pxs);
            departMapper.insertNode(id,name,id,parentId,null,depart,px);
        }else{
            departMapper.insertNode(id,name,id,parentId,null,depart,null);
        }

        return new ResponseObject(1,"",null);
    }


    @RequestMapping("/delNode")
    @ResponseBody
    public ResponseObject delNode(HttpServletRequest request){
        String  node=request.getParameter("node");
        if(node.indexOf(",")>-1){
            String []nodes=node.split(",");
            for(String nodeId:nodes){
                departMapper.delNode(nodeId);
            }
        }else{
            departMapper.delNode(node);
        }
     return new ResponseObject(200,"",null);


    }
    @RequestMapping("/updateNode")
    @ResponseBody
    public ResponseObject updateNode(HttpServletRequest request){
        int i=0;
        String name=request.getParameter("name");
        String id=request.getParameter("id");
        String pxs=request.getParameter("px");
        String depart=request.getParameter("depart");
        if(pxs!=null){
            int px=Integer.parseInt(pxs);
            i=departMapper.updateNode(name,id,px,depart);
        }else{
            i=departMapper.updateNode(name,id,null,depart);
        }

        return new ResponseObject(i,"",null);
    }

}
