package xxw.mapper;

import xxw.po.Log;

import java.util.List;

/**
 * Created by lp on 2020/6/4.
 */
public interface LogMapper {
    int inertLog(Log log);
    List<Log> getLogs();
}
