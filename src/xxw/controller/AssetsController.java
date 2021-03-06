package xxw.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xxw.mapper.SysMessageMapper;
import xxw.po.*;
import xxw.util.DateUtils;
import xxw.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.AssetsMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by lp on 2020/8/7.
 */
@Controller
@Component
@RequestMapping("/assetsconfig")
public class AssetsController {
    @Autowired
    AssetsMapper assetsMapper;
    @Autowired
    SysMessageMapper sysMessageMapper;
    @Autowired
    LogController logController;

    @RequestMapping("/getConfigInfo")
    @ResponseBody
    public List<AssetsConfig> getConfigList(@RequestBody JSONObject json) {
        String zctype = json.getString("zctype");
        // String order = json.getString("order");
        List<AssetsConfig> info = assetsMapper.getAssetsConfigInfo(zctype, null);
        if (info.size() > 0) {
            return info;
        } else {
            return null;
        }
    }

    @RequestMapping("/getAllConfigInfo")
    @ResponseBody
    public List<AssetsConfig> getAllConfigList(HttpServletRequest request) {
        String zctype = request.getParameter("zctype");
        String order = request.getParameter("order");
        if (zctype != null && zctype.indexOf(",") > -1) {
            List<AssetsConfig> info1 = assetsMapper.getAllAssetsConfigInfo(zctype.split(",")[0], order);
            List<AssetsConfig> info2 = assetsMapper.getAllAssetsConfigInfo(zctype.split(",")[1], order);
            info1.addAll(info2);
            if (info1.size() > 0) {
                return info1;
            } else {
                return null;
            }
        } else {
            List<AssetsConfig> info = assetsMapper.getAllAssetsConfigInfo(zctype, order);
            if (info.size() > 0) {
                return info;
            } else {
                return null;
            }
        }

    }

    /*
     * 获取配置信息不包含隐藏show
     */
    @RequestMapping("/getConfigInfoshow")
    @ResponseBody
    public List<AssetsConfig> getConfigListshow(HttpServletRequest request) {
        String zctype = request.getParameter("zctype");
        String order = request.getParameter("order");
        if (zctype != null && zctype.indexOf(",") > -1) {
            List<AssetsConfig> info1 = assetsMapper.getAssetsConfigInfo(zctype.split(",")[0], order);
            List<AssetsConfig> info2 = assetsMapper.getAssetsConfigInfo(zctype.split(",")[1], order);
            info1.addAll(info2);
            if (info1.size() > 0) {
                return info1;
            } else {
                return null;
            }
        } else {
            List<AssetsConfig> info = assetsMapper.getAllAssetsConfigInfo(zctype, order);
            if (info.size() > 0) {
                return info;
            } else {
                return null;
            }
        }

    }

    @RequestMapping("/insertConfig")
    @ResponseBody
    public int insertAssetsConfig(HttpServletRequest request, AssetsConfig assetsConfig) {
        int i = 0;
        assetsConfig.setIsdel("0");
        Integer max = assetsMapper.getMaxField(assetsConfig.getZctype());
        assetsConfig.setField("field" + (max + 1));
        UUID id= UUID.randomUUID();
        assetsConfig.setId(id.toString());
        i = assetsMapper.insertConfig(assetsConfig);
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        String eventDesc = "用户" + user.getUserName() + "添加资产信息项";
        String eventType = "添加资产信息项";
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate = dateFormat.format(date);
        logController.insertLogs(eventType, realdate, eventDesc, user.getId(), user.getUserName());
        return i;
    }

    @RequestMapping("/updateConfig")
    @ResponseBody
    public int updateConfig(HttpServletRequest request, AssetsConfig assetsConfig) {
        int i = 0;
        i = assetsMapper.updateConfig(assetsConfig);

        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        String eventDesc = "用户" + user.getUserName() + "修改资产信息项";
        String eventType = "修改资产信息项";
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate = dateFormat.format(date);
        logController.insertLogs(eventType, realdate, eventDesc, user.getId(), user.getUserName());
        return i;
    }

