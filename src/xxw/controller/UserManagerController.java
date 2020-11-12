package xxw.controller;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.DepartMapper;
import xxw.mapper.UserMapper;
import xxw.po.User;
import xxw.util.MD5Util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Created by lp on 2020/5/28.
 */
@Controller
@RequestMapping("/user")
public class UserManagerController {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private DepartMapper departMapper;
    @Autowired
    LogController logController;
    @RequestMapping("/selectAllUser")
    @ResponseBody
    public List<User> selectAllUser(HttpServletRequest request){
        List<User> userlist=userMapper.selectAllUser();
        if(userlist.size()>0){
            return userlist;
        }else{
            return null;
        }
    }
    @RequestMapping("/addUser")
    @ResponseBody
    public int addUser(HttpServletRequest request,User user){

        UUID uuid=UUID.randomUUID();
        String userid=uuid.toString();
        user.setId(userid);
        String pwd=DigestUtils.md5Hex(user.getPassword().getBytes());
       // String pwd=MD5Util.getMD5Str(password);
        user.setPassword(pwd);
        int i=userMapper.addUser(user);
        userMapper.userAddRole(user.getId(),user.getRole());
        HttpSession session =   request.getSession();
        User users = (User)session.getAttribute("user");
        String eventDesc="用户"+users.getUserName()+"添加用户及设置角色";
        String eventType="添加用户";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,users.getId(),users.getUserName());
        //departMapper.insertNode(userid,user.getUserName(),userid,user.getPosId(),null,"user",null);
        return i;
    }
    @RequestMapping("/editUser")
    @ResponseBody
    public int editUser(HttpServletRequest request,User user){
        if(user.getPassword().length()<32){
            String pwd=MD5Util.getMD5Str(user.getPassword());
            user.setPassword(pwd);
        }
        int i=userMapper.editUser(user);
        userMapper.userUpdateRole(user.getId(),user.getRole());

        HttpSession session =   request.getSession();
        User users = (User)session.getAttribute("user");
        String eventDesc="用户"+users.getUserName()+"修改用户及设置角色";
        String eventType="修改用户";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,users.getId(),users.getUserName());
        return i;
    }
    @RequestMapping("/deleteUser")
    @ResponseBody
    public void deleteUser(HttpServletRequest request){
        String id = request.getParameter("data");
        id=id.substring(0,id.length()-1);
        String []ids=id.split(",");
        for(int i=0;i<ids.length;i++){
            userMapper.deleteUser(ids[i]);
        }

        HttpSession session =   request.getSession();
        User users = (User)session.getAttribute("user");
        String eventDesc="用户"+users.getUserName()+"删除用户";
        String eventType="删除用户";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,users.getId(),users.getUserName());
    }
    @RequestMapping("/userAddRole")
    @ResponseBody
    public int userAddRole(HttpServletRequest request){
        int i=0;
        String czrole=null;
        String userId=request.getParameter("userid");
        String roleIds=request.getParameter("roleids");
         czrole=userMapper.selectUserRoleIdByUser(userId);
        if(roleIds!=null){
            roleIds=roleIds.substring(0,roleIds.length()-1);
        }
        if(userId!=null&&roleIds!=null){
            if(czrole!=null) {
                i=userMapper.userUpdateRole(userId,roleIds);
            }else{
                i = userMapper.userAddRole(userId, roleIds);
            }
            return i;
        }else{
            return i;
        }
    }
    @RequestMapping("/userClearRole")
    @ResponseBody
    public int userClearRole(HttpServletRequest request){
        int i=0;
        String czrole=null;
        String userId=request.getParameter("userid");
        String roleIds=request.getParameter("roleids");
        czrole=userMapper.selectUserRoleIdByUser(userId);
        if(czrole!=null){
            i=userMapper.userClearRole(userId);
            return i;
        }else{
            return i;
        }

    }
    @RequestMapping("/getRoleByUserId")
    @ResponseBody
    public String getRoleByUserId(HttpServletRequest request){
        String czrole=null;
        String userId=request.getParameter("userid");
        //String roleIds=request.getParameter("roleids");
        czrole=userMapper.selectUserRoleIdByUser(userId);
        return czrole;

    }

    @RequestMapping("/getUsersById")
    @ResponseBody
    public ResponseObject getUserById(HttpServletRequest request){
            String ids=request.getParameter("ids");
            String names="";
            if(ids.indexOf(",")>-1){
                String  idarray []=ids.split(",");
                for(int i=0;i<idarray.length;i++){
                    User user=userMapper.queryUser(null,null,idarray[i]);
                    names=names+user.getUserName()+",";
                }
            }else{
                User user=userMapper.queryUser(null,null,ids);
                names=user.getUserName();
            }
        return  new ResponseObject(1,"",names);

    }

    @RequestMapping("/getUserByName")
    @ResponseBody
    public ResponseObject getUserByName(HttpServletRequest request){
        String name=request.getParameter("name");
        String names="";
        User user=userMapper.queryUser(name,null,null);
        if(user!=null){
            return  new ResponseObject(0,"",names);
        }else{
            return  new ResponseObject(1,"",names);
        }


    }
}
