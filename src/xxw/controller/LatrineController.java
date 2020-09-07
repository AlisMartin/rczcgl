package xxw.controller;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.LatrineMapper;
import xxw.po.Latrine;
import xxw.po.Region;
import xxw.po.UploadFile;
import xxw.service.LatrineService;
import xxw.util.VariableUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.*;

/**
 * <p>户厕改造信息表controller类</p>
 * @author zzm
 * @date 2019/8/15
 * @version 1.0
 */
@Controller
@RequestMapping("/latrine")
public class LatrineController {
    @Autowired
    private LatrineService latrineService;
    @Autowired
    private LatrineMapper latrineMapper;
    private ObjectMapper objectMapper = new ObjectMapper();
    /**
     * 登录接口示例
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/login")
    @ResponseBody
    public ResponseObject login(HttpServletRequest request, HttpServletResponse response){

        String name = request.getParameter("name");
        String pwd = request.getParameter("pwd");
        if(name!=null&&pwd!=null){
            if(name.equals("admin")&&pwd.equals("123")){
                return new ResponseObject(VariableUtils.SUCCESS,"登录验证成功","");
            }else{
                return new ResponseObject(VariableUtils.FAILURE,"登录验证失败","");
            }
        }else{
            return new ResponseObject(VariableUtils.FAILURE,"登录验证失败","");
        }



    }
    /**
     * 新增户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/addInfo")
    @ResponseBody
    public ResponseObject addInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody Latrine latrine){

        if(latrine == null){
            return new ResponseObject(VariableUtils.FAILURE,"新增失败","");
        }
        int maxId = latrineMapper.selectMaxId();
        maxId=maxId+1;
        latrine.setId(BigDecimal.valueOf((int) maxId));
        String uuid = UUID.randomUUID().toString();
        String unique=latrine.getCounty()+uuid;
        latrine.setUniqueId(unique);
        int count = latrineMapper.insertSelective(latrine);

        if(count <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"新增失败","");
        }

        return new ResponseObject(VariableUtils.SUCCESS,"新增成功","");
    }

    /**
     * 更新户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/updateInfo")
    @ResponseBody
    public ResponseObject updateInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody Latrine latrine){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        if(latrine == null || latrine.getId() == null){
            return new ResponseObject(VariableUtils.FAILURE,"更新失败","");
        }
        int count = latrineMapper.updateByPrimaryKeySelective(latrine);

        if(count <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"更新失败","");
        }

        return new ResponseObject(VariableUtils.SUCCESS,"更新成功","");
    }

    /**
     * 删除户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/deleteInfo")
    @ResponseBody
    public ResponseObject deleteInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody Latrine latrine){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        if(latrine == null || latrine.getId() == null){
            return new ResponseObject(VariableUtils.FAILURE,"删除失败","");
        }

        int count = latrineMapper.deleteByPrimaryKey(latrine.getId());

        if(count <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"删除失败","");
        }

        return new ResponseObject(VariableUtils.SUCCESS,"删除成功","");
    }
    /**
     * 删除户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/deleteByUid")
    @ResponseBody
    public ResponseObject deleteByUid(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }
        String uniqueId=request.getParameter("uniqueId");

        int count = latrineMapper.deleteByUid(uniqueId);

        if(count <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"删除失败","");
        }

        return new ResponseObject(VariableUtils.SUCCESS,"删除成功","");
    }

    /**
     * 查询户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryInfo")
    @ResponseBody
    public ResponseObject queryInfo(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String renovateDate = request.getParameter("renovateDate");
        String name = request.getParameter("name");
        String checkStr = request.getParameter("check");
        String pageStr = request.getParameter("page");
        String limitStr  = request.getParameter("limit");
        String state = request.getParameter("state");
        Integer check = null;
        Integer page = null;
        Integer limit = null;
        if(checkStr != null) check = Integer.parseInt(checkStr);
        if(pageStr != null) page = Integer.parseInt(pageStr);
        if(limitStr != null) limit = Integer.parseInt(limitStr);
        List<Latrine> latrineList=new ArrayList<Latrine>();
        if(check==0){
            String []states={"0","2","4","6"};
            latrineList=latrineMapper.queryLatrineByPagingX(county, town, village, renovateDate, name, null, states,page, limit);
        }else{
            String []states={"1","3","5","7"};
            latrineList = latrineMapper.queryLatrineByPagingX(county, town, village, renovateDate, name, null, states,page, limit);
        }


        if(latrineList != null) {
            return new ResponseObject(VariableUtils.SUCCESS,"",latrineList);
        }
        return new ResponseObject(VariableUtils.FAILURE,"查询失败",latrineList);
    }

    /**
     * 查询户厕改造数量
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryCount")
    @ResponseBody
    public ResponseObject queryCount(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String renovateDate = request.getParameter("renovateDate");
        String name = request.getParameter("name");
        String []uncheckallState={"0","2","4","6"};
        String []uncheckState={"0","2","4","6"};
        String []checkState={"1","3","5","7"};
        int uncheckallCount = latrineMapper.queryLatrineCountX(county, town, village, renovateDate, name, null,uncheckallState);
        int uncheckCount = latrineMapper.queryLatrineCountX(county, town, village, renovateDate, name, null,uncheckState);
        int checkCount = latrineMapper.queryLatrineCountX(county, town, village, renovateDate, name, null,checkState);

        Map<String, Integer> checkCountMap = new HashMap<>();
        checkCountMap.put("check", checkCount);
        checkCountMap.put("uncheck", uncheckCount);
        checkCountMap.put("uncheckall", uncheckallCount);
        checkCountMap.put("total", checkCount + uncheckCount);

        return new ResponseObject(VariableUtils.SUCCESS,"",checkCountMap);
    }

    /**
     * 查询镇办所处区县
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryCounty")
    @ResponseBody
    public ResponseObject queryCounty(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String town = request.getParameter("town");

        if(town == null) return new ResponseObject(VariableUtils.FAILURE,"","");

        return new ResponseObject(VariableUtils.SUCCESS,"", latrineMapper.queryCounty(town));
    }

    /**
     * 查询区县
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryCounties")
    @ResponseBody
    public ResponseObject queryCounties(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String renovateDate = request.getParameter("renovateDate");
        String checkStr = request.getParameter("check");

        Integer check = null;
        if(checkStr != null) check = Integer.parseInt(checkStr);

        List<String> countyList = latrineMapper.queryCounties(renovateDate, check);

        return new ResponseObject(VariableUtils.SUCCESS,"",countyList);
    }

    /**
     * 查询镇办
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryTowns")
    @ResponseBody
    public ResponseObject queryTowns(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        String renovateDate = request.getParameter("renovateDate");
        String checkStr = request.getParameter("check");

        Integer check = null;
        if(checkStr != null) check = Integer.parseInt(checkStr);

        List<String> townList = latrineMapper.queryTowns(county, renovateDate, check);

        return new ResponseObject(VariableUtils.SUCCESS,"",townList);
    }

    /**
     * 查询村庄
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryVillages")
    @ResponseBody
    public ResponseObject queryVillages(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String renovateDate = request.getParameter("renovateDate");
        String checkStr = request.getParameter("check");

        Integer check = null;
        if(checkStr != null) check = Integer.parseInt(checkStr);

        List<String> villageList = latrineMapper.queryVillagesX(county, town, renovateDate, check);

        return new ResponseObject(VariableUtils.SUCCESS,"",villageList);
    }

    /**
     * 统计户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象，返回数据的格式为：
     *         {
     *          sum:{total:总数, check:核实数, uncheck:未核实数}
     *          child:{[{name:子区划, total:总数, check:核实数, uncheck:未核实数}}]}
     *          renovatemode:{[{id:改厕类型编码,count:改厕类型总数}]}
     *         }
     */
    @RequestMapping("/statInfo")
    @ResponseBody
    public ResponseObject statInfo(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        if(county!=null){
            county=county.replace("区","").replace("县","");
            if(county.indexOf("市")>0){//防止“市中”被误截取
                county = county.replace("市","");
            }
        }
        String town = request.getParameter("town");
        if(town!=null){
            town=town.replace("镇","").replace("街道办事处","").replace("街道办","").replace("街道","").replace("街办","");
        }

        String renovateDate = request.getParameter("renovateDate");

        Map<String, Object> statInfoMap = latrineService.statInfo(county, town, renovateDate);

        return new ResponseObject(VariableUtils.SUCCESS,"",statInfoMap);
    }

