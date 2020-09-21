package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.DepartMapper;
import xxw.mapper.UserMapper;
import xxw.po.User;
import xxw.util.MD5Util;

import javax.servlet.http.HttpServletRequest;
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
    public int addUser(HttpServletRequest request){
        String userName= request.getParameter("userName");
        String tel =request.getParameter("tel");
        String email =request.getParameter("email");
        String type =request.getParameter("type");
        String password =request.getParameter("password");
        String comp = request.getParameter("company");
        String depart = request.getParameter("department");
        String position = request.getParameter("position");
        String positionname = request.getParameter("positionname");
        //String pnodeId = request.getParameter("pnodeId");
        String level = request.getParameter("level");
        User user =new User();
        user.setUserName(userName);
        user.setTel(tel);
        user.setEmail(email);
        user.setType(type);
        UUID uuid=UUID.randomUUID();
        String userid=uuid.toString();
        user.setId(userid);
        String pwd=MD5Util.getMD5Str(password);
        user.setPassword(pwd);
        user.setCompany(comp);
        user.setDepartment(depart);
        user.setPosition(positionname);
        int i=userMapper.addUser(user);
        departMapper.insertNode(userid,userName,userid,position,level,"user");
        return i;
    }
    @RequestMapping("/editUser")
    @ResponseBody
    public int editUser(HttpServletRequest request){
        String userName= request.getParameter("userName");
        String tel =request.getParameter("tel");
        String email =request.getParameter("email");
        String type =request.getParameter("type");
        String password =request.getParameter("password");
        String userid=request.getParameter("id");
        User user =new User();
        user.setUserName(userName);
        user.setTel(tel);
        user.setEmail(email);
        user.setType(type);
        user.setId(userid);
        String pwd=MD5Util.getMD5Str(password);
        user.setPassword(pwd);
        int i=userMapper.editUser(user);
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
}
