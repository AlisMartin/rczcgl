package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AuthMapper;
import xxw.mapper.RoleMapper;
import xxw.mapper.UserMapper;
import xxw.po.Role;
import xxw.po.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by lp on 2020/5/26.
 */
@Controller
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    LogController logController;
    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private AuthMapper authMapper;
    @RequestMapping("/userCheck")
    @ResponseBody
    public int getUserByName(HttpServletRequest request,HttpSession session){
        String username=request.getParameter("username");
        int i=userMapper.getUserByName(username);
        if(i>0){
            int num=(int)(Math.random()*9+1)*10000 ;
            session.setAttribute("checkNum",num);
            session.setAttribute("time",System.currentTimeMillis());
            return num;
        }else{
            return 0;
        }
    }
    @RequestMapping("/userLogin")
    @ResponseBody
    public User login(HttpServletRequest request,HttpSession session){
        String username=request.getParameter("username");
        String password=request.getParameter("password");
        User user=userMapper.getUser(username,password);
        String auth=null;
        String authType="";
        if(user!=null&&user.getId()!=null){
            Role role=roleMapper.selectRoleByUserId(user.getId());
            if(role!=null&&role.getRoleId()!=null){
                auth=authMapper.getAuthByRoleId(role.getRoleId());
                if(auth.indexOf(',')>0){
                    String [] au=auth.split(",");
                    for(int i=0;i<au.length;i++){
                        String type=authMapper.getAuthByAuthId(au[i]);
                        if(type!=null){
                            authType=authType+type+",";
                        }
                    }
                authType=authType.substring(0,authType.length()-1);
                }else{
                    authType=authMapper.getAuthByAuthId(auth);
                }
                user.setRole(role.getRole());
                user.setAuth(authType);
            }

            request.getSession().setAttribute("user",user);
            String eventDesc="用户"+user.getUserName()+"登录系统";
            String eventType="登录";
            Date date =new Date();
            SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String realdate= dateFormat.format(date);
            //String realdate=date.toString();
            logController.insertLogs(eventType,realdate,eventDesc,user.getId(),user.getUserName());
            return user;
        }else{
            return null;
        }
    }
}
