package xxw.service;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import xxw.mapper.AssetsMapper;
import xxw.mapper.DepartMapper;
import xxw.po.AssetsConfig;
import xxw.po.DepartTree;
import xxw.po.User;
import xxw.util.StringUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by lp on 2020/8/10.
 */
@Service
public class ExportAssetsService {
    @Resource
    AssetsMapper assetsMapper;
    @Resource
    DepartMapper departmapper;

    public void exportAssetsInfo(String zctype, String path, String name, User user) {
        //获取导出列及列名
        List<AssetsConfig> configlist = assetsMapper.getAssetsConfigInfo(zctype, null);
        //获取导出资产信息
        List<Map<String, String>> infomap = new ArrayList<>();
        List<String> comlist = new ArrayList<>();
        if ("8".equals(user.getAuth())) {
            infomap = assetsMapper.getAssetsInfoByMap(zctype, null);
            comlist = assetsMapper.getAssetsCom(zctype);
        } else {
            infomap = assetsMapper.getAssetsInfoByMap(zctype, user.getComId());
            comlist.add(user.getComId());
        }

        FileOutputStream fs = null;
        Workbook wb = null;
        wb = new SXSSFWorkbook();
        try {
            for (String s : comlist) {
                DepartTree departtree = departmapper.getCom(s, "company");
                fs = new FileOutputStream(path + File.separator + name);

//            Sheet sheet = wb.createSheet("sheet1");
                Sheet sheet = wb.createSheet(departtree.getNodeName());

                CellStyle headStyle = customCellStyle(wb, "head");
                CellStyle conStyle = customCellStyle(wb, "con");

                String[] HeadFields = new String[configlist.size()];
                String[] KeyFields = new String[configlist.size()];
                for (int i = 0; i < configlist.size(); i++) {
                    HeadFields[i] = configlist.get(i).getFieldname();
                    KeyFields[i] = configlist.get(i).getField().toUpperCase();
                }


                //表头部分
                Row vr = sheet.createRow(0);
                vr.setHeight((short) (400));
                Cell cellHead = null;
                int cacheitems = 100;
                int num = 0;
                for (int i = 0; i < HeadFields.length; i++) {
                    cellHead = vr.createCell(i);
                    cellHead.setCellValue(HeadFields[i]);
                    cellHead.setCellStyle(headStyle);
                    sheet.setColumnWidth(i, cellHead.getStringCellValue().getBytes().length * 300);
                }
                //内容部分
                Row row = null;
                Cell cellKey = null;
                int rowNum = 0;
                for (int i = 0; i < infomap.size(); i++) {
                    if (!s.equals(infomap.get(i).get("COMPANYID"))) {
                        continue;
                    }
                    if (num % cacheitems == 0) {
                        ((SXSSFSheet) sheet).flushRows();
                    }
                    rowNum += 1;
                    row = sheet.createRow(rowNum);
                    row.setHeight((short) 300);
                    // Map<String, Object> regionMap = BasicInfoList.get(i);
                    for (int j = 0; j < KeyFields.length; j++) {
                        cellKey = row.createCell(j);
                        cellKey.setCellValue(infomap.get(i).get(KeyFields[j]));
                        cellKey.setCellStyle(conStyle);
                    }
                }
            }

            wb.write(fs);
            wb.close();
            fs.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fs != null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (wb != null) {
                try {
                    wb.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    //导出资产汇总信息
    public void exportSummaryAssetsInfo(String zctype,String path,String name,String comId){
        //获取导出列及列名
        Map<String,Float> totalmap=new HashMap<>();
        List<Map<String,String>> infomap=new ArrayList<>();
        List<AssetsConfig> configlist=assetsMapper.getAssetsConfigInfo(zctype,null);
        List<AssetsConfig> rzconfiglist=assetsMapper.getAssetsConfigInfo("5",null);
        configlist.addAll(rzconfiglist);


        FileOutputStream fs=null;
        Workbook wb=null;
        try {
            fs = new FileOutputStream(path + File.separator + name);
            wb = new SXSSFWorkbook();
            Sheet sheet;
            String comName="";

            String[] HeadFields = new String[configlist.size()];
            String[] KeyFields =  new String[configlist.size()];
            for(int i=0;i<configlist.size();i++){
                HeadFields[i]=configlist.get(i).getFieldname();
                KeyFields[i]=configlist.get(i).getField().toUpperCase();
                if(configlist.get(i).getFieldname().indexOf("公司")>-1){
                    comName=configlist.get(i).getField();
                }
            }

            if(comId==null){
                List<String> comIds=new ArrayList<>();
                comIds.add("all");
                comIds.addAll(assetsMapper.getComIds(zctype));

                for(String companyId:comIds){
                    if(companyId.equals("all")){
                        companyId=null;
                    }
                    totalmap= this.totalAssets(zctype, companyId);
                    //获取导出资产信息
                    infomap=assetsMapper.getSumAssetsInfoByMap(zctype,companyId);
                    if (companyId == null) {
                        sheet = wb.createSheet("所有公司汇总");
                    }else{
                        sheet=wb.createSheet(infomap.get(0).get(comName.toUpperCase()));
                    }



                    CellStyle headStyle = customCellStyle(wb, "head");
                    CellStyle conStyle = customCellStyle(wb, "con");


                    //表头部分
                    Row vr = sheet.createRow(0);
                    vr.setHeight((short) (400));
                    Cell cellHead = null;
                    int cacheitems = 100;
                    int num = 0;
                    for (int i = 0; i < HeadFields.length; i++) {
                        cellHead = vr.createCell(i);
                        cellHead.setCellValue(HeadFields[i]);
                        cellHead.setCellStyle(headStyle);
                        sheet.setColumnWidth(i, cellHead.getStringCellValue().getBytes().length * 300);
                    }
                    //内容部分
                    Row row = null;
                    Cell cellKey = null;
                    for (int i = 0; i < infomap.size(); i++) {
                        if (num % cacheitems == 0) {
                            ((SXSSFSheet) sheet).flushRows();
                        }
                        row = sheet.createRow(i + 1);
                        row.setHeight((short) 300);
                        // Map<String, Object> regionMap = BasicInfoList.get(i);
                        for (int j = 0; j < KeyFields.length; j++) {
                            cellKey = row.createCell(j);
                            cellKey.setCellValue(infomap.get(i).get(KeyFields[j]));
                            cellKey.setCellStyle(conStyle);
                        }
                    }

                    //合计部分
                    row = sheet.createRow(infomap.size()+1);
                    row.setHeight((short) 300);
                    for (int j = 0; j < KeyFields.length; j++) {
                        cellKey = row.createCell(j);
                        cellKey.setCellStyle(conStyle);
                        if(j==0){
                            cellKey.setCellValue("总计：");
                        }else{
                            if(totalmap.containsKey(KeyFields[j].toLowerCase())){
                                cellKey.setCellValue(totalmap.get(KeyFields[j].toLowerCase()));
                            }
                        }
                    }



                    //合并单元格
                    for(int x=0;x<configlist.size();x++){
                        //从数据行开始
                        String pdname="公司";
                        if(new String(configlist.get(x).getFieldname().getBytes(),"utf-8").indexOf(new String(pdname.getBytes(),"utf-8"))>-1) {
                            int xtrow=1;
                            int xtcol=0;
                            int nums=0;
                            xtcol = x;
                            for (int y = 0; y < infomap.size(); y++) {
                                nums++;
                                if(y==(infomap.size()-1)){
                                    break;
                                }
                                if (!infomap.get(y).get(configlist.get(x).getField().toUpperCase()).equals(infomap.get(y + 1).get(configlist.get(x).getField().toUpperCase()))) {
                                    if(nums>1){
                                        sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 1), x, x));// 到rowTo行columnTo的区域
                                    }

                                    nums = 0;
                                    xtrow = y + 1+1;
                                }else if(infomap.get(y).get(configlist.get(x).getField().toUpperCase()).equals(infomap.get(y + 1).get(configlist.get(x).getField().toUpperCase()))&&y==(infomap.size()-2)){
                                    sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums), x, x));

                                }
                            }
                        }else if(configlist.get(x).getField().indexOf("fcfield")>-1){
                           int xtrow=1;
                            int xtcol=0;
                            int nums=0;
                            String value="";
                            xtcol = x;
                            for(int y=0;y<infomap.size();y++){
                                nums++;
                                if(infomap.get(y).containsKey("FINANCEID")){
                                    if(!value.equals(infomap.get(y).get("FINANCEID"))){
                                        value=infomap.get(y).get("FINANCEID");
                                        if(nums>2){
                                            sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 2), x, x));
                                        }
                                        xtrow=y+1;
                                        if(y!=0){
                                            nums=0;
                                        }

                                    }else{
                                        if(!("".equals(value))&&y==(infomap.size()-1)){
                                            if(nums>1){
                                                sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 1), x, x));
                                            }
                                        }
                                    }
                                    if("".equals(value)) {
                                        nums=0;
                                        value = infomap.get(y).get("FINANCEID");
                                        xtrow = y + 1;
                                    }
                                }else{
                                    if(!("".equals(value))){
                                        if(nums>2){
                                            sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 2), x, x));
                                        }
                                    }
                                    nums=0;
                                    value="";
                                }
                            }
                        }
                    }
                }
            }else{
                totalmap= this.totalAssets(zctype, comId);
                //获取导出资产信息
                infomap=assetsMapper.getSumAssetsInfoByMap(zctype,comId);

                sheet = wb.createSheet(infomap.get(0).get(comName.toUpperCase()));
                CellStyle headStyle = customCellStyle(wb, "head");
                CellStyle conStyle = customCellStyle(wb, "con");


                //表头部分
                Row vr = sheet.createRow(0);
                vr.setHeight((short) (400));
                Cell cellHead = null;
                int cacheitems = 100;
                int num = 0;
                for (int i = 0; i < HeadFields.length; i++) {
                    cellHead = vr.createCell(i);
                    cellHead.setCellValue(HeadFields[i]);
                    cellHead.setCellStyle(headStyle);
                    sheet.setColumnWidth(i, cellHead.getStringCellValue().getBytes().length * 300);
                }
                //内容部分
                Row row = null;
                Cell cellKey = null;
                for (int i = 0; i < infomap.size(); i++) {
                    if (num % cacheitems == 0) {
                        ((SXSSFSheet) sheet).flushRows();
                    }
                    row = sheet.createRow(i + 1);
                    row.setHeight((short) 300);
                    // Map<String, Object> regionMap = BasicInfoList.get(i);
                    for (int j = 0; j < KeyFields.length; j++) {
                        cellKey = row.createCell(j);
                        cellKey.setCellValue(infomap.get(i).get(KeyFields[j]));
                        cellKey.setCellStyle(conStyle);
                    }
                }

                //合计部分
                row = sheet.createRow(infomap.size()+1);
                row.setHeight((short) 300);
                for (int j = 0; j < KeyFields.length; j++) {
                    cellKey = row.createCell(j);
                    cellKey.setCellStyle(conStyle);
                    if(j==0){
                        cellKey.setCellValue("总计：");
                    }else{
                        if(totalmap.containsKey(KeyFields[j].toLowerCase())){
                            cellKey.setCellValue(totalmap.get(KeyFields[j].toLowerCase()));
                        }
                    }
                }



                //合并单元格
                for(int x=0;x<configlist.size();x++){
                    //从数据行开始
                    String pdname="公司";
                    if(new String(configlist.get(x).getFieldname().getBytes(),"utf-8").indexOf(new String(pdname.getBytes(),"utf-8"))>-1) {
                        int xtrow=1;
                        int xtcol=0;
                        int nums=0;
                        xtcol = x;
                        for (int y = 0; y < infomap.size(); y++) {
                            nums++;
                            if(y==(infomap.size()-1)){
                                break;
                            }
                            if (!infomap.get(y).get(configlist.get(x).getField().toUpperCase()).equals(infomap.get(y + 1).get(configlist.get(x).getField().toUpperCase()))) {
                                if(nums>1){
                                    sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 1), x, x));// 到rowTo行columnTo的区域
                                }

                                nums = 0;
                                xtrow = y + 1+1;
                            }else if(infomap.get(y).get(configlist.get(x).getField().toUpperCase()).equals(infomap.get(y + 1).get(configlist.get(x).getField().toUpperCase()))&&y==(infomap.size()-2)){
                                sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums), x, x));

                            }
                        }
                    }else if(configlist.get(x).getField().indexOf("fcfield")>-1){
                        int xtrow=1;
                        int xtcol=0;
                        int nums=0;
                        String value="";
                        xtcol = x;
                        for(int y=0;y<infomap.size();y++){
                            nums++;
                            if(infomap.get(y).containsKey("FINANCEID")){
                                if(!value.equals(infomap.get(y).get("FINANCEID"))){
                                    value=infomap.get(y).get("FINANCEID");
                                    if(nums>1){
                                        sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 2), x, x));
                                    }
                                    xtrow=y+1;
                                    if(y!=0){
                                        nums=0;
                                    }

                                }else{
                                    if(!("".equals(value))&&y==(infomap.size()-1)){
                                        if(nums>2){
                                            sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 2), x, x));
                                        }
                                    }
                                }
                                if("".equals(value)) {
                                    nums=0;
                                    value = infomap.get(y).get("FINANCEID");
                                    xtrow = y + 1;
                                }
                            }else{
                                if(!("".equals(value))){
                                    if(nums>1){
                                        sheet.addMergedRegion(new CellRangeAddress(xtrow, (xtrow + nums - 2), x, x));
                                    }
                                }
                                nums=0;
                                value="";
                            }
                        }
                    }
                }
            }

            wb.write(fs);
            wb.close();
            fs.close();
        }catch (IOException e){
            e.printStackTrace();
        }finally {
            if(fs!=null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(wb!=null){
                try {
                    wb.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Map<String, String>> importAssetsInfo(MultipartFile file, String zctype) {
        int num = 1;
        //获取导出列及列名
        List<AssetsConfig> configlist = assetsMapper.getAssetsConfigInfo(zctype, null);
        AssetsConfig assetsConfig = new AssetsConfig();
        if(!"5".equals(zctype)){
            assetsConfig.setField("layerid");
            assetsConfig.setFieldname("要素ID");
            configlist.add(assetsConfig);
        }
        List<Map<String, String>> maplist = new ArrayList<Map<String, String>>();
        try {
            // POIFSFileSystem fs = new POIFSFileSystem(file.getInputStream());
            //HSSFWorkbook hw =new HSSFWorkbook(fs);
            Workbook hw = WorkbookFactory.create(file.getInputStream());

            //获取第一个sheet页
            Sheet sheet = hw.getSheetAt(0);
            //总行数
            int rowNum = sheet.getLastRowNum();
            //第一条数据行(列名)
            Row datafirstrow = sheet.getRow(0);
            //总列数
            int colNum = datafirstrow.getPhysicalNumberOfCells();

            String[] cloarray = new String[colNum];
            int y = 0;
            while (y < colNum) {
                String cellvalue = getCellFormatValue(datafirstrow.getCell((short) y));
                for (int z = 0; z < configlist.size(); z++) {
                    if (cellvalue.equals(configlist.get(z).getFieldname())) {
                        cloarray[y] = configlist.get(z).getField();
                    }
                    if ("融资编号".equals(cellvalue)) {
                        cloarray[y] = "financeid";
                    }
                }
                y++;
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Map<String, String> datamap = new HashMap<String, String>();
                Row row = sheet.getRow(i);
                int j = 0;
                while (j < colNum) {
                    datamap.put(cloarray[j], getCellFormatValue(row.getCell((short) j)));
                    j++;
                }
                if(!"5".equals(zctype)) {
                    //获取session
                    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
                    HttpSession session = request.getSession();
                    User user = (User) session.getAttribute("user");
                    datamap.put("companyid", user.getComId());
                    datamap.put("zctype", zctype);
                    String uuid = UUID.randomUUID().toString();
                    datamap.put("zcid", uuid);
                    maplist.add(datamap);
                }else{
                    datamap.put("zcid", datamap.get("id"));
                    maplist.add(datamap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return maplist;
    }

    public String getCellFormatValue(Cell cell) {
        String cellvalue = "";
        if (cell != null) {
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_NUMERIC:
                case Cell.CELL_TYPE_FORMULA: {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        cellvalue = sdf.format(date);
                    }
                    // 如果是纯数字
                    else {
                        // 取得当前Cell的数值
//                        cellvalue = String.valueOf(cell.getNumericCellValue());
                        DecimalFormat df = new DecimalFormat("0");
                        cellvalue = df.format(cell.getNumericCellValue());
                        cellvalue = subZeroAndDot(cellvalue);
                    }
                    break;
                }
                case Cell.CELL_TYPE_STRING:
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                default:
                    cellvalue = "";
            }
        } else {
            cellvalue = "";
        }
        return cellvalue;
    }

    /** * 使用正则表达式去掉多余的.与
     *  * @param s
     * @return
     */
    private String subZeroAndDot(String s) {
        if (s.indexOf(".0") > 0) {
            // 去掉多余的
            s = s.replaceAll("0+?$", "");
            // 如果最后一位是.则去掉
            s = s.replaceAll("[.]$", "");
        }
        return s;
    }

    /**
     * 获取设置单元格样式
     *
     * @param wb  工作簿对象
     * @param poi 要设置的区域，（表头或者内容）
     * @return 单元格样式对象
     */
    private CellStyle customCellStyle(Workbook wb, String poi) {
        CellStyle style = wb.createCellStyle();
        if (poi == "head") {
            Font font = wb.createFont();
            font.setFontHeightInPoints((short) 11);
            font.setFontName("SimHei");
            CellStyle headStyle = wb.createCellStyle();
            headStyle.setFont(font);
            headStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
            headStyle.setAlignment(CellStyle.ALIGN_CENTER);
            headStyle.setBorderBottom(headStyle.BORDER_THIN);
            headStyle.setBorderLeft(headStyle.BORDER_THIN);
            headStyle.setBorderTop(headStyle.BORDER_THIN);
            headStyle.setBorderRight(headStyle.BORDER_THIN);
            style = headStyle;
        } else {
            CellStyle conStyle = wb.createCellStyle();
            conStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
            conStyle.setBorderBottom(conStyle.BORDER_THIN);
            conStyle.setBorderLeft(conStyle.BORDER_THIN);
            conStyle.setBorderTop(conStyle.BORDER_THIN);
            conStyle.setBorderRight(conStyle.BORDER_THIN);
            style = conStyle;
        }
        return style;
    }
    //汇总计算总数
    public Map<String,Float> totalAssets(String zctype,String gsmc){
        Map<String,Float> mapCount=new HashMap<>();
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
                                        if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                            count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                            mapCount.put(entry.getKey().toLowerCase(), count);
                                            financeId.add(assetslist.get(i).get("FINANCEID"));
                                        }
                                    }else{
                                        if(!financeId.contains(assetslist.get(i).get("FINANCEID"))){
                                            if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                                count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                                mapCount.put(entry.getKey().toLowerCase(), count);
                                                financeId.add(assetslist.get(i).get("FINANCEID"));
                                            }
                                        }
                                    }
                                }else {
                                    if(StringUtil.isNumber(assetslist.get(i).get(entry.getKey()))) {
                                        count = count + Float.parseFloat(assetslist.get(i).get(entry.getKey()));
                                        mapCount.put(entry.getKey().toLowerCase(), count);
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
}
