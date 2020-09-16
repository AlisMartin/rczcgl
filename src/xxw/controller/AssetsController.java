package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetsConfig;
import xxw.po.AssetsInfo;
import xxw.po.AssetsParam;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by lp on 2020/8/7.
 */
@Controller
@RequestMapping("/assetsconfig")
public class AssetsController {
    @Autowired
    AssetsMapper assetsMapper;
    @RequestMapping("/getConfigInfo")
    @ResponseBody
    public List<AssetsConfig> getConfigList(HttpServletRequest request){
        String zctype=request.getParameter("zctype");
        String order=request.getParameter("order");
        List<AssetsConfig> info=assetsMapper.getAssetsConfigInfo(zctype,order);
        if(info.size()>0){
            return  info;
        }else{
            return null;
        }
    }
    @RequestMapping("/getAllConfigInfo")
    @ResponseBody
    public List<AssetsConfig> getAllConfigList(HttpServletRequest request){
        String zctype=request.getParameter("zctype");
        String order=request.getParameter("order");
        List<AssetsConfig> info=assetsMapper.getAllAssetsConfigInfo(zctype,order);
        if(info.size()>0){
            return  info;
        }else{
            return null;
        }
    }
    @RequestMapping("/insertConfig")
    @ResponseBody
    public int insertAssetsConfig(HttpServletRequest request,AssetsConfig assetsConfig){
        int i=0;
        i=assetsMapper.insertConfig(assetsConfig);
        return i;
    }
    @RequestMapping("/updateConfig")
    @ResponseBody
    public int updateConfig(HttpServletRequest request,AssetsConfig assetsConfig){
        int i=0;
        i=assetsMapper.updateConfig(assetsConfig);
        return i;
    }
    @RequestMapping("/getAssetsInfo")
    @ResponseBody
    public List<AssetsInfo> getAssetsInfo(HttpServletRequest request,AssetsConfig assetsConfig){
        List<AssetsInfo> info=assetsMapper.getAssetsInfo(assetsConfig.getZctype());
        if(info.size()>0){
            return  info;
        }else{
            return null;
        }
    }
}
