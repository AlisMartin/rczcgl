package xxw.encryp;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.security.PublicKey;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Register implements ActionListener{

	private String publicFilePath = "D:\\项目\\newrczcgl\\out\\artifacts\\rczcgl_war_exploded\\auth_key\\id_key_rsa.pub";
	private String privateFilePath = "D:\\项目\\newrczcgl\\out\\artifacts\\rczcgl_war_exploded\\auth_key\\id_key_rsa";

	JFrame frame=new JFrame("荣成市资产管理系统注册码生成机");
	JTabbedPane tabPane=new JTabbedPane();//选项卡布局
	Container con=new Container();//布局1
	Container con1=new Container();//布局2
	JLabel label1=new JLabel("开始日期：");
	JLabel label3=new JLabel("有效天数:");
	JLabel label5=new JLabel("物理地址:");
	JLabel label4=new JLabel("注册码：");
	JLabel label6=new JLabel("");
	JLabel label7=new JLabel("");
	JLabel label2=new JLabel("");
	JTextArea text1=new JTextArea();

	JTextField text2=new JTextField("40");
	JButton button2 = new JButton("生成注册码");

	Register(){
		double lx=Toolkit.getDefaultToolkit().getScreenSize().getWidth();
		double ly=Toolkit.getDefaultToolkit().getScreenSize().getHeight();
		frame.setLocation(new Point((int)(lx/2)-150,(int)(ly/2)-150));//设定窗口出现位置
		frame.setSize(500,320);//设定窗口大小
		tabPane.setBounds(0,0,7100,105);

		label1.setBounds(10,23,70,23);
		label3.setBounds(10,55,70,55);
		label5.setBounds(10,110,70,23);
		label4.setBounds(10,120,300,85);
		label6.setBounds(85,110,220,25);
		label7.setBounds(85,25,220,25);

		text1.setBounds(85,150,360,100);
		text2.setBounds(85,65,120,25);
		button2.setBounds(260,50,120,20);
		label2.setBounds(80,80,260,60);
		button2.addActionListener(this);//添加事件处理
		frame.add(label1);
		frame.add(label3);
		frame.add(label4);
		frame.add(label5);
		frame.add(label6);
		frame.add(label7);
		frame.add(text2);
		frame.add(text1);
		frame.add(button2);
		frame.add(label2);
		frame.add(tabPane);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		getMac();
		label7.setText(getCurrentTimes());
	}

	public void  getMac(){

		InetAddress ia;
		try {
			ia = InetAddress.getLocalHost();
			System.out.println(ia);
			try {
				String mac = getLocalMac(ia);
				label6.setText(mac);
			} catch (SocketException e) {
				e.printStackTrace();
			}
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}

	}

	public void actionPerformed(ActionEvent e){//事件处理
		if(e.getSource().equals(button2)){
			if("".equals(text2.getText().toString().trim())){
				JOptionPane.showMessageDialog(null, "必须填入有效天数", "警告",  JOptionPane.ERROR_MESSAGE);
			}else{

				StringBuffer sb = new StringBuffer();

				sb.append(label7.getText().trim())
						.append("&")
						.append(text2.getText().trim())
						.append("&")
						.append(label6.getText().trim());

				String code = generateCode(sb.toString());

				text1.setText(code);

			}
		}
	}

	public String generateCode(String mes){

		PublicKey pk;
		String code ="";
		try {
			pk = RsaUtils.getPublicKey(publicFilePath);
			code = encrypt(mes,pk);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return code;
	}


	//入口函数
	public static void main(String[] args) throws ClassNotFoundException {
		new Register();
	}

	/**
	 * 获取服务器的MAC地址
	 * @param ia
	 * @throws SocketException
	 */
	private static String getLocalMac(InetAddress ia) throws SocketException {
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

	/**
	 * 获取当前时间
	 * @return
	 */
	private String getCurrentTimes(){

		SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date(System.currentTimeMillis());
		return formatter.format(date);
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

}
