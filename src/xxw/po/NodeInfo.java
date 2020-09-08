package xxw.po;

/**
 * Created by lp on 2020/9/4.
 */
public class NodeInfo {
    private String id;
    private String nodeId;
    private String nodeName;
    private String nodeOrder;
    private String userId;
    private String flowName;
    private String flowtype;

    public String getTreeid() {
        return treeid;
    }

    public void setTreeid(String treeid) {
        this.treeid = treeid;
    }

    private String treeid;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeOrder() {
        return nodeOrder;
    }

    public void setNodeOrder(String nodeOrder) {
        this.nodeOrder = nodeOrder;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFlowName() {
        return flowName;
    }

    public void setFlowName(String flowName) {
        this.flowName = flowName;
    }

    public String getFlowtype() {
        return flowtype;
    }

    public void setFlowtype(String flowtype) {
        this.flowtype = flowtype;
    }

}
