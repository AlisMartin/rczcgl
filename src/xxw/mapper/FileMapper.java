package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.FileInfo;

/**
 * Created by lp on 2020/9/17.
 */
public interface FileMapper {
    FileInfo queryFileByParam(@Param("fileName")String fileName,@Param("fileId")String fileId,@Param("pathId")String pathId);
}
