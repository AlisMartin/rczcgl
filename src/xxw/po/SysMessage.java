package xxw.po;

/**
 * Created by lp on 2020/9/19.
 */
public class SysMessage {

    private String flowId;
    private String tsUser;
    private String jsUser;
    private String fileName;

    private String tsId;
    private String jsId;
    private String dId;


    private String fileId;
    private String tsDate;
    private String desc;
    private String type;
    private String duser;


    public String getTsId() {
        return tsId;
    }

    public void setTsId(String tsId) {
        this.tsId = tsId;
    }

    public String getJsId() {
        return jsId;
    }

    public void setJsId(String jsId) {
        this.jsId = jsId;
    }

    public String getdId() {
        return dId;
    }

    public void setdId(String dId) {
        this.dId = dId;
    }

    public String getShow() {
        return show;
    }

    public void setShow(String show) {
        this.show = show;
    }

    private String show;

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    private String node;

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }
    public String getFlowId() {
        return flowId;
    }

    public void setFlowId(String flowId) {
        this.flowId = flowId;
    }

    public String getTsUser() {
        return tsUser;
    }

    public void setTsUser(String tsUser) {
        this.tsUser = tsUser;
    }

    public String getJsUser() {
        return jsUser;
    }

    public void setJsUser(String jsUser) {
        this.jsUser = jsUser;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }



    public String getTsDate() {
        return tsDate;
    }

    public void setTsDate(String tsDate) {
        this.tsDate = tsDate;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDuser() {
        return duser;
    }

    public void setDuser(String duser) {
        this.duser = duser;
    }

}
