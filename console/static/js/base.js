Maangular.module("Sobot4", ["ngAnimate", "ngCookies", "ngMessages", "ngResource", "ngSanitize", "ui.router", "pascalprecht.translate ",
	"mgcrea.ngStrap ","ngFileUpload ","ui.sortable ","oc.lazyLoad ","Sobot4.C ","Sobot4.D ","Sobot4.F ","Sobot4.S ","Sobot4.P "])
.constant("zcGlobal ",{
	BaseUrl:"/",BaseRouterUrl:"",
	TempID:"temp-id ",
	ServVersion: 4, 
	retCodeList: {
			success: "000000"
		}
	}
), 
angular.module("Sobot4.C", []), 
angular.module("Sobot4.D", []), 
angular.module("Sobot4.F", []), 
angular.module("Sobot4.S", []), 
angular.module("Sobot4.P", []), 
angular.module("Sobot4")
.config(["$httpProvider", function(e) {
	e.interceptors.push("HttpInter")
}])
.config(["$translateProvider", function(e) {
	var t = {
			L10001: "登录",
			L10002: "请输入邮箱地址",
			L10003: "请输入密码",
			L10004: "提交"
		},
		r = {
			L10001: "登录",
			L10002: "请输入邮箱地址 "
		};
	e.translations("zh-cn ",t).translations("en ",r),
	e.preferredLanguage("zh-cn")
}])
.config(["$modalProvider ",function(e) {
	angular.extend(e.defaults, {
		animation: "am-fade-and-slide-top",
		placement: "center",
		backdrop: !0,
		keyboard: !0,
		show: !1,
		title: "&nbsp;",
		content: "&nbsp;"
	})
}])
.config(["$alertProvider", function(e) {
	angular
		.extend(e.defaults, {
			animation: "am-fade-and-slide-top",
			placement: "top",
			show: !1,
			templateUrl: "views/public / strap - alert.html ",duration:3,title:" &nbsp;",content:" &nbsp;"})
}])
.config(["$popoverProvider ",function(e) {
	angular.extend(e.defaults, {
		animation: "am-flip-x",
		placement: "auto",
		trigger: "hover",
		html: !0,
		delay: 500,
		container: "body"
	})
}])
.config(["zcScrollBarProvider", function(e) {
	e.defaults = {
		scrollButtons: {
			scrollAmount: "auto",
			enable: !0
		},
		axis: "y",
		mouseWheel: {
			enable: !0,
			preventDefault: !0,
			normalizeDelta: !0,
			deltaFactor: 2e3
		},
		alwaysShowScrollbar: 0,
		scrollbarPosition: "inside",
		theme: "minimal-dark",
		autoHideScrollbar: !0,
		advanced: {
			updateOnBrowserResize: !0,
			normalizeMouseWheelDelta: !0,
			updateOnContentResize: !0,
			autoExpandHorizontalScroll: !0,
			autoUpdateTimeout: 200,
			updateOnSelectorChange: !0
		}
	}
}]), 
angular.module("Sobot4")
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", "zcGlobal", function(e, t, r, l) {
	var o = l.BaseRouterUrl || "/";
	e.html5Mode(!0), 
	r.when("/", o + "login")
	.when("/helpCenter", o + "helpCenter/login")
	.when("/helpCenter/", o + "helpCenter / login ")
	.otherwise(o+"login "),
	t
	.state("login ",{
		url:o+"login ",
		views:{
			"zcBox @ ":{
				controller:"LoginCtrl ", 
				templateUrl: "views/public/zc-login.html"
				}
			}
	}).state("register", {
		url: o + "register",
		views: {
			"zcBox@": {
				controller: "RegisterCtrl",
				templateUrl: "views/public/zc-register.html"
			}
		}
	}).state("registerStatus", {
		url: o + "registerStatus",
		views: {
			"zcBox@": {
				controller: "RegisterStatusCtrl",
				templateUrl: "views/public/zc-registerStatus.html"
			}
		}
	}).state("registerStatusFalse", {
		url: o + "registerStatusFalse",
		views: {
			"zcBox@": {
				controller: "RegisterStatusFalseCtrl",
				templateUrl: "views/public/zc-registerStatusFalse.html"
			}
		}
	}).state("findpwd", {
		url: o + "findpwd",
		views: {
			"zcBox@ ":{controller:"FindPwdCtrl ",templateUrl:"views / public / zc - findpwd.html "}
		}
	})
	.state("activate_email ",{
		url: o + "activate_email/:ActId/:ServiceId",
		views: {
			"zcBox@": {
				controller: "ActivateEmailCtrl",
				templateUrl: "views / public / zc - activateEmail.html "}
		}
	})
	.state("contactManager ",{
		url:o+"contactManager ",
		views:{
			"zcBox @ ":{
				controller: "ActivateEmailCtrl",
				templateUrl: "views/public/zc-contactManager.html"
			}
		}
	})
	.state("activateLogin", {
		url: o + "activateLogin",
		views: {
			"zcBox@": {
				controller: "ActivateEmailCtrl",
				templateUrl: "views/public/zc-activateLogin.html "}
			}})
	.state("msg ",{
		url:o+"msg ? activeId ",
		views:{
			"zcBox @ ":{
				controller:"MsgCtrl ",
				templateUrl:"views / public / zc - msg.html "
			}
		}
	})
	.state("helpCenter ",{
		url:o+"helpCenter ",
		views:{
			"zcBox @ ":{
				controller:"HelpCenterCtrl ",
				templateUrl : "views/helpCenter/index.html"
			}
		},
		resolve: {
			deps: ["$ocLazyLoad", function(e) {
				return e.load([
					"scripts/plugs/ueditor/third-party/zeroclipboard/ZeroClipboard.js", 
					"scripts/plugs/ueditor/ueditor.config.js ",
					"scripts / plugs / ueditor / ueditor.all.min.js "
				])
			}]
		}
	})
	.state("helpCenter.login ",{
		url:" / login ",
		views: {
			zcBody: {
				controller: "HelpCenterLoginCtrl",
				templateUrl: "views/helpCenter/login.html"
			}
		}
	})
	.state("helpCenter.forgetPwd ",{
		url:" / forgetPwd ",
		views:{
			zcBody:{
				controller:"HelpCenterForgetPwdCtrl ",
				templateUrl: "views / helpCenter / forgetPwd.html "
			}
		}
	})
	.state("helpCenter.myWorkOrder ",{
		url:" / helpMyWorkOrder ",
		views:{
			zcBody: {
				controller: "HelpCenterOrderCtrl",
				templateUrl: "views/helpCenter/myWorkOrder.html"
			}
		}
	})
	.state("helpCenter.myWorkOrderDetail ",{
		url:" / helpMyWorkOrder / detail / : workOrderID ",
		views:{
			zcBody:{
				controller:"HelpCenterOrderDetailCtrl ", 
				templateUrl: "views/helpCenter/myWorkOrderDetail.html"
			}
		}
	}).state("openAPI", {
		url: o + "openAPI",
		views: {
			"zcBox@ ":{
				controller:"OpenAPICtrl ",
				templateUrl:"views / openAPI / index.html "
			}
		}
	})
	.state("openAPI.login ",{
		url:" / login / : TempID ",
		views:{
			zcBody:{
				controller:"OpenAPILoginCtrl ",templateUrl:"views / openAPI / login.html "
			}
		}
	})
	.state("zc", {
		"abstract": !0,
		url: o,
		views: {
			"zcBox@": {
				templateUrl: "views/public/zc-index.html"
			}
		},
		resolve: {
			deps: ["$ocLazyLoad", function(e) {
				return e.load([
					"scripts/plugs/ueditor/third-party/zeroclipboard/ZeroClipboard.js ",
					"scripts / plugs / ueditor / ueditor.config.js ",
					"scripts / plugs / ueditor / ueditor.all.min.js "
				])
			}]
		}
	}).state("zc.back", {
		views: {
			zcHeader: {
				templateUrl: "views/public/zc-header.html"
			},
			zcBody: {
				templateUrl: "views/public /zc-body.html "
			}
		}	
	}).state("zc.back.home ",{
		url:"home ",
		views:{
			zcMain:{
				controller:"HomeCtrl ",
				templateUrl: "views/home/index.html"
			}
		}
	}).state("zc.back.home.servicesGeneral", {
		url: "/servciesGeneral",
		views: {
			zcContent: {
				controller: "HomeServicesGeneralCtrl",
				templateUrl: "views/home/servicesGeneral.html"
			}
		}
	}).state("zc.back.home.homeWorkOrder ",{
		url:" / homeWorkOrder ",
		views:{
			zcContent:{
				controller:"HomeWorkOrderCtrl ",
				templateUrl: "views/home/workOrder.html"
			}
		}
	}).state("zc.back.home.myReception", {
		url: "/myReception",
		views: {
			zcContent: {
				controller: "myReceptionCtrl",
				templateUrl: "views/home/myReception.html"
			}
		}
	}).state("zc.back.workOrderCenter", {
		url: "workOrderCenter",
		views: {
			zcMain: {
				controller: "WorkOrderCenterCtrl",
				templateUrl: "views/workOrderCenter / index.html "
			}
		}
	}).state("zc.back.workOrderCenter.workOrderClass ",{
		url:" / workOrderClass / : parentID / : typeID ",
		views: {
			zcContent: {
				controller: "WorkOrderClassCtrl",
				templateUrl: "views/workOrderCenter/workOrderClass.html "
			}
		}
	}).state("zc.back.workOrderCenter.searchService ",{
		url:" / searchService / : parentID / : typeID ",
		views: {
			zcContent: {
				controller: "SearchServiceCtrl",
				templateUrl: "views/workOrderCenter/searchService.html"
			}
		}
	}).state("zc.back.createWorkOrder", {
		url: "workOrderCenter/createWorkOrder",
		views: {
			zcMain: {
				controller: "CreateWorkOrderCtrl",
				templateUrl: "views/createWorkOrder/index.html"
			}
		}
	})
	.state("zc.back.myWorkOrder", {
		url: "workOrderCenter / myWorkOrder / : userID ",
		views:{
			zcMain:{
				controller:"MyWorkOrderCtrl ",
				templateUrl:"views / myWorkOrder / index.html "
			}
		}
	}).state("zc.back.userAndGroup ",{
		url:"userAndGroup ",
		views:{
			zcMain:{
				controller:"UserAndGroupCtrl ",
				templateUrl: "views/userAndGroup/index.html"
			}
		}
	}).state("zc.back.userAndGroup.userGroup", {
			url: "/userGroup / : parentID / : typeID ",
			views:{
				zcContent:{
					templateUrl:"views / userAndGroup / userGroup.html "
			}
		}
	}).state("zc.back.userAndGroup.otherCustomerGroup ",{
		url:" / otherCustomerGroup / : parentID / : typeID ",
		views:{
			zcContent:{
				templateUrl: "views/userAndGroup/OtherCustomerGroup.html"
			}
		}
	}).state("zc.back.userAndGroup.workOrderCustomerGroup", {
		url: "/workOrderCustomerGroup/:parentID/:typeID/:groupID",
		views: {
			zcContent: {
				templateUrl: "views/userAndGroup / workOrderCustomerGroup.html "
			}
		}
	}).state("zc.back.userAndGroup.onlineSkillGroup ",{
		url:" / onlineSkillGroup / : parentID / : typeID / : groupID ",
		views:{
			zcContent:{
				templateUrl:"views / userAndGroup / onlineSkillGroup.html "
			}
		}
	}).state("zc.back.userDetail", {
		url: "userAndGroup/userDetail/:userID",
		views: {
			zcMain: {
				controller: "userDetailCtrl",
				templateUrl: "views/userAndGroup/userDetail.html"
			}
		}
	}).state("zc.back.ordinaryUserDetail", {
		url: "userAndGroup / ordinaryUserDetail / : userID ",
		views:{
			zcMain:{
				controller:"ordinaryUserDetailCtrl ",
				templateUrl:"views / userAndGroup / ordinaryUserDetail.html "
			}
		}
	}).state("zc.back.statistics ",{
		url:"statistics ",
		views:{
			zcMain:{
				controller: "StatisticsCtrl",
				templateUrl: "views/statistics/index.html"
			}
		}
	}).state("zc.back.statistics.onlineCustomerService", {
		url: "/onlineCustomerService",
		views: {
			zcContent: {
				controller: "OnlineCustomerServiceCtrl",
				templateUrl: "views / statistics / onlineCustomerService.html "
			}
		}
	}).state("zc.back.statistics.chatRecord ",{
		url:" / chatRecord ",
			views: {
				zcContent: {
					controller: "SessionRecordCtrl",
					templateUrl: "views/statistics/chatRecord.html"
				}
			}
		})
	.state("zc.back.statistics.workload", {
		url: "/workload",
		views: {
			zcContent: {
				controller: "CustomerServiceWorkloadCtrl",
				templateUrl: "views/statistics/workload.html"
			}
		}
	}).state("zc.back.statistics.robotReply", {
		url: "/robotReply",
		views: {
			zcContent: {
				controller: "robotReplyServiceCtrl",
				templateUrl: "views/statistics/robotReply.html"
			}
		}
	}).state("zc.back.statistics.satisfaction", {
		url: "/satisfaction",
		views: {
			zcContent: {
				controller: "SatisfactionCtrl",
				templateUrl: "views/statistics/satisfaction.html"
			}
		}
	}).state("zc.back.repository", {
		url: "repository",
		views: {
			zcMain: {
				controller: "RepositoryCtrl",
				templateUrl: "views/repository/index.html"
			}
		}
	}).state("zc.back.repository.issuesManagement ",{
		url:" / issuesManagement / : parentID / : typeID ",
		views:{
			zcContent:{
				controller:"IssuesManagementCtrl ", templateUrl: "views/repository/issuesManagement.html"
			}
		}
	}).state("zc.back.repository.issuesLearning", {
		url: "/issuesLearning/:parentID/:typeID",
		views: {
			zcContent: {
				controller: "IssuesLearningCtrl",
				templateUrl: "views/repository/issuesLearning.html"
			}
		}
	}).state("zc.back.repository.addIssues", {
		url: "/addIssues/:parentID / : typeID / : tabsActiveIndex ",
		views:{
			zcContent:{
				controller:"AddIssuesCtrl ",
				templateUrl:"views / repository / addIssues.html "
			}
		}
	}).state("zc.back.editIssues ",{
		url:"repository / editIssues / : docID ",
		views:{
			zcMain:{
				controller: "EditIssuesCtrl",
				templateUrl: "views/repository/editIssues.html"
			}
		}
	}).state("zc.back.settings", {
		url: "settings",
		views: {
			zcMain: {
				controller: "SettingsCtrl",
				templateUrl: "views/settings/index.html"
			}
		}
	}).state("zc.back.settings.account ",{
		url:" / account ",
		views:{
			zcContent:{
				controller:"SettingsAccountCtrl ",templateUrl:"views / settings / account.html "
			}
		}
	}).state("zc.back.settings.optionsInfo ",{
			url:" / optionsInfo ",
			views:{
				zcContent: {
					controller: "SettingsInfoCtrl",
					templateUrl: "views/settings/optionsInfo.html"
				}
			}
	}).state("zc.back.settings.autoResponse ",{
		url:" / autoResponse ",
		views:{
			zcContent:{
				controller:"SettingsAutoCtrl ",
				templateUrl:"views / settings / autoResponse.html "
			}
		}
	}).state("zc.back.settings.workOrderResponse ",{
			url:" / workOrderResponse ", 
		views: {
			zcContent: {
				controller: "SettingsMessageCtrl",
				templateUrl: "views/settings/workOrderResponse.html"
			}
		}
	}).state("zc.back.settings.SLASettings", {
		url: "/SLASettings",
		views: {
			zcContent: {
				controller: "SLASettingsCtrl",
				templateUrl: "views/settings/SLASettings.html"
			}
		}
	}).state("zc.back.settings.channelPc", {
		url: "/channelPc",
		views: {
			zcContent: {
				controller: "SettingsChannelPcCtrl",
				templateUrl: "views/settings/channelPc.html"
			}
		}
	}).state("zc.back.settings.channelMobile", {
		url: "/channelMobile",
		views: {
			zcContent: {
				controller: "SettingsChannelMobileCtrl",
				templateUrl: "views/settings/channelMobile.html"
			}
		}
	}).state("zc.back.settings.channelApp", {
		url: "/channelApp",
		views: {
			zcContent: {
				controller: "SettingsChannelAppCtrl",
				templateUrl: "views/settings/channelApp.html"
			}
		}
	}).state("zc.back.settings.channelWeChat", {
		url: "/channelWeChat?auth_code",
		views: {
			zcContent: {
				controller: "SettingsChannelWeCtrl",
				templateUrl: "views/settings/channelWeChat.html"
			}
		}
	}).state("zc.back.settings.channelThird ",{
		url:" / channelThird ? token ",
		views:{
			zcContent:{
				controller:"SettingsChannelThirdCtrl ",
				templateUrl : "views/settings/channelThird.html"
			}
		}
	})
}])
.run(["$rootScope", "$state", "$window", "AuthServ", "zcGlobal", "TabServ", "DialogServ", function(e, t, r, l, o, s, n) {
	e.defaultPage = "zc.back.home.homeWorkOrder", 
	e.$on("$stateChangeStart", function(a, i, c, p, u) {
		n.destroy(), 
		$(".modal-backdrop").length && $(".modal-backdrop").remove();
		var d = ["login", "register", "registerStatus", "registerStatusFalse", "findpwd", 
		"activate_email", "contactManager", "activateLogin", "helpCenter.login", 
		"helpCenter.forgetPwd", "helpCenter.resetPwd", "helpCenter.myWorkOrder", 
		"helpCenter.myWorkOrderDetail ","openAPI ","openAPI.login ","msg "],
		m=!0;for(var v in d)if(i.name===d[v]){
			m=!1;break
		}
		var w = ["home", "workOrderCenter", "userAndGroup", "statistics", "repository", "settings"],
			h = i.name.split(".");
		if (h.length > 2 && "zc" === h[0] && "back" === h[1]) {
			for (var v in w)
				if (h[2] === w[v]) {
					e.sidebarActiveItem = w[v];
					break
				}
			c && c.hasOwnProperty("parentID") && c.hasOwnProperty("typeID") && (e.menubarActiveItem = c.parentID + "-" + c.typeID)
		}!m || l.isLogined || r.sessionStorage.getItem(o.TempID) || (a.preventDefault(), t.go("login")), s.unTrigger(i, c)
	})
}]);