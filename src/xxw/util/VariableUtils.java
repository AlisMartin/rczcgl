package xxw.util;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * <p>全局静态变量类</p>
 *
 * @version 1.0
 * @author zxf
 * @date 2015/11/27
 */
public class VariableUtils {
    /**
     * 日期格式化对象
     */
    public static DateFormat fullDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    public static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static DecimalFormat DecimalFormat_LowPrecision = new DecimalFormat("#.##");
    public static DecimalFormat DecimalFormat_HighPrecision = new DecimalFormat("#.####");

    /**
     * 系统角色的类型
     */
    public enum ROLE_TYPE{
        Administrator(1), Operator(2);

        int roleType;
        ROLE_TYPE(int roleType) {
            this.roleType = roleType;
        }
        public int getRoleType() {
            return roleType;
        }
    }

    /**
     * 专题图的类型
     */
    public enum THEME_TYPE{
        ClassThemeMap(1), LevelThemeMap(2);

        int themeTypeId;
        THEME_TYPE(int themeTypeId) {
            this.themeTypeId = themeTypeId;
        }
        public int getThemeTypeId() {
            return themeTypeId;
        }
    }

    /**
     * 区划的级别
     */
    public enum REGION_LEVEL{
        City(1), County(2), Town(3), Village(4);

        int regionLevel;
        REGION_LEVEL(int regionLevel) {
            this.regionLevel = regionLevel;
        }
        public int getRegionLevel() {
            return regionLevel;
        }
    }

    /**
     * 操作成功的标识值
     */
    public static final int SUCCESS = 1;

    /**
     * 操作失败的标识值
     */
    public static final int FAILURE = 0;

    /**
     * 用户名参数的名称
     */
    public static final String USERNAME = "_userName";

    /**
     * 用户名参数的名称
     */
    public static final String USERID = "_userid";

    public static final String CLIENT_MOBILE = "mobile";

    /**
     * 单点登录标识信息
     * */
    public static final String MSG = "msg";

    public static final String LOGIN_HREF = "indexLogin";
    /**
     * 村镇登录页
     */
    public static final String URL_LOGIN = "login.html";
    /**
     * 改厕移动端登录页 added by lipeng 2019.9.22
     */
    public static final String URL_LOGIN_LATRINE= "#/Login";

    public static final String INDEX_HREF = "indexHref";
    /**
     * 建委首页
     */
    public static final String URL_INDEX = "index.html";
    /**
     * 区县首页
     */
    public static final String URL_INDEX_DISTRICT = "indexdistrict.html";
    /**
     * 乡镇首页
     */
    public static final String URL_INDEX_TOWN = "indextown.html";
    /**
     * 乡镇详情页
     */
    public static final String URL_TOWN = "detailtown.html";
    /**
     * 行政村首页
     */
    public static final String URL_VILLAGE = "village.html";
    /**
     * 区县首页
     */
    public static final String URL_DISTRICT = "detaildistrict.html";
    /**
     * 动态系统  建委首页
     */
    public static final String URL_D_INDEX = "d_city.html";
    /**
     * 动态系统 乡镇首页
     */
    public static final String URL_D_TOWN = "d_town.html";
    /**
     * 动态系统 区县首页
     */
    public static final String URL_D_DISTRICT = "d_district.html";

    /**
     * 表名参数的名称
     */
    public static final String TABLENAME = "tableName";

    /**
     * 表上报周期参数的名称
     */
    public static final String SUBMITPERIOD = "submitPeriod";

    /**
     * 配置键参数的名称
     */
    public static final String CONFIGKEY = "key";

    /**
     * 专题地图编号参数的名称
     */
    public static final String THEMEID = "themeId";

    /**
     * 专题地图条件参数的名称
     */
    public static final String THEMECOND = "themeCond";

    /**
     * 自定义查询条件编号参数的名称
     */
    public static final String QUERYID = "queryId";

    /**
     * 链接编号参数的名称
     */
    public static final String LINkID = "linkId";

    /**
     * 区划的等级
     */
    public static final String REGIONLEVEL = "level";

    /**
     * 区划的编码
     */
    public static final String REGIONCODE = "code";
    /**
     * 行政村基本信息表名
     */
    public static final String T_VILLAGE_INFO = "VILLAGE_INFO";
    /**
     * 行政村
     */
    public static final String VILLAGE = "village";

    /**
     * 建制镇
     */
    public static final String TOWN = "town";

    /**
     * 日志事件类型的名称
     */
    public static final String EVENTTYPE = "eventType";

    /**
     * 起始日期的名称
     */
    public static final String FROMTIME = "fromTime";

