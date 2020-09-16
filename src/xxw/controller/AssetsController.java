package xxw.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import xxw.po.AssetVO;
import xxw.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetsConfig;
import xxw.po.AssetsInfo;
import xxw.po.AssetsParam;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    @RequestMapping("/getAssetsInfoByName")
    @ResponseBody
    public Map<String,Object> findAssetsInfoByName(@RequestBody JSONObject json){
        Map<String,Object> res = new HashMap<>();
        JSONArray zctypes = json.getJSONArray("zctypes");
        String name = json.getString("name");
        List<String> info=assetsMapper.getFieldByTypeAndName(zctypes);

        String field1,field2,field3,field4;
        field1=info.get(0);
        field2=info.size()>1?info.get(1):null;
        field3=info.size()>1?info.get(2):null;
        field4=info.size()>1?info.get(3):null;
        List<AssetsInfo> infoList=assetsMapper.getAssetsInfoByName(StringUtil.formatLike(name),field1,field2,field3,field4);
        if (infoList.size()>0){
            res.put("code",1);
            res.put("data",infoList);
            return  res;
        }else{
            res.put("code",0);
            res.put("data",null);
            return  res;
        }
    }
    @RequestMapping("/addAssetsByType")
    @ResponseBody
    public ResponseObject addAssetsByType(@RequestBody List<AssetVO> dto) {
        Map<String, Object> res = new HashMap<>();
        Map<String, String> insertInfo = new HashMap<>();
        for (AssetVO assetVO : dto) {
            if (StringUtil.isNotEmpty(assetVO.getValue())) {
                insertInfo.put(assetVO.getName(), assetVO.getValue());
            }
        }
        UUID uuid = UUID.randomUUID();
        insertInfo.put("zcid", uuid.toString());
        int i = assetsMapper.insertAssetsInfo(insertInfo);
        if (i == 1) {
            return new ResponseObject(1, "³É¹¦", "");
        } else {
            return new ResponseObject(1, "Ê§°Ü", "");
        }
    }
}
