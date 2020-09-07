package xxw.service;


import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Decoder;
import xxw.fileservice.FileService;
import xxw.fileservice.FileServiceUtil;
import xxw.mapper.LatrineMapper;
import xxw.po.Latrine;
import xxw.po.UploadFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.util.*;

/**
 * <p>户厕改造信息表service类</p>
 * @author zzm
 * @date 2019/8/15
 * @version 1.0
 */
@Service
public class LatrineService {
    @Resource   //自动注入,默认按名称
    private LatrineMapper latrineMapper;
    private ObjectMapper objectMapper = new ObjectMapper();

    private FileService pictureService = null;
    private ServletFileUpload pictureUpload = null;

    private BASE64Decoder decoder = new BASE64Decoder();
    private DecimalFormat df = new DecimalFormat("0");

    //region 导入数据
    /**
     * 导入户厕改造数据
     *
     * @param filePath 户厕改造数据文件路径
     * @return int 导入记录数
     **/
    public int importAllData(String filePath){
        if(filePath == null) return -1;

        File pathFile = new File(filePath);
        if(!pathFile.exists() || !pathFile.isDirectory()) return -1;

        File[] fileArray = pathFile.listFiles();
        if(fileArray == null || fileArray.length == 0) return 0;

        int totalCount = 0, count;

        for(File file : fileArray){
            if(file.getName().endsWith(".xls") || file.getName().endsWith(".xlsx")){
                count = importDataX(file);

                System.out.println(file.getName().substring(0, file.getName().lastIndexOf(".")) + ":" + count);

                totalCount += count;
            }
        }

        fileArray = null;

        return totalCount;
    }

