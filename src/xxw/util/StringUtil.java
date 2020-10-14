package xxw.util;

/**
 * Created by wrh on 2020/9/14.
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * �ַ���������
 *
 * @author hulb
 */
public class StringUtil {
    /**
     * �ж��Ƿ��ǿ�
     */
    public static boolean isEmpty(String str) {
        if (str == null || "".equals(str.trim())) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * �ж��Ƿ��ǿ�
     */
    public static boolean isNotEmpty(String str) {
        if ((str != null) && !"".equals(str.trim())) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * ��ʽ��ģ����ѯ
     */
    public static String formatLike(String str) {
        if (isNotEmpty(str)) {
            return "%" + str + "%";
        } else {
//            return "%%";
            return null;
        }
    }
    /**
     * �ж��Ƿ�Ϊ����
     */
    public static boolean isNumber(String str) {
        String reg = "^[0-9]+(.[0-9]+)?$";
        return str.matches(reg);
    }
    }
