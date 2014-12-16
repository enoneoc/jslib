//扩展jQuery类 e.g $.urlParm('id');
jQuery.extend({
	
	//获取URL参数
	urlParm:function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
		  r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	
});

//jQuery对象添加方法 e.g $(target).inputChange(function(){...})
jQuery.fn.extend({
	
	//input实时监控
	inputChange: function(callback){
		if($.support.leadingWhitespace){
			this.bind('propertychange', function(e){
				if(e.originalEvent.propertyName == 'value'){
					$(this).keyup();
				}
			});
			this.bind('keyup', callback);
		}else{
			this.bind('input', callback);
		}
		return( this );
	},
	
	//全选
	checkeAll:function(){
		var _this = $(this);
		_this.click(function(){
			$('input[type=checkbox]').prop('checked', _this.prop('checked'));
		})
	},
	
	//获取checkbox的所有选中项 (_this.val() 相当于 <input type="checkbox" value="12" />)
	getCheckeds:function(){
		var _checkedArr = [];
		this.each(function(index, element) {
			var _this = $(this);
			_this.prop('checked')&&_checkedArr.push(_this.val());
		});
		return _checkedArr;
	}
	
});