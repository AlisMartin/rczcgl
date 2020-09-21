package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import xxw.po.FlowHistory;
import xxw.po.FlowInstance;
import xxw.po.NodeInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/9/4.
 */
public interface FlowMapper {
    List<NodeInfo> getNodes();
    void upNode(@Param("id")String id,@Param("nodeId")String nodeId,@Param("flowType")String flowType,@Param("treeid")String treeid);

    int createFlow(FlowHistory flowInstance);

    int updateFlow(FlowHistory flowInstance);

    int createFlowHistory(FlowHistory flowHistory);

    List<FlowHistory>  queryFlowInfos(@Param("flowType")String flowType,@Param("flowId")String flowId);
    List<FlowHistory> queryFlowHistoryInfo(@Param("flowId")String flowId,@Param("node")String node);
    List<String> selectCom();

    List<String> selectPos(@Param("com")String com);

    List<String> selectType(@Param("com")String com,@Param("pos")String pos);

    List<Map<String,String>>selectFile(@Param("com")String com,@Param("pos")String pos,@Param("type")String type,@Param("fileDate")String fileDate);

    List<Map<String,String>>selectPathId(@Param("com")String com,@Param("pos")String pos,@Param("type")String type);

    int insertManagerFile(@Param("fileId")String fileId,@Param("fileName")String fileName,@Param("filePath")String filePath,@Param("realName")String realName,@Param("pathId")String pathId,@Param("fileDate")String fileDate);
    int updateFile(@Param("fileId")String fileId,@Param("zcid")String zcid);
    void savefilefold(@Param("com")String com,@Param("pos")String pos,@Param("type")String type,@Param("pathid")String pathid);
}
