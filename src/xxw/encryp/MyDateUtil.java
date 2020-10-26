package xxw.encryp;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;

public class MyDateUtil {
	
	/**
     * ��ָ���������ַ���ת��������
     * @param dateStr �����ַ���
     * @param pattern ��ʽ
     * @return ���ڶ���
     */
    public static Date parseDate(String dateStr, String pattern)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        Date date;
        try {
            date = sdf.parse(dateStr);
        } catch (ParseException e) {
            throw  new RuntimeException("����ת������");
        }

        return date;
    }

    /**
     * ��ָ�������ڸ�ʽ����ָ���������ַ���
     * @param date ���ڶ���
     * @param pattern ��ʽ
     * @return ��ʽ����������ַ���
     */
    public static String dateFormate(Date date, String pattern)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String dateStr;
        if(date == null)
        {
            return "";
        }
        dateStr = sdf.format(date);
        return dateStr;
    }

    /**
     * ��ѯָ������ǰ��ָ��������
     * @param date ���ڶ���
     * @param days ����
     * @return ���ڶ���
     */
    public static Date incr(Date date, int days)
    {
        if (date == null){
            return null;
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, days);
        return calendar.getTime();
    }

    /**
     * ��LocalDate����ת����Date
     * @param localDate LocalDate����
     * @return Date����
     */
    public static Date localDateToDate(LocalDate localDate)
    {
        if (localDate == null)
        {
            return null;
        }
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime zonedDateTime = localDate.atStartOfDay(zoneId);
        Date date = Date.from(zonedDateTime.toInstant());

        return date;
    }

    /**
     * ��Dateת��LocalDate����
     * @param date Date����
     * @return LocalDate����
     */
    public static LocalDate dateToLocalDate(Date date)
    {
        if (date == null)
        {
            return null;
        }
        ZoneId zoneId = ZoneId.systemDefault();
        Instant instant = date.toInstant();
        LocalDate localDate = instant.atZone(zoneId).toLocalDate();

        return localDate;
    }
    
}
