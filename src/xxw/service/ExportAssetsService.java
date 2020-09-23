package xxw.service;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import xxw.mapper.AssetsMapper;
import xxw.po.AssetsConfig;
import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by lp on 2020/8/10.
 */
@Service
public class ExportAssetsService {
    @Resource
    AssetsMapper assetsMapper;
    public void exportAssetsInfo(String zctype,String path,String name){
        //获取导出列及列名
        List<AssetsConfig> configlist=assetsMapper.getAssetsConfigInfo(zctype,null);
        //获取导出资产信息
        List<Map<String,String>> infomap=assetsMapper.getAssetsInfoByMap(zctype,null);

        FileOutputStream fs=null;
        Workbook wb=null;
        try {
            fs = new FileOutputStream(path + File.separator + name);

            wb = new SXSSFWorkbook();
            Sheet sheet = wb.createSheet("sheet1");

            CellStyle headStyle = customCellStyle(wb, "head");
            CellStyle conStyle = customCellStyle(wb, "con");

            String[] HeadFields = new String[configlist.size()];
            String[] KeyFields =  new String[configlist.size()];
            for(int i=0;i<configlist.size();i++){
                HeadFields[i]=configlist.get(i).getFieldname();
                KeyFields[i]=configlist.get(i).getField().toUpperCase();
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

        public List<Map<String,String>> importAssetsInfo(MultipartFile file,String zctype){
            int num=1;
            //获取导出列及列名
            List<AssetsConfig> configlist=assetsMapper.getAssetsConfigInfo(zctype,null);
            List<Map<String,String>> maplist=new ArrayList<Map<String,String>>();
            try {
               // POIFSFileSystem fs = new POIFSFileSystem(file.getInputStream());
                //HSSFWorkbook hw =new HSSFWorkbook(fs);
                Workbook hw=WorkbookFactory.create(file.getInputStream());

                //获取第一个sheet页
                Sheet sheet = hw.getSheetAt(0);
                //总行数
                int rowNum=sheet.getLastRowNum();
                //第一条数据行(列名)
                Row datafirstrow = sheet.getRow(0);
                //总列数
                int colNum=datafirstrow.getPhysicalNumberOfCells();

                String []cloarray=new String [colNum];
                int y = 0;
                while(y<colNum){
                    String cellvalue=getCellFormatValue(datafirstrow.getCell((short)y));
                    for(int z=0;z<configlist.size();z++){
                        if(cellvalue.equals(configlist.get(z).getFieldname())){
                            cloarray [y]=configlist.get(z).getField();
                        }
                    }
                    y++;
                }

                for(int i=1;i<=sheet.getLastRowNum();i++){
                    Map<String,String> datamap= new HashMap<String,String>();
                    Row row = sheet.getRow(i);
                    int j=0;
                    while (j<colNum){
                        datamap.put(cloarray[j],getCellFormatValue(row.getCell((short) j)));
                        j++;
                    }
                    datamap.put("zctype",zctype);
                    String uuid = UUID.randomUUID().toString();
                    datamap.put("zcid",uuid);
                    maplist.add(datamap);
                }
            }catch(Exception e){
                e.printStackTrace();
            }
            return maplist;
        }
    public String getCellFormatValue(Cell cell){
        String cellvalue="";
        if(cell!=null){
            switch (cell.getCellType()){
                case Cell.CELL_TYPE_NUMERIC:
                case Cell.CELL_TYPE_FORMULA:{
                    if (DateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        cellvalue = sdf.format(date);
                    }
                    // 如果是纯数字
                    else {
                        // 取得当前Cell的数值
                        cellvalue = String.valueOf(cell.getNumericCellValue());
                    }
                    break;
                }
                case Cell.CELL_TYPE_STRING:
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                    default:
                        cellvalue="";
            }
        }else{
            cellvalue="";
        }
        return  cellvalue;
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
}
