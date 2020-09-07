package xxw.po;

public class Region {
    private Integer id;

    private String code;

    private String name;

    private String parentCode;

    private String pName;

    private Integer level;

    private Integer control;

    private Integer year;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getControl() {
        return control;
    }

    public void setControl(Integer control) {
        this.control = control;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Region clone(){
        Region region = new Region();
        region.setId(this.getId());
        region.setCode(this.getCode());
        region.setName(this.getName());
        region.setYear(this.getYear());
        region.setLevel(this.getLevel());
        region.setParentCode(this.getParentCode());
        region.setpName(this.getpName());
        region.setControl(this.getControl());

        return region;
    }
}