package xxw.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @Title: DateUtils
 * @Description:
 * @author: shitong
 * @version: 1.0
 * @date: 2018/5/26 9:58
 */
public class DateUtils {

    /**
     * @author sunx
     * @date 2019/10/21 16:30
     * @description 增加时间单位：年
     */
    public static String getCurrentAddYear(int year) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.YEAR, year);
        return sdf.format(cal.getTime());
    }

    /**
     * 增加时间单位：月
     */
    public static String getCurrentAddmonth(int month, String pattern, String date) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        Calendar cal = Calendar.getInstance();
        Date date1;
        try {
            date1 = sdf.parse(date);
            cal.setTime(date1);
            cal.add(Calendar.MONTH, month);
            return sdf.format(cal.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return date;
        }
    }

    /**
     * 增加时间单位：天
     */
    public static String getCurrentAddDay(int day) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DATE, day);
        return sdf.format(cal.getTime());
    }

    /**
     * 增加时间单位：分钟
     */
    public static String getCurrentAddMin(int minute) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, minute);
        return sdf.format(cal.getTime());
    }


    /**
     * 把Date转为String
     */
    public static String getFormatTime(Date date, String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(date);
    }

    /**
     * 增加时间单位：天
     */
    public static Date addDay(int day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DATE, day);
        return cal.getTime();
    }

    /**
     * 增加时间单位：天
     */
    public static Date addDay(Date date, int day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, day);
        return cal.getTime();
    }

    /**
     * 增加时间单位：月
     */
    public static Date addMonth(Date date, int month) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, month);
        return cal.getTime();
    }

    /**
     * 减去多少天
     */
    public static Date minusDay(Date date, int day) {
        return addDay(date, -day);
    }

    /**
     * 获取日期对应的星期
     */
    public static String getWeekOfDate(Date date) {
        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0) {
            w = 0;
        }
        return weekDays[w];
    }

    public static java.sql.Date utilToSqlDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        java.sql.Date result = null;
        try {
            Date finalDate = sdf.parse(sdf.format(date));
            result = new java.sql.Date(finalDate.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static Date StringToUtilDate(String date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date utilDate = null;
        try {
            utilDate = sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return utilDate;
    }

    public static Date StringToUtilDate(String date, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        Date utilDate = null;
        try {
            utilDate = sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return utilDate;
    }

    /**
     * @author dwh
     * @date 2019/9/11 10:30
     * @description 获取两个日期之间的工作日天数（不排除法定节假日）
     */
    public static int getDutyDays(String startStrDate, String endStrDate) {
        int result = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            Date startDate = sdf.parse(startStrDate);
            Date endDate = sdf.parse(endStrDate);
            while (startDate.compareTo(endDate) <= 0) {
                if (startDate.getDay() != 6 && startDate.getDay() != 0) {
                    result++;
                }
                startDate.setDate(startDate.getDate() + 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @param httpArg
     *            :参数
     * @return 返回结果
     */
    public static String request(String httpArg) {
        String httpUrl = "http://tool.bitefu.net/jiari/";
        BufferedReader reader = null;
        String result = null;
        StringBuffer sbf = new StringBuffer();
        httpUrl = httpUrl + "?d=" +httpArg;
        try {
            URL url = new URL(httpUrl);
            HttpURLConnection connection = (HttpURLConnection) url
                    .openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            InputStream is = connection.getInputStream();
            reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            String strRead = null;
            while ((strRead = reader.readLine()) != null) {
                sbf.append(strRead);
            }
            reader.close();
            result = sbf.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @author dwh
     * @date 2019/9/11 10:30
     * @description 获取两个日期之间的工作日天数（不排除法定节假日）
     */
    public static int getDutyDays(String startStrDate, String endStrDate, String pattern) {
        int result = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(pattern);
            Date startDate = sdf.parse(startStrDate);
            Date endDate = sdf.parse(endStrDate);
            while (startDate.compareTo(endDate) <= 0) {
                if (startDate.getDay() != 6 && startDate.getDay() != 0) {
                    result++;
                }
                startDate.setDate(startDate.getDate() + 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @author dwh
     * @date 2019/9/11 10:39
     * @description 获取两个日期之间的天数（排除周日）
     */
    public static int getDaysRemoveSunday(String startStrDate, String endStrDate) {
        int result = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            Date startDate = sdf.parse(startStrDate);
            Date endDate = sdf.parse(endStrDate);
            while (startDate.compareTo(endDate) <= 0) {
                if (startDate.getDay() != 0) {
                    result++;
                }
                startDate.setDate(startDate.getDate() + 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static int getAgeByBirthDay(Date birthDay) {
        int age = 0;
        Calendar cal = Calendar.getInstance();
        if (cal.before(birthDay)) { //出生日期晚于当前时间，无法计算
            throw new IllegalArgumentException(
                    "出生日期在当前之后，令人难以置信");
        }
        int yearNow = cal.get(Calendar.YEAR);  //当前年份
        int monthNow = cal.get(Calendar.MONTH);  //当前月份
        int dayOfMonthNow = cal.get(Calendar.DAY_OF_MONTH); //当前日期
        cal.setTime(birthDay);
        int yearBirth = cal.get(Calendar.YEAR);
        int monthBirth = cal.get(Calendar.MONTH);
        int dayOfMonthBirth = cal.get(Calendar.DAY_OF_MONTH);
        age = yearNow - yearBirth;   //计算整岁数
        if (monthNow <= monthBirth) {
            if (monthNow == monthBirth) {
                if (dayOfMonthNow < dayOfMonthBirth) age--;//当前日期在生日之前，年龄减一
            } else {
                age--;//当前月份在生日之前，年龄减一
            }
        }
        return age;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/8/9 10:49
     * @return:
     * @Description: 获取当前年和月
     */
    public static int[] getCurrentMonthIntArr() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int[] ym = new int[]{year, month};
        return ym;
    }
    /**
     * @Description: 获取当前年
     */
    public static Integer getYearInt() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        return year;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/8/9 10:49
     * @return:
     * @Description: 获取当前年和月
     */
    public static String getCurrentMonthSting() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        String stringMonth = String.valueOf(month);
        if (month < 10) {
            stringMonth = "0" + month;
        }
        return year + "-" + stringMonth;
    }

    /**
     * 计算两个日期之间相差的天数
     * @param smdate 较小的时间
     * @param bdate 较大的时
     * @return 相差天数
     * @throws ParseException
     */

    public static int daysBetween(Date smdate,Date bdate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(smdate);
        long time1 = cal.getTimeInMillis();
        cal.setTime(bdate);
        long time2 = cal.getTimeInMillis();
        long between_days=(time2-time1)/(1000*3600*24);
        return Integer.parseInt(String.valueOf(between_days));
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/9/10 16:12
     * @return: Integer
     * @Description: 获取两个日期间天数
     */
    public static Integer getBetweenDatesLength(Date startDate, Date endDate) {
        List<String> days = new ArrayList<String>();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar tempStart = Calendar.getInstance();
            tempStart.setTime(startDate);
            Calendar tempEnd = Calendar.getInstance();
            tempEnd.setTime(endDate);
            tempEnd.add(Calendar.DATE, +1);// 日期加1(包含结束)
            while (tempStart.before(tempEnd)) {
                days.add(dateFormat.format(tempStart.getTime()));
                tempStart.add(Calendar.DAY_OF_YEAR, 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Integer.valueOf(days.size());
    }
    /**
     * @author: sunx
     * @time: 2019/12/16  11:30
     * @return:
     * @Description: 获取两个日期相差年份
     */
    public static Integer getBetweenYearsLength(Date startDate, Date endDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        int month = 0;
        int year = 0;
        try {
            Calendar bef = Calendar.getInstance();
            Calendar aft = Calendar.getInstance();
            bef.setTime(sdf.parse(sdf.format(startDate)));
            aft.setTime(sdf.parse(sdf.format(endDate)));
            int date = aft.get(Calendar.DATE) - bef.get(Calendar.DATE);
            month = aft.get(Calendar.MONTH) - bef.get(Calendar.MONTH);
            year = aft.get(Calendar.YEAR) - bef.get(Calendar.YEAR);
            if (year <= 0) {
                year = 0;
            } else if (year > 0 && month == 0) {
                year = year - (date < 0 ? 1 : 0);
            } else if (year > 0 && month > 0) {
                year = year;
            } else if (year > 0 && month < 0) {
                year = year - 1;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return year;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/8/9 11:24
     * @return:
     * @Description: 获取本月第一天
     */
    public static String getCurrentMonthFirstDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 0);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        String firstday = sdf.format(cale.getTime());
        return firstday;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/8/9 11:24
     * @return:
     * @Description: 获取本月最后一天
     */
    public static String getCurrentMonthLastDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, 0);
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        String firstday = sdf.format(cale.getTime());
        return firstday;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/9/10 16:31
     * @return:
     * @Description: 获取某月的第一天
     */
    public static String getMonthFirstDay(int year, int month) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        //设置年份
        cal.set(Calendar.YEAR, year);
        //设置月份
        cal.set(Calendar.MONTH, month - 1);
        //获取某月最小天数
        int firstDay = cal.getActualMinimum(Calendar.DAY_OF_MONTH);
        //设置日历中月份的最小天数
        cal.set(Calendar.DAY_OF_MONTH, firstDay);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        //格式化日期
        String firstDayOfMonth = sdf.format(cal.getTime());
        return firstDayOfMonth;
    }

    /**
     * @Author: Chu_Yu
     * @Date: 2019/9/10 16:34
     * @return:
     * @Description: 获取某月最后一天
     */
    public static String getMonthLastDay(int year, int month) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        //设置年份
        cal.set(Calendar.YEAR, year);
        //设置月份
        cal.set(Calendar.MONTH, month - 1);
        //获取某月最大天数
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        //设置日历中月份的最大天数
        cal.set(Calendar.DAY_OF_MONTH, lastDay);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        //格式化日期
        String lastDayOfMonth = sdf.format(cal.getTime());
        return lastDayOfMonth;
    }

    public static boolean isValidDate(String str,String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        try {
            sdf.setLenient(false);
            sdf.parse(str);
        }catch (ParseException e){
            return false;
        }
        return true;
    }
}
