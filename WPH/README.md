# 唯品会 APP 自动签到脚本

-   QuanX
    -   添加任务仓库[TaskGallery.json](https://raw.githubusercontent.com/panghujiajia/Scripts/master/WPH/TaskGallery.json) 和 重写[Rewrite.conf](https://raw.githubusercontent.com/panghujiajia/Scripts/master/WPH/Rewrite.conf)，重写可以选择在任务仓库里添加附件的方式添加
    -   打开重写和 Mitm，并保持 QuanX VPN 开启
    -   打开唯品会 APP，进入“个人中心”里面，点击“签到有礼”，手工签到一次，提示 Cookie 写入成功
    -   配置完成，关闭重写和 Mitm
-   Surge
    -   添加模块[Surge.sgmodule](https://raw.githubusercontent.com/panghujiajia/Scripts/master/WPH/Surge.sgmodule)
    -   打开脚本和 Mitm，并保持 Surge VPN 开启
    -   打开唯品会 APP，进入“个人中心”里面，点击“签到有礼”，手工签到一次，提示 Cookie 写入成功
    -   配置完成，关闭 Mitm
