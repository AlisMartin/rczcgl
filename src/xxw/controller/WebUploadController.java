package xxw.controller;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import xxw.mapper.FlowMapper;
import xxw.po.Webuploader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Created by lp on 2020/6/2.
 */
@Controller
@RequestMapping("/upload")
public class WebUploadController {
    @Autowired
    private FlowMapper flowMapper;
    @Value("${FileUrl}")
    private String fileUrl;

    @RequestMapping("/fileupload")
    @ResponseBody
    public ResponseObject upload(HttpServletRequest request,MultipartFile file, String chunks,String chunk,String name,String zcid)throws IOException{
        ResponseObject responseObject = new ResponseObject();
        try{
            String xdPath;
            String tempPath;
            String otherPath;
             if("".equals(zcid)||zcid==null){
                xdPath="filemanager/upload/";
                tempPath= request.getSession().getServletContext().getRealPath("/") + "filemanager/upload/";
                 otherPath = fileUrl + "filemanager/upload/";
            }else{
                xdPath="assetsfile/"+zcid+"/";
                tempPath = request.getSession().getServletContext().getRealPath("/") + "assetsfile/"+zcid+"/";
                otherPath = fileUrl + "assetsfile/"+zcid+"/";
            }

            if(file!=null){
                if((null==chunks&&null==chunk)||("").equals(chunks)&&("").equals(chunk)){

                    File parentFile=new File(tempPath);
                    File otherFile=new File(otherPath);
                    if(!parentFile.exists()){
                        parentFile.mkdirs();
                    }
                    if(!otherFile.exists()){
                        otherFile.mkdirs();
                    }
                    File destTempFile=new File(parentFile+"/"+name);
                    File otherTempFile=new File(otherFile+"/"+name);
                    FileUtils.copyInputStreamToFile(file.getInputStream(),destTempFile);
                    destTempFile.createNewFile();
                    FileUtils.copyInputStreamToFile(file.getInputStream(),otherTempFile);
                    otherTempFile.createNewFile();
                    UUID uid=UUID.randomUUID();
                    String id=uid.toString();
                    flowMapper.insertManagerFile(id,name,xdPath,null,null,null);
                    responseObject.setCode(1);
                    responseObject.setData(id);
                    responseObject.setMessage("上传完毕");
                    return responseObject;
                }
                String tempFileDir=tempPath+"\\part\\"+File.separator+name;
                File parentFileDir=new File(tempFileDir);
                if(!parentFileDir.exists()){
                    parentFileDir.mkdirs();
                }
                File f=new File(tempFileDir+File.separator+name+"_"+chunk+".part");
                if(!f.exists()){
                    FileUtils.copyInputStreamToFile(file.getInputStream(), f);
                    f.createNewFile();
                }
                boolean uploadDone=true;
                for(int i=0;i<Integer.parseInt(chunks);i++){
                    File partFile=new File(tempFileDir,name+"_"+i+".part");
                    if(!partFile.exists()){
                        uploadDone=false;
                        responseObject.setCode(1);
                        responseObject.setMessage("上传完毕");
                        return responseObject;
                    }
                }
                if(uploadDone){
                    synchronized (this){
                        File destTempFile=new File(tempPath,name);
                        for(int i=0;i<Integer.parseInt(chunks);i++){
                            File partFile=new File(tempFileDir,name+"_"+i+".part");
                            FileOutputStream destTempfos=new FileOutputStream(destTempFile,true);
                            FileUtils.copyFile(partFile,destTempfos);
                            destTempfos.close();
                        }
                        UUID uid=UUID.randomUUID();
                        String id=uid.toString();
                        flowMapper.insertManagerFile(id,name,xdPath,null,null,null);
                        responseObject.setData(id);
                        FileUtils.deleteDirectory(parentFileDir);
                    }
                }

                responseObject.setCode(1);
                responseObject.setMessage("上传完毕");
                return responseObject;
            }
            responseObject.setCode(1);
            responseObject.setMessage("上传完毕");
            return responseObject;
        }catch (Exception e){
            e.printStackTrace();
            responseObject.setCode(0);
            responseObject.setMessage("上传出错");
            return responseObject;
        }
    }