    /**
     * 更新村信息照片
     * @param request http请求对象
     * @param response  http响应对象
     * @param session session对象
     */
    @RequestMapping("/updateLatrinePicture")
    @ResponseBody
    public String updateLatrinePicture(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        response.setHeader("pragma", "no-cache");
        response.setHeader("cache-control","no-cache");

        //设置接收的编码格式
        try {
            request.setCharacterEncoding("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String flag = latrineService.uploadPicture(request);
        if(!flag.equals("0")) {
            //返回字符串对象，解决IE9中ajaxsubmit不兼容json的问题 by lipeng
//            return new ResponseObject(VariableUtils.SUCCESS, "", flag);
            return "{\"code\":\"" + VariableUtils.SUCCESS + "\",\"message\":" + "\"\",\"data\":\"" + flag + "\"}";
        }
//        return new ResponseObject(VariableUtils.FAILURE, "上传失败", flag);
        return "{\"code\":\"" + VariableUtils.FAILURE + "\",\"message\":" + "\"上传失败\",\"data\":\"" + flag + "\"}";
    }

    /**
     * 查询图片
     * @param request http请求对象
     * @param response  http响应对象
     * @param session session对象
     */
    @RequestMapping("/selectPics")
    @ResponseBody
    public List<UploadFile> selectPics(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String uniqueId = request.getParameter("uniqueId");
        List<UploadFile> uploadFileList = null;
        uploadFileList = latrineService.queryPics(uniqueId);

        return uploadFileList;
    }

    /**
     * 删除单张图片
     * @param request http请求对象
     * @param response http响应对象
     */
    @RequestMapping("/deletePicture")
    @ResponseBody
    public ResponseObject deletePicture(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("pragma", "no-cache");
        response.setHeader("cache-control","no-cache");
        //设置接收的编码格式
        try {
            request.setCharacterEncoding("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        String path = request.getParameter("path");
        String uniqueId = request.getParameter("uniqueId");
        String picName = request.getParameter("picName");

        int flag = 0;
        if(uniqueId != null && picName != null) {
            flag = latrineService.deletePicture(path, uniqueId, picName);
            if (flag == 1) {
                return new ResponseObject(VariableUtils.SUCCESS, "", flag);
            }
        }
        return new ResponseObject(VariableUtils.FAILURE, "删除失败", flag);
    }
    /**
     * 判断村序号vilindex是否重复
     * @param request http请求对象
     * @param response http响应对象
     */
    @RequestMapping("/judgeVilindexRepeat")
    @ResponseBody
    public int judgingVilindexRepeat(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("pragma", "no-cache");
        response.setHeader("cache-control","no-cache");
        //设置接收的编码格式
        try {
            request.setCharacterEncoding("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String vil_index = request.getParameter("vilindex");
        Integer vilindex=null;
        if(vil_index!=null){
            vilindex = Integer.parseInt(vil_index);
        }
        int count=latrineMapper.judgevilindexrepeat(county,town,village,vilindex);
        if(count>0){
            return 1;
        }else{
            return 0;
        }
    }
    /**
     * 查询户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryInfoByPage")
    @ResponseBody
    public ResponseObject queryInfoByPage(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        String county=null;
        String town=null;
        String village=null;
        String renovateDate=null;
        String checkDate=null;
        String name=null;
        String state=null;
        Integer[] states=null;
        String vilstate=null;
        String cardcf=null;
        String currentXz=null;
        String renovateModeFs=null;
        String flushModeCs=null;
        String toiletLocaitonWz=null;
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");
            county = request.getParameter("county");
            town = request.getParameter("town");
            village = request.getParameter("village");
            renovateDate = request.getParameter("renovateDate");
            checkDate = request.getParameter("checkDate");
            name = request.getParameter("name");
            state = request.getParameter("isCheck");
            vilstate = request.getParameter("vilstate");
            cardcf = request.getParameter("cardcf");
            currentXz = request.getParameter("currentxz");
            renovateModeFs = request.getParameter("renovateModeFs");
            flushModeCs = request.getParameter("flushModeCs");
            toiletLocaitonWz = request.getParameter("toiletLocationWz");

            if(state!=null&&state.indexOf(",")>0) {
                String []arr=state.split(",");
                states=new Integer[arr.length];
                for(int i=0;i<arr.length;i++){
                    states[i]=Integer.parseInt(arr[i]);
                }
            }
            if(state!=null&&state.indexOf(",")<0){
                states=new Integer[1];
                states[0]=Integer.parseInt(state);
            }
            if(county !=null){
                county=URLDecoder.decode(county, "UTF-8");
            }
            if(town !=null){
                town=URLDecoder.decode(town, "UTF-8");
            }
            if(village !=null){
                village=URLDecoder.decode(village, "UTF-8");
            }
            if(renovateDate !=null){
                renovateDate=URLDecoder.decode(renovateDate, "UTF-8");
            }
            if(name !=null){
                name=URLDecoder.decode(name, "UTF-8");
            }
            if(vilstate !=null){
                vilstate=URLDecoder.decode(vilstate, "UTF-8");
            }
            if(cardcf !=null){
                cardcf=URLDecoder.decode(cardcf, "UTF-8");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        String checkStr = request.getParameter("check");
        String pageStr = request.getParameter("page");
        String limitStr  = request.getParameter("limit");

        Integer check = null;
        Integer page = null;
        Integer limit = null;
        if(checkStr != null) check = Integer.parseInt(checkStr);
        if(pageStr != null) page = Integer.parseInt(pageStr);
        if(limitStr != null) limit = Integer.parseInt(limitStr);
        List<Latrine> latrineList = latrineMapper.queryLatrineByPaging(county, town, village, renovateDate,checkDate, name,check,states,vilstate,cardcf,currentXz,renovateModeFs,flushModeCs,toiletLocaitonWz,page,limit);
        int count = latrineMapper.queryLatrineCountByStates(county, town, village, renovateDate,checkDate, name, check, states,vilstate,cardcf,currentXz,renovateModeFs,flushModeCs,toiletLocaitonWz);
        //List<Latrine> lcount=latrineMapper.queryLatrineCountByPage(county, town, village, renovateDate,checkDate, name,check,states,vilstate,cardcf,currentXz,renovateModeFs,flushModeCs,toiletLocaitonWz);
        //int count = lcount.size();
       //System.out.println("查询出的数量为"+count);
        if(latrineList != null) {
            String str1 = " {'total': "+count+", 'topics': ";
            str1 = str1.replaceAll("\'","\"");
            try {
                String vbi = objectMapper.writeValueAsString(latrineList);
                String infoJson = str1 + vbi + "}";
                //return objectMapper.readValue(infoJson, Map.class);
                return new ResponseObject(VariableUtils.SUCCESS, "", objectMapper.readValue(infoJson,Map.class));
            }catch (IOException io){
                io.printStackTrace();
            }
        }
        return new ResponseObject(VariableUtils.FAILURE,"查询失败",latrineList);
    }

    /**
     * 查询户厕改造信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/buildRegionInfo")
    @ResponseBody
    public LatrineService.SimpleRegion buildRegionInfo(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        LatrineService.SimpleRegion simpleRegion=latrineService.buildRegionTree();
        return simpleRegion;
    }

    /**
     * 查询村庄x，y坐标及uniqueid
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryXyUniqueInfo")
    @ResponseBody
    public ResponseObject queryXyUniqueId(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

        String regions = request.getParameter("regions");
        if(regions!=null){
            String [] villagelist = regions.split(",");
            Map<String,List> datamap=new HashMap<String,List>();
            List<Map<String,String>> list=null;
            for(int i=0;i<villagelist.length;i++){
                String county=villagelist[i].split("_")[0];
                county=county.replace("区","").replace("县","");
                if(county.indexOf("市")>0){//防止“市中”被误截取
                    county = county.replace("市","");
                }
                String town=villagelist[i].split("_")[1];
                town=town.replace("镇","").replace("街道办事处","").replace("街道办","").replace("街道","").replace("街办","");
                String village=villagelist[i].split("_")[2];
                village  = village.replace("村民委员会","").replace("居民委员会","").replace("村委会","").replace("居委会","").replace("村","");
                String vilindex="";
                list=new ArrayList<Map<String,String>>();
                List<Latrine> latrineList = latrineMapper.queryXyUnqueidInfo(county,town,village);
                Map<String,String> map=null;
                for(Latrine latrine:latrineList){
                    map=new HashMap<String,String>();
                    map.put("x",latrine.getX());
                    map.put("y",latrine.getY());
                    map.put("uniqueId",latrine.getUniqueId());
                    vilindex=String.valueOf(latrine.getVilIndex());
                    map.put("vilIndex",vilindex);
                    list.add(map);
                }
               datamap.put(villagelist[i],list);
            }
            return new ResponseObject(VariableUtils.SUCCESS, "", datamap);
        }else{
            return new ResponseObject(VariableUtils.FAILURE,"查询失败",null);
        }

    }
    /**
     * 通过uniqueid查询所有信息
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/queryByUniqueId")
    @ResponseBody
    public ResponseObject queryByUniqueId(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

        String uniqueId = request.getParameter("uniqueId");
        if(uniqueId!=null){
            Latrine latrine = latrineMapper.queryByUnqueid(uniqueId);
            return new ResponseObject(VariableUtils.SUCCESS, "", latrine);
        } else{
            return new ResponseObject(VariableUtils.FAILURE,"查询失败",null);
        }

    }
    @RequestMapping("/queryLatrineCounty")
    @ResponseBody
    public ResponseObject queryLatrineByLevel(HttpServletRequest request) throws Exception {
        String year = request.getParameter("year");
        List<Latrine> list = latrineMapper.selectLatrineCounty(year);
        List<Region> listregion = new ArrayList<Region>();
        for(Latrine l:list){
            Region region =new Region();
            region.setCode(l.getCounty());
            region.setName(l.getCounty());
            listregion.add(region);
        }
        return new ResponseObject(VariableUtils.SUCCESS,"", listregion);
    }
    @RequestMapping("/queryLatrineTown")
    @ResponseBody
    public ResponseObject queryLatrineTown(HttpServletRequest request) throws Exception {
        String county = request.getParameter("county");
        String year = request.getParameter("year");
        if("".equals(year)){
            year=null;
        }
        System.out.println("countyyear++++++++++"+county);
        List<Latrine> list = latrineMapper.selectLatrineTown(null,county);
        System.out.println("list++++++++++"+list.size());
        List<Region> listregion = new ArrayList<Region>();
        for(Latrine l:list){
            System.out.println("镇名++++++"+l.getTown());
            Region region =new Region();
            region.setCode(l.getTown());
            region.setName(l.getTown());
            listregion.add(region);
        }
        return new ResponseObject(VariableUtils.SUCCESS,"", listregion);
    }
    @RequestMapping("/queryLatrineVillage")
    @ResponseBody
    public ResponseObject queryLatrineVillage(HttpServletRequest request) throws Exception {
        String town = request.getParameter("town");
        String year = request.getParameter("year");
        if("".equals(year)){
            year=null;
        }
        List<Latrine> list = latrineMapper.selectLatrineVillage(year,town);
        List<Region> listregion = new ArrayList<Region>();
        for(Latrine l:list){
            Region region =new Region();
            region.setCode(l.getVillage());
            region.setName(l.getVillage());
            listregion.add(region);
        }
        return new ResponseObject(VariableUtils.SUCCESS,"", listregion);
    }
    /**
     * 根据登录用户级别更新审核状态
     * @param request 页面请求
     * @param response 服务器响应
     */
    @RequestMapping("/updateState")
    @ResponseBody
    public void updateState(HttpServletRequest request) throws Exception {
        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String cardcf = request.getParameter("cardcf");
        String oldState = request.getParameter("oldState");
        String newState = request.getParameter("newState");
        String uniqueId = request.getParameter("uniqueId");
        String rejectReason = request.getParameter("thyy");
        String name = request.getParameter("name");
        String renovateDate = request.getParameter("renovateDate");
        String check = request.getParameter("check");
        String vilstate = request.getParameter("vilstate");

        latrineMapper.updateState(county,town,village,name,renovateDate,vilstate,cardcf,oldState,newState,uniqueId,rejectReason,check);
    }
    /**
     * 根据条件判断改厕户是否已核实
     * @param request 页面请求
     * @param response 服务器响应
     */
    @RequestMapping("/selectCountByState")
    @ResponseBody
    public int selectCountByParam(HttpServletRequest request) throws Exception {
        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String state = request.getParameter("state");
        //根据条件查询改厕户数量
        int count=latrineMapper.selectCountByParam(county,town,village);
        //根据条件查询改厕户已核实的数量
        int stacount=latrineMapper.selectCountByState(county,town,village,state);
        if(stacount==0){
            return 0;
        }
        if(count==stacount){
            return 1;
        }else{
            return 0;
        }
    }
    /**
     * 根据所有状态的改厕户数量
     * @param request 页面请求
     * @param response 服务器响应
     */
    @RequestMapping("/selectAllStatesCount")
    @ResponseBody
    public int selectAllStatesCount(HttpServletRequest request) throws Exception {
        String county = request.getParameter("county");
        String town = request.getParameter("town");
        String village = request.getParameter("village");
        String state = request.getParameter("state");
        //根据条件查询改厕户数量
        int count=latrineMapper.selectCountByParam(county,town,village);
        //根据条件查询改厕户已核实的数量
        int stacount=latrineMapper.selectCountByState(county,town,village,state);
        if(stacount==0){
            return 0;
        }
        if(count==stacount){
            return 1;
        }else{
            return 0;
        }
    }
    /**
     * 更新户厕改造信息(new)
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/updateLatrineInfo")
    @ResponseBody
    public ResponseObject updateLatrineInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody Latrine latrine){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        if(latrine == null || latrine.getId() == null){
            return new ResponseObject(VariableUtils.FAILURE,"更新失败","");
        }

        int count = latrineMapper.updateLatrineInfo(latrine);

        if(count <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"更新失败","");
        }

        return new ResponseObject(VariableUtils.SUCCESS,"更新成功","");
    }
    /**
     * 更新户厕改造信息(new)
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/selectTownXy")
    @ResponseBody
    public ResponseObject selectTownXy(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }
        String county = request.getParameter("county");
        county=county.replace("区","").replace("县", "");
     if(county.indexOf("市")>0){//防止“市中”被误截取
            county = county.replace("市","");
     }
        String town = request.getParameter("town");

        if(town!=null) {
            town = town.replace("镇", "").replace("街道办事处", "").replace("街道办", "").replace("街道", "").replace("街办", "");
        }
        Map<String,String> map=new HashMap<String,String>();
        map = latrineMapper.selectTownXy(county,town);
/*
        if(map.size() <= 0){
            return new ResponseObject(VariableUtils.FAILURE,"查询失败","");
        }*/

        return new ResponseObject(VariableUtils.SUCCESS, "", map);
    }
    /**
     * 审核进度统计
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/auditProgress")
    @ResponseBody
    public ResponseObject auditProgress(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }

        String county = request.getParameter("county");
        if(county!=null){
            county=county.replace("区","").replace("县","");
            if(county.indexOf("市")>0){//防止“市中”被误截取
                county = county.replace("市","");
            }
        }
        String town = request.getParameter("town");
        if(town!=null){
            town=town.replace("镇","").replace("街道办事处","").replace("街道办","").replace("街道","").replace("街办","");
        }
        List<String> regionlist=new ArrayList<String>();
        if(county != null && town != null&!("").equals(town)){
            regionlist = latrineMapper.queryVillagesX(county, town, null, null);
        }else if(county != null&!("").equals(county)){
            regionlist = latrineMapper.queryTownsX(county, null, null);
        }else{
            regionlist = latrineMapper.queryCounties(null, null);
        }
        List<Map<String,String>> list=new ArrayList<Map<String, String>>();
        BigDecimal b = new BigDecimal(5);
        for(String region:regionlist){
            Map<String,String> statemap=new HashMap<String, String>();
            Map<String,String> newstatemap=new HashMap<String, String>();
            if(county != null && town != null&!("").equals(town)){
                statemap=latrineMapper.auditProgress(county,town,region);
                int count=0;
                for(String key:statemap.keySet()){
                    if(key.substring(5,key.length()).indexOf('0')>-1||key.substring(5,key.length()).indexOf('2')>-1||key.substring(5,key.length()).indexOf('4')>-1||key.substring(5,key.length()).indexOf('6')>-1){
                        Object a = statemap.get(key);
                        count=count+Integer.parseInt(a.toString());
                        newstatemap.put("0",count+"");
                    }else{
                        newstatemap.put(key.substring(5,key.length()),statemap.get(key));
                    }

                }
                Integer allcount= latrineMapper.selectCountByParam(county,town,region);
                newstatemap.put("allcount",String.valueOf(allcount));
            }else if(county !=null&!("").equals(county)){
                statemap=latrineMapper.auditProgress(county,region,null);
                int count=0;
                for(String key:statemap.keySet()){
                    if(key.substring(5,key.length()).indexOf('0')>-1||key.substring(5,key.length()).indexOf('2')>-1||key.substring(5,key.length()).indexOf('4')>-1||key.substring(5,key.length()).indexOf('6')>-1){
                        Object a = statemap.get(key);
                        count=count+Integer.parseInt(a.toString());
                        newstatemap.put("0",count+"");
                    }else{
                        newstatemap.put(key.substring(5,key.length()),statemap.get(key));
                    }

                }
                Integer allcount= latrineMapper.selectCountByParam(county,region,null);
                newstatemap.put("allcount",String.valueOf(allcount));
            }else{
                statemap=latrineMapper.auditProgress(region,null,null);
                int count=0;
                for(String key:statemap.keySet()){
                    if(key.substring(5,key.length()).indexOf('0')>-1||key.substring(5,key.length()).indexOf('2')>-1||key.substring(5,key.length()).indexOf('4')>-1||key.substring(5,key.length()).indexOf('6')>-1){
                       Object a = statemap.get(key);
                        count=count+Integer.parseInt(a.toString());
                        newstatemap.put("0",count+"");
                    }else{
                        newstatemap.put(key.substring(5,key.length()),statemap.get(key));
                    }
                }
                Integer allcount= latrineMapper.selectCountByParam(region,null,null);
                newstatemap.put("allcount",String.valueOf(allcount));
            }
            newstatemap.put("name",region);
          //  statemap.add(Map<String,String>("name", region));
            list.add(newstatemap);
        }

        return new ResponseObject(VariableUtils.SUCCESS,"",list);
    }
    /**
     * 更新户厕改造信息(new)
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/cxtown")
    @ResponseBody
    public ResponseObject cxtown(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }
        String town=request.getParameter("town");
        town= latrineMapper.cxtown(town);

        if("".equals(town)){
            return new ResponseObject(VariableUtils.FAILURE,"查询失败","");
        }
        return new ResponseObject(VariableUtils.SUCCESS,"查询成功",town);
    }
    /**
     * 设为拆迁村(new)
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/setCqVillage")
    @ResponseBody
    public ResponseObject setcxtown(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }
        String county=request.getParameter("county");
        String town = request.getParameter("town");
        String village=request.getParameter("village");
        String vilState=request.getParameter("vilState");
        String state =request.getParameter("state");
        String current=request.getParameter("current");
        int i= latrineMapper.setCqVillage(county,town,current,village,state,vilState);

        if(i<0){
            return new ResponseObject(VariableUtils.FAILURE,"查询失败","");
        }
        return new ResponseObject(VariableUtils.SUCCESS,"查询成功",i);
    }
    /**
     * 设为拆迁村前判断是否核实(new)
     * @param request 页面请求
     * @param response 服务器响应
     * @return ResponseObject 响应对象
     */
    @RequestMapping("/judgeCheck")
    @ResponseBody
    public ResponseObject judgeCheck(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html; charset=utf-8");
        try {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

        } catch (IOException e) {
            e.printStackTrace();
        }
        String county=request.getParameter("county");
        String town = request.getParameter("town");
        String village=request.getParameter("village");
        Integer check=null;
        int villageCount= latrineMapper.selectVillageCount(county, town, village,check);
        int checkCount=latrineMapper.selectVillageCount(county,town,village,1);
        int i=0;
        if(villageCount==checkCount){
            i=1;
        }
        if(villageCount<=0){
            return new ResponseObject(VariableUtils.FAILURE,"查询失败","");
        }
        return new ResponseObject(VariableUtils.SUCCESS,"查询成功",i);
    }


}