    /**
     * 导入户厕改造数据
     *
     * @param file 户厕改造数据文件
     * @param startNum 记录起始编号
     * @return int 导入记录数
     **/
    private int importDataX(File file){
        if(file == null || !file.exists()) return 0;

        int sn = 1, count = 0;
        List<Latrine> latrineList = new ArrayList<>();

        try {
            LatrineXlsxParser latrineXlsxParser = new LatrineXlsxParser();
            latrineXlsxParser.processOneSheet(file.getAbsolutePath(), latrineList);

            if(latrineList.size() > 0){
                for(Latrine latrine : latrineList){
                    latrine.setUniqueId(latrine.getCounty() + sn++);
                    latrine.setIsCheck(0);
                    if(latrine.getIdCard() != null && latrine.getIdCard().length() > 18){
                        latrine.setIdCard(latrine.getIdCard().substring(0, 18));
                    }
                    if(latrine.getTel() != null && latrine.getTel().length() > 11){
                        latrine.setTel(latrine.getTel().substring(0, 11));
                    }
                    if(latrine.getRenovateModeId() == null){
                        latrine.setRenovateModeId("99");
                    }

                    if(latrineMapper.insertSelective(latrine) == 1) count++;
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }

        latrineList.clear();

        return count;
    }

    //转换改厕方式
    public static String convertRenovateMode(String strVal){
        if(strVal == null) return null;

        String modeStr = "";

        if(strVal.contains("砖砌三格") || strVal.contains("砖砌")) modeStr = modeStr.length() == 0 ? "7" : modeStr + ";7";
        else if(strVal.contains("三格") || strVal.contains("黑桶") || strVal.contains("三隔") || strVal.contains("3格") || strVal.contains("分格")) modeStr = modeStr.length() == 0 ? "0" : modeStr + ";0";
        if(strVal.contains("双瓮") || strVal.contains("双翁") || strVal.contains("双格") || strVal.contains("双桶")) modeStr = modeStr.length() == 0 ? "1" : modeStr + ";1";
        if(strVal.contains("粪尿") || strVal.contains("分集")) modeStr = modeStr.length() == 0 ? "2" : modeStr + ";2";
        if(strVal.contains("水冲") || strVal.contains("管网")) modeStr = modeStr.length() == 0 ? "3" : modeStr + ";3";
        if(strVal.contains("一体化")) modeStr = modeStr.length() == 0 ? "4" : modeStr + ";4";
        if(strVal.contains("沼气")) modeStr = modeStr.length() == 0 ? "6" : modeStr + ";6";

        return modeStr.length() == 0 ? "99" : modeStr;
    }

    //转换改厕年份
    public static String convertRenovateYear(String strVal){
        if(strVal == null) return null;

        if(strVal.startsWith("2016前") || strVal.startsWith("2016年前") || strVal.startsWith("2016年底前") ||
                strVal.startsWith("2015") || strVal.startsWith("15")) return "2015年底前";
        if(strVal.startsWith("2016") || strVal.startsWith("16年") || strVal.startsWith("16.") ||
                strVal.startsWith("享受政策2016")) return "2016";
        if(strVal.startsWith("2017") || strVal.startsWith("17年") || strVal.startsWith("17.") ||
                strVal.startsWith("享受政策2017")) return "2017";
        if(strVal.startsWith("2018") || strVal.startsWith("18年") || strVal.startsWith("18.") ||
                strVal.startsWith("享受政策2018")) return "2018";

        return strVal;
    }

    /**
     * 导入户厕改造数据
     *
     * @param file 户厕改造数据文件
     * @return int 导入记录数
     **/
    @Deprecated
    private int importData(File file){
        if(file == null || !file.exists()) return 0;

        FileInputStream fis = null;
        Workbook workbook = null;
        List<Latrine> latrineList = new ArrayList<>();

        try {
            fis = new FileInputStream(file);

            if(file.getName().endsWith(".xls")){
                workbook = new HSSFWorkbook(fis);
            }else{
                workbook = new XSSFWorkbook(fis);
            }

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null || sheet.getLastRowNum() < 1) return 0;

            int rowNum = 1, count = 0, sn = 1;
            String strVal = null;
            Row row = null;
            Latrine latrine = null;

            while ((row = sheet.getRow(rowNum++)) != null) {
                latrine = new Latrine();

                //区县名称
                strVal = getCellStringValue(row.getCell(1));
                if(strVal == null) continue;
                latrine.setCounty(strVal.trim());

                //街道名称
                strVal = getCellStringValue(row.getCell(2));
                if(strVal == null) continue;
                latrine.setTown(strVal.trim());

                //村庄名称
                strVal = getCellStringValue(row.getCell(3));
                if(strVal == null) continue;
                latrine.setVillage(strVal.trim());

                //户主姓名
                strVal = getCellStringValue(row.getCell(4));
                if(strVal == null) continue;
                latrine.setName(strVal.trim());

                //身份证号码
                strVal = getCellStringValue(row.getCell(5));
                if(strVal != null) latrine.setIdCard(strVal.trim().substring(0, 18));

                //门牌号码
                strVal = getHouseNum(row.getCell(6));
                if(strVal != null) latrine.setHouseNum(strVal.trim());

                //改厕方式
                strVal = getCellStringValue(row.getCell(7));
                latrine.setRenovateMode(strVal);
                if(strVal != null) latrine.setRenovateModeId(convertRenovateMode(strVal.trim()));

                //改厕年份
                strVal = getCellStringValue(row.getCell(8));
                if(strVal != null) latrine.setRenovateDate(convertRenovateYear(strVal.trim()));

                //联系电话
                strVal = getTel(row.getCell(9));
                if(strVal != null) latrine.setTel(strVal.trim());

                //备注
                strVal = getCellStringValue(row.getCell(10));
                if(strVal != null) latrine.setRemarks(strVal.trim());
            }

            latrine.setUniqueId(latrine.getCounty() + sn++);
            latrine.setIsCheck(0);

            if(latrineMapper.insertSelective(latrine) == 1){
                count ++;
            }

            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (workbook != null) {
                try {
                    workbook.close();
                } catch (IOException e) {
                }
            }
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                }
            }
        }
    }

    private Object getCellValue(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case Cell.CELL_TYPE_BLANK:
                return null;
            case Cell.CELL_TYPE_BOOLEAN:
                return cell.getBooleanCellValue();
            case Cell.CELL_TYPE_NUMERIC:
                return cell.getNumericCellValue();
            case Cell.CELL_TYPE_STRING:
                return cell.getStringCellValue();
            case Cell.CELL_TYPE_FORMULA:
                return cell.getStringCellValue();
            case Cell.CELL_TYPE_ERROR:
                return null;
            default:
                return cell.getStringCellValue();
        }
    }

    private double getCellDoubleValue(Cell cell) {
        Object valueObj = getCellValue(cell);

        if (valueObj == null || !(valueObj instanceof Double)) return -1;

        return (Double) valueObj;
    }

    private int getCellIntegerValue(Cell cell) {
        Object valueObj = getCellValue(cell);

        if (valueObj == null || !(valueObj instanceof Double)) return -1;

        return ((Double) valueObj).intValue();
    }

    private long getCellLongValue(Cell cell) {
        Object valueObj = getCellValue(cell);

        if (valueObj == null || !(valueObj instanceof Double)) return -1;

        return ((Double) valueObj).longValue();
    }

    private boolean getCellBooleanValue(Cell cell) {
        Object valueObj = getCellValue(cell);

        if (valueObj == null || !(valueObj instanceof Boolean)) return false;

        return (Boolean) valueObj;
    }

    private String getCellStringValue(Cell cell) {
        Object valueObj = getCellValue(cell);
        if (valueObj == null) return null;

        return String.valueOf(valueObj);
    }

    //获取门牌号
    private String getHouseNum(Cell cell){
        Object valueObj = getCellValue(cell);

        if (valueObj == null) return null;
        if(valueObj instanceof Double) return df.format(cell.getNumericCellValue());
        return String.valueOf(valueObj);
    }

    //获取联系电话
    private String getTel(Cell cell){
        Object valueObj = getCellValue(cell);

        if (valueObj == null) return null;
        if(valueObj instanceof Double) return df.format(cell.getNumericCellValue());
        return String.valueOf(valueObj);
    }
    //endregion

    //region 创建区划树
    /**
     * 创建区划树
     * @return SimpleRegion
     */
    public SimpleRegion buildRegionTree(){
        SimpleRegion city = new SimpleRegion("济南市", 1);

        buildChildRegions(city);

        return city;
    }

    /**
     * 递归创建子区划
     *
     * @param region 父区划
     */
    private void buildChildRegions(SimpleRegion region){
        if(region == null || region.getLevel() == 4) return;

        List<String> childList = null;

        if(region.getLevel() == 1) {
            childList = latrineMapper.queryCounties(null, null);
        }else if(region.getLevel() == 2){
            childList = latrineMapper.queryTowns(region.getName(), null, null);
        }else if(region.getLevel() == 3){
            childList = latrineMapper.queryVillages(region.getPname(), region.getName(), null, null);
        }

        int level = region.getLevel() + 1;
        SimpleRegion child = null;

        for(String name : childList){
            child = new SimpleRegion(name, level);
            child.setPname(region.getName());

            region.addChild(child);
        }

        if(level < 4){
            for(String name : childList){
                buildChildRegions(region.getChild(name));
            }
        }

        childList.clear();
    }

    /**
     * 简单区划内部类
     */
    public class SimpleRegion{
        private String name;
        private String code;
        private String pname;
        private String pcode;
        private  final String iconCls="no-icon";
        private int level;
        private Map<String, SimpleRegion> childRegionMap;

        SimpleRegion(String name, int level)
        {
            this.setName(name);
            this.level = level;
            this.setCode(String.valueOf(level));

            childRegionMap = new HashMap<String, SimpleRegion>();
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getPname() {
            return pname;
        }

        public void setPname(String pname) {
            this.pname = pname;
        }

        public String getPcode() {
            return pcode;
        }

        public void setPcode(String pcode) {
            this.pcode = pcode;
        }

        public  String getIconCls() {
            return iconCls;
        }

        public int getLevel() {
            return level;
        }

        public void setLevel(int level) {
            this.level = level;
        }


        public SimpleRegion getChild(String name){
            if(name == null) return null;

            return childRegionMap.get(name);
        }

        public Collection<SimpleRegion> getChildren(){
            return childRegionMap.values();
        }

        public boolean addChild(SimpleRegion region){
            if(region.getName() == null || childRegionMap.containsKey(region.getName())) return false;

            childRegionMap.put(region.getName(), region);

            return true;
        }

        public boolean removeChild(SimpleRegion region){
            if(region.getName() == null || !childRegionMap.containsKey(region.getName())) return false;

            childRegionMap.remove(region.getName());

            return true;
        }

        public boolean clear(){
            childRegionMap.clear();

            return true;
        }

        public void destroy(){
            for(Map.Entry<String, SimpleRegion> entry : childRegionMap.entrySet()){
                entry.getValue().destroy();
            }

            childRegionMap.clear();
        }
    }
    //endregion

    //region 统计信息
    /**
     * 统计户厕改造信息
     *
     * @param county 区县
     * @param town  镇办
     * @param renovateDate 改造日期
     * @return Map<String, Object>
     */
    public Map<String, Object> statInfo(String county, String town, String renovateDate)
    {
        Map<String, Object> statInfoMap = new HashMap<>(3);

        //统计总数量
        String []uncheckstate={"0","2","4","6"};
        String []checkstate={"1","3","5","7"};
        int uncheckCount = latrineMapper.queryLatrineCountX(county,town,null,renovateDate,null,null,uncheckstate);
        int checkCount = latrineMapper.queryLatrineCountX(county, town, null, renovateDate, null,null,checkstate);

        Map<String, Integer> sumMap = new HashMap<>();
        sumMap.put("check", checkCount);
        sumMap.put("uncheck", uncheckCount);
        sumMap.put("total", checkCount + uncheckCount);

        statInfoMap.put("sum", sumMap);

        //统计子区划数量
        List<Map<String, Object>> childSumList = new ArrayList<>();

        List<String> childList;
        if(county != null && town != null){
            childList = latrineMapper.queryVillagesX(county, town, renovateDate, null);
        }else if(county != null){
            childList = latrineMapper.queryTownsX(county, renovateDate, null);
        }else{
            childList = latrineMapper.queryCounties(renovateDate, null);
        }
        int countyAcrossCount=0;
        int townAcrossCount=0;
        String countyState[]={"5","7"};
        String townState[]={"3","5","7"};
        Map<String, Object> childSumMap;
        for(String child : childList){
            if(county != null && town != null){
                uncheckCount = latrineMapper.queryLatrineCountX(county, town, child, renovateDate, null,null,uncheckstate);
                checkCount = latrineMapper.queryLatrineCountX(county, town, child, renovateDate, null,null,checkstate);
            }else if(county != null){
                uncheckCount = latrineMapper.queryLatrineCountX(county, child, null, renovateDate, null,null,uncheckstate);
                checkCount = latrineMapper.queryLatrineCountX(county, child, null, renovateDate, null,null,checkstate);
                townAcrossCount=latrineMapper.queryCountyAcrossLatrineCount(county,child,townState,renovateDate,1);
            }else{
                uncheckCount = latrineMapper.queryLatrineCountX(child, null, null, renovateDate, null,null,uncheckstate);
                checkCount = latrineMapper.queryLatrineCountX(child, null, null, renovateDate, null,null,checkstate);
                countyAcrossCount=latrineMapper.queryCountyAcrossLatrineCount(child,null,countyState,renovateDate,1);
            }

            childSumMap = new HashMap<>();
            childSumMap.put("name", child);
            childSumMap.put("check", checkCount);
            childSumMap.put("uncheck", uncheckCount);
            childSumMap.put("total", checkCount + uncheckCount);
            childSumMap.put("countyacross", countyAcrossCount);
            childSumMap.put("townacross", townAcrossCount);

            childSumList.add(childSumMap);
        }

        statInfoMap.put("child", childSumList);

        //统计改造类型数量
        List<Map<String, Integer>> renovateModeSumList = latrineMapper.queryRenovateModeCountX(county, town, null, renovateDate, null);

        statInfoMap.put("renovatemode", renovateModeSumList);

        return statInfoMap;
    }
    //endregion

    //region 图片上传

    private ServletFileUpload getServletFileUpload(){
        DiskFileItemFactory fac = new DiskFileItemFactory();

        File tempPicDir = new File("D:/uploadFile/temp");
        if (!tempPicDir.exists()) {
            tempPicDir.mkdirs();
        }

        fac.setRepository(tempPicDir);
        //设置缓存大小，当上传文件的容量超过该缓存，直接放到暂时存储室
        fac.setSizeThreshold(5 * 1024 * 1024);

        ServletFileUpload upload = new ServletFileUpload(fac);
        upload.setHeaderEncoding("UTF-8");

        return upload;
    }

    private FileService getFileService(){
        Object service = FileServiceUtil.getService(FileService.class);

        if(service != null) return (FileService)service;

        return null;
    }

    /**
     * 上传图片, 文件存储路径：web/uploadPic/srcPic(or miniPic)/{区县/镇办/村}/{unique_id}/{picName}.{图片原格式}
     *
     * @param request HttpRequest请求
     * @return 上传成功：图片名称 ，上传失败：0，图片尺寸超出限制：1
     */
    public String uploadPicture(HttpServletRequest request) {
        if (pictureUpload == null) pictureUpload = getServletFileUpload();
        if (pictureService == null) pictureService = getFileService();

        if (pictureUpload == null || pictureService == null) {
            System.out.println("图片上传接受服务创建失败.");
            return "0";
        }

        List fileList = null;
        try {
            fileList = pictureUpload.parseRequest(request);
        } catch (FileUploadException e) {
            System.out.println("解析图片上传请求失败：" + e.getMessage());
            return "0";
        }

        //region 获取前端传过来的参数
        Map<String, String> paramMap = new HashMap<>();
        List<DiskFileItem> diskFileItemList = new ArrayList<>();

        FileItem fileItem = null;
        for (Object object : fileList) {
            fileItem = (FileItem) object;

            if (fileItem.isFormField()) {//获取参数
                try {
                    paramMap.put(fileItem.getFieldName(), fileItem.getString("utf-8"));//如果你页面编码是utf-8的
                } catch (UnsupportedEncodingException e) {
                    System.out.println("获取上传图片参数失败：" + e.getMessage());
                }
            } else if (fileItem instanceof DiskFileItem) {
                diskFileItemList.add((DiskFileItem) fileItem);
            }
        }

        fileList.clear();

        if (!paramMap.containsKey("path") || !paramMap.containsKey("uniqueId") ||
                !paramMap.containsKey("picName") || !paramMap.containsKey("file")) {
            paramMap.clear();
            diskFileItemList.clear();

            System.out.println("上传图片未包含有效的参数.");
            return "0";
        }

        String data = paramMap.get("file");
        int k = data.indexOf(",");
        if (data.startsWith("data") && k > 0) {
            data = data.substring(k + 1);
        }
        //endregion

        try {
            Calendar date = Calendar.getInstance();
            String uploadDate = String.valueOf(date.get(Calendar.YEAR));

            String fileSrcName = "";
            String fileSaveName = "";
            String fileFormat = "";
            UploadFile uploadFile = null;

            // 遍历上传文件写入磁盘
            for (DiskFileItem item : diskFileItemList) {
                //图片大小限制（20 MB） lipeng
                if (item.getSize() > 20971520) {
                    System.out.println("上传图片文件大小超过限制.");
                    return "0";
                } else if (item.getName() == null) {
                    System.out.println("上传图片文件未包含有效的名称信息.");
                    return "0";
                }

                //获得文件名及路径
                String fileName = item.getName();
                fileSrcName = fileName.substring(fileName.lastIndexOf("\\") + 1);
                fileFormat = fileSrcName.substring(fileSrcName.lastIndexOf("."));
                fileSaveName = paramMap.get("picName") + fileFormat;

                item.delete();

                //上传文件到文件服务器
                if (!pictureService.savePic(decoder.decodeBuffer(data), paramMap.get("path") + "/" + paramMap.get("uniqueId"), fileSaveName)) {
                    System.out.println("保存图片信息到数据库失败.");
                    return "0";
                }

                uploadFile = new UploadFile();
                uploadFile.setRecordID(paramMap.get("uniqueId"));
                uploadFile.setType(paramMap.get("picName"));
                uploadFile.setUploadYear(Integer.parseInt(uploadDate));
                uploadFile.setSrcName(fileSrcName);
                uploadFile.setSaveName(fileSaveName);

                if (latrineMapper.insertFile(uploadFile) != 1) {
                    System.out.println("保存图片信息到数据库失败.");
                    return "0";
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (paramMap != null) paramMap.clear();
            if (diskFileItemList != null) diskFileItemList.clear();
        }

        return "1";
    }

    /**
     * 查询图片
     *
     * @param uniqueID 改厕户的唯一ID
     **/
    public List<UploadFile> queryPics(String uniqueID) {
        return latrineMapper.selectPicByUniqueID(uniqueID);
    }

    /**
     * 删除图片
     *
     * @param recordId 记录id
     * @param picName  图片字段名
     * @return 1:执行成功；0：执行失败
     */
    public int deletePicture(String path, String uniqueId, String picName) {
        int flag = latrineMapper.deleteByUniqueIdAndSaveName(uniqueId, picName);
        if (0 < flag) {
            flag = deleteRealPic(path + File.separator + uniqueId, picName);
        }

        return flag;
    }

    /**
     * 删除物理路径中的文件
     *
     * @param picName  图片字段名
     * @return 1:执行成功；0：执行失败
     */
    public int deleteRealPic(String path, String picName) {
        try {
            FileService service = (FileService) FileServiceUtil.getService(FileService.class);
            service.deletePic(path, picName);
            return 1;

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
    //endregion

    /**
     * 生成区划的json字符串
     *
     * @return 生成的字符串
     */
    public String createLatrineRegion(){
        String vbi=null;
        SimpleRegion region = buildRegionTree();
        Collection<SimpleRegion> collection =region.getChildren();
        for(LatrineService.SimpleRegion county :collection){
            county.setPname(null);
            for(LatrineService.SimpleRegion town:county.getChildren()){
                town.setPname(null);
                for(LatrineService.SimpleRegion village: town.getChildren()){
                    village.setPname(null);
                }
            }
        }
        try {
            vbi = objectMapper.writeValueAsString(region);
            String header = " {\"expanded\": true,";
            vbi = header + vbi.substring(1);
            vbi = vbi.replaceAll("\"pname\":null,\"pcode\":null,", "");
            vbi = vbi.replaceAll("\"level\":1,", "");
            vbi = vbi.replaceAll("\"level\":2,", "");
            vbi = vbi.replaceAll("\"level\":3,", "");
            vbi = vbi.replaceAll("\"level\":4,\"children\":\\[\\]", "\"leaf\":true");
            vbi = vbi.replaceAll("name", "text");
        }catch(IOException e){
            e.printStackTrace();
        }
        return  vbi;
    }
}
