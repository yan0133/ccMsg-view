'use strict';

/* Directives */

angular.module('ZDK01.D')
	.directive("pagination", ["$rootScope", "$timeout", "pubSubServ", function(e, t, a) {
		return {
			restrict: "EA",
			templateUrl: "views/public/pagination.html",
			require: "?ngModel",
			replace: !1,
			scope: {
				config: "=",
				isInit: "=",
				totalItems: "=",
				pageSize: "=",
				jumpToPage: "=",
				prevText: "@",
				nextText: "@",
				moreText: "@",
				isAutoCallback: "=",
				callBack: "&"
			},
			link: function(scope, t, a, o) {
				var d = function() {
					scope.pageList = [];
					scope.currentPage = 1;
					l = Math.ceil(n.totalItems / n.pageSize);
					scope.prevPage = function() {
						if(scope.currentPage > 1){
							scope.currentPage--;
							p();
						}
					};
					scope.nextPage = function() {
						if(scope.currentPage < l){
							scope.currentPage++;
							p();
						}
					};
					scope.jumpTo = function(t) {
						if(angular.isNumber(t)){
							if(t > 0 && l >= t){
								scope.currentPage = t;
								p()
							}
						}
					};
					scope.$watch("currentPage", function(newValue, t, scope) {
						scope.isDisablePrev = 1 == newValue;
						scope.isDisableNext = newValue === l;
						//scope.paginationObj.currentPage = scope.currentPage
					});
					p()
				};
				var p = function() {
					var t = scope.currentPage;
					var pageList = [];
					if (n.totalItems) {
						if (7 >= l){
							for (var o = 0; l > o; o++){
								pageList.push(o + 1);
							}
						} else if (4 >= t) {
							pageList = [1, 2, 3, 4, 5, n.moreText, l];
						} else if (3 >= l - t) {
							switch (l - t) {
								case 3:
									pageList = [1, n.moreText, t - 1, t, t + 1, t + 2, l];
									break;
								case 2:
									pageList = [1, n.moreText, t - 2, t - 1, t, t + 1, l];
									break;
								case 1:
									pageList = [1, n.moreText, t - 3, t - 2, t - 1, t, l];
									break;
								case 0:
									pageList = [1, n.moreText, t - 4, t - 3, t - 2, t - 1, l]
							} 
						}else{
							pageList = [1, n.moreText, t - 1, t, t + 1, n.moreText, l];
						}
					}
				};
				d()
			}
		}
	}])