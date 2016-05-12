angular.module("Sobot4.P")
.provider("zcScrollBar", [function() {
	this.defaults = {
		scrollButtons: {
			scrollAmount: "auto",
			enable: !0
		},
		setWidth: 300,
		scrollInertia: 400,
		axis: "yx"
	};
	this.$get = function() {
		return {
			defaults: this.defaults
		}
	}
}]).service("aaaaaa", [function() {
	this.aaa = "aaaa"
}]), 