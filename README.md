## Get Favicon
由于我自己在我的[书签系统](http://mybookmark.cn)需要用到网站的favicon，但是国内我也没找到好的获取favicon接口，由于GFW的原因，使用Google提供的接口`http://www.google.com/s2/favicons?domain=`无法访问，所以，我自己写了一个简单的通过Google的API获取favicon。使用接口很简单：   
* `http://favicon.luchenqun.com/?url=你要获取的url地址`   
比如`http://favicon.luchenqun.com/?url=http://mybookmark.cn`


每个网站都应该有一个favicon图片，就是显示在浏览器标题栏上面的小图标，当打开网页或将网页加入收藏时都会显示这个图标。   
而对于WEB设计或站长来说，可能会希望把某个网站的图标加入到站点名字或链接的前面以为页面增添色彩，同时增加链接的可读性和易用性。   
这个接口便是为此功能而生的。通过一种简单、稳定的方式获取网站的Favicon图标。   

