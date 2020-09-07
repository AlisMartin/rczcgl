package xxw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xxw.mapper.FlowMapper;
import xxw.po.NodeInfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by lp on 2020/9/4.
 */
@Controller
@RequestMapping("/flow")
public class FlowController {
    @Autowired
    FlowMapper flowMapper;
    @RequestMapping("/getNodeInfo")
    @ResponseBody
    public List<NodeInfo> getNodeInfo(HttpServletRequest request){
        List<NodeInfo> list=flowMapper.getNodes();
        return  list;
    }
}