    /*
     *文件管理功能 文件上传
     */
    @RequestMapping("/filemanagerupload")
    @ResponseBody
    public String fielmanagerupload(HttpServletRequest request,MultipartFile file, String chunks,String chunk,String name,String com,String pos,String filetype)throws IOException{
        try{
            String coms=request.getParameter("com");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
            Date date = new Date();
            String year=sdf.format(date);
            String filePath="";
            if(filetype.equals("请选择")||filetype.equals("null")){
                filetype=null;
            }
            if(filetype==null){
                filePath="filemanager/"+year+"/"+com+"/"+pos;
            }else{
                filePath="filemanager/"+year+"/"+com+"/"+pos+"/"+filetype;
            }
            String tempPath = request.getRealPath("/") + filePath;
            String bfPath= fileUrl+filePath;
            if(file!=null){
                if((null==chunks&&null==chunk)||("").equals(chunks)&&("").equals(chunk)){

                    File parentFile=new File(tempPath);
                    File bfparentFile=new File(bfPath);
                    if(!parentFile.exists()){
                        parentFile.mkdirs();
                    }
                    if(!bfparentFile.exists()){
                        bfparentFile.mkdirs();
                    }
                    File destTempFile=new File(parentFile+"/"+name);
                    File bfdestTempFile=new File(bfparentFile+"/"+name);
               /*     if(!destTempFile.exists()){
                        destTempFile.createNewFile();
                    }*/
                    FileUtils.copyInputStreamToFile(file.getInputStream(),destTempFile);
                    destTempFile.createNewFile();
                    FileUtils.copyInputStreamToFile(file.getInputStream(),bfdestTempFile);
                    bfdestTempFile.createNewFile();
                    return "上传完毕";
                }
                String tempFileDir=tempPath+"\\part\\"+File.separator+name;
                String bftempFileDir=bfPath+"\\part\\"+File.separator+name;
                File parentFileDir=new File(tempFileDir);
                if(!parentFileDir.exists()){
                    parentFileDir.mkdirs();
                }
                File bfparentFileDir=new File(bftempFileDir);
                if(!bfparentFileDir.exists()){
                    bfparentFileDir.mkdirs();
                }
                File f=new File(tempFileDir+File.separator+name+"_"+chunk+".part");
                if(!f.exists()){
                    FileUtils.copyInputStreamToFile(file.getInputStream(), f);
                    f.createNewFile();
                }
                File bff=new File(bftempFileDir+File.separator+name+"_"+chunk+".part");
                if(!bff.exists()){
                    FileUtils.copyInputStreamToFile(file.getInputStream(), bff);
                    bff.createNewFile();
                }
                boolean uploadDone=true;
                for(int i=0;i<Integer.parseInt(chunks);i++){
                    File partFile=new File(tempFileDir,name+"_"+i+".part");
                    if(!partFile.exists()){
                        uploadDone=false;
                        return "上传完毕";
                    }
                }
                if(uploadDone){
                    synchronized (this){
                        File destTempFile=new File(tempPath,name);
                        File bfdestTempFile=new File(bfPath,name);
                        for(int i=0;i<Integer.parseInt(chunks);i++){
                            File partFile=new File(tempFileDir,name+"_"+i+".part");
                            File bfpartFile=new File(bftempFileDir,name+"_"+i+".part");
                            FileOutputStream destTempfos=new FileOutputStream(destTempFile,true);
                            FileUtils.copyFile(partFile,destTempfos);
                            destTempfos.close();
                            FileOutputStream bfdestTempfos=new FileOutputStream(bfdestTempFile,true);
                            FileUtils.copyFile(bfpartFile,bfdestTempfos);
                            bfdestTempfos.close();
                        }
                        FileUtils.deleteDirectory(parentFileDir);
                        FileUtils.deleteDirectory(bfparentFileDir);
                    }
                }
                return "上传完毕";
            }
            return "上传完毕";
        }catch (Exception e){
            e.printStackTrace();
            return "上传完毕";
        }
    }

    public static String getRealPath(HttpServletRequest request) {
        String realPath = request.getSession().getServletContext().getRealPath(File.separator);
        realPath = realPath.substring(0, realPath.length() - 1);
        int aString = realPath.lastIndexOf(File.separator);
        realPath = realPath.substring(0, aString);
        return realPath;
    }
    @RequestMapping("/download")
    @ResponseBody
    public void downLoad(HttpServletRequest request,HttpServletResponse response) throws IOException{
        String realPath="F:/eclipse.zip";
        File file = new File(realPath);
        String []filearray = realPath.split("/");
        String filename=filearray[filearray.length-1];
        if (file.exists()) {
            OutputStream out = null;
            FileInputStream in = null;
            try {
                // 1.读取要下载的内容
                in = new FileInputStream(file);

                // 2. 告诉浏览器下载的方式以及一些设置
                // 解决文件名乱码问题，获取浏览器类型，转换对应文件名编码格式，IE要求文件名必须是utf-8, firefo要求是iso-8859-1编码
                File file1=new File("F:/data/"+filename);
                if(!file1.getParentFile().exists()){
                    file1.getParentFile().mkdirs();
                }
                out = new FileOutputStream(file1);
                int len = 0;
                byte[] buffer = new byte[1024];
                while ((len = in.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (out != null) {
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            }
        }
    }

}
