package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.DepartTree;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/9/2.
 */
public interface DepartMapper {
    int delNode(@Param("nodeId")String nodeId);
    List<Map<String,String>> getNodes(@Param("level")String level,@Param("parentNodeId")String parentNodeId);
    List<DepartTree> getNodesInfo(@Param("level")String level,@Param("parentNodeId")String parentNodeId);
    String getMaxLevel();
    List<DepartTree>getDepart(@Param("depart")String depart,@Param("pnodeId")String pnodeId,@Param("px")Integer px,@Param("id")String id);
    DepartTree getCom(@Param("id")String id,@Param("depart")String depart);
    DepartTree getComByNodename(@Param("name")String name,@Param("depart")String depart);
    int updateNode(@Param("name")String name,@Param("id")String id,@Param("px")Integer px,@Param("depart")String depart);
    void insertNode(@Param("id")String id,@Param("nodeName")String nodeName,@Param("nodeId")String nodeId,@Param("pnodeId")String pnodeId,@Param("level")String level,@Param("depart")String depart,@Param("px")Integer px);
}
