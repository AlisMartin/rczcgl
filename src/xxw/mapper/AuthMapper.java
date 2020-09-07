package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.Auth;

import java.util.List;

/**
 * Created by lp on 2020/6/1.
 */
public interface AuthMapper {
    List<Auth>getAllAuth();
    String getAuthByRoleId(@Param("roleId")String roleId);
    String getAuthByAuthId(@Param("authId")String authId);
}
