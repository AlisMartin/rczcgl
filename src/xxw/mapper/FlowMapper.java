package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.FlowHistory;
import xxw.po.FlowInstance;
import xxw.po.NodeInfo;

import java.util.List;

/**
 * Created by lp on 2020/9/4.
 */
public interface FlowMapper {
    List<NodeInfo> getNodes();
    void upNode(@Param("id")String id,@Param("nodeId")String nodeId,@Param("flowType")String flowType,@Param("treeid")String treeid);

    int createFlow(FlowInstance flowInstance);

    int updateFlow(FlowInstance flowInstance);

    int createFlowHistory(FlowHistory flowHistory);

}
