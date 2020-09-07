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
        List<AssetsConfig> info=assetsMapper.getAssetsConfigInfo(zctype);
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
      /*  String zctype=request.getParameter("zctype");
        String fieldname=request.getParameter("fieldname");
        String field=request.getParameter("field");*/
    /*    assetsConfig.setZctype(zctype);
        assetsConfig.setField(field);
        assetsConfig.setFieldname(fieldname);*/
        i=assetsMapper.insertConfig(assetsConfig);
        return i;
    }
    @RequestMapping("/getAssetsInfo")
    @ResponseBody
    public List<AssetsInfo> getAssetsInfo(HttpServletRequest request,AssetsParam assetsParam){
        List<AssetsInfo> info=assetsMapper.getAssetsInfo(assetsParam.getZctype());
        if(info.size()>0){
            return  info;
        }else{
            return null;
        }
    }
}
