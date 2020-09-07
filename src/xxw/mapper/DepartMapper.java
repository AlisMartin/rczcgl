package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.DepartTree;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/9/2.
 */
public interface DepartMapper {
    List<Map<String,String>> getNodes(@Param("level")String level,@Param("parentNodeId")String parentNodeId);
    List<DepartTree> getNodesInfo(@Param("level")String level,@Param("parentNodeId")String parentNodeId);
    String getMaxLevel();
    List<DepartTree>getDepart(@Param("depart")String depart,@Param("pnodeId")String pnodeId);
    void insertNode(@Param("id")String id,@Param("nodeName")String nodeName,@Param("nodeId")String nodeId,@Param("pnodeId")String pnodeId,@Param("level")String level,@Param("depart")String depart);
}
