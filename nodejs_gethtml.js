/*
node JS 抓取网页

第一步 创建工作目录 & 安装 nodejs 组件：

>mkdir tst
>cd tst
>npm install request cheerio

第二步 测试 创建 example.js 内容如下：

var cheerio = require('cheerio');
$ = cheerio.load('<html><head></head><body><div id="content"><div id="sidebar"></div><div id="main"><div id="breadcrumbs"></div><table id="data"><tr><th>Name</th><th>Address</th></tr><tr><td class="name">John</td><td class="address">Address of John</td></tr><tr><td class="name">Susan</td><td class="address">Address of Susan</td></tr></table></div></div></body></html>');

$('#data .name').each(function() {
    console.log($(this).text());
});

终端测试

>node ecample.js

完成！（完整示例代码如下）
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
var request = require('request');
var cheerio = require('cheerio');
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
pools = {
    'Aloha': 3,
    'Beaverton': 15,
    'Conestoga': 12,
    'Harman': 11,
    'Raleigh': 6,
    'Somerset': 22,
    'Sunset': 5,
    'Tualatin Hills': 2
};
for (pool in pools) {
    var url = 'http://www.thprd.org/schedules/schedule.cfm?cs_id=' + pools[pool];
    request(url, (function(pool) { return function(err, resp, body) {
        $ = cheerio.load(body);
        $('#calendar .days td').each(function(day) {
            $(this).find('div').each(function() {
                event = $(this).text().trim().replace(/\s\s+/g, ',').split(',');
                if (event.length >= 2 && (event[1].match(/open swim/i) || event[1].match(/family swim/i)))
                    console.log(pool + ',' + days[day] + ',' + event[0] + ',' + event[1]);
            });
        });
    }})(pool));
}
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
原文网址：http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
*/
var movie = {
	url: 'http://www.soundtrack.net/movie/selfless-2014/',
	hdKeyword: '无我 / Selfless'
};




var request = require('request');
var cheerio = require('cheerio');

//var movie = {};
//三列代表网址
// movie = {
// 	url: 'http://www.soundtrack.net/movie/step-up-3d/',
// 	hdKeyword: '这是我的测试版 / 怎么样 / 还可以吧'
// };
//两列有分割标志代表网址
// movie = {
// 	url:'http://www.soundtrack.net/movie/southpaw/',
// 	hdKeyword:'这是我的测试版 / 怎么样 / 还可以吧'
// };
//两列无分割标志代表网址
// movie = {
// 	url:'http://www.soundtrack.net/movie/paper-towns/',
// 	hdKeyword:'这是我的测试版 / 怎么样 / 还可以吧'
// };
//只有一首歌曲代表网址
// movie = {
// 	url:'http://www.soundtrack.net/movie/jupiter-ascending/',
// 	hdKeyword:'这是我的测试版 / 怎么样 / 还可以吧'
// };


//分割标示符 左右结构
var column_2 = '<p align="center"><font style="font-size: 12px;"><b>--end left column 1, start right column 2--</b></font></p>';
//分割标示符 左中右结构
var column_3 = {
	hr1: '<p align="center"><font style="font-size: 12px;"><b>--end left column 1, start center column 2--</b></font></p>',
	hr2: '<p align="center"><font style="font-size: 12px;"><b>--end centered column 2, start right column 3--</b></font></p>'
}

//中文关键字
var HTML_H2 = '<h2 class="c_names" title="' + movie.hdKeyword + '"></h2>';

//图片标签
var HTML_IMG = '<div class="fixImg"></div>';

//去掉不用的HTML标签
function FUNC_delTag(code) {
	return (code.replace(/( align="center")/g, '').replace(/(<font style="font-size: 12px;">)/g, '').replace(/(<\/font>)/g, '').replace(/(<hr>)/g, '').replace(/(&quot;)/g, '').replace(/<b id=/g, '<strong id=').replace(/(<\/b>)/g, '</strong>'));
}

//按照自己的输出标准，输出html
function FUNC_format_html(inParm) {

	var html = '',
		code = inParm.html();
	//一个分割标示符 左右机构
	if (code.indexOf(column_2) > 0) {
		var arry_splitHtml = code.split(column_2);
		html = '<div class="column_l">' + arry_splitHtml[0] + '</div><div class="column_r">' + arry_splitHtml[1] + '</div>';
	}
	//两个分割标示符 左中右 结构
	if (code.indexOf(column_3.hr1) > 0) {
		var arry_splitHtml = code.split(column_3.hr1),
			arry_splitHtml_split = arry_splitHtml[1].split(column_3.hr2);
		html = '<div class="column_l">' + arry_splitHtml[0] + '</div><div class="column_m">' + arry_splitHtml_split[0] + '</div><div class="column_r">' + arry_splitHtml_split[1] + '</div>';
	}

	//没有分割标示符 获取奇偶数 分在左右结构
	if (code.indexOf(column_2) < 0 && code.indexOf(column_3.hr1) < 0) {
		var tagP = inParm.find('p');
		//歌曲数目大于1
		if (tagP.length > 1) {
			var _html_l, _html_r, arry_l = [],
				arry_r = [];
			tagP.each(function(index, el) {
				var _this = $(this);
				//获取奇偶数的单个歌曲<p>，奇数放在column_l，偶数放到column_r
				if (index % 2 == 0) {
					arry_l.push('<p>' + _this.html() + '</p>');
					_html_l = '<div class="column_left">' + arry_l.join('') + '</div>';
				} else {
					arry_r.push('<p>' + _this.html() + '</p>');
					_html_r = '<div class="column_right">' + arry_r.join('') + '</div>';
				}
				html = _html_l + _html_r;
			});
		} else { //只有一首歌曲
			html = '<div class="column_1">' + code + '</div>';
		}

	};

	return (HTML_H2 + FUNC_delTag(html) + HTML_IMG);

}

//抓取网页核心代码
request(movie.url, (function() {
	return function(err, resp, body) {
		$ = cheerio.load(body);
		//给原始代码中的 b 标签添加 id
		$('.description').eq(2).find('b').each(function(index, el) {
			var _this = $(this),
				_text = _this.text();
			//跳过分割标示 b 标签
			if (_text.indexOf('--end') < 0) {
				_this.attr({
					id: _this.text()
				});
			}
		});

		var _targetCnt = $('.description').eq(2);
		var HTML_content = FUNC_format_html(_targetCnt);
		console.log(HTML_content);
	}
})());