package xxw.po;

import org.springframework.web.multipart.MultipartFile;

/**
 * Created by lp on 2020/6/2.
 */
public class Webuploader {
    private MultipartFile file;
    private String chunks;
    private String chunk;
    private String name;
    private String size;
    private String lastModifiedDate;
    private String type;
    private String id;
    String fileMd5;
    String rate;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public String getChunks() {
        return chunks;
    }

    public void setChunks(String chunks) {
        this.chunks = chunks;
    }

    public String getChunk() {
        return chunk;
    }

    public void setChunk(String chunk) {
        this.chunk = chunk;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(String lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileMd5() {
        return fileMd5;
    }

    public void setFileMd5(String fileMd5) {
        this.fileMd5 = fileMd5;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

  /*  @Override
    public String toString() {
        return "Uploader[" +
                "file=" + file +
                ", chunks='" + chunks + '\'' +
                ", chunk='" + chunk + '\'' +
                ", name='" + name + '\'' +
                ", size='" + size + '\'' +
                ", lastModifiedDate='" + lastModifiedDate + '\'' +
                ", type='" + type + '\'' +
                ", id='" + id + '\'' +
                ", fileMd5='" + fileMd5 + '\'' +
                ", rate='" + rate + '\'' +
                ']';
    }*/
}
