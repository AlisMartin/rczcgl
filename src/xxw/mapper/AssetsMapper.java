package xxw.mapper;

import com.alibaba.fastjson.JSONArray;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import xxw.po.AssetsConfig;
import xxw.po.AssetsFile;
import xxw.po.AssetsInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/8/7.
 */
public interface AssetsMapper {
    List<AssetsConfig> getAssetsConfigInfo(@Param("zctype")String zctype,@Param("order")String order);
    List<AssetsConfig> getAllAssetsConfigInfo(@Param("zctype")String zctype,@Param("order")String order);
    List<AssetsInfo> getAssetsInfo(@Param("zctype")String zctype);//,@Param("page")String page,@Param("limit")String limit
    List<String> getFieldByTypeAndName(@Param("zctypes")JSONArray zctypes);
    List<AssetsInfo> getAssetsInfoByName(@Param("name")String name,@Param("field1")String field1,@Param("field2")String field2,@Param("field3")String field3,@Param("field4")String field4);
    List<Map<String,String>> getAssetsInfoByMap(@Param("zctype")String zctype);
    int insertConfig(AssetsConfig assetsConfig);
    int insertAssetsInfo(@Param("assetsMap")Map<String,String> assetsMap);
    int updateAssetsInfo(@Param("assetsMap")Map<String,String> assetsMap);
    int updateConfig(AssetsConfig assetsConfig);
    List<AssetsFile> getAssetFileListByZcid(@Param("zcid")String zcid);

}
