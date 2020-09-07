package xxw.mapper;


import org.apache.ibatis.annotations.Param;
import xxw.po.Latrine;
import xxw.po.UploadFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface LatrineMapper {
    int deleteByPrimaryKey(BigDecimal id);
    int deleteByUid(@Param("uniqueId") String uniqueId);
    int insert(Latrine record);

    int insertSelective(Latrine record);

    Latrine selectByPrimaryKey(BigDecimal id);

    int updateByPrimaryKeySelective(Latrine record);

    int updateLatrineInfo(Latrine record);

    int updateByPrimaryKey(Latrine record);

    int deleteAll();

    String queryCounty(@Param("town") String town);
    String queryCountyX(@Param("town") String town);

    List<String> queryCounties(@Param("renovateDate") String renovateDate, @Param("check") Integer check);

    List<String> queryTowns(@Param("county") String county, @Param("renovateDate") String renovateDate, @Param("check") Integer check);
    List<String> queryTownsX(@Param("county") String county, @Param("renovateDate") String renovateDate, @Param("check") Integer check);

    List<String> queryVillages(@Param("county") String county, @Param("town") String town, @Param("renovateDate") String renovateDate, @Param("check") Integer check);
    List<String> queryVillagesX(@Param("county") String county, @Param("town") String town, @Param("renovateDate") String renovateDate, @Param("check") Integer check);

    List<Latrine> queryLatrineByPaging(@Param("county") String county, @Param("town") String town,
                                       @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("checkDate") String checkDate, @Param("name") String name,
                                       @Param("ischeck") Integer ischeck, @Param("states") Integer[] states, @Param("vilstate") String vilstate, @Param("cardcf") String cardcf, @Param("currentXz") String currentXz, @Param("renovateModeFs") String renovateModeFs, @Param("flushModeCs") String flushModeCs, @Param("toiletLocationWz") String toiletLocationWz, @Param("page") Integer page, @Param("limit") Integer limit);
    List<Latrine> queryLatrineCountByPage(@Param("county") String county, @Param("town") String town,
                                          @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("checkDate") String checkDate, @Param("name") String name,
                                          @Param("ischeck") Integer ischeck, @Param("states") Integer[] states, @Param("vilstate") String vilstate, @Param("cardcf") String cardcf, @Param("currentXz") String currentXz, @Param("renovateModeFs") String renovateModeFs, @Param("flushModeCs") String flushModeCs, @Param("toiletLocationWz") String toiletLocationWz);
    List<Latrine> queryLatrineByPagingX(@Param("county") String county, @Param("town") String town,
                                        @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("name") String name,
                                        @Param("check") Integer check, @Param("states") String[] states, @Param("page") Integer page, @Param("limit") Integer limit);

    List<Map<String, Integer>> queryRenovateModeCount(@Param("county") String county, @Param("town") String town, @Param("village") String village,
                                                      @Param("renovateDate") String renovateDate, @Param("check") Integer check);
    List<Map<String, Integer>> queryRenovateModeCountX(@Param("county") String county, @Param("town") String town, @Param("village") String village,
                                                       @Param("renovateDate") String renovateDate, @Param("check") Integer check);

    int queryLatrineCount(@Param("county") String county, @Param("town") String town,
                          @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("name") String name,
                          @Param("check") Integer check);
    int queryCountyAcrossLatrineCount(@Param("county") String county, @Param("town") String town, @Param("states") String[] states,
                                      @Param("renovateDate") String renovateDate, @Param("check") Integer check);
    int queryLatrineCountX(@Param("county") String county, @Param("town") String town,
                           @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("name") String name,
                           @Param("check") Integer check, @Param("states") String[] states);
    int queryLatrineCountByStates(@Param("county") String county, @Param("town") String town,
                                  @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("checkDate") String checkDate, @Param("name") String name,
                                  @Param("check") Integer check, @Param("states") Integer[] states, @Param("vilstate") String vilstate, @Param("cardcf") String cardcf, @Param("currentXz") String currentXz, @Param("renovateModeFs") String renovateModeFs, @Param("flushModeCs") String flushModeCs, @Param("toiletLocationWz") String toiletLocationWz);

    int insertFile(UploadFile uploadFile);
    int insertFiles(List<UploadFile> listFiles);

    List<UploadFile> selectPicByUniqueID(String uniqueId);

    int deleteByUniqueIdAndSaveName(String uniqueId, String saveName);

    int judgevilindexrepeat(@Param("county") String county, @Param("town") String town, @Param("village") String village, @Param("vilindex") Integer vilindex);

    List<Map<String,Object>> queryLatrine(@Param("county") String county, @Param("town") String town,
                                          @Param("village") String village, @Param("renovateDate") String renovateDate, @Param("name") String name, @Param("shstates") String[] shstates, @Param("hsstate") String hsstate, @Param("vilstate") String vilstate, @Param("cardcf") String cardcf, @Param("current") String current, @Param("renovatemode") String renovatemode, @Param("flushmode") String flushmode, @Param("toiletlocation") String toiletlocation, @Param("checkDate") String checkDate);
    List<Latrine> queryXyUnqueidInfo(@Param("county") String county, @Param("town") String town, @Param("village") String village);

    Latrine queryByUnqueid(@Param("uniqueId") String uniqueId);

    List<Latrine> selectLatrineCounty(@Param("year") String year);

    List<Latrine> selectLatrineTown(@Param("year") String year, @Param("county") String county);

    List<Latrine> selectLatrineVillage(@Param("year") String year, @Param("town") String town);

    int updateState(@Param("county") String county, @Param("town") String town,
                    @Param("village") String village, @Param("name") String name, @Param("renovateDate") String renovateDate, @Param("vilstate") String vilstate, @Param("cardcf") String cardcf, @Param("oldState") String oldState,
                    @Param("newState") String newState, @Param("uniqueId") String uniqueId, @Param("rejectReason") String rejectReason, @Param("check") String check);

    int selectCountByState(@Param("county") String county, @Param("town") String town,
                           @Param("village") String village, @Param("state") String oldState);

    int selectCountByParam(@Param("county") String county, @Param("town") String town,
                           @Param("village") String village);
    Map<String,String>selectTownXy(@Param("county") String county, @Param("town") String town);

    int selectMaxId();

    Map<String,String> auditProgress(@Param("county") String county, @Param("town") String town, @Param("village") String village);

    String cxtown(@Param("town") String town);

    int setCqVillage(@Param("county") String county, @Param("town") String town, @Param("current") String current,
                     @Param("village") String village, @Param("state") String state, @Param("vilstate") String villagestate);
    int selectVillageCount(@Param("county") String county, @Param("town") String town, @Param("village") String village, @Param("check") Integer check);


}