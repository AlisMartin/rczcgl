package xxw.po;

import java.util.List;

/**
 * Created by lp on 2020/9/2.
 */
public class DepartTree {
    private String id;

    private String nodeName;

    private String nodeId;

    private String parentNodeId;

    private String level;

    private List<DepartTree> nodes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getParentNodeId() {
        return parentNodeId;
    }

    public void setParentNodeId(String parentNodeId) {
        this.parentNodeId = parentNodeId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public List<DepartTree> getNodes() {
        return nodes;
    }

    public void setNodes(List<DepartTree> nodes) {
        this.nodes = nodes;
    }


}
