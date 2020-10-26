package xxw.encryp;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class RsaGen {

	private String privateFilePath = "D:\\auth_key\\id_key_rsa";
	private String publicFilePath = "D:\\auth_key\\id_key_rsa.pub";
	//private String privateFilePath = "D:\\auth_key";
	//private String publicFilePath = "D:\\auth_key";
	public static void main(String[] args) throws ClassNotFoundException {
		new RsaGen();
	}

	RsaGen(){
		try {
			System.out.println("开始生成RSA密匙............................");
			//RsaUtils.generateKey(publicFilePath, privateFilePath, "山东智慧云天科技有限公司", 2048);
			System.out.println("生成RSA密匙完成............................");

			String message = "df723820";

			PublicKey pk = RsaUtils.getPublicKey(publicFilePath);
			String mes = "EZ/gMJW2QyeMFMuyiKECYaogKnMTE/SACNJ3x+T2AWwS8BhuDpRMIosU1BzyzNluZfKs39fdDzGqAV+Nm0hMcBYiXPvUQdIK6OW0e3IOYj9cPXW8dC5Ifeh0rDBy++FRfbGOBpBmyNuEHlEW3kmL/R//H+qx2uUvcv39kxIush5gPgg+mPi/oRsUpKTpa+4tlM5fdRSQ6UnNYg2PLM4vQJWUNdoJtUL2YzllfUj40mlus/JiXR0aWROqaLuDg3ts23pPUF0JMflq+j6nxeU6PmjY0pov/vqiL3yGHk+6Lp/jJ9GnXfFK/z2ZfEj+vs9RhHlaDudZio93sgSAiOVBcw==";//encrypt(message,pk);
			System.out.println("加密结果：" + mes);
			String res =  decrypt(mes,RsaUtils.getPrivateKey(privateFilePath));
			System.out.println("解密结果：" + res);
			vliadCode(res);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("生成RSA密匙错误............................");
			System.out.println(e.getMessage());
		}
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
	public String encrypt( String str, PublicKey publicKey ) throws Exception{
		//base64编码的公钥
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.ENCRYPT_MODE, publicKey);
		String outStr = Base64.encodeBase64String(cipher.doFinal(str.getBytes("UTF-8")));
		return outStr;
	}

	/**
	 * RSA私钥解密
	 *
	 * @param str
	 *            加密字符串
	 * @param privateKey
	 *            私钥
	 * @return 铭文
	 * @throws Exception
	 *             解密过程中的异常信息
	 */
	public static String decrypt(String str, PrivateKey privateKey) throws Exception{
		//64位解码加密后的字符串
		byte[] inputByte = Base64.decodeBase64(str.getBytes("UTF-8"));
		//RSA解密
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, privateKey);
		String outStr = new String(cipher.doFinal(inputByte));
		return outStr;
	}

	public static Boolean vliadCode(String codes) throws UnknownHostException, SocketException{

		SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss");

		String[] list = codes.split("&");

		int day = Integer.parseInt(list[1]);
		String mac = list[2];

		String  curr_date = formatter.format(new Date(System.currentTimeMillis()));
		Date date1 = MyDateUtil.parseDate(list[0], "yyyy-MM-dd HH:mm:ss");
		Date date2 = MyDateUtil.parseDate(curr_date, "yyyy-MM-dd HH:mm:ss");


		// 获取相差的天数
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date1);
		long timeInMillis1 = calendar.getTimeInMillis();
		calendar.setTime(date2);
		long timeInMillis2 = calendar.getTimeInMillis();

		long betweenDays =  (timeInMillis2 - timeInMillis1) / (1000L*3600L*24L);

		//判断天数
		if(day > betweenDays){
			System.out.println("剩余天数："  + (day - betweenDays));
		}else{
			return false;
		}

		InetAddress ia =  InetAddress.getLocalHost();
		String rmac = getLocalMac(ia);
		//判断MAC地址
		if(rmac.equals(mac)){
			System.out.println("服务器物理地址正确");
		}else{
			return false;
		}
		return true;
	}


	/**
	 * 获取服务器的MAC地址
	 * @param ia
	 * @throws SocketException
	 */
	public static String getLocalMac(InetAddress ia) throws SocketException {
		byte[] mac = NetworkInterface.getByInetAddress(ia).getHardwareAddress();
		StringBuffer sb = new StringBuffer("");
		for(int i=0; i<mac.length; i++) {
			if(i!=0) {
				sb.append("-");
			}
			//字节转换为整数
			int temp = mac[i]&0xff;
			String str = Integer.toHexString(temp);
			if(str.length()==1) {
				sb.append("0"+str);
			}else {
				sb.append(str);
			}
		}
		return sb.toString().toUpperCase();
	}
}
