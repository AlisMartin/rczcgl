package xxw.po;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true) //added by lipeng 2019.9.22
public class Latrine {
    private BigDecimal id;

    private String county;

    private String town;

    private String village;

    private String name;

    private String idCard;

    private String houseNum;

    private String renovateModeId;

    private String renovateMode;

    private String renovateDate;

    private String checkDate;

    private String tel;

    private String respUnit;

    private String x;

    private String y;

    private String current;

    private Integer isCheck;

    private String remarks;

    private String uniqueId;

    private String renovateCode;

    private BigDecimal vilIndex;

    private BigDecimal currentId;

    private String builder;

    private String supervisor;

    private String inspector;

    private String state;

    private String rejectReason;

    private String villageState;

    private String toiletLocation;

    private String flushMode;

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
        this.id = id;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county == null ? null : county.trim();
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town == null ? null : town.trim();
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village == null ? null : village.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard == null ? null : idCard.trim();
    }

    public String getHouseNum() {
        return houseNum;
    }

    public void setHouseNum(String houseNum) {
        this.houseNum = houseNum == null ? null : houseNum.trim();
    }

    public String getRenovateModeId() {
        return renovateModeId;
    }

    public void setRenovateModeId(String renovateModeId) {
        this.renovateModeId = renovateModeId == null ? null : renovateModeId.trim();
    }

    public String getRenovateMode() {
        return renovateMode;
    }

    public void setRenovateMode(String renovateMode) {
        this.renovateMode = renovateMode == null ? null : renovateMode.trim();
    }

    public String getRenovateDate() {
        return renovateDate;
    }

    public void setRenovateDate(String renovateDate) {
        this.renovateDate = renovateDate == null ? null : renovateDate.trim();
    }

    public String getCheckDate() {
        return checkDate;
    }

    public void setCheckDate(String checkDate) {
        this.checkDate = checkDate == null ? null : checkDate.trim();
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel == null ? null : tel.trim();
    }

    public String getRespUnit() {
        return respUnit;
    }

    public void setRespUnit(String respUnit) {
        this.respUnit = respUnit == null ? null : respUnit.trim();
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x == null ? null : x.trim();
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y == null ? null : y.trim();
    }

    public String getCurrent() {
        return current;
    }

    public void setCurrent(String current) {
        this.current = current == null ? null : current.trim();
    }

    public int getIsCheck() {
        return isCheck;
    }

    public void setIsCheck(int isCheck) {
        this.isCheck = isCheck;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks == null ? null : remarks.trim();
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId == null ? null : uniqueId.trim();
    }

    public String getRenovateCode() {
        return renovateCode;
    }

    public void setRenovateCode(String renovateCode) {
        this.renovateCode = renovateCode == null ? null : renovateCode.trim();
    }

    public BigDecimal getVilIndex() {
        return vilIndex;
    }

    public void setVilIndex(BigDecimal vilIndex) {
        this.vilIndex = vilIndex;
    }

    public BigDecimal getCurrentId() {
        return currentId;
    }

    public void setCurrentId(BigDecimal currentId) {
        this.currentId = currentId;
    }

    public String getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(String supervisor) {
        this.supervisor = supervisor;
    }

    public String getBuilder() {
        return builder;
    }

    public void setBuilder(String builder) {
        this.builder = builder;
    }

    public String getInspector() {
        return inspector;
    }

    public void setInspector(String inspector) {
        this.inspector = inspector;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getrejectReason() {
        return rejectReason;
    }

    public void setrejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }

    public String getVillageState() {
        return villageState;
    }

    public void setVillageState(String villageState) {
        this.villageState = villageState;
    }


    public String getFlushMode() {
        return flushMode;
    }

    public void setFlushMode(String flushMode) {
        this.flushMode = flushMode;
    }

    public String getToiletLocation() {
        return toiletLocation;
    }

    public void setToiletLocation(String toiletLocation) {
        this.toiletLocation = toiletLocation;
    }

}