package xxw.controller;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import xxw.po.Webuploader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.List;

/**
 * Created by lp on 2020/6/2.
 */
@Controller
@RequestMapping("/upload")
public class WebUploadController {
    @RequestMapping("/fileupload")
    @ResponseBody
    public String upload(HttpServletRequest request,MultipartFile file, String chunks,String chunk,String name,String zcid)throws IOException{
        try{
            String tempPath = request.getRealPath("/") + "assetsfile/"+zcid+"/";
            if(file!=null){
                if((null==chunks&&null==chunk)||("").equals(chunks)&&("").equals(chunk)){

                    File parentFile=new File(tempPath);
                    if(!parentFile.exists()){
                        parentFile.mkdirs();
                    }
                    File destTempFile=new File(parentFile+"/"+name);
               /*     if(!destTempFile.exists()){
                        destTempFile.createNewFile();
                    }*/
                    FileUtils.copyInputStreamToFile(file.getInputStream(),destTempFile);
                    destTempFile.createNewFile();
                    return "上传完毕";
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
                        return "上传完毕";
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
                        FileUtils.deleteDirectory(parentFileDir);
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
