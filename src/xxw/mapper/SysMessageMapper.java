package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.SysMessage;

import java.util.List;

/**
 * Created by lp on 2020/9/18.
 */
public interface SysMessageMapper {
    List<SysMessage> queryMessage(@Param("jsuser")String jsuser,@Param("show")String show);
    void insertSysMessage(SysMessage sysMessage);
   void updateSysMessage(@Param("show")String show,@Param("flowId")String flowId,@Param("node")String node,@Param("duser")String duser);
}
