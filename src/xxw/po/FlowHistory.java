package xxw.po;

import java.util.Date;

/**
 * Created by lp on 2020/9/8.
 */
public class FlowHistory {
    private String id;
    private String flowId;
    private String flowType;
    private String node;
    private String nodeOrder;
    private Date startDate;
    private Date endDate;
    private String status;
    private String file;
    private String rejectReason;
    private String sqInfo;
    private String sqReason;
    private String user;
    private String dusers;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFlowId() {
        return flowId;
    }

    public void setFlowId(String flowId) {
        this.flowId = flowId;
    }

    public String getFlowType() {
        return flowType;
    }

    public void setFlowType(String flowType) {
        this.flowType = flowType;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getNodeOrder() {
        return nodeOrder;
    }

    public void setNodeOrder(String nodeOrder) {
        this.nodeOrder = nodeOrder;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getRejectReason() {
        return rejectReason;
    }

    public void setRejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }

    public String getSqInfo() {
        return sqInfo;
    }

    public void setSqInfo(String sqInfo) {
        this.sqInfo = sqInfo;
    }

    public String getSqReason() {
        return sqReason;
    }

    public void setSqReason(String sqReason) {
        this.sqReason = sqReason;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getDusers() {
        return dusers;
    }

    public void setDusers(String dusers) {
        this.dusers = dusers;
    }


}
