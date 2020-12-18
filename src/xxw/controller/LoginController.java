package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.encryp.RsaGen;
import xxw.encryp.RsaUtils;
import xxw.mapper.AuthMapper;
import xxw.mapper.RoleMapper;
import xxw.mapper.UserMapper;
import xxw.po.Role;
import xxw.po.User;
import xxw.util.UpdateRSATask;
import xxw.util.VariableUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.PrintWriter;
import java.security.PublicKey;
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
    public User login(HttpServletRequest request,HttpSession session,HttpServletResponse response){
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
            String tempPath = request.getRealPath("/") + "auth_key";
            String publicFilePath=tempPath+"\\id_key_rsa.pub";
            String privateFilePath=tempPath+"\\id_key_rsa";
            Boolean flag=true;
            File filePathTemp = new File(tempPath);
            if (!filePathTemp.isDirectory()) {
                filePathTemp.mkdirs();
            }
            String [] mylist=filePathTemp.list();
            if(mylist.length<1){
                try {
                    RsaUtils.generateKey(publicFilePath, privateFilePath, "山东智慧云天科技有限公司", 2048);
                    File sjfile=new File(tempPath+"\\datelog.txt");
                    if(!sjfile.exists()){
                        sjfile.createNewFile();
                    }
                    UpdateRSATask task=new UpdateRSATask(tempPath+"\\datelog.txt",privateFilePath,publicFilePath);
                    task.init();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }else{
                try {
                    PublicKey pk = RsaUtils.getPublicKey(publicFilePath);
                    String mes="jR8U+nROuI1DzW96+t/QkXEsVSeDmTZjvtQZYzdK0jvSIO/80IujTD9ZWy9M7rwBCCy40gqD1vlv87A4bHO4pMw2+T6YosFcbi5sckhErPQ0pn19ai1IfiMYMgqVp7i0cz8v2z+w7cjkIblq2ZNiK2byBBCmD2TPzXeN+kiSq1wY20Ph2SxYBBtnYlNH7L3kxTEkgU4zmDOXjPZJXoc9AhNx+EYi1V+5x9/kXNFIwiRHrwOmHw+FqkLVBgs4mIx1MZM3k6yiJjc3qngQZewz4uoH2NBoJkkFsPX7RKawJ0DR1JdLUv2N0OUKDxACRdoEsQi3AnQNRUjeRzH66qtoWg==";
                    //String mes = "WmWh1rDTp1wzSvVhG/sdM81JkSOm+98FOO9mSatslPiExqDhZK3UzmjzeTUxuRAJNeD6iQdqIs4MvICZqRb8ird/wGDIgLJ9u0/8kHXVAPJZfTj7SrA+jV06WIybnh8rDMv4lj9IzMUDVKnuXj7444EYJJcgOYV6bKfJlZc/Jm56c2eymlEbtMvSF4sfgc/ihwdpTXyuCKYT3ZeF04LVLUsoTznMLTQEwBSTO+baMTJIYhB7PHVPXTmdKyJ1hXJYX0Y6ZostY2zdF+G7sGgGsXQ+ZyKtiZ2ywPWqJ8FQp4uBFiU7Sg85zHN+Oyi6BPwMMx8jJ/VbkfLcjjiLGb6OIA==";//encrypt(message,pk);
                    System.out.println("加密结果：" + mes);
                    String res =  RsaGen.decrypt(mes, RsaUtils.getPrivateKey(privateFilePath));
                    System.out.println("解密结果：" + res);
                    flag= RsaUtils.vliadCode(res, tempPath + "\\datelog.txt", privateFilePath);
                    //flag = true;
                    if(!flag){
                        user.setState("0");
                       /* String loginPage =  VariableUtils.URL_LOGIN;
                        response.setContentType("text/html; charset=UTF-8");
                        PrintWriter out = response.getWriter();*/
                        //out.print("<script type='text/javascript'>window.location.href='/rczcgl/" + loginPage + "';</script>");
                        //filterChain.doFilter(request, response);
                    }else{
                        user.setState("1");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
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
