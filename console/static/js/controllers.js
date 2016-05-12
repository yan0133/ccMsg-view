'use strict';

/* Controllers */
angular.module('ZDK01.C')
.controller("MainCtrl", ["$rootScope", "$scope", "$cookies", "$state", "$window", "LoginServ", "CookieServ", "$location", "zcGlobal","AuthServ","StorageServ",
	function($rootScope, $scope, $cookies, $state, $window, LoginServ, CookieServ, $location, zcGlobal,AuthServ,StorageServ){

	function getState(sanme) {
		var _cookies = document.cookie.split("; ");
		for (var i = 0; i < _cookies.length; i++) {
			if(_cookies[i].split("=")[0] == sanme){
				return _cookies[i].split("=")[1];
			}
		}
	}

	$rootScope.getUserInfo = function() {
		$rootScope.userInfo = {};
		LoginServ.getUserInfo().then(function(e) {
			if ("000000" == e.retCode) {
				var userInfo = e.item;
				for (var n in userInfo){
					$rootScope.userInfo[n] = userInfo[n];
				} 
				$rootScope.userInfo[zcGlobal.TempID] = $window.sessionStorage[zcGlobal.TempID];
				$rootScope.authManagement();

				var loginStatus = getState("loginStatus");
				$scope.loginStatus = loginStatus || 1;
				$scope.loginUrl = "../webchat/index.html?uid=" + $rootScope.userInfo.serviceId + "&status=" + $scope.loginStatus
			}
		})
	}
	$rootScope.authManagement = function(t) {
		if($window.sessionStorage.getItem(zcGlobal.TempID)){
			AuthServ.getUserAuthInfo().then(function(e) {
				if(e.retCode === zcGlobal.retCodeList.success){
					$rootScope.userAuthInfo = {
						info: e.item || null
					}
				}
			})
		}
	}
	$rootScope.logout = function() {
		console.log($rootScope.userInfo.serviceEmail)
		LoginServ.logOut({
			loginUser: $rootScope.userInfo.serviceEmail
		}).then(function(e) {

		});
		AuthServ.isLogined = false;
		$window.sessionStorage.removeItem(zcGlobal.TempID);
		StorageServ.clear();
		CookieServ.del();
		$state.go("login");
	}
	if($window.sessionStorage[zcGlobal.TempID]){
		$rootScope.getUserInfo();
	}
	$rootScope.$on("userIntercepted", function(e, t, a) {
		$state.go("login")
	})

}]).controller('headerCtrl', ['$scope', function($scope){

}]).controller('LoginCtrl', ['$rootScope','$scope','$state','$timeout','$window','LoginServ','AuthServ','zcGlobal', 
	function($rootScope,$scope,$state,$timeout,$window,LoginServ,AuthServ,zcGlobal){
		$scope.errorLoginState = false;
		$scope.loginUser = "123220173@qq.com";
		$scope.loginPwd = "kfxt7788";
		$scope.login = function(){
			$timeout(function() {
				var userName = $scope.loginUser || "";
				var emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				if (userName == ""){
					$scope.loginError = "请输入您的邮箱";
					$scope.errorLoginState = true;
				}else if (emailReg.test(userName)) {
					var passWord = $scope.loginPwd ? $scope.loginPwd : "";
					if(passWord.trim() == ""){
						$scope.loginError = "请输入登录密码";
						$scope.errorLoginState = true;
					}else{
						$scope.loginError = "";
						$scope.errorLoginState = false;
						LoginServ.login({
							loginUser: userName,
							loginPwd: passWord
						}).then(
							function(n) {
								var i = {
									retCode: n.retCode
								};
								i[zcGlobal.TempID] = n.item;
								$rootScope.userInfo = i;
								if(i && "000000" === i.retCode && i[zcGlobal.TempID]){
									$scope.loginError = "";
									$scope.errorLoginState = false;
									AuthServ.isLogined = true;
									$window.sessionStorage[zcGlobal.TempID] = i[zcGlobal.TempID];
									$rootScope.getUserInfo();
									$state.go($rootScope.defaultPage);
								}else{
									$scope.loginError = n.retMsg || "登录失败,请重新登录";
									$scope.errorLoginState = true;
								}
							}, function(e) {
								AuthServ.isLogined = false;
							}
						)
					}
				} else {
					$scope.loginError = "邮箱格式不正确，请重新输入";
					$scope.errorLoginState = true;
				}
			}, 500)
		}
	}
]).controller('HelpCenterCtrl', ['$scope', function($scope){
	
}]);
	/**
	 * ============================================================================================
	 * =====================================       首页       =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("HomeCtrl", ["$rootScope", "$scope", "HomeServ", "$state", "$timeout", function($rootScope, $scope, HomeServ, $state, $timeout) {
	var r = function(){
		HomeServ.getMenuBar().then(function(a) {
			$scope.menuBar = a;
			/**权限控制**/
			/*
			var o = $rootScope.userAuthInfo ? $rootScope.userAuthInfo.info.cusRoleId : null,
				i = [],
				s = [];
			if (o) {
				switch (o) {
					case "1111":
						i = ["workOrder", "myReception"];
						break;
					case "2222":
						i = ["workOrder", "myReception", "servicesGeneral"];
						break;
					case "3333":
						i = ["workOrder", "myReception", "servicesGeneral"];
						break;
					case "5555":
						i = ["workOrder"]
				}
				for (var c, l = 0, u = i.length; u > l; l++) {
					c = i[l];
					for (var d, p = 0, m = a.menuList.length; m > p; p++) {
						d = a.menuList[p], d.name === c && s.push(d)
					}
				}
				a.menuList = s;
				$scope.menuBar = a;
			} else{
				$timeout(function() {
					$rootScope.authManagement(), r()
				}, 2000)
			}*/
		});
	};
	r();
	$scope.homeMenuActive = {};
	$scope.homeMenuActive.activeItem = "2001";
	$scope.reloadPage = function(t) {
		$scope.homeMenuActive.activeItem = $scope;
	}
}]).controller('myWorkOrderCtrl', ['$scope','$rootScope','HomeServ', function($scope,$rootScope,HomeServ){
	$scope.homeMenuActive.activeItem = "2001";
	var clearTable = function(){
		$scope.content = [];
		$scope.totalItems = 0;
		$scope.currentPage = 1;
	}
	var myWorkOrder = function(params){
		return HomeServ.QueryTicketByServiceList(params)
	}
	var myGroupWorkOrder = function(params){
		return HomeServ.QueryTicketByGroupList(params)
	}
	var myGroupNoOrder = function(params){
		return HomeServ.QueryTicketByGroupInitList(params)
	}
	var allNoOrder = function(params){
		return HomeServ.QueryTicketByInitList(params)
	}
	var reloadTable = function(state){
		clearTable();

		HomeServ.QueryTicketSummary().then(function(e) {
			$scope.contentNum = e.item;
		});

		var params = {
			pageNo: $scope.currentPage || 1,
			pageSize: $scope.pageSize || 10
		}
		var table;
		switch(state){
			case 0:
				table = myWorkOrder(params);
				break;
			case 1:
				table = myGroupWorkOrder(params);
				break;
			case 2:
				table = myGroupNoOrder(params);
				break;
			case 3:
				table = allNoOrder(params);
				break;
			default:
				break;
		}
		if(table){
			table.then(function(e) {
				$scope.content = e.items;
				$scope.totalItems = e.pageCount;
				$scope.currentPage = e.pageNo;
			})
		}
	}

	$scope.$watch('isActive',function(state){
		reloadTable(state);
	});
	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
		reloadTable($scope.isWorkActive)
	};

	$scope.isActive = 0;
}]).controller('myReceptionCtrl', ['$scope', function($scope){
	$scope.homeMenuActive.activeItem = "2002";
	$scope.labels = ["00.00", "01:00", "02:00", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];
	$scope.onClick = function(points, evt) {
		console.log(points, evt);
	};
	
}]).controller('servicesGeneralCtrl', ['$scope', function($scope){
	$scope.homeMenuActive.activeItem = "2003";
	$scope.labels = ["00.00", "01:00", "02:00", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];
	$scope.onClick = function(points, evt) {
		console.log(points, evt);
	};
	
}]).controller("SidebarCtrl", ["$scope", "SidebarServ", function($scope, SidebarServ) {
	SidebarServ.getSidebarInfo().then(function(list){
		$scope.sidebarInfo = list;
		$scope.sidebarInfo.activeItem = 0;
	})
	
}])

	/**
	 * ============================================================================================
	 * =====================================     工单中心     =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("WorkOrderCenterCtrl", 
	["$scope", "$rootScope", "$state", "$stateParams", "WorkOrderCenterServ", 
	"zcGlobal", "$window", "LoginServ", function(
	e, t, a, o, n, 
	r, l, c) {
	function g() {
		console.log()
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, e.formData = {}, e.viewData = {}, t.userInfo = {}, c.getUserInfo().then(function(a) {
			if ("000000" == a.retCode) {
				e.role.cusRoleId = a.item.cusRoleId;
				var o = a.item;
				for (var n in o) t.userInfo[n] = o[n];
				t.userInfo[r.TempID] = l.sessionStorage[r.TempID], e.formData.replyType = 1
			} else {
				// m.alert({
				// 	title: "",
				// 	content: a.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				// 	placement: "top",
				// 	type: "success",
				// 	show: !0
				// })
			} 
		}), e.loadListTime = "", t.menuBarWork = {}, t.menuBarSLA = {}, $(".zc-bottom-bar").css("display", "none"), n.getMenuBar({
			taskType: 3,
			taskStatus: 1,
			usedType: 2
		}).then(function(o) {
			if ("000000" == o.retCode) {
				t.menuBarWork = o.items;
				for (var n = 0; n < t.menuBarWork.length; n++) t.menuBarWork[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1001", typeID: ' + t.menuBarWork[n].taskId + "})", t.menuBarWork[n].taskId == a.params.typeID && (e.activeTaskName = t.menuBarWork[n].taskName, e.activeTicketNum = t.menuBarWork[n].ticketNum)
			} else t.menuBarWork = []
		}), n.getMenuBar({
			taskType: 2,
			taskStatus: 1,
			usedType: 2
		}).then(function(o) {
			if ("000000" == o.retCode) {
				t.menuBarSLA = o.items;
				for (var n = 0; n < t.menuBarSLA.length; n++) t.menuBarSLA[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1002", typeID: ' + t.menuBarSLA[n].taskId + "})", t.menuBarSLA[n].taskId == a.params.typeID && (e.activeTaskName = t.menuBarSLA[n].taskName, e.activeTicketNum = t.menuBarSLA[n].ticketNum)
			} else t.menuBarSLA = {}
		})
	}

	function f() {
		n.getMenuBar({
			taskType: 3,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			if ("000000" == e.retCode) {
				t.menuBarWork = e.items;
				for (var a = 0; a < t.menuBarWork.length; a++) t.menuBarWork[a].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1001", typeID: ' + t.menuBarWork[a].taskId + "})"
			} else t.menuBarWork = {}
		});
		n.getMenuBar({
			taskType: 2,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			if ("000000" == e.retCode) {
				t.menuBarSLA = e.items;
				for (var a = 0; a < t.menuBarSLA.length; a++) t.menuBarSLA[a].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1002", typeID: ' + t.menuBarSLA[a].taskId + "})"
			} else t.menuBarSLA = {}
		})
	}
	g(), e.reloadMenu = function() {
		f();
		// m.alert({
		// 	title: "成功",
		// 	content: "刷新列表",
		// 	placement: "top",
		// 	type: "success",
		// 	show: !0
		// })
	}, e.triggerMenuActive = function(t) {
		e.activeTaskName = t.taskName, e.activeTicketNum = t.ticketNum
	}
}]).controller("WorkOrderClassCtrl",["$scope", "$rootScope", "$state", "$stateParams",function($scope,$rootScope,$state,$stateParams){

}]).controller("SearchServiceCtrl",["$scope", "$rootScope", "$state", "$stateParams",function($scope,$rootScope,$state,$stateParams){

}])

	/**
	 * ============================================================================================
	 * =====================================      知识库      =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("RepositoryCtrl", ["$scope",function($scope){

}]).controller("IssuesManagementCtrl", ["$scope",function($scope){

}])

	/**
	 * ============================================================================================
	 * =====================================     用户和组     =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("UserAndGroupCtrl", ["$scope",function($scope){
	
}])

	/**
	 * ============================================================================================
	 * =====================================       统计       =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("StatisticsCtrl", ["$scope",function($scope){
	
}]).controller("OnlineCustomerServiceCtrl", ["$scope",function($scope){
	
}])
	/**
	 * ============================================================================================
	 * =====================================       设置       =====================================
	 * ============================================================================================
	 */
angular.module('ZDK01.C')
.controller("SettingsCtrl", ["$scope",function($scope){
	
}]).controller("SettingsInfoCtrl", ["$scope",function($scope){
	
}])
