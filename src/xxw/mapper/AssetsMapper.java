package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.AssetsConfig;
import xxw.po.AssetsInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by lp on 2020/8/7.
 */
public interface AssetsMapper {
    List<AssetsConfig> getAssetsConfigInfo(@Param("zctype")String zctype);
    List<AssetsInfo> getAssetsInfo(@Param("zctype")String zctype);
    List<Map<String,String>> getAssetsInfoByMap(@Param("zctype")String zctype);
    int insertConfig(AssetsConfig assetsConfig);
    int insertAssetsInfo(@Param("assetsMap")Map<String,String> assetsMap);

}
