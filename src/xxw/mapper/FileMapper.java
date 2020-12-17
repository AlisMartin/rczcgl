package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.FileInfo;

import java.util.List;

/**
 * Created by lp on 2020/9/17.
 */
public interface FileMapper {
    FileInfo queryFileByParam(@Param("fileName")String fileName,@Param("fileId")String fileId,@Param("pathId")String pathId);
    List<FileInfo> queryQmPicByParam(@Param("filePath")String filePath);
    int delById(@Param("fileId")String fileId);
}
