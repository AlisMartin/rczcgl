package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.Role;

import java.util.List;

/**
 * Created by lp on 2020/6/1.
 */
public interface RoleMapper {

    int addRole(Role role);

    int updateRole(@Param("roleId")String roleId,@Param("role")String role);

    int deleteRole(@Param("roleId")String roleId);

    List<Role> getAllRoles();

    int roleAddAuth(@Param("roleId")String roleId,@Param("authId")String authId);

    String selectAuthByRoleId(@Param("roleId")String roleId);

    int roleUpdateAuth(@Param("roleId")String roleId,@Param("authId")String authId);

    int roleClearAuth(@Param("roleId")String roleId);

    Role selectRoleByUserId(@Param("userId")String userId);
}