    @RequestMapping("/getAssetsInfo")
    @ResponseBody
    public Map<String, Object> getAssetsInfo(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));
        String gsmc = json.getString("gsmc");
        String zctype = json.getString("zctype");


        int pageNumber = offset == 0 ? 1 : offset / limit + 1;
        Page page = PageHelper.startPage(pageNumber, limit);
        List<AssetsInfo> info = assetsMapper.getAssetsInfo(zctype, gsmc);
        PageInfo pageInfo = new PageInfo<>(info);
        if (pageInfo.getList().size() > 0) {
            res.put("total", pageInfo.getTotal());
            res.put("rows", pageInfo.getList());
            return res;
        } else {
            return null;
        }
    }

    @RequestMapping("/getSumAssetsInfo")
    @ResponseBody
    public Map<String, Object> getSumAssetsInfo(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
       /* int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));*/
        String gsmc = json.getString("gsmc");
        String zctype = json.getString("zctype");
        /*int pageNumber = offset==0?1:offset/limit + 1;
        Page page = PageHelper.startPage(pageNumber,limit);*/
        List<AssetsInfo> info = assetsMapper.getSumAssetsInfo(zctype, gsmc);
        /* PageInfo pageInfo = new PageInfo<>(info);*/
        if (info.size() > 0) {
            res.put("total", info.size());
            res.put("rows", info);
            return res;
        } else {
            return null;
        }
    }

    @RequestMapping("/getAssetsHistoryInfo")
    @ResponseBody
    public Map<String, Object> getAssetsHistoryInfo(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));
        String gsmc = json.getString("gsmc");
        String zctype = json.getString("zctype");
        int pageNumber = offset == 0 ? 1 : offset / limit + 1;
        Page page = PageHelper.startPage(pageNumber, limit);
        List<AssetsInfoHistory> info = assetsMapper.getAssetsHistoryInfo(zctype, gsmc);
        PageInfo pageInfo = new PageInfo<>(info);
        if (pageInfo.getList().size() > 0) {
            res.put("total", pageInfo.getTotal());
            res.put("rows", pageInfo.getList());
            return res;
        } else {
            return null;
        }
    }

    @RequestMapping("/getAllSumAssetsInfo")
    @ResponseBody
    public Map<String, Object> getAllSumAssetsInfo(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        String gsmc = json.getString("gsmc");
        String zctype = json.getString("zctype");
        List<AssetsInfo> info = assetsMapper.getSumAssetsInfo(zctype, gsmc);
        PageInfo pageInfo = new PageInfo<>(info);
        if (pageInfo.getList().size() > 0) {
            res.put("total", pageInfo.getTotal());
            res.put("rows", pageInfo.getList());
            return res;
        } else {
            return null;
        }
    }

    @RequestMapping("/getAssetByid")
    @ResponseBody
    public Map<String, Object> getAssetByid(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        String zcid = json.getString("zcid");
        AssetsInfo info = assetsMapper.getAssetByid(zcid);
        res.put("code", 1);
        res.put("data", info);
        return res;
    }

    @RequestMapping("/getAssetsInfoByName")
    @ResponseBody
    public Map<String, Object> findAssetsInfoByName(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        JSONArray zctypes = json.getJSONArray("zctypes");
        String name = json.getString("name");
        if (StringUtil.isEmpty(name)) {
            res.put("code", 0);
            res.put("data", null);
            return res;
        }
        List<AssetsConfig> assetsInfos = assetsMapper.getFieldByTypeAndName(zctypes);

        String field1 = null, field2 = null, field3 = null, field4 = null;
        for (AssetsConfig info : assetsInfos) {
            if (zctypes.contains("1") && "1".equals(info.getZctype())) {
                field1 = info.getField();
            }
            if (zctypes.contains("2") && "2".equals(info.getZctype())) {
                field2 = info.getField();
            }
            if (zctypes.contains("3") && "3".equals(info.getZctype())) {
                field3 = info.getField();
            }
            if (zctypes.contains("4") && "4".equals(info.getZctype())) {
                field4 = info.getField();
            }
        }
        List<AssetsInfo> infoList = assetsMapper.getAssetsInfoByName(StringUtil.formatLike(name), field1, field2, field3, field4);
        if (assetsInfos.size() > 0 && infoList.size() > 0) {
            res.put("total", infoList.size());
            res.put("rows", infoList);
            return res;
        } else {
            res.put("code", 0);
            res.put("data", null);
            return res;
        }
    }

    @RequestMapping("/addAssetsByType")
    @ResponseBody
    public ResponseObject addAssetsByType(@RequestBody List<AssetVO> dto) {
        Map<String, Object> insertInfo = new HashMap<>();
        for (AssetVO assetVO : dto) {
            if (StringUtil.isNotEmpty(assetVO.getValue())) {
                if ("stopday".equals(assetVO.getName())) {
                    SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
                    try {
                        Date realdate1 = dateFormat1.parse(assetVO.getValue());
                        insertInfo.put("stopday", realdate1);
                    } catch (Exception e) {
                    }
                    continue;
                }
                insertInfo.put(assetVO.getName(), assetVO.getValue());
            }
        }
        UUID uuid = UUID.randomUUID();
        //获取session
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        //插入资产的公司id
        insertInfo.put("companyid", user.getComId());
        insertInfo.put("zcid", uuid.toString());
        if ("2".equals(insertInfo.get("zctype"))) {
            insertInfo.put("layerid", uuid.toString());
        }

        int i = assetsMapper.insertAssetsInfo(insertInfo);

        String eventDesc = "用户" + user.getUserName() + "新增资产";
        String eventType = "新增资产";
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String realdate = dateFormat.format(date);
        logController.insertLogs(eventType, realdate, eventDesc, user.getId(), user.getUserName());
        if (i == 1) {
            if ("2".equals(insertInfo.get("zctype"))) {
                return new ResponseObject(1, "成功", uuid);
            } else {
                return new ResponseObject(1, "成功", "");
            }

        } else {
            return new ResponseObject(0, "失败", "");
        }
    }

    @RequestMapping("/editAsset")
    @ResponseBody
    public ResponseObject editAsset(@RequestBody List<AssetVO> dto) {
        String jsusers = "";
        Map<String, Object> insertInfo = new HashMap<>();
        for (AssetVO assetVO : dto) {
            if ("jsusers".equals(assetVO.getName())) {
                jsusers = assetVO.getValue();
                continue;
            }
            if ("stopday".equals(assetVO.getName())) {
                SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
                if(assetVO.getValue()!=null){
                    try {
                        Date realdate1 = dateFormat1.parse(assetVO.getValue());
                        insertInfo.put("stopday", realdate1);
                    } catch (Exception e) {
                    }
                }else{
                    //asdasd
                    insertInfo.put("stopday", null);
                }


                continue;

            }
            //if (StringUtil.isNotEmpty(assetVO.getValue())) {
                insertInfo.put(assetVO.getName(), assetVO.getValue());
            //}
        }
        String zcid = insertInfo.get("zcid").toString();
        Map<String, String> assetsInfo = assetsMapper.selectAssetsInfo(zcid);
        int i;
        if (StringUtil.isNotEmpty(insertInfo.get("zctype") == null ? null : insertInfo.get("zctype").toString())) {
            UUID uuid = UUID.randomUUID();

            assetsInfo.remove("ID");
            assetsInfo.put("ZCID", uuid.toString());
            i = assetsMapper.insertAssetsInfoHistory(assetsInfo);

            //先从资产表吧老的存到历史表，再把新的编辑进去
            int a = assetsMapper.updateAssetsInfo(insertInfo);

            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpSession session = request.getSession();
            User user = (User) session.getAttribute("user");
            String eventDesc = "用户" + user.getUserName() + "编辑资产";
            String eventType = "编辑资产";
            Date dates = new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String realdate = dateFormat.format(dates);
            logController.insertLogs(eventType, realdate, eventDesc, user.getId(), user.getUserName());

            SysMessage sysMessage = new SysMessage();
            sysMessage.setFlowName(insertInfo.get("field3") == null ? null : insertInfo.get("field3").toString());
            sysMessage.setFlowId(uuid.toString());
            Date date = new Date();
            String tsdate = DateUtils.getFormatTime(date, "yyyy-MM-dd HH:mm:ss");
            sysMessage.setTsDate(tsdate);
            sysMessage.setJsId(jsusers);
            sysMessage.setTsUser(user.getUserName());
            sysMessage.setTsId(user.getId());
            sysMessage.setDesc("资产信息变更");
            sysMessage.setShow("1");
            sysMessage.setType(insertInfo.get("zctype") == null ? null : insertInfo.get("zctype").toString());
            sysMessage.setFlowtype("assess");
            sysMessageMapper.insertSysMessage(sysMessage);
        } else {
            i = assetsMapper.updateAssetsInfo(insertInfo);
        }
        if (i == 1) {
            return new ResponseObject(1, "成功", assetsInfo.get("LAYERID"));
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }

    @RequestMapping("/getAssetFileListByZcid")
    @ResponseBody
    public Map<String, Object> getAssetFileListByZcid(@RequestBody JSONObject json) {
        Map<String, Object> res = new HashMap<>();
        String zcid = json.getString("zcid");
        List<AssetsFile> fileList = assetsMapper.getAssetFileListByZcid(zcid);
        res.put("total", fileList.size());
        res.put("rows", fileList);
        res.put("msg", "成功");
        return res;
    }

    @RequestMapping("/total")
    @ResponseBody
    public Map<String, Float> totalAssets(HttpServletRequest request) {
        String zctype = request.getParameter("zctype");
        String gsmc = request.getParameter("gsmc");
        Map<String, Float> mapCount = new HashMap<>();
        List<AssetsConfig> configlist = assetsMapper.getAllAssetsConfigInfo(zctype, null);
        //融资统计
        List<AssetsConfig> rzconfiglist = assetsMapper.getAllAssetsConfigInfo("5", null);
        configlist.addAll(rzconfiglist);
        List<Map<String, String>> assetslist = assetsMapper.getAllAssetsInfoByMap(zctype, gsmc);
        if (assetslist.size() < 1) {
            return null;
        } else {
            int maxentry = assetslist.get(0).size();
            int entryi = 0;
            for (int i = 0; i < assetslist.size(); i++) {
                if (assetslist.get(i).size() > maxentry) {
                    maxentry = assetslist.get(i).size();
                    entryi = i;
                }
            }
            List<String> financeId = new ArrayList<>();
            for (Map.Entry<String, String> entry : assetslist.get(entryi).entrySet()) {
                Float count = (float) 0;
                for (int i = 0; i < assetslist.size(); i++) {
                    for (AssetsConfig assetsConfig : configlist) {
                        if (assetsConfig.getFieldType().equals("2") && assetsConfig.getField().toUpperCase().equals(entry.getKey())) {
                            if (assetslist.get(i).containsKey(entry.getKey())) {
                                if (assetslist.get(i).containsKey("FINANCEID") && entry.getKey().indexOf("FCFIELD") > -1) {
                                    if (financeId.size() == 0) {
                                        if (StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                            count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                            mapCount.put(entry.getKey().toLowerCase(), count);
                                            financeId.add(assetslist.get(i).get("FINANCEID"));
                                        }

                                    } else {
                                        if (!financeId.contains(assetslist.get(i).get("FINANCEID"))) {
                                            if (StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                                count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                                mapCount.put(entry.getKey().toLowerCase(), count);
                                                financeId.add(assetslist.get(i).get("FINANCEID"));
                                            }
                                        }
                                    }
                                } else {
                                    if (!financeId.contains(assetslist.get(i).get("FINANCEID"))) {
                                        if (StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                            count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                            mapCount.put(entry.getKey().toLowerCase(), count);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return mapCount;
        }

    }

    @RequestMapping("/delAssets")
    @ResponseBody
    public ResponseObject delAssets(@RequestBody JSONObject json) {
        String id = json.getString("id");
        Integer a = assetsMapper.delAssets(id);
        if (a == 1) {
            return new ResponseObject(1, "成功", "");
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }

    @RequestMapping("/delAssetsFile")
    @ResponseBody
    public ResponseObject delAssetsFile(@RequestBody JSONObject json) {
        String id = json.getString("id");
        Integer a = assetsMapper.delAssetsFile(id);
        if (a == 1) {
            return new ResponseObject(1, "成功", "");
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }

    /**
     * 每天02点30启动任务
     */
    // @Scheduled(cron = "0/25 * *  * * ? ")   //每5秒执行一次
    @Scheduled(cron = "0 30 02 ? * *")
    public void test1() {
        List<AssetsInfo> configlist = assetsMapper.getAssetsInfo(null, null);
        List<AssetsInfo> reslist = new ArrayList<>();
        Date date1 = new Date();
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);
        // 将时分秒,毫秒域清零
        cal1.set(Calendar.HOUR_OF_DAY, 0);
        cal1.set(Calendar.MINUTE, 0);
        cal1.set(Calendar.SECOND, 0);
        cal1.set(Calendar.MILLISECOND, 0);
        date1 = cal1.getTime();

        for (AssetsInfo assetsInfo : configlist) {
            if (assetsInfo.getDays() != null && assetsInfo.getStopday() != null) {
                String stopday = assetsInfo.getStopday();
                Date date2;
                try {
                    date2 = new SimpleDateFormat("yyyy-MM-dd").parse(stopday);
                } catch (Exception e) {
                    e.printStackTrace();
                    continue;
                }

                Integer days = Integer.parseInt(assetsInfo.getDays());
                int betweenDay = DateUtils.daysBetween(date1, date2);
                assetsInfo.setDayorder(betweenDay);
                reslist.add(assetsInfo);
            }
        }
        int res = assetsMapper.updateAssetsInfoDays(reslist);
        System.out.println("定时任务。。。计算到期时间" + (new Date()).toString() + "结果：" + res);
    }
}