    /**
     * 截止日期的名称
     */
    public static final String TOTIME = "toTime";

    //region 流程控制相关变量
//    public static final String AuditDataIdKey = "auditDataId";
//    public static final String AuditDataTypeKey = "auditDataType";
//    public static final String CZ_USERKey = "cz_user";
//    public static final String QX_USERKey = "qx_user";
//    public static final String JW_USERKey = "jw_user";
    public static final String UserIdKey = "userID";
    public static final String IsCheckedKey = "isChecked";
    public static final String AuditAttachedInfoKey = "attachedInfo";

    public enum USER_REGIONLEVEL{
        CZ(1), QX(2), JW(3);

        int value;
        USER_REGIONLEVEL(int regionLevel) {
            this.value = regionLevel;
        }
        public int getValue() {
            return value;
        }
    }

    public enum ISCHECKED{
        YES(1), NO(0);

        int value;
        ISCHECKED(int temp) {this.value = temp;}
        public int getValue() { return value;}
    }

    public enum Enum_EVENTTYPE{
        LOGOUTSYSTEM(0), LOGINSYSTEM(1), STARTDATASUBMIT(2), SUBMITDATA(3),
        CHECKDATA(4), SUMMARIZEDATA(5), EXPORTEXCEL(6), SENDMESSAGE(7),
        MANAGEUSER(8), MANAGEMESSAGE(9), ALTERUSERINFO(9);

        int value;
        Enum_EVENTTYPE(int value) {this.value = value;}
        public int getValue() { return value;}
        public String getName(){
            if(value == 0) return "登出系统";
            else if(value == 1) return "登入系统";
            else if(value == 2) return "启动数据报送";
            else if(value == 3) return "提交数据";
            else if(value == 4) return "审核数据";
            else if(value == 5) return "汇总数据";
            else if(value == 6) return "导出报表";
            else if(value == 7) return "发送系统消息";
            else if(value == 8) return "管理系统用户";
            else if(value == 9) return "管理系统消息";
            else if(value == 10) return "修改用户信息";
            else return "未知事件";
        }
    }

    //endregion

    /*public static final Map<String,String> codeRegion=new HashMap<String,String>();
    static{
        codeRegion.put("3701","济南市");
    }*/

    /**
     * 判断字符串是否为有效的日期
     * @param str 字符串
     * @param testFullDate 是否检测完整的日期，完整日期的格式为：yyyy-MM-dd HH:mm:ss
     * @return true|false，字符串为有效日期时返回true，否则返回false
     */
    public static boolean isDate(String str, boolean testFullDate){
        if(str == null || str.length() == 0) return false;

        DateFormat df = null;
        if(testFullDate){
            df = fullDateFormat;
        }else{
            df = dateFormat;
        }

        try {
            df.parse(str);
        } catch (ParseException e) {
            return false;
        }

        return true;
    }

    /**
     * 判断字符串是否为数字
     * @param str 字符串
     * @return true|false，字符串为数字时返回true，否则返回false
     */
    public static boolean isNumber(String str){
        if(str == null || str.length() == 0) return false;

        Pattern pattern = Pattern.compile("-?[0-9]+.?[0-9]+");
        Matcher isNum = pattern.matcher(str);

        return isNum.matches();
    }

    /**
     * 判断字符串是否为整数
     * @param str 字符串
     * @return true|false，字符串为整数时返回true，否则返回false
     */
    public static boolean isInteger(String str){
        if(str == null || str.length() == 0) return false;

        Pattern pattern = Pattern.compile("-?[0-9]*");
        Matcher isNum = pattern.matcher(str);

        return isNum.matches();
    }

    /**
     * 将字符串转换为有效的日期
     * @param str 字符串
     * @return Date，日期对象
     */
    public static Date toDate(String str){
        try {
            return fullDateFormat.parse(str);
        } catch (ParseException e) {
            return null;
        }
    }

    /**
     * 将数组分割成固定长度的多个数组
     * @param array 原始数组
     * @param size 子数组大小
     * @return 子数组集合
     */
    public static List<String[]> toFixedArrays(String[] array, int size) {
        if(array == null) return null;

        int count = array.length % size == 0 ? array.length / size : array.length / size + 1;

        List<String[]> subArrayList = new ArrayList<String[]>();
        List<String> list;
        String[] temp;
        int i, j;

        for (i = 0; i < count; i++) {
            int index = i * size;

            list = new ArrayList<String>();
            j = 0;

            while (j < size && index < array.length) {
                list.add(array[index++]);
                j++;
            }

            temp = (String[])list.toArray(new String[list.size()]);
            subArrayList.add(temp);
        }

        return subArrayList;
    }
}
