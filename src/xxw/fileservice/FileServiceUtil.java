package xxw.fileservice;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created by qingm on 2017/7/5.
 */
public class FileServiceUtil {
    private static final String Config_File = "fileservice.properties";

    public static String getConfigValue(String configKey) {
        String configValue = null;
        InputStream in = null;
        Properties prop = new Properties();

        try {
            prop = new Properties();
            in = FileServiceUtil.class.getClassLoader().getResourceAsStream(Config_File);

            prop.load(in);

            if(prop.containsKey(configKey)){
                configValue = prop.getProperty(configKey);
            }
        } catch (IOException e) {
            System.out.println("读取配置文件失败:" + Config_File);
        }finally {
            if(prop != null){
                prop.clear();
            }
            if(in != null){
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
        }

        return configValue;
    }

    public static Object getService(Class type){
        String url = getConfigValue("serviceURL");
        if(url == null) return null;

        JaxWsProxyFactoryBean factory = new JaxWsProxyFactoryBean();
        factory.setAddress(url);
        factory.setServiceClass(type);
        return factory.create();
    }
}
