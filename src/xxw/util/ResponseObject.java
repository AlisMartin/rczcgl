package xxw.util;

/**
 * <p>Description:</p>
 *
 * @version 1.0
 * @author zzm
 * @date 2016/1/6
 */
public class ResponseObject {
    //返回的代码，默认为1
    private int code = VariableUtils.SUCCESS;

    //返回的消息，默认为空字符串
    private Object message = "";

    //返回的数据，默认为空
    private Object data = null;

    public ResponseObject(){}

    public ResponseObject(int code, Object message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
