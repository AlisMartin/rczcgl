package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetVO;
import xxw.po.AssetsConfig;
import xxw.po.AssetsInfo;
import xxw.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
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
                map =  totalAssets(zctype,comid,"1");
/*                List<AssetsConfig>configlist=new ArrayList<>();
                if(zctype==null){
                    configlist=assetsMapper.getAllAssetsConfigInfo(null, null);
                }else{
                    configlist=assetsMapper.getAllAssetsConfigInfo(zctype, null);
                    List<AssetsConfig> rzconfiglist=assetsMapper.getAllAssetsConfigInfo("5", null);
                    configlist.addAll(rzconfiglist);
                }
                //融资统计

                for(AssetsConfig assetsConfig :configlist){
                    if((assetsConfig.getFieldname().indexOf("租金")>-1&&assetsConfig.getZctype().equals("2"))||(assetsConfig.getFieldname().indexOf("租金")>-1&&assetsConfig.getZctype().equals("3"))){
                        if(map.containsKey(assetsConfig.getField())) {
                            AssetVO assetVO = new AssetVO();
                            assetVO.setName(map.get("gsmc").toString());
                            assetVO.setValue(map.get(assetsConfig.getField()).toString());
                            datalist.add(assetVO);
                        }
                    }
                }*/
                AssetVO assetVO = new AssetVO();
                assetVO.setName(map.get("name").toString());
                if(map.get("value")==null){
                    assetVO.setValue("");
                }else{
                    assetVO.setValue(map.get("value").toString());
                }

                datalist.add(assetVO);
            }
            datamap.put("zj",datalist);
        }
        if(sx.indexOf("2")>-1){
            List<AssetVO> datalist=new ArrayList<>();
            for(String comid:gsmcs){
                Map<String,Object> map=new HashMap<>();
                map=  totalAssets(zctype,comid,"2");
 /*               List<AssetsConfig>configlist=new ArrayList<>();
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
                }*/
                AssetVO assetVO = new AssetVO();
                assetVO.setName(map.get("name").toString());
                if(map.get("value")==null){
                    assetVO.setValue("");
                }else{
                    assetVO.setValue(map.get("value").toString());
                }
                datalist.add(assetVO);
            }
            datamap.put("rzje",datalist);
        }

        if(sx.indexOf("3")>-1){
            List<AssetVO> datalist=new ArrayList<>();
            for(String comid:gsmcs){
                Map<String,Object> map=new HashMap<>();
                map=  totalAssets(zctype,comid,"3");
 /*               List<AssetsConfig>configlist=new ArrayList<>();
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
                }*/
                AssetVO assetVO = new AssetVO();
                assetVO.setName(map.get("name").toString());
                if(map.get("value")==null){
                    assetVO.setValue("");
                }else{
                    assetVO.setValue(map.get("value").toString());
                }
                datalist.add(assetVO);
            }
            datamap.put("cjj",datalist);
        }

        return  new ResponseObject(1,"",datamap);
    }

    public Map<String,Object> totalAssets(String zctype,String gsmc,String tjx) {
        Map<String, Object> total = new HashMap<>();
        Map<String, Object> mapCount = new HashMap<>();
        List<AssetsConfig> configlist;
        if (zctype == null) {
            zctype = "1,2,3,4";
        }
        if (zctype.indexOf(",") > -1) {
            String zcarray[] = zctype.split(",");
            Float totalcount = (float) 0;
            for (int y = 0; y < zcarray.length; y++) {
                configlist = assetsMapper.getAllAssetsConfigInfo(zcarray[y], null);
                List<AssetsConfig> rzconfiglist = assetsMapper.getAllAssetsConfigInfo("5", null);
                configlist.addAll(rzconfiglist);
                List<Map<String, String>> assetslist = assetsMapper.getAllAssetsInfoByMap(zcarray[y], gsmc);
                if (assetslist.size() < 1) {
                } else {
                    List<String> financeId = new ArrayList<>();
                    AssetsInfo assetsInfo = new AssetsInfo();
                    Field[] fields = assetsInfo.getClass().getDeclaredFields();
                    for (int x = 0; x < fields.length; x++) {
                        Float count = (float) 0;
                        for (int i = 0; i < assetslist.size(); i++) {
                            for (AssetsConfig assetsConfig : configlist) {
                                if (assetsConfig.getFieldType().equals("2") && assetsConfig.getField().equals(fields[x].getName().toString())) {
                                    if (assetslist.get(i).containsKey(fields[x].getName().toString().toUpperCase())) {
                                        if (assetslist.get(i).containsKey("FINANCEID") && fields[x].getName().toString().toUpperCase().indexOf("FCFIELD") > -1) {
                                            if (financeId.size() == 0) {
                                                if (tjx.indexOf("2") > -1) {
                                                    if ((assetsConfig.getFieldname().indexOf("融资金额") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                        count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                        mapCount.put(zcarray[y], count);
                                                        financeId.add(assetslist.get(i).get("FINANCEID"));
                                                    }
                                                }

                                            } else {
                                                if (!financeId.contains(assetslist.get(i).get("FINANCEID"))) {
                                                    if (tjx.indexOf("2") > -1) {
                                                        if ((assetsConfig.getFieldname().indexOf("融资金额") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                            count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                            mapCount.put(zcarray[y], count);
                                                            financeId.add(assetslist.get(i).get("FINANCEID"));
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if (tjx.indexOf("1") > -1) {
                                                if ((assetsConfig.getFieldname().indexOf("租金") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                    count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                    mapCount.put(zcarray[y], count);
                                                }
                                            }
                                            if (tjx.indexOf("3") > -1) {
                                                if ((assetsConfig.getFieldname().indexOf("成交价(万元)") == 0) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                    count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                    mapCount.put(zcarray[y], count);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (assetsConfig.getFieldname().indexOf("公司") > -1) {
                                    if (!mapCount.containsKey("gsmc")) {
                                        mapCount.put("gsmc", assetslist.get(i).get(assetsConfig.getField().toUpperCase()));
                                    }
                                }
                            }
                        }
                    }

                }
                if (mapCount.containsKey(zcarray[y])) {
                    totalcount = totalcount + Float.parseFloat(mapCount.get(zcarray[y]).toString());
                }
            }
            total.put("value", totalcount);
            total.put("name", mapCount.get("gsmc"));

            return total;
        } else {
            Float totalcount = (float) 0;
            configlist = assetsMapper.getAllAssetsConfigInfo(zctype, null);
            List<AssetsConfig> rzconfiglist = assetsMapper.getAllAssetsConfigInfo("5", null);
            configlist.addAll(rzconfiglist);
            List<Map<String, String>> assetslist = assetsMapper.getAllAssetsInfoByMap(zctype, gsmc);
            if (assetslist.size() < 1) {
            } else {
                List<String> financeId = new ArrayList<>();
                AssetsInfo assetsInfo = new AssetsInfo();
                Field[] fields = assetsInfo.getClass().getDeclaredFields();
                for (int x = 0; x < fields.length; x++) {
                    Float count = (float) 0;
                    for (int i = 0; i < assetslist.size(); i++) {
                        for (AssetsConfig assetsConfig : configlist) {
                            if (assetsConfig.getFieldType().equals("2") && assetsConfig.getField().equals(fields[x].getName().toString())) {
                                if (assetslist.get(i).containsKey(fields[x].getName().toString().toUpperCase())) {
                                    if (assetslist.get(i).containsKey("FINANCEID") && fields[x].getName().toString().toUpperCase().indexOf("FCFIELD") > -1) {
                                        if (financeId.size() == 0) {
                                            if (tjx.indexOf("2") > -1) {
                                                if ((assetsConfig.getFieldname().indexOf("融资金额") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                    count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                    mapCount.put(zctype, count);
                                                    financeId.add(assetslist.get(i).get("FINANCEID"));
                                                }
                                            }

                                        } else {
                                            if (!financeId.contains(assetslist.get(i).get("FINANCEID"))) {
                                                if (tjx.indexOf("2") > -1) {
                                                    if ((assetsConfig.getFieldname().indexOf("融资金额") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                        count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                        mapCount.put(zctype, count);
                                                        financeId.add(assetslist.get(i).get("FINANCEID"));
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (tjx.indexOf("1") > -1) {
                                            if ((assetsConfig.getFieldname().indexOf("租金") > -1) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                mapCount.put(zctype, count);
                                            }
                                        }
                                        if (tjx.indexOf("3") > -1) {
                                            if ((assetsConfig.getFieldname().indexOf("成交价(万元)") == 0) && StringUtil.isNumber(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()))) {
                                                count = count + Float.parseFloat(assetslist.get(i).get(fields[x].getName().toString().toUpperCase()));
                                                mapCount.put(zctype, count);
                                            }
                                        }
                                    }
                                }
                            }
                            if (assetsConfig.getFieldname().indexOf("公司") > -1) {
                                if (!mapCount.containsKey("gsmc")) {
                                    mapCount.put("gsmc", assetslist.get(i).get(assetsConfig.getField().toUpperCase()));
                                }
                            }
                        }
                    }
                }

            }
            total.put("value", mapCount.get(zctype));
            total.put("name", mapCount.get("gsmc"));

            return total;
        }
    }
}
