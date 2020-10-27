package xxw.util;

import org.apache.commons.codec.binary.*;
import xxw.encryp.MyDateUtil;
import xxw.encryp.RsaUtils;

import javax.crypto.Cipher;
import java.io.*;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Base64;

/**
 * Created by 86188 on 2020/10/24.
 */
public class RSATaskDetail extends TimerTask {
    private String path;
    private String privateKey;
    private String publicKey;

    public RSATaskDetail(String path, String privateKey,String publicKey) {
        this.path = path;
        this.privateKey = privateKey;
        this.publicKey=publicKey;
    }

    @Override
    public void run() {
        String mes = "WmWh1rDTp1wzSvVhG/sdM81JkSOm+98FOO9mSatslPiExqDhZK3UzmjzeTUxuRAJNeD6iQdqIs4MvICZqRb8ird/wGDIgLJ9u0/8kHXVAPJZfTj7SrA+jV06WIybnh8rDMv4lj9IzMUDVKnuXj7444EYJJcgOYV6bKfJlZc/Jm56c2eymlEbtMvSF4sfgc/ihwdpTXyuCKYT3ZeF04LVLUsoTznMLTQEwBSTO+baMTJIYhB7PHVPXTmdKyJ1hXJYX0Y6ZostY2zdF+G7sGgGsXQ+ZyKtiZ2ywPWqJ8FQp4uBFiU7Sg85zHN+Oyi6BPwMMx8jJ/VbkfLcjjiLGb6OIA==";
        System.out.println("+++++" + new Date());
        String res = null;
        File file = new File(this.path);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss");
        String curr_date = formatter.format(new Date(System.currentTimeMillis()));
        String result = txt2String(file);
        //String jmdate=encryptAndDencrypt(curr_date,'3');
        String jmdate= null;
        try {
            jmdate = encrypt(curr_date, RsaUtils.getPublicKey(this.publicKey));
        } catch (Exception e) {
            e.printStackTrace();
        }
        if ("".equals(result)) {
            WriteNewLog(jmdate,file);
        }else{
            try {
                res = decrypt(mes, RsaUtils.getPrivateKey(this.privateKey));
            } catch (Exception e) {
                e.printStackTrace();
            }
            String[] list = res.split("&");
            int day = Integer.parseInt(list[1]);
            Date date1 = MyDateUtil.parseDate(list[0], "yyyy-MM-dd HH:mm:ss");
            Date date2 = MyDateUtil.parseDate(curr_date, "yyyy-MM-dd HH:mm:ss");

            // 获取相差的天数
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date1);
            long timeInMillis1 = calendar.getTimeInMillis();
            calendar.setTime(date2);
            long timeInMillis2 = calendar.getTimeInMillis();

            long betweenDays = (timeInMillis2 - timeInMillis1) / (1000L * 3600L * 24L);

            //判断天数
            if (day > betweenDays) {
                WriteNewLog(jmdate,file);
            } else {
            }
        }
        System.out.println(result);
    }

    public static String txt2String(File file) {
        StringBuilder result = new StringBuilder();
        try {
            BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
            String s = null;
            while ((s = br.readLine()) != null) {//使用readLine方法，一次读一行
                result.append(System.lineSeparator() + s);
            }
            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result.toString();
    }

    public static void WriteNewLog(String str, File newlog) {
        System.out.println("----------------开始写新日志----------------");
        try {
            if (!newlog.isFile()) {
                newlog.createNewFile();
            }
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(newlog), "utf-8"));
            bw.write(str + "\r\n");
           // bw.write(str);
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * RSA私钥解密
     *
     * @param str        加密字符串
     * @param privateKey 私钥
     * @return 铭文
     * @throws Exception 解密过程中的异常信息
     */
    public static String decrypt(String str, PrivateKey privateKey) throws Exception {
        //64位解码加密后的字符串
        byte[] inputByte = org.apache.commons.codec.binary.Base64.decodeBase64(str.getBytes("UTF-8"));
        //RSA解密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        String outStr = new String(cipher.doFinal(inputByte));
        return outStr;
    }

    /**
     * RSA公钥加密
     *
     * @param str
     *            加密字符串
     * @param publicKey
     *            公钥
     * @return 密文
     * @throws Exception
     *             加密过程中的异常信息
     */
    public static String encrypt( String str, PublicKey publicKey ) throws Exception{
        //base64编码的公钥
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        String outStr = org.apache.commons.codec.binary.Base64.encodeBase64String(cipher.doFinal(str.getBytes("UTF-8")));
        return outStr;
    }

}
