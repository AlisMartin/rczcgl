package xxw.fileservice;

import javax.jws.WebMethod;
import javax.jws.WebService;

/**
 * Created by qingm on 2017/7/5.
 */
@WebService(serviceName = "FileService", targetNamespace="http://fileservice.citytown.xxw.cn/")
public interface FileService {
    /**
     * 保存图片到服务器目录
     *
     * @param fileByte 图片字节数组
     * @param fileName 图片原名
     * @return
     */
    @WebMethod
    public boolean saveFile(byte[] fileByte, String regionCode, String fileName);

    @WebMethod
    public boolean savePic(byte[] fileByte, String regionCode, String fileName);

    @WebMethod
    public void deleteFile(String regionCode, String fileName);

    @WebMethod
    public void deletePic(String regionCode, String fileName);
}
