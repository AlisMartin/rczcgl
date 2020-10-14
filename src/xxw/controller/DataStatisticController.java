package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetVO;
import xxw.po.AssetsConfig;
import xxw.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 86188 on 2020/10/13.
 */
@Controller
@Component
@RequestMapping("/statistic")
public class DataStatisticController {
    @Autowired
    AssetsMapper assetsMapper;
    @RequestMapping("/getComIds")
    @ResponseBody
    public List<String> getCompany(HttpServletRequest request) {
        String zctype = request.getParameter("zctype");
        List<String> info = assetsMapper.getComIds(zctype);
        if (info.size() > 0) {
            return info;
        } else {
            return null;
        }
    }

    @RequestMapping("/getTj")
    @ResponseBody
    public ResponseObject getTj(HttpServletRequest request) {
        String zctype = request.getParameter("zctype");
        String sx = request.getParameter("sx");
        List<String> gsmcs = assetsMapper.getComIds(zctype);
        Map<String,Object> datamap=new HashMap<>();
        if(sx.indexOf("1")>-1){
            List<AssetVO> datalist=new ArrayList<>();
            for(String comid:gsmcs){
                Map<String,Object> map=new HashMap<>();
                map=  totalAssets(zctype,comid,"1");
                List<AssetsConfig>configlist=new ArrayList<>();
                if(zctype==null){
                    configlist=assetsMapper.getAllAssetsConfigInfo(null, null);
                }else{
                    configlist=assetsMapper.getAllAssetsConfigInfo(zctype, null);
                    List<AssetsConfig> rzconfiglist=assetsMapper.getAllAssetsConfigInfo("5", null);
                    configlist.addAll(rzconfiglist);
                }
                //融资统计
                for(AssetsConfig assetsConfig :configlist){
                    if(assetsConfig.getFieldname().indexOf("租金")>-1&&assetsConfig.getZctype().equals("2")){
                        if(map.containsKey(assetsConfig.getField())) {
                            AssetVO assetVO = new AssetVO();
                            assetVO.setName(map.get("gsmc").toString());
                            assetVO.setValue(map.get(assetsConfig.getField()).toString());
                            datalist.add(assetVO);
                        }
                    }
                }
            }
            datamap.put("zj",datalist);
        }
        if(sx.indexOf("2")>-1){
            List<AssetVO> datalist=new ArrayList<>();
            for(String comid:gsmcs){
                Map<String,Object> map=new HashMap<>();
                map=  totalAssets(zctype,comid,"1");
                List<AssetsConfig>configlist=new ArrayList<>();
                if(zctype==null){
                    configlist=assetsMapper.getAllAssetsConfigInfo(null, null);
                }else{
                    configlist=assetsMapper.getAllAssetsConfigInfo(zctype, null);
                    List<AssetsConfig> rzconfiglist=assetsMapper.getAllAssetsConfigInfo("5", null);
                    configlist.addAll(rzconfiglist);
                }
                for(AssetsConfig assetsConfig :configlist){
                    if(assetsConfig.getFieldname().indexOf("融资金额")>-1){
                        if(map.containsKey(assetsConfig.getField())){
                            AssetVO assetVO=new AssetVO();
                            assetVO.setName(map.get("gsmc").toString());
                            assetVO.setValue(map.get(assetsConfig.getField()).toString());
                            datalist.add(assetVO);
                        }

                    }
                }
            }
            datamap.put("rzje",datalist);
        }

        return  new ResponseObject(1,"",datamap);
    }

    public Map<String,Object> totalAssets(String zctype,String gsmc,String tjx){
        Map<String,Object> mapCount=new HashMap<>();
        List<AssetsConfig> configlist=assetsMapper.getAllAssetsConfigInfo(zctype, null);
        //融资统计
        List<AssetsConfig> rzconfiglist=assetsMapper.getAllAssetsConfigInfo("5", null);
        configlist.addAll(rzconfiglist);
        List<Map<String,String>> assetslist=assetsMapper.getAllAssetsInfoByMap(zctype, gsmc);
        if(assetslist.size()<1){
            return null;
        }else{
            int maxentry=assetslist.get(0).size();
            int entryi=0;
            for(int i=0;i<assetslist.size();i++){
                if(assetslist.get(i).size()>maxentry){
                    maxentry=assetslist.get(i).size();
                    entryi=i;
                }
            }
            List<String> financeId=new ArrayList<>();
            for(Map.Entry<String,String> entry:assetslist.get(entryi).entrySet()) {
                Float count = (float)0;
                for (int i = 0; i < assetslist.size(); i++) {
                    for (AssetsConfig assetsConfig : configlist) {
                        if (assetsConfig.getFieldType().equals("2") && assetsConfig.getField().toUpperCase().equals(entry.getKey())) {
                            if(assetslist.get(i).containsKey(entry.getKey())){
                                if(assetslist.get(i).containsKey("FINANCEID")&&entry.getKey().indexOf("FCFIELD")>-1){
                                    if(financeId.size()==0){
                                        if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))){
                                            count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                            mapCount.put(entry.getKey().toLowerCase(), count);
                                            financeId.add(assetslist.get(i).get("FINANCEID"));
                                        }

                                    }else{
                                        if(!financeId.contains(assetslist.get(i).get("FINANCEID"))){
                                            if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))){
                                                count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                                mapCount.put(entry.getKey().toLowerCase(), count);
                                                financeId.add(assetslist.get(i).get("FINANCEID"));
                                            }
                                        }
                                    }
                                }else{
                                    if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))){
                                        count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                        mapCount.put(entry.getKey().toLowerCase(), count);
                                    }

                                }
                            }
                        }
                        if(assetsConfig.getFieldname().indexOf("公司")>-1){
                            if(!mapCount.containsKey("gsmc")){
                                mapCount.put("gsmc",assetslist.get(i).get(assetsConfig.getField().toUpperCase()));
                            }

                        }
                    }
                }
            }
            return mapCount;
        }
    }
}
