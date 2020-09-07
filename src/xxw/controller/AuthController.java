package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AuthMapper;
import xxw.po.Auth;

import java.util.List;

/**
 * Created by lp on 2020/6/1.
 */
@Controller
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthMapper authMapper;

    @RequestMapping("/getAllauths")
    @ResponseBody
    public List<Auth> getAllauths(){
        List<Auth> list=authMapper.getAllAuth();
        if(list.size()>0){
            return list;
        }else{
            return null;
        }
    }
}
