package xxw.mapper;

import org.apache.ibatis.annotations.Param;
import xxw.po.User;

import java.util.List;

/**
 * Created by lp on 2020/5/26.
 */
public interface UserMapper {
    int getUserByName(@Param("username")String username);
    User getUser(@Param("username")String username,@Param("password")String password);
    List<User> selectAllUser();
    int addUser(User user);
    int editUser(User user);
    int deleteUser(@Param("id")String id);
    int userAddRole(@Param("userId")String userId,@Param("roleId")String roleId);
    String selectUserRoleIdByUser(@Param("userId")String userId);
    int userUpdateRole(@Param("userId")String userId,@Param("roleId")String roleId);
    int userClearRole(@Param("userId")String userId);
    User queryUser(@Param("username")String username,@Param("password")String password,@Param("id")String id);
}
