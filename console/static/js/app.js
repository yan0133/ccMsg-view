'use strict';


/**
*  Module
*
* Description
*/
angular.module('ZDK01', ["ngAnimate", "ngCookies", "ngMessages", "ngResource", "ngSanitize",
	'ui.router','ui.bootstrap','chart.js',
	'ZDK01.C','ZDK01.D','ZDK01.F','ZDK01.S','ZDK01.P'])
.constant("zcGlobal",{
	BaseUrl:"/",
	BaseRouterUrl:"",
	TempID:"temp-id",
	ServVersion: 4, 
	retCodeList: {
		success: "000000"
	}
});

angular.module("ZDK01.C", []);
angular.module("ZDK01.D", []);
angular.module("ZDK01.F", []);
angular.module("ZDK01.S", []);
angular.module("ZDK01.P", []);

angular.module("ZDK01")
.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", "zcGlobal", function($locationProvider, $stateProvider, $urlRouterProvider, zcGlobal) {
	console.log(zcGlobal.retCodeList.success);
	var rootUrl = zcGlobal.BaseRouterUrl || "/";
	// $locationProvider.html5Mode({
	// 	enabled: true,
	// 	requireBase: false
	// });
	$urlRouterProvider
		.when("/", rootUrl + "login")
		.when("/helpCenter",  rootUrl + "helpCenter/login")
		.when("/helpCenter/", rootUrl + "helpCenter/login")
		.otherwise(rootUrl+"login");

	$stateProvider
	.state("login",{
		url:rootUrl+"login",
		views:{
			"zcBox@":{
				controller:"LoginCtrl",
				templateUrl: "views/public/login.html"
			}
		}
	}).state("helpCenter",{
		url:rootUrl+"helpCenter",
		views:{
			"zcBox@":{
				controller:"HelpCenterCtrl",
				templateUrl : "views/helpCenter/index.html"
			}
		}
	}).state("zc", {
		abstract: true,
		url: rootUrl,
		views: {
			"zcBox@": {
				templateUrl: "views/public/index.html"
			}
		}
	}).state("zc.back", {
		views: {
			zcHeader: {
				templateUrl: "views/public/header.html"
			},
			zcBody: {
				templateUrl: "views/public/body.html"
			}
		}	
	})

	/**
	 * ============================================================================================
	 * =====================================       首页       =====================================
	 * ============================================================================================
	 */
	.state("zc.back.home",{
		url: "home",
		views:{
			zcMain:{
				controller:"HomeCtrl",
				templateUrl: "views/home/index.html"
			}
		}
	}).state("zc.back.home.homeWorkOrder",{
		url:"/homeWorkOrder",
		views:{
			zcContent:{
				controller:"myWorkOrderCtrl",
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
	}).state("zc.back.home.servicesGeneral", {
		url: "/servciesGeneral",
		views: {
			zcContent: {
				controller: "servicesGeneralCtrl",
				templateUrl: "views/home/servicesGeneral.html"
			}
		}
	})
	/**
	 * ============================================================================================
	 * =====================================     工单中心     =====================================
	 * ============================================================================================
	 */
	.state("zc.back.workOrderCenter", {
		url: "workOrderCenter",
		views: {
			zcMain: {
				controller: "WorkOrderCenterCtrl",
				templateUrl: "views/workOrderCenter/index.html"
			}
		}
	}).state("zc.back.workOrderCenter.workOrderClass",{
		url:" /workOrderClass/:parentID/:typeID",
		views: {
			zcContent: {
				controller: "WorkOrderClassCtrl",
				templateUrl: "views/workOrderCenter/workOrderClass.html"
			}
		}
	}).state("zc.back.workOrderCenter.searchService",{
		url:" /searchService/:parentID/:typeID",
		views: {
			zcContent: {
				controller: "SearchServiceCtrl",
				templateUrl: "views/workOrderCenter/searchService.html"
			}
		}
	})
	/**
	 * ============================================================================================
	 * =====================================      知识库      =====================================
	 * ============================================================================================
	 */
	.state("zc.back.repository", {
		url: "repository",
		views: {
			zcMain: {
				controller: "RepositoryCtrl",
				templateUrl: "views/repository/index.html"
			}
		}
	}).state("zc.back.repository.issuesManagement",{
		url:"/issuesManagement/:parentID/:typeID ",
		views:{
			zcContent:{
				controller:"IssuesManagementCtrl", 
				templateUrl: "views/repository/issuesManagement.html"
			}
		}
	})
	/**
	 * ============================================================================================
	 * =====================================     用户和组     =====================================
	 * ============================================================================================
	 */
	.state("zc.back.userAndGroup",{
		url:"userAndGroup",
		views:{
			zcMain:{
				controller:"UserAndGroupCtrl",
				templateUrl: "views/userAndGroup/index.html"
			}
		}
	}).state("zc.back.userAndGroup.userGroup", {
		url: "/userGroup/:parentID/:typeID",
		views:{
			zcContent:{
				templateUrl:"views/userAndGroup/userGroup.html"
			}
		}
	})
	/**
	 * ============================================================================================
	 * =====================================       统计       =====================================
	 * ============================================================================================
	 */
	.state("zc.back.statistics",{
		url:"statistics",
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
				templateUrl: "views/statistics/onlineCustomerService.html"
			}
		}
	})
	/**
	 * ============================================================================================
	 * =====================================       设置       =====================================
	 * ============================================================================================
	 */
	.state("zc.back.settings", {
		url: "settings",
		views: {
			zcMain: {
				controller: "SettingsCtrl",
				templateUrl: "views/settings/index.html"
			}
		}
	}).state("zc.back.settings.optionsInfo",{
			url:"/optionsInfo",
			views:{
				zcContent: {
					controller: "SettingsInfoCtrl",
					templateUrl: "views/settings/optionsInfo.html"
				}
			}
	})
}])
.run(["$rootScope", "$state", "$window", "AuthServ", "zcGlobal", function($rootScope, $state, $window, AuthServ, zcGlobal) {
	$rootScope.defaultPage = "zc.back.home.homeWorkOrder", 
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
		// var w = ["home", "workOrderCenter", "userAndGroup", "statistics", "repository", "settings"]
		// for (var i = 0; i < w.length; i++) {
		// 	$rootScope.sidebarActiveItem = w[i];
		// 	break;
		// }
		// 
		// i = $state;
		
		var unlogin = ["login", "register", "registerStatus", "registerStatusFalse", "findpwd", 
			"activate_email", "contactManager", "activateLogin", "helpCenter.login", 
			"helpCenter.forgetPwd", "helpCenter.resetPwd", "helpCenter.myWorkOrder", 
			"helpCenter.myWorkOrderDetail","openAPI","openAPI.login","msg"];
		var needLogin = true;
		for(var m in unlogin){
			if(toState.name===unlogin[m]){
				needLogin = false;
				break
			}
		}
		var mainMenu = ["home", "workOrderCenter", "userAndGroup", "statistics", "repository", "settings"];
		var _state = toState.name.split(".");
		if (_state.length > 2 && "zc" === _state[0] && "back" === _state[1]) {
			for (var n in mainMenu){
				if (_state[2] === mainMenu[n]) {
					$rootScope.sidebarActiveItem = mainMenu[n];
					break;
				}
			}
			if(toParams && toParams.hasOwnProperty("parentID") && toParams.hasOwnProperty("typeID")){
				$rootScope.menubarActiveItem = toParams.parentID + "-" + toParams.typeID;
			}
		}

		if(needLogin){
			if($window.sessionStorage.getItem(zcGlobal.TempID)){
			}else{
				event.preventDefault();
				$state.go("login"); 
			}
		}
	})
}]);