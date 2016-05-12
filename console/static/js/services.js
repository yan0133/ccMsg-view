'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
// 
angular.module('ZDK01.S')
.factory("HttpInter", ["$q", "$window", "zcGlobal", "StorageServ", "$rootScope", function(e, t, a, o, n) {
	return {
		request: function(e) {
			return e.headers = e.headers || {}, t.sessionStorage[a.TempID] && (e.headers[a.TempID] = t.sessionStorage[a.TempID]), e
		},
		response: function(t) {
			var a = t && t.hasOwnProperty("data") ? t.data : {};
			return a.hasOwnProperty("retCode") && "999998" == a.retCode && (o.clear(), n.$emit("userIntercepted", "notLogin", a)), t || e.when(t)
		}
	}
}]).factory("CookieServ", ["$cookieStore", "$cookies", function($cookieStore, $cookies) {
	var userCookie = {};
	return {
		user: userCookie,
		set: function($cookies) {
			var userCookie = $cookieStore.get("__zdkccu");
			$cookies = $cookies || userCookie, $cookieStore.put("__zdkccu", $cookies)
		},
		get: function() {
			var $cookieStore = $cookies.get("__zdkccu");
			return $cookieStore ? JSON.parse($cookieStore) : false
		},
		del: function() {
			$cookieStore.remove("__zdkccu")
		}
	}
}]).factory("StorageServ", ["$window", "zcGlobal", function($window, t) {
	var a = {};
	var o = function(e) {
		return angular.isUndefined(e) ? "zc" : "TempID" === e ? t.TempID : e
	};
	if($window.sessionStorage){
		a = {
			get: function(t) {
				return t = o(t), $window.sessionStorage.getItem(t) ? JSON.parse($window.sessionStorage.getItem(t)) : null
			},
			set: function(t, a) {
				t = o(t), a = angular.isObject(a) || angular.isArray(a) ? JSON.stringify(a) : a, $window.sessionStorage.setItem(t, JSON.stringify(a))
			},
			remove: function(t) {
				t = o(t), $window.sessionStorage.removeItem(t)
			},
			clear: function() {
				$window.sessionStorage.clear()
			}
		}
	};
	return a;
}])
.factory("BaseServ", ["$rootScope", "$http", "$q", "CookieServ", "zcGlobal", function(e, t, a, o, n) {
	return {
		query: function(r) {
			e.userInfo ? "" : e.userInfo = o.get();
			var deferred = a.defer();
			var getUrl = function() {
				//return r.Serv ? n.BaseUrl + r.urlServ : r.ChatServ ? n.BaseUrl + r.urlServ : n.BaseUrl + "console/" + r.url
				return r.Serv ? r.urlServ : r.url ? r.url :r.urlServ;
			};
			var config = {
				method: r.method.toUpperCase() || "GET",
				url: getUrl(),
				headers: {}
			};
			if ("GET" === config.method) {
				config.params = r.params || {};
				t(config).success(function(e) {
					deferred.resolve(e)
				}).error(function(e) {
					deferred.reject(e)
				})
				return deferred.promise;
			}
			if ("ZCPOST" === config.method) return config.method = "POST", config.data = r.params || {}, t(config).success(function(e) {
				deferred.resolve(e)
			}).error(function(e) {
				deferred.reject(e)
			}), deferred.promise;
			if ("POST" === config.method) {
				if(r.Serv){
					t.post(getUrl(), r.params).success(
						function(e) {
							deferred.resolve(e)
						}
					)
				}else{
					t.get(getUrl(), r.params).success(
						function(e) {
							deferred.resolve(e)
						}
					);
				}
				return deferred.promise
			}
		}
	}
}]).factory("DialogServ", ["$modal", "$alert", function(e, t) {
	var a, o = {},
		n = function(e, t) {
			return a = e(t), o.list.push(a), a
		},
		r = function(e) {
			for (var t, a = 0, n = o.list.length; n > a; a++) t = o.list[a], t.hasOwnProperty(e) && angular.isFunction(t[e]) && (t[e](), "destroy" == e && (o.list.splice(a, 1), n = o.list.length, a--))
		};
	return o.list = [], o.modal = function(t) {
		return n(e, t)
	}, o.alert = function(e) {
		return n(t, e)
	}, o.hide = function() {
		r("hide")
	}, o.destroy = function() {
		r("destroy")
	}, o
}]).factory("AuthServ", ["BaseServ", function(e) {
	var result = {
		isLogined: false,
		getUserAuthInfo: function(params) {
			var a = e.query({
				Serv: false,
				method: "POST",
				urlServ: "data/getServiceInfoByToken.json",
				params: params
			});
			return a
		},
		getUserInfo: function(params) {
			var a = e.query({
				method: "GET",
				params: params,
				Serv: false,
				urlServ: "data/getServiceDataInfo.json"
			});
			return a
		}
	};
	return result;
}]).factory("LoginServ", ["BaseServ", function(e) {
	return {
		login: function(t) {
			var a = e.query({
				method: "POST",
				Serv: false,
				urlServ: "data/serviceLogin.json",
				params: t,
				noToken: true
			});
			return a
		},
		getUserInfo: function(t, a, o) {
			var n = e.query({
				method: "GET",
				params: t,
				Serv: false,
				urlServ: "data/getServiceDataInfo.json"
			});
			return n
		},
		logOut: function(t) {
			var a = e.query({
				method: "POST",
				Serv: false,
				urlServ: "data/serviceLogOut",
				params: t
			});
			return a
		}
	}
}]).factory("SidebarServ", ["BaseServ", function(e) {
	return {
		getSidebarInfo: function() {
			var t = e.query({
				method: "GET",
				url: "static/data/SidebarInfo.json"
			});
			return t
		}
	}
}]).factory("HomeServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function(t, a) {
			var o = e.query({
				method: "GET",
				url: "static/data/HomeMenuBar.json"
			});
			return o
		},
		getRealTimeData: function(t) {
			var a = e.query({
				method: "GET",
				ChatServ: !0,
				urlServ: "chat/data/getOnceData.action",
				params: t
			});
			return a
		},
		getHomeServicesGeneralContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/rptSessionStatsList",
				params: t
			});
			return a
		},
		getHomeSGCustomerData: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/rptStaffjobStatsList",
				params: t
			});
			return a
		},
		getHomeCustomerServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/getRptStaffjobStatsByStaffId",
				params: t
			});
			return a
		},
		getRptStaffjobStatsDetailByStaffId: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/getRptStaffjobStatsDetailByStaffId",
				params: t
			});
			return a
		},
		QueryTicketSummary: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/ws/queryTicketSummary.json",
				params: t
			});
			return a
		},
		QueryTicketByServiceList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/ws/queryTicketByServiceList.json",
				params: t
			});
			return a
		},
		QueryTicketByGroupList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/ws/queryTicketByGroupList.json",
				params: t
			});
			return a
		},
		QueryTicketByGroupInitList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/ws/queryTicketByGroupInitList.json",
				params: t
			});
			return a
		},
		QueryTicketByInitList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "data/ws/queryTicketByInitList.json",
				params: t
			});
			return a
		}
	}
}]).factory("WorkOrderCenterServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function(t) {
			var a = t.url,
				o = e.query({
					method: "GET",
					url: a,
					Serv: false,
					urlServ: "data/ws/queryTaskList"+(t.taskType==3?1:2)+".json",
					params: t
				});
			return o
		},
		getQueryTicketTotalNumList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "ws/queryTicketTotalNumList",
				params: t
			});
			return a
		},
		workOrderServiceContent: function(t) {
			var a = t.url,
				o = e.query({
					method: "GET",
					url: a,
					Serv: false,
					urlServ: "ws/queryTicketListByTaskId",
					params: t
				});
			return o
		},
		deleteWorkOrderContent: function(t) {
			var a = e.query({
				method: "POST",
				Serv: false,
				urlServ: "ws/updateTicketStatus",
				params: t
			});
			return a
		},
		exportWorkOrder: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "ws/queryExportTicketList",
				params: t
			});
			return a
		},
		updateBatchTicket: function(t) {
			var a = e.query({
				method: "POST",
				Serv: false,
				urlServ: "ws/updateBatchTicket",
				params: t
			});
			return a
		},
		queryTicketById: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "ws/queryTicketById",
				params: t
			});
			return a
		},
		querySimpleTicketInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "ws/querySimpleTicketInfo",
				params: t
			});
			return a
		},
		searchTicketList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: false,
				urlServ: "ws/searchTicketList",
				params: t
			});
			return a
		}
	}
}]).factory("pubSubServ", ["$rootScope", function(e) {
	var t = "_DATA_UPDATED_",
		a = function(a, o) {
			a = a || t, o = o || {}, e.$emit(a, o)
		},
		o = function(a, o, n) {
			if (!angular.isFunction(a)) return void console.log("pubSubService.subscribe need a callback function");
			n = n || t;
			var r = e.$on(n, a);
			o && o.$on("$destroy", r)
		};
	return {
		publish: a,
		subscribe: o
	}
}])