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
    public int addUser(HttpServletRequest request,User user){

        UUID uuid=UUID.randomUUID();
        String userid=uuid.toString();
        user.setId(userid);
        String pwd=DigestUtils.md5Hex(user.getPassword().getBytes());
       // String pwd=MD5Util.getMD5Str(password);
        user.setPassword(pwd);
        int i=userMapper.addUser(user);
        departMapper.insertNode(userid,user.getUserName(),userid,user.getPosId(),null,"user",null);
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
