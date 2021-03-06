package xxw.mapper;

import com.alibaba.fastjson.JSONArray;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import xxw.po.AssetsConfig;
import xxw.po.AssetsFile;
import xxw.po.AssetsInfo;
import xxw.po.AssetsInfoHistory;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/8/7.
 */
public interface AssetsMapper {
    List<AssetsConfig> getAssetsConfigInfo(@Param("zctype")String zctype,@Param("order")String order);
    List<AssetsConfig> getAllAssetsConfigInfo(@Param("zctype")String zctype,@Param("order")String order);
    List<AssetsInfo> getAssetsInfo(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    List<AssetsInfo> getSumAssetsInfo(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    AssetsInfo getAssetByid(@Param("zcid")String zcid);
    List<AssetsInfoHistory> getAssetsHistoryInfo(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    List<AssetsConfig> getFieldByTypeAndName(@Param("zctypes")JSONArray zctypes);
    List<AssetsInfo> getAssetsInfoByName(@Param("name")String name,@Param("field1")String field1,@Param("field2")String field2,@Param("field3")String field3,@Param("field4")String field4);
    List<Map<String,String>> getAssetsInfoByMap(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    List<String> getAssetsCom(@Param("zctype")String zctype);
    List<Map<String,String>> getAllAssetsInfoByMap(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    int insertConfig(AssetsConfig assetsConfig);
    Integer getMaxField();
    int insertAssetsInfo(@Param("assetsMap")Map<String,Object> assetsMap);
    int insertAssetsInfoHistory(@Param("assetsMap")Map<String,String> assetsMap);
    int updateAssetsInfo(@Param("assetsMap")Map<String,Object> assetsMap);
    int updateAssetsInfoDays(@Param("list")List<AssetsInfo> assetsList);
    int updateConfig(AssetsConfig assetsConfig);
    List<AssetsFile> getAssetFileListByZcid(@Param("zcid")String zcid);
    List<Map<String,String>> getSumAssetsInfoByMap(@Param("zctype")String zctype,@Param("gsmc")String gsmc);
    int delAssets(@Param("zcid")String zcid);
    int delAssetsFile(@Param("fileId")String fileId);
    List<String> getComIds(@Param("zctype")String zctype);
    Map<String,String> selectAssetsInfo(@Param("zcid")String zcid);
}
