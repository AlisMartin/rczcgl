package xxw.po;

import java.math.BigDecimal;

public class UploadFile {
    private BigDecimal id;

    private String recordID;

    private String type;

    private String srcName;

    private String saveName;

    private int uploadYear;

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getRecordID() {
        return recordID;
    }

    public void setRecordID(String recordID) {
        this.recordID = recordID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSrcName() {
        return srcName;
    }

    public void setSrcName(String srcName) {
        this.srcName = srcName;
    }

    public String getSaveName() {
        return saveName;
    }

    public void setSaveName(String saveName) {
        this.saveName = saveName;
    }

    public int getUploadYear() {
        return uploadYear;
    }

    public void setUploadYear(int uploadYear) {
        this.uploadYear = uploadYear;
    }
}