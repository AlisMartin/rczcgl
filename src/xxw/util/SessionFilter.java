package xxw.util;

import org.springframework.web.filter.OncePerRequestFilter;
import xxw.encryp.RsaGen;
import xxw.encryp.RsaUtils;
import xxw.po.User;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.PublicKey;

/**
 * <p>用户登录过滤器</p>
 * @author zxf
 * @date 2016/1/6
 * @version 1.0
 */
public class SessionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

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
                String mes = "WmWh1rDTp1wzSvVhG/sdM81JkSOm+98FOO9mSatslPiExqDhZK3UzmjzeTUxuRAJNeD6iQdqIs4MvICZqRb8ird/wGDIgLJ9u0/8kHXVAPJZfTj7SrA+jV06WIybnh8rDMv4lj9IzMUDVKnuXj7444EYJJcgOYV6bKfJlZc/Jm56c2eymlEbtMvSF4sfgc/ihwdpTXyuCKYT3ZeF04LVLUsoTznMLTQEwBSTO+baMTJIYhB7PHVPXTmdKyJ1hXJYX0Y6ZostY2zdF+G7sGgGsXQ+ZyKtiZ2ywPWqJ8FQp4uBFiU7Sg85zHN+Oyi6BPwMMx8jJ/VbkfLcjjiLGb6OIA==";//encrypt(message,pk);
                System.out.println("加密结果：" + mes);
                String res =  RsaGen.decrypt(mes, RsaUtils.getPrivateKey(privateFilePath));
                System.out.println("解密结果：" + res);
//                flag=RsaUtils.vliadCode(res,tempPath+"\\datelog.txt",privateFilePath);
                flag = true;
                if(!flag){
                    String loginPage =  VariableUtils.DQ_PAGE;
                    response.setContentType("text/html; charset=UTF-8");
                    PrintWriter out = response.getWriter();
                    out.print("<script type='text/javascript'>window.location.href='/rczcgl/" + loginPage + "';</script>");
                    filterChain.doFilter(request, response);
                }else{
                    String pageUrl = request.getHeader("REFERER");
                    // 不过滤的uri
                    String[] notFilter = new String[] { "login.html","/js/","/css/","/images/","/user",".ico"};
                    // 过滤的uri
                    String[] filter = new String[] {".html",".action"};

                    // 请求的uri
                    String uri = request.getRequestURI();
                    //System.out.println("收到请求：" + uri);

                    // 是否过滤
                    boolean doFilter = true;
                    for (String s : notFilter) {
                        if (uri.indexOf(s) != -1) {
                            // 如果uri中包含不过滤的uri，则不进行过滤
                            doFilter = false;
                            break;
                        }
                    }

                    HttpSession session = request.getSession();

                    //boolean doFilter = true;
//        System.out.println("页面地址" + pageUrl);
//        if((pageUrl != null && pageUrl.contains("#/")) ||uri.contains("#/")) { //改厕的移动页面，不过滤
//            System.out.println("不过滤");
//            doFilter = false;
//            loginPage = "#/Login";
//        }else
                    if(!uri.contains("login") && !uri.contains("login/userLogin.action")
                            && !uri.contains("user/remUserCheck.action") && !uri.contains("user/userCheck.action")
                            && !uri.contains("user/logout.action")&& !uri.contains("user/getLoginCheck.action")){
                        for (String s : filter) {
                            if (uri.contains(s)) {
                                // 如果uri中包含不过滤的uri，则不进行过滤
                                doFilter = true;
                                break;
                            }
                        }
                    }

//        for (String s : filter) {
//            if (uri.contains(s) && !uri.contains("login") && !uri.contains("/user")) {
//                // 如果uri中包含不过滤的uri，则不进行过滤
//                doFilter = true;
//                break;
//            }
//        }
                    // doFilter=false;
                    if (doFilter) {
                        response.setCharacterEncoding("UTF-8");
                        // 执行过滤

                        //根据ajax请求中的client参数，获取登录页面地址 added by lipeng 2019.9.22
                        Object client = request.getParameter("client");
                        String loginPage = (client !=null && client.equals(VariableUtils.CLIENT_MOBILE)) ?
                                VariableUtils.URL_LOGIN_LATRINE: VariableUtils.URL_LOGIN;

                        // 从session中获取登录者实体
                        User user = (User)session.getAttribute("user");
                        //String username=user.getUserName();
                        Object indexHref = session.getAttribute(VariableUtils.INDEX_HREF);
                        if((null==user)){
//            if((null!=username)&&(uri.contains(VariableUtils.URL_INDEX) ||
//                    uri.contains(VariableUtils.URL_DISTRICT) ||
//                    uri.contains(VariableUtils.URL_TOWN))){

                            response.setContentType("text/html; charset=UTF-8");
                            PrintWriter out = response.getWriter();
                            out.print("<script type='text/javascript'>window.location.href='/rczcgl/" + loginPage + "';</script>");


                        }else{
                            filterChain.doFilter(request, response);
                        }
                    } else {
                        // 如果不执行过滤，则继续
                        filterChain.doFilter(request, response);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
