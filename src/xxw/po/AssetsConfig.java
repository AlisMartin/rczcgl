package xxw.po;

/**
 * Created by lp on 2020/8/7.
 */
public class AssetsConfig {
    private String id;
    private String zctype;
    private String field;
    private String fieldname;
    private String show;
    private String order;
    private String fieldType;
    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getZctype() {
        return zctype;
    }

    public void setZctype(String zctype) {
        this.zctype = zctype;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getFieldname() {
        return fieldname;
    }

    public void setFieldname(String fieldname) {
        this.fieldname = fieldname;
    }

    public String getShow() {
        return show;
    }

    public void setShow(String show) {
        this.show = show;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }
}
