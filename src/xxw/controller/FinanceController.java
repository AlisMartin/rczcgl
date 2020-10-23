package xxw.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xxw.mapper.FinanceMapper;
import xxw.po.AssetVO;
import xxw.po.Finance;
import xxw.po.User;
import xxw.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created by wrh on 2020/9/27.
 */
@Controller
@RequestMapping("/finance")
public class FinanceController {
    @Autowired
    FinanceMapper financeMapper;

    @RequestMapping("/getFinanceList")
    @ResponseBody
    public Map<String,Object> getFinanceList(@RequestBody JSONObject json){
        Map<String,Object> res = new HashMap<>();
        int offset = Integer.parseInt(json.getString("offset"));
        int limit = Integer.parseInt(json.getString("limit"));
        int pageNumber = offset==0?1:offset/limit + 1;
        Page page = PageHelper.startPage(pageNumber, limit);
        List<Finance> info=financeMapper.getFinance();
        PageInfo pageInfo = new PageInfo<>(info);
        if(pageInfo.getList().size()>0){
            res.put("total",pageInfo.getTotal());
            res.put("rows",pageInfo.getList());
            return  res;
        }else{
            return null;
        }
    }
    @RequestMapping("/addOrUpdateFinance")
    @ResponseBody
    public ResponseObject addOrUpdateFinance(@RequestBody List<AssetVO> dto){
        Map<String, String> insertInfo = new HashMap<>();
        for (AssetVO assetVO : dto) {
            if (StringUtil.isNotEmpty(assetVO.getValue())) {
                insertInfo.put(assetVO.getName(), assetVO.getValue());
            }
        }
        int i;
        if (StringUtil.isEmpty(insertInfo.get("zcid"))){
            //获取session
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpSession session =   request.getSession();
            User user = (User)session.getAttribute("user");
            insertInfo.put("companyid", user.getComId());

//            UUID uuid = UUID.randomUUID();
            insertInfo.put("zcid",insertInfo.get("id"));
            i = financeMapper.insertFinance(insertInfo);
        }else {
            i = financeMapper.updateFinance(insertInfo);
        }
        if (i == 1) {
            return new ResponseObject(1, "成功", "");
        } else {
            return new ResponseObject(0, "失败", "");
        }
    }
}
