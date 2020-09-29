package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.FileInfo;
import xxw.po.Finance;

import java.util.List;
import java.util.Map;

/**
 * Created by wrh on 2020/9/27.
 */
public interface FinanceMapper {
    List<Finance> getFinance ();

    int insertFinance(@Param("assetsMap")Map<String,String> assetsMap);

    int updateFinance(@Param("assetsMap")Map<String,String> assetsMap);
}
