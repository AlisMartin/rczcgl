package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.RoleMapper;
import xxw.po.Role;

import javax.servlet.http.HttpServletRequest;
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
        return i;
    }
    @RequestMapping("/delRole")
    @ResponseBody
    public int delRole(HttpServletRequest request){
        String roleIds = request.getParameter("roleId");
        roleIds=roleIds.substring(0,roleIds.length()-1);
        String [] IdArray=roleIds.split(",");
        for(int i=0;i<IdArray.length;i++){
            roleMapper.deleteRole(IdArray[i]);
        }
        return 1;
    }
    @RequestMapping("/updateRole")
    @ResponseBody
    public int updateRole(HttpServletRequest request){
        String roleId = request.getParameter("roleId");
        String role = request.getParameter("role");
        int i = roleMapper.updateRole(roleId,role);
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
}
