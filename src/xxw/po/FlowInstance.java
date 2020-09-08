package xxw.po;

import java.util.Date;

/**
 * Created by lp on 2020/9/8.
 */
public class FlowInstance {
    private String id;
    private String flowId;
    private String nowNode;
    private Date startDate;
    private Date endDate;
    private String flowType;
    private String status;

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

    public String getNowNode() {
        return nowNode;
    }

    public void setNowNode(String nowNode) {
        this.nowNode = nowNode;
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

    public String getFlowType() {
        return flowType;
    }

    public void setFlowType(String flowType) {
        this.flowType = flowType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
