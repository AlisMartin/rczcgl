package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.RoleMapper;
import xxw.po.Role;
import xxw.po.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Created by lp on 2020/6/1.
 */
@Controller
@RequestMapping("/role")
public class RoleController {
    @Autowired
    RoleMapper roleMapper;
    @Autowired
    LogController logController;
    @RequestMapping("/getAllRoles")
    @ResponseBody
    public List<Role> getAllRoles(HttpServletRequest request){
        List<Role> roles = roleMapper.getAllRoles();
        if(roles.size()>0){
            return roles;
        }else{
            return null;
        }
    }

    @RequestMapping("/addRole")
    @ResponseBody
    public int addRole(HttpServletRequest request){
        String role = request.getParameter("role");
        UUID uuid=UUID.randomUUID();
        String roleId=uuid.toString();
        Role rol= new Role();
        rol.setRoleId(roleId);
        rol.setRole(role);
        int i=roleMapper.addRole(rol);

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"添加角色";
        String eventType="添加角色";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return i;
    }
    @RequestMapping("/delRole")
    @ResponseBody
    public int delRole(HttpServletRequest request){
        String roleIds = request.getParameter("roleId");
        if(roleIds.indexOf(",")>-1){
            String [] IdArray=roleIds.split(",");
            for(int i=0;i<IdArray.length;i++){
                roleMapper.deleteRole(IdArray[i]);
            }
        }else{
            roleMapper.deleteRole(roleIds);
        }

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"删除角色";
        String eventType="删除角色";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());

        return 1;
    }
    @RequestMapping("/updateRole")
    @ResponseBody
    public int updateRole(HttpServletRequest request){
        String roleId = request.getParameter("roleId");
        String role = request.getParameter("role");
        int i = roleMapper.updateRole(roleId,role);

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"修改角色";
        String eventType="修改角色";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return i;
    }

    @RequestMapping("/roleAddAuth")
    @ResponseBody
    public int roleAddAuth(HttpServletRequest request){
        int i=0;
        String roleId = request.getParameter("roleId");
        String authId = request.getParameter("authId");
        authId=authId.substring(0,authId.length()-1);

        String authIds=null;
        authIds=roleMapper.selectAuthByRoleId(roleId);
        if(authIds==null){
            i = roleMapper.roleAddAuth(roleId,authId);
        }else{
            i=roleMapper.roleUpdateAuth(roleId,authId);
        }

        HttpSession session =   request.getSession();
        User user = (User)session.getAttribute("user");
        String eventDesc="用户"+user.getUserName()+"设置角色权限";
        String eventType="设置角色权限";
        Date date =new Date();
        SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate= dateFormat.format(date);
        //String realdate=date.toString();
        logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
        return i;
    }
    @RequestMapping("/selectAuthByRole")
    @ResponseBody
    public String selectAuthByRoleId(HttpServletRequest request){
        String authS=null;
        String roleId = request.getParameter("roleId");
        authS = roleMapper.selectAuthByRoleId(roleId);
        return authS;
    }
    @RequestMapping("/roleUpdateAuth")
    @ResponseBody
     public int roleUpdateAuth(HttpServletRequest request){
        int i=0;
        String roleId = request.getParameter("roleId");
        String authId = request.getParameter("authId");
        i = roleMapper.roleUpdateAuth(roleId,authId);
        return i;
    }
    @RequestMapping("/roleClearAuth")
    @ResponseBody
    public int roleClearAuth(HttpServletRequest request){
        int i=0;
        String roleId = request.getParameter("roleId");
        i = roleMapper.roleClearAuth(roleId);
        return i;
    }
    @RequestMapping("/queryRoleByRoleName")
    @ResponseBody
    public int queryRoleByRoleName(HttpServletRequest request){
        String role = request.getParameter("role");
        Role roles=roleMapper.getRoleByName(role);
        if(roles!=null){
            return 1;
        }else{
            return 0;
        }

    }
}
