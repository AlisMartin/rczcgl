package xxw.util;

import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.Priority;

/**
 * <p>判断日志输出级别方法重写</p>
 * @version 1.0
 * @author zxf
 * @date 2015/12/3
 */
public class LogAppender extends DailyRollingFileAppender {
    @Override
    public boolean isAsSevereAsThreshold(Priority priority) {
        //只判断是否相等，而不判断优先级
        return this.getThreshold().equals(priority);
    }
}


