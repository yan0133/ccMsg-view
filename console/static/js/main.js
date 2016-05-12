angular.module("Sobot4.C").controller("ActivateEmailCtrl", ["$rootScope", "$scope", "$state", "$window", "$stateParams", "ActivateEmailServ", "AuthServ", "MessageServ", "checkServ", "zcGlobal", function(e, t, a, o, n, r, i, s, c, l) {
	t.isActivateEmail = !1, t.errorActivationInfo = "";
	var u = n.ActId || "",
		d = n.ServiceId || "";
	"" != u && r.getCheckActivateEmail({
		x: u,
		serviceId: d
	}).then(function(e) {
		"100015" == e.retCode ? (t.isActivateEmail = !0, t.adminUser = e.item.managerInfo.serviceName, t.companyId = e.item.managerInfo.companyId, t.cmpName = e.item.companyName, t.userRole = e.item.serviceInfo.cusRoleName, t.userEmail = e.item.serviceInfo.serviceEmail, t.managerEmail = e.item.managerInfo.serviceEmail, t.cusRId = e.item.serviceInfo.cusRoleId) : "100016" == e.retCode ? a.go("activateLogin") : "100014" == e.retCode ? t.errorActivationInfo = "很抱歉，您的激活邮件有效期已过，请联系管理员" : "100125" == e.retCode ? t.errorActivationInfo = e.retMsg || "账户已删除，请联系管理员" : "100126" == e.retCode && (t.errorActivationInfo = e.retMsg || "链接已过期，请联系管理员")
	}), t.flag = !0, t.getSmsCode = function() {
		var e = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/,
			a = t.phoneNum;
		a ? e.test(a) ? (t.retError = "", t.errorState = !1, t.flag && r.getActivateSendSms({
			phoneNo: a
		}).then(function(e) {
			if ("000000" != e.retCode) t.retError = e.retMsg ? e.retMsg : "发送失败，稍后点击重新发送", t.errorState = !0;
			else {
				t.retError = "", t.errorState = !1;
				var a = 60;
				$(".msg_btn").html('<span class="set_time" style="color:#1CB3B5;font-size:18px;" >' + a + "</span>秒后重新获取"), window.send_code_limit_time = setInterval(function() {
					return parseInt($(".msg_btn").text()) > 1 ? ($(".msg_btn").html('<span style="color:#1CB3B5;font-size:18px;" >' + --a + "</span>秒后重新获取").show(), t.flag = !1, t.flag) : (clearInterval(window.send_code_limit_time), $(".msg_btn").text("重新发送"), t.flag = !0, t.flag)
				}, 1e3)
			}
		})) : (t.retError = "请您输入正确的手机号", t.errorState = !0) : (t.retError = "请您输入手机号", t.errorState = !0)
	}, t.getHome = function() {
		var n = t.invtPwd || "",
			s = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/,
			c = t.phoneNum || "",
			u = t.smsYzm || "";
		n ? c ? s.test(c) ? u ? (t.retError = "", t.errorState = !1, r.getActivationConfirm({
			companyId: t.companyId || "",
			verificationCode: u,
			phoneNo: c,
			password: n,
			email: t.userEmail || "",
			cusRoleId: t.cusRId || "",
			cusRoleName: t.userRole || "",
			managerEmail: t.managerEmail || ""
		}).then(function(s) {
			"000000" == s.retCode ? r.login({
				loginUser: t.userEmail,
				loginPwd: n
			}).then(function(n) {
				var r = {
					retCode: n.retCode
				};
				r[l.TempID] = n.item, e.userInfo = r, r && "000000" === r.retCode && r[l.TempID] ? (t.loginError = "", t.errorLoginState = !1, i.isLogined = !0, o.sessionStorage[l.TempID] = r[l.TempID], e.getUserInfo(), a.go(e.defaultPage), e.authManagement(), a.go(e.defaultPage)) : (t.retError = n.retMsg, t.errorState = !0)
			}) : (t.retError = s.retMsg || "系统繁忙，稍后重新激活", t.errorState = !0)
		})) : (t.retError = "请输入短信中的验证码", t.errorState = !0) : (t.retError = "请您输入正确的手机号", t.errorState = !0) : (t.retError = "请输入有效的手机号码", t.errorState = !0) : (t.retError = "请输入邮件中的初始密码", t.errorState = !0)
	}
}]), angular.module("Sobot4.C").controller("OnlineCustomerServiceCtrl", ["$rootScope", "$scope", "StatisticsServ", function(e, t, a) {
	t.menuBar.activeItem = "5001", t.isActive = 0, t.endisActive = 0, t.MENDisActive = 1, t.primary = 0, t.isDisplay = !0, t.dateType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1, t.userSourceOpt = "用户来源", t.allSourceOpt = "所有来源", t.desktopWebOpt = "桌面网站", t.mobileWebsiteOpt = "移动网站", t.WeChatOpt = "微信", t.appOpt = "APP";
	var o = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = o(0), t.shortEndTime = o(0), t.source = "";
	var n = "total",
		r = "visitorCount",
		i = "online-admain",
		s = "endonline-admain",
		c = function(t, a, o, n) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(r) {
				for (var i, s = t ? t : [], c = s.length, l = [], u = [], d = 0, p = null; c > d; d++) p = s[d], l.push(p.coordinate), u.push(p.attriValue);
				r = r, i = [{
					domID: a,
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: l
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: o ? o : n,
							type: "line",
							data: u,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(i, r)
			})
		},
		l = function(t) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/map"], function(a) {
				var o, n = t ? t.map(function(e) {
					return {
						name: e.areaCode,
						newCount: e.newVisitor,
						oldCount: e.oldVisitor,
						totalCount: e.areaCount
					}
				}) : [];
				a = a, o = [{
					domID: "map-chart",
					option: {
						tooltip: {
							backgroundColor: "#ffffff",
							borderColor: "black",
							borderRadius: 10,
							borderWidth: 2,
							shadow: "ture",
							animation: !0,
							show: !0,
							style: {
								Color: "black"
							},
							borderColor: "#09aeb0",
							textStyle: {
								color: "black",
								fontSize: "18px",
								fontWeight: "blod",
								fontFamily: "Courir new"
							},
							formatter: function(e, t, a) {
								var o = "&nbsp;&nbsp;" + e.name + "&nbsp;&nbsp;<br/>";
								return o += "&nbsp;&nbsp;新用户：" + e.value.newCount + "&nbsp;&nbsp;<br/>", o += "&nbsp;&nbsp;老用户：" + e.value.oldCount + "&nbsp;&nbsp;<br/>", o += "&nbsp;&nbsp;总用户：" + e.value.totalCount + "&nbsp;&nbsp;<br/>"
							}
						},
						series: [{
							name: "中国",
							type: "map",
							mapType: "china",
							selectedMode: "single",
							itemStyle: {
								normal: {
									borderWidth: 1,
									borderColor: "#037e7f",
									color: "#09c3c5",
									label: {
										show: !1
									}
								},
								emphasis: {
									borderWidth: 1,
									borderColor: "",
									color: "#06b2b4",
									label: {
										show: !0,
										textStyle: {
											color: "#fff"
										}
									}
								}
							},
							roam: !1,
							data: n
						}]
					}
				}], e.createChart(o, a)
			})
		},
		u = function(e, o, n, r, i, s) {
			if ("" != n) var l = {
				startDate: e,
				endDate: o,
				source: n,
				attriName: r
			};
			else var l = {
				startDate: e,
				endDate: o,
				attriName: r
			};
			a.geTrptSessionStatsList(l).then(function(a) {
				t.listBoxt = a.item ? a.item : "";
				var l = a.item && a.item.total_ch ? a.item.total_ch : "0";
				if ("" != a.items) $("#online-admain").empty(), c(a.items, i, s, l);
				else {
					var u = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
					$("#online-admain").empty().append(u)
				}
				if ("" != n) {
					var d;
					d = {
						url: "/data/rptSessionStatsListExport/4?",
						startDate: e,
						endDate: o,
						source: n,
						SessionName: r
					}, t.requestUrl = d.url + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&source=" + d.source + "&attriName=" + d.SessionName
				} else {
					var d;
					d = {
						url: "/data/rptSessionStatsListExport/4?",
						startDate: e,
						endDate: o,
						SessionName: r
					}, t.requestUrl = d.url + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&attriName=" + d.SessionName
				}
			})
		},
		d = function(e, o, n, r, i, s) {
			if ("" != n) var l = {
				startDate: e,
				endDate: o,
				source: n,
				attriName: r
			};
			else var l = {
				startDate: e,
				endDate: o,
				attriName: r
			};
			a.getStatisticeServiceContent(l).then(function(a) {
				if ("0" == a.retCode) {
					t.endlistBoxt = a.item ? a.item : "";
					var l = a.item.visitorCount_ch;
					if ("" != a.items) $("#endonline-admain").empty(), c(a.items, i, s, l);
					else {
						var u = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
						$("#endonline-admain").empty().append(u)
					}
					if ("" != n) {
						var d;
						d = {
							url: "/data/rptVisitStatsListExport/4?",
							startDate: e,
							endDate: o,
							source: n,
							UserCountsName: r
						}, t.UserRequestUrl = d.url + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&source=" + d.source + "&attriName=" + d.UserCountsName
					} else {
						var d;
						d = {
							url: "/data/rptVisitStatsListExport/4?",
							startDate: e,
							endDate: o,
							UserCountsName: r
						}, t.UserRequestUrl = d.url + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&attriName=" + d.UserCountsName
					}
				}
			})
		},
		p = function(e, t, o) {
			if ("" != o) var n = {
				startDate: e,
				endDate: t,
				source: o
			};
			else var n = {
				startDate: e,
				endDate: t
			};
			a.getMapUsers(n).then(function(e) {
				l(e.items)
			})
		};
	u(t.shortStartTime, t.shortEndTime, t.source, n, i, ""), d(t.shortStartTime, t.shortEndTime, t.source, r, s, ""), p(t.shortStartTime, t.shortEndTime, t.source), a.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, t.exportBtnEnter = function() {
		t.exportBtnState = !0
	}, t.exportBtnLeave = function() {
		t.exportBtnState = !1
	}, t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._option_start_y option:selected").text(),
			a = $("._option_start_m option:selected").text(),
			o = $("._option_start_day option:selected").text(),
			n = $("._option_end_y option:selected").text(),
			r = $("._option_end_m option:selected").text(),
			i = $("._option_end_day option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, $("._option_start_m").change(function() {
		var e = $("._option_start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_start_day option").eq(29).hide(), $("._option_start_day option").eq(30).hide()) : ($("._option_start_day option").eq(29).show(), "04月" == e ? $("._option_start_day option").eq(30).hide() : $("._option_start_day option").eq(30).show()), $("._option_start_day").val("01日")
	}), $("._option_end_m").change(function() {
		var e = $("._option_end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_end_day option").eq(29).hide(), $("._option_end_day option").eq(30).hide()) : ($("._option_end_day option").eq(29).show(), "04月" == e ? $("._option_end_day option").eq(30).hide() : $("._option_end_day option").eq(30).show()), $("._option_end_day").val("01日")
	}), t.SelectSourceOpt = function(e) {
		t.userSourceOpt = e
	}, t.queryByTimeAndSource = function() {
		var e = t.dateType,
			a = t.userSourceOpt;
		switch (t.source = "", e) {
			case "今天":
				t.shortStartTime = o(0), t.shortEndTime = o(0);
				break;
			case "昨天":
				t.shortStartTime = o(-1), t.shortEndTime = o(-1);
				break;
			case "过去7天":
				t.shortStartTime = o(-7), t.shortEndTime = o(-1);
				break;
			case "过去30天":
				t.shortStartTime = o(-30), t.shortEndTime = o(-1);
				break;
			default:
				var c = t.startDateType,
					l = t.endDateType,
					m = c.replace("年", "-"),
					g = m.replace("月", "-");
				t.shortStartTime = g.replace("日", "");
				var f = l.replace("年", "-"),
					v = f.replace("月", "-");
				t.shortEndTime = v.replace("日", "")
		}
		switch (a) {
			case "用户来源":
				t.source = "";
				break;
			case "桌面网站":
				t.source = "0";
				break;
			case "移动网站":
				t.source = "4";
				break;
			case "微信":
				t.source = "1";
				break;
			case "APP":
				t.source = "2"
		}
		t.isActive = 0, t.endisActive = 0, u(t.shortStartTime, t.shortEndTime, t.source, n, i, ""), d(t.shortStartTime, t.shortEndTime, t.source, r, s, ""), p(t.shortStartTime, t.shortEndTime, t.source)
	}, t.total = function(e) {
		u(t.shortStartTime, t.shortEndTime, t.source, n, i, e)
	}, t.robor = function(e) {
		var a = "robot";
		u(t.shortStartTime, t.shortEndTime, t.source, a, i, e)
	}, t.human = function(e) {
		var a = "human";
		u(t.shortStartTime, t.shortEndTime, t.source, a, i, e)
	}, t.queue = function(e) {
		var a = "queue";
		u(t.shortStartTime, t.shortEndTime, t.source, a, i, e)
	}, t.leaveInQueue = function(e) {
		var a = "leaveInQueue";
		u(t.shortStartTime, t.shortEndTime, t.source, a, i, e)
	}, t.endtotal = function(e) {
		d(t.shortStartTime, t.shortEndTime, t.source, r, s, e)
	}, t.endrobor = function(e) {
		var a = "robot";
		d(t.shortStartTime, t.shortEndTime, t.source, a, s, e)
	}, t.endhuman = function(e) {
		var a = "human";
		d(t.shortStartTime, t.shortEndTime, t.source, a, s, e)
	}
}]).controller("SessionRecordCtrl", ["$rootScope", "$scope", "StatisticsServ", "DialogServ", "$timeout", "DownloadFileServ", "dateUtil", function(e, t, a, o, n, r, i) {
	t.menuBar.activeItem = "5003";
	var s, c = !1;
	t.selectOption = {
		special: !0
	}, t.isDisplay = !0, t.dateType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.Threeday = "过去3天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1, t.userSourceOpt = "用户来源", t.allSourceOpt = "所有来源", t.desktopWebOpt = "桌面网站", t.mobileWebsiteOpt = "移动网站", t.WeChatOpt = "微信", t.appOpt = "APP", t.lineUpOpt = "排队情况", t.allLineUpOpt = "所有情况", t.is2Human_ch = "未接人工", t.onlyLineUpOpt = "接人工排队", t.noLineUpOpt = "接人工未排队", t.selectedTags = [], t.allCus = "所有客服", t.initCus = "最后接待", t.LRobot = "机器人", t.selected = [], t.isTags = !1, t.isInitCus = !0, t.disCus = "", t.contentsAndUserId = "会话内容", t.SessionContent = "会话内容", t.UserDockId = "用户对接ID", t.Copy = "按会话内容筛选", t.queueStatus = "", t.is2Human = "", t.selectUserID = "", t.source = "", t.sessionContents = "", t.setUserId = "";
	var l = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = l(0) + " 00:00:00", t.shortEndTime = l(0) + " 23:59:59", $(".panel.panel-default").undelegate(".js-export-file", "click"), $(".panel.panel-default").delegate(".js-export-file", "click", function(e) {
		var o = e.currentTarget,
			n = $(o).attr("zc-file-url"),
			i = $(o).attr("zc-query-url");
		c || (c = !0, s = setTimeout(function() {
			c = !1
		}, 500), t.$apply(function() {
			var e = r(t),
				o = e.getQueryParam(n);
			a.fileStatusQuery(i, o).then(function(t) {
				e.show(t)
			})
		}))
	}), a.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay, t.startDateHours = e.startDate.startDateHours, t.endDateHours = e.endDate.endDateHours, t.startDateMnu = e.startDate.startDateMnu, t.endDateMnu = e.endDate.endDateMnu
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, $("._option_start_m").change(function() {
		var e = $("._option_start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_start_day option").eq(29).hide(), $("._option_start_day option").eq(30).hide()) : ($("._option_start_day option").eq(29).show(), "04月" == e ? $("._option_start_day option").eq(30).hide() : $("._option_start_day option").eq(30).show()), $("._option_start_day").val("01日")
	}), $("._option_end_m").change(function() {
		var e = $("._option_end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_end_day option").eq(29).hide(), $("._option_end_day option").eq(30).hide()) : ($("._option_end_day option").eq(29).show(), "04月" == e ? $("._option_end_day option").eq(30).hide() : $("._option_end_day option").eq(30).show()), $("._option_end_day").val("01日")
	}), t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._option_start_y option:selected").text(),
			a = $("._option_start_m option:selected").text(),
			o = $("._option_start_day option:selected").text(),
			n = $("._option_start_h option:selected").text(),
			r = $("._option_start_mnu option:selected").text(),
			i = $("._option_end_y option:selected").text(),
			s = $("._option_end_m option:selected").text(),
			c = $("._option_end_day option:selected").text(),
			l = $("._option_end_h option:selected").text(),
			u = $("._option_end_mnu option:selected").text(),
			d = e + a + o + n + r,
			p = i + s + c + l + u;
		t.dateType = d + "至" + p, t.startDateType = d, t.endDateType = p
	}, t.SelectSourceOpt = function(e) {
		t.userSourceOpt = e
	}, t.SelectLineUpOpt = function(e) {
		t.lineUpOpt = e
	}, t.LastCustomer = function(e, a) {
		t.LastCusId = "", t.LastCusId = a ? a : "", t.isTags = !1, t.isInitCus = !0, t.initCus = e, $(".dropdown-menu li input[type=checkbox]").attr("checked", !1), t.selectedTags = [], t.selected = []
	};
	var u = function(e, a, o) {
		if ("add" == e && -1 == t.selected.indexOf(a) && (t.selected.push(a), t.selectedTags.push(o)), "remove" == e && -1 != t.selected.indexOf(a)) {
			var n = t.selected.indexOf(a);
			t.selected.splice(n, 1), t.selectedTags.splice(n, 1), 0 == t.selectedTags.length && (t.isTags = !1, t.isInitCus = !0, t.initCus = "最后接待", t.selectedTags = [], t.selected = [])
		}
		t.disCus = t.selectedTags.join()
	};
	t.updateSelection = function(e, a) {
		t.isTags = !0, t.isInitCus = !1;
		var o = e.target,
			n = o.checked ? "add" : "remove";
		u(n, a, o.name)
	}, t.isSelected = function(e) {
		return t.selected.indexOf(e) >= 0
	}, t.SltCetAndUserId = function(e) {
		t.contentsAndUserId = e, t.selectOption.special = "会话内容" == e, "会话内容" == e ? t.Copy = "按会话内容筛选" : t.Copy = "按用户对接ID筛选"
	}, t.queryByTimeAndSource = function() {
		var e = t.dateType,
			a = t.userSourceOpt,
			n = t.lineUpOpt,
			r = t.selected,
			s = t.contentsAndUserId;
		t.source = "", t.queueStatus = "", t.is2Human = "", t.sessionContents = "", t.setUserId = "";
		var c = t.selectUserID;
		if (c.length > 100) return !1;
		var u = function() {
			var e = i.parse(t.shortStartTime),
				a = i.parse(t.shortEndTime),
				o = i.daysDistance(e, a);
			return !(o > 1 && t.selectOption.special && t.selectUserID.length > 0)
		};
		switch (e) {
			case "今天":
				t.shortStartTime = l(0) + " 00:00:00", t.shortEndTime = l(0) + " 23:59:59";
				break;
			case "昨天":
				t.shortStartTime = l(-1) + " 00:00:00", t.shortEndTime = l(-1) + " 23:59:59";
				break;
			case "过去3天":
				t.shortStartTime = l(-3) + " 00:00:00", t.shortEndTime = l(-1) + " 23:59:59";
				break;
			case "过去7天":
				t.shortStartTime = l(-7) + " 00:00:00", t.shortEndTime = l(-1) + " 23:59:59";
				break;
			case "过去30天":
				t.shortStartTime = l(-30) + " 00:00:00", t.shortEndTime = l(-1) + " 23:59:59";
				break;
			default:
				var d = t.startDateType,
					m = t.endDateType,
					g = d.replace("年", "-"),
					f = g.replace("月", "-"),
					v = f.replace("日", " "),
					h = v.replace("时", ":"),
					y = h.replace("分", ":00");
				t.shortStartTime = y;
				var S = m.replace("年", "-"),
					b = S.replace("月", "-"),
					D = b.replace("日", " "),
					I = D.replace("时", ":"),
					w = I.replace("分", ":59");
				t.shortEndTime = w
		}
		switch (a) {
			case "用户来源":
				t.source = "";
				break;
			case "桌面网站":
				t.source = "0";
				break;
			case "移动网站":
				t.source = "4";
				break;
			case "微信":
				t.source = "1";
				break;
			case "APP":
				t.source = "2"
		}
		switch (n) {
			case "排队情况":
				t.queueStatus = "", t.queueStatus = "", t.is2Human = "";
				break;
			case "未接人工":
				t.is2Human = "1", t.queueStatus = "";
				break;
			case "接人工排队":
				t.queueStatus = "1", t.is2Human = "0";
				break;
			case "接人工未排队":
				t.queueStatus = "2", t.is2Human = "0"
		}
		switch (s) {
			case "会话内容":
				t.sessionContents = t.selectUserID, t.setUserId = "";
				break;
			case "用户对接ID":
				t.sessionContents = "", t.setUserId = t.selectUserID
		}
		if (!u()) {
			t.modalDomData = {
				title: "提示",
				content: "按照会话内容进行查询时，请选择1天内的时间范围"
			};
			var T = o.modal({
				scope: t,
				templateUrl: "views/public/dialog-alert.html"
			});
			return void T.$promise.then(T.show)
		}
		p(t.shortStartTime, t.shortEndTime, t.source, t.queueStatus, t.is2Human, r.join(), t.sessionContents, t.setUserId)
	};
	var d = function() {
			t.totalItems = {}, t.activePageSize = {}, t.pageCount = {}, t.activePageNo = {}, t.content = {}, t.itemNum = {}, t.activePageNo = 1, t.activePageSize = 10
		},
		p = function(e, o, n, r, i, s, c, l) {
			d();
			var u = {};
			u.init = function() {
				u.initPagination(), u.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount ? e.totalCount : "", t.paginationObj.config.isInit = !0
				})
			}, u.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, u.initTableList = function(u) {
				u = u ? u : {};
				var d = {
						startDate: e,
						endDate: o,
						userSource: n ? n : "",
						is2Human: i ? i : "",
						isQueue: r ? r : "",
						lastStaffId: s ? s : "",
						content: c ? c.length > 100 ? c.substring(0, 100) : c : "",
						partnerId: l ? l.length > 100 ? l.substring(0, 100) : l : ""
					},
					p = "/data/rptConversationRecordStatsExport/4?",
					m = {
						url: "/data/rptVisitorStatsExport/4?",
						isNew: "1"
					},
					g = "/data/rptVisitorStatsExport/4?",
					f = "/data/rptMsgRecordExport/4?",
					v = {
						startDate: e,
						endDate: o,
						source: n ? n : "",
						is2Human: i ? i : "",
						queueStatus: r ? r : "",
						lastStaffId: s ? s : "",
						content: c ? c.length > 100 ? c.substring(0, 100) : c : "",
						partnerId: l ? l.length > 100 ? l.substring(0, 100) : l : "",
						page: u.pageNo || t.paginationObj.currentPage || t.activePageNo,
						size: u.pageSize || t.paginationObj.pageSize || t.activePageSize
					};
				return t.SessionUrl = p + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&userSource=" + d.userSource + "&isQueue=" + d.isQueue + "&is2Human=" + d.is2Human + "&lastStaffId=" + d.lastStaffId + "&partnerId=" + d.partnerId + "&content=" + d.content, t.NewUserDataUrl = m.url + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&userSource=" + d.userSource + "&isQueue=" + d.isQueue + "&is2Human=" + d.is2Human + "&isNew=" + m.isNew + "&lastStaffId=" + d.lastStaffId + "&partnerId=" + d.partnerId + "&content=" + d.content, t.UserDataAllUrl = g + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&userSource=" + d.userSource + "&isQueue=" + d.isQueue + "&is2Human=" + d.is2Human + "&lastStaffId=" + d.lastStaffId + "&partnerId=" + d.partnerId + "&content=" + d.content, t.ChatDataUrl = f + "startDate=" + d.startDate + "&endDate=" + d.endDate + "&userSource=" + d.userSource + "&isQueue=" + d.isQueue + "&is2Human=" + d.is2Human + "&lastStaffId=" + d.lastStaffId + "&partnerId=" + d.partnerId + "&content=" + d.content, a.QueryConversation(v).then(function(e) {
					return "0" == e.retCode ? (t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.chatrecordBodyData = e.items, e) : void 0
				})
			}, t.getTableListByPagination = function(e) {
				t.activePageNo = e.currentPage, t.paginationObj.currentPage = e.currentPage, t.paginationObj.pageSize = e.pageSize, u.initTableList()
			}, u.init()
		};
	a.getStaffInfo().then(function(e) {
		t.customerData = e.items ? e.items : [], t.customerData.unshift({
			staffName: "机器人",
			staffId: "robot"
		})
	}), p(t.shortStartTime, t.shortEndTime, t.source, t.queueStatus, t.is2Human, "", t.sessionContents, t.setUserId), t.tabsActiveIndex = 0, t.eachCid = "", t.a = "", t.isCidChecked = "11-1";
	var m = function(e) {
			return e ? (t.vidChatData = [], t.ChatListMsg = "正在加载中...", t.noMoreLeftData = !1, t.currentPage = 1, void a.QueryConversation({
				visitorId: e,
				startDate: t.shortStartTime,
				endDate: t.shortEndTime,
				page: t.currentPage,
				size: 10
			}).then(function(o) {
				return "0" !== o.retCode ? !1 : (t.noMoreLeftData = !(!o.items || !o.items.length), t.ChatListMsg = "点击加载更多", n(function() {
					t.vidChatData = o.items ? o.items : []
				}, 800), void(t.getMoreChatList = function() {
					return 0 == t.noMoreLeftData ? (t.ChatListMsg = "没有更多记录了！", !1) : (t.currentPage++, t.ChatListMsg = "正在加载中...", void a.QueryConversation({
						visitorId: e,
						startDate: t.shortStartTime,
						endDate: t.shortEndTime,
						page: t.currentPage,
						size: 10
					}).then(function(e) {
						var a = e.items && 0 != e.items.length ? e.items : [];
						if (0 == a.length) return t.noMoreLeftData = !1, t.ChatListMsg = "没有更多记录了！", !1;
						t.ChatListMsg = "点击加载更多";
						var o = e.items && 0 != e.items.length ? e.items : [],
							n = o.length;
						o && n ? t.vidChatData = t.vidChatData.concat(o) : ""
					}))
				}))
			})) : !1
		},
		g = function(e) {
			var e = angular.isArray(e) ? e : [],
				t = e.length,
				a = [];
			if (e && t)
				for (var o, n = 0; t > n; n++) {
					o = e[n];
					var r = "3",
						i = "",
						s = o.hasOwnProperty("ts") ? o.ts : "",
						c = o.hasOwnProperty("senderType") ? o.senderType : "",
						l = o.hasOwnProperty("receiverName") ? o.receiverName : "",
						u = o.hasOwnProperty("senderName") ? o.senderName : "",
						d = o.hasOwnProperty("offlineType") ? o.offlineType : "",
						p = o.hasOwnProperty("t") ? o.t : "";
					switch (o.type) {
						case "5":
							i = o.msg, r = c;
							break;
						case "4":
							i = "用户和机器人建立会话";
							break;
						case "6":
							i = "用户转人工服务";
							break;
						case "7":
							i = "用户排队";
							break;
						case "8":
							i = "用户和客服" + l + "建立会话";
							break;
						case "9":
							i = "用户与客服" + u + "的会话,被转接到客服" + l;
							break;
						case "10":
							switch (d) {
								case "4":
									i = "用户会话超时，本次会话已经结束";
									break;
								case "5":
									i = "用户关闭了聊天页面，本次会话已经结束";
									break;
								case "3":
									i = "用户被客服" + l + "加入黑名单,本次会话结束";
									break;
								case "2":
									i = "用户被客服" + l + "移除,本次会话结束";
									break;
								case "1":
									i = "客服" + l + "离线,本次会话结束";
									break;
								case "6":
									i = "用户打开新的聊天页面，本次会话已经结束"
							}
							break;
						case "11":
							i = "客服" + u + "把" + l + "拉黑了";
							break;
						case "12":
							i = "用户已被客服" + u + "取消拉黑";
							break;
						case "16":
							i = "用户已被客服" + u + "添加星标";
							break;
						case "17":
							i = "用户已被客服" + u + "取消星标";
							break;
						case "18":
							i = "用户向客服" + l + "申请语音通话";
							break;
						case "19":
							i = "客服" + u + "给用户回拨语音通话";
							break;
						case "20":
							var m = o.msg.indexOf(";"),
								g = o.msg.substring(0, m),
								f = o.msg.substring(m + 1, o.msg.length);
							i = '用户访问了页面 <a href="' + g + '" target="_blank">' + f + "</a>";
							break;
						case "21":
							i = "客服" + u + "主动邀请会话"
					}
					a.push({
						msgType: r,
						msgText: i,
						senderName: u,
						sendTime: s,
						tempTime: p
					})
				}
			return a
		},
		f = function(e) {
			t.cidBodyData = {
				totalItems: 0,
				totalHuman: 0,
				list: []
			}, t.moreMsgListBtnText = "正在加载中...", t.noMoreData = !1, t.userNickName = "", t.currentPage = 1, a.cidsatisfactionServiceContent({
				cid: e,
				page: t.currentPage,
				size: 15
			}).then(function(o) {
				return "0" !== o.retCode ? !1 : (t.noMoreData = !!o.items.length, t.moreMsgListBtnText = "点击加载更多", t.cidBodyData.totalItems = o.item && o.item.total ? o.item.total > 999 ? "999+" : o.item.total : 0, t.cidBodyData.totalHuman = o.item && o.item.totalHuman ? o.item.totalHuman > 999 ? "999+" : o.item.totalHuman : 0, t.a = o.item && o.item.totalCount ? o.item.totalCount : 0, n(function() {
					t.cidBodyData.list = g(o.items && 0 != o.items.length ? o.items : [])
				}, 800), void(t.getMoreContext = function() {
					return 0 == t.noMoreData ? (t.moreMsgListBtnText = "没有更多记录了！", !1) : (t.currentPage++, t.moreMsgListBtnText = "正在加载中...", void a.cidsatisfactionServiceContent({
						cid: e,
						page: t.currentPage,
						size: 15
					}).then(function(e) {
						var a = e.items && 0 != e.items.length ? e.items : [];
						if (0 == a) return t.noMoreData = !1, t.moreMsgListBtnText = "没有更多记录了！", !1;
						t.moreMsgListBtnText = "点击加载更多", t.cidBodyData.totalItems = e.item && e.item.total ? e.item.total : 0, t.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman : 0;
						var o = g(e.items && 0 != e.items.length ? e.items : []),
							n = o.length;
						o && n ? t.cidBodyData.list = t.cidBodyData.list.concat(o) : ""
					}))
				}))
			})
		},
		v = function(e, o) {
			t.cidBodyData = {
				totalItems: 0,
				totalHuman: 0,
				list: []
			}, t.moreMsgListBtnText = "正在加载中...", t.noMoreData = !1, t.userNickName = "", t.currentPage = 1, a.cidsatisfactionServiceContent({
				cid: e,
				page: t.currentPage,
				size: o ? o : 15
			}).then(function(r) {
				if ("0" !== r.retCode) return !1;
				t.noMoreData = !!r.items.length, t.moreMsgListBtnText = "点击加载更多", t.cidBodyData.totalItems = r.item && r.item.total ? r.item.total > 999 ? "999+" : r.item.total : 0, t.cidBodyData.totalHuman = r.item && r.item.totalHuman ? r.item.totalHuman > 999 ? "999+" : r.item.totalHuman : 0;
				var i = [];
				if (1 == t.noMoreData) {
					for (var s = 0; s < r.items.length; s++) {
						var c = r.items[s];
						"1" !== c.senderType && "1" !== c.receiverType && i.push(c)
					}
					n(function() {
						t.cidBodyData.list = g(i)
					}, 800)
				}
				t.getMoreContext = function() {
					return 0 == t.noMoreData ? (t.moreMsgListBtnText = "没有更多记录了！", !1) : (t.currentPage++, t.moreMsgListBtnText = "正在加载中...", void a.cidsatisfactionServiceContent({
						cid: e,
						page: t.currentPage,
						size: o ? o : 15
					}).then(function(e) {
						var a = e.items && 0 != e.items.length ? e.items : [];
						if (0 == a) return t.noMoreData = !1, t.moreMsgListBtnText = "没有更多记录了！", !1;
						t.moreMsgListBtnText = "点击加载更多", t.cidBodyData.totalItems = e.item && e.item.total ? e.item.total : 0, t.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman : 0;
						var o = [];
						if (1 == t.noMoreData) {
							for (var n = 0; n < e.items.length; n++) {
								var r = e.items[n];
								"1" !== r.senderType && "1" !== r.receiverType && o.push(r)
							}
							var i = g(o),
								s = i.length;
							i && s ? t.cidBodyData.list = t.cidBodyData.list.concat(i) : ""
						}
					}))
				}
			})
		};
	t.checkDetailsById = function(e, a, n) {
		var r = null;
		t.eachCid = "", t.tabsActiveIndex = 0, t.isUserInfoShown = !1, t.modalDomData = {
			title: "会话详情",
			userName: n ? n : ""
		}, r || (r = o.modal({
			scope: t,
			templateUrl: "views/public/strap-modal-leftListContext.html"
		})), r.$isShown || r.$promise.then(r.show), t.isCid = "0-" + e, t.eachCid = e, m(a), f(e)
	}, t.allDetailByCid = function() {
		t.tabsActiveIndex = 0, f(t.eachCid)
	}, t.artificialCVSNByCid = function() {
		t.tabsActiveIndex = 1, v(t.eachCid, t.a)
	}, t.checkLeftEachByCid = function(e, a) {
		t.eachCid = e, t.isCid = a, t.tabsActiveIndex = 0, t.isUserInfoShown = !1, f(e)
	};
	var h = ["PC", "微信", "APP", "微博", "WAP"];
	t.showUserInfo = function() {
		t.isUserInfoShown = !t.isUserInfoShown, t.isUserInfoShown && a.infosatisfactionServiceContent({
			cid: t.eachCid
		}).then(function(e) {
			return "0" !== e.retCode ? !1 : (t.userInfoBodyData = e.item, t.userInfoBodyData.sourceText = h[t.userInfoBodyData.source], void(t.userInfoBodyData.id && a.QueryUserHistoryInfo({
				userId: t.userInfoBodyData.id
			}).then(function(e) {
				return "0" !== e.retCode ? !1 : void(t.userInfoBodyData.visitedNums = e.item && e.item.total ? e.item.total : 0)
			})))
		})
	}, t.hideUserInfo = function() {
		t.isUserInfoShown = !t.isUserInfoShown
	}
}]).controller("CustomerServiceWorkloadCtrl", ["$rootScope", "$scope", "StatisticsServ", function(e, t, a) {
	t.menuBar.activeItem = "5002", t.oderisActive = 0, t.isDisplay = !0, t.isTwoDisplay = !0, t.dateType = "今天", t.dateTwoType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1, t.CusTwoShow = !1, t.tableTitles = [{
		title: "在线时长"
	}, {
		title: "忙碌时长"
	}, {
		title: "独立接待会话"
	}, {
		title: "转入会话"
	}, {
		title: "转出会话"
	}, {
		title: "消息数"
	}, {
		title: "回复率"
	}, {
		title: "平均首次响应时间"
	}, {
		title: "平均响应时间"
	}, {
		title: "平均接待时间"
	}, {
		title: "操作"
	}], t.titleEnter = function(e) {
		e.state = 1
	}, t.titleLeave = function(e) {
		e.state = 0
	}, t.titleActive = function(e) {
		e.state = 2
	};
	var o = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = o(0), t.shortEndTime = o(0), t.shortTwoStartTime = o(0), t.shortTwoEndTime = o(0), t.groupId = "", t.groupName = "客服分组", t.allGroupName = "所有分组", a.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.isTwoShow = function() {
		t.isTwoDisplay = !t.isTwoDisplay, t.CusTwoShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, t.toggleTwo = function(e) {
		t.isTwoDisplay = !t.isTwoDisplay, t.dateTwoType = e
	}, t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, t.isTwoCustomDate = function() {
		0 == t.CusTwoShow ? t.CusTwoShow = !0 : t.CusTwoShow = !1
	}, $("._start_m").change(function() {
		var e = $("._start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._start_day option").eq(29).hide(), $("._start_day option").eq(30).hide()) : ($("._start_day option").eq(29).show(), "04月" == e ? $("._start_day option").eq(30).hide() : $("._start_day option").eq(30).show()), $("._start_day").val("01日")
	}), $("._end_m").change(function() {
		var e = $("._end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._end_day option").eq(29).hide(), $("._end_day option").eq(30).hide()) : ($("._end_day option").eq(29).show(), "04月" == e ? $("._end_day option").eq(30).hide() : $("._end_day option").eq(30).show()), $("._end_day").val("01日")
	}), $("._two_sm").change(function() {
		var e = $("._two_sm option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._two_sday option").eq(29).hide(), $("._two_sday option").eq(30).hide()) : ($("._two_sday option").eq(29).show(), "04月" == e ? $("._two_sday option").eq(30).hide() : $("._two_sday option").eq(30).show()), $("._two_sday").val("01日")
	}), $("._two_em").change(function() {
		var e = $("._two_em option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._two_eday option").eq(29).hide(), $("._two_eday option").eq(30).hide()) : ($("._two_eday option").eq(29).show(), "04月" == e ? $("._two_eday option").eq(30).hide() : $("._two_eday option").eq(30).show()), $("._two_eday").val("01日")
	}), t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._start_y option:selected").text(),
			a = $("._start_m option:selected").text(),
			o = $("._start_day option:selected").text(),
			n = $("._end_y option:selected").text(),
			r = $("._end_m option:selected").text(),
			i = $("._end_day option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, t.optionTwoDate = function() {
		t.isTwoDisplay = !t.isTwoDisplay;
		var e = $("._two_sy option:selected").text(),
			a = $("._two_sm option:selected").text(),
			o = $("._two_sday option:selected").text(),
			n = $("._two_ey option:selected").text(),
			r = $("._two_em option:selected").text(),
			i = $("._two_eday option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateTwoType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, t.queryByTimeAndSource = function() {
		var e = t.dateType;
		switch (e) {
			case "今天":
				t.shortStartTime = o(0), t.shortEndTime = o(0);
				break;
			case "昨天":
				t.shortStartTime = o(-1), t.shortEndTime = o(-1);
				break;
			case "过去7天":
				t.shortStartTime = o(-7), t.shortEndTime = o(-1);
				break;
			case "过去30天":
				t.shortStartTime = o(-30), t.shortEndTime = o(-1);
				break;
			default:
				var a = t.startDateType,
					n = t.endDateType,
					i = a.replace("年", "-"),
					s = i.replace("月", "-");
				t.shortStartTime = s.replace("日", "");
				var c = n.replace("年", "-"),
					l = c.replace("月", "-");
				t.shortEndTime = l.replace("日", "")
		}
		r(t.shortStartTime, t.shortEndTime, t.groupId)
	};
	var n = function() {
			t.totalItems = {}, t.activePageSize = {}, t.pageCount = {}, t.activePageNo = {}, t.content = {}, t.itemNum = {}, t.activePageSize = 10, t.activePageNo = 1
		},
		r = function(e, o, r) {
			n();
			var i = {};
			i.init = function() {
				i.initPagination(), i.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e && e.totalCount ? e.totalCount : "", t.paginationObj.config.isInit = !0
				})
			}, i.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, i.initTableList = function(n) {
				if (n = n ? n : {}, "" != r) var i = {
					startDate: e,
					endDate: o,
					groupId: r,
					pageNo: n.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: n.pageSize || t.paginationObj.pageSize || t.activePageSize
				};
				else var i = {
					startDate: e,
					endDate: o,
					pageNo: n.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: n.pageSize || t.paginationObj.pageSize || t.activePageSize
				};
				return a.getRptStaffjobStatsList(i).then(function(a) {
					if ("0" == a.retCode) {
						t.totalItems = a.totalCount, t.activePageSize = a.pageSize, t.pageCount = a.pageCount, t.activePageNo = a.pageNo, t.tBodyData = a.items;
						for (var n in t.tBodyData)
							if (t.tBodyData[n].replyConvRate <= 0) t.tBodyData[n].replyConvRate = 0;
							else if (1 == t.tBodyData[n].replyConvRate) {
							var i = t.tBodyData[n].replyConvRate;
							t.tBodyData[n].replyConvRate = 100 * i + "%"
						} else {
							var s = t.tBodyData[n].replyConvRate.toFixed(2);
							t.tBodyData[n].replyConvRate = s.substring(2, 4) + "%"
						}
						if ("" != r) {
							var c;
							c = {
								url: "/data/rptStaffjobStatsListExport/4?",
								startDate: e,
								endDate: o,
								groupId: r
							}, t.requestUrl = c.url + "startDate=" + c.startDate + "&endDate=" + c.endDate + "&groupId=" + c.groupId
						} else {
							var c;
							c = {
								url: "/data/rptStaffjobStatsListExport/4?",
								startDate: e,
								endDate: o
							}, t.requestUrl = c.url + "startDate=" + c.startDate + "&endDate=" + c.endDate
						}
						return setTimeout(function() {
							$(".look").attr("data-toggle", "modal"), $(".look").attr("data-target", "#myModal")
						}, 3e3), a
					}
					t.tBodyData = []
				})
			}, t.getTableListByPagination = function(e) {
				t.activePageNo = e.currentPage, t.paginationObj.currentPage = e.currentPage, t.paginationObj.pageSize = e.pageSize, i.initTableList()
			}, i.init()
		},
		i = function(t, a) {
			var o = "总接待会话";
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(n) {
				for (var r, i = t ? t : [], s = i.length, c = [], l = [], u = 0, d = null; s > u; u++) d = i[u], c.push(d.coordinate), l.push(d.attriValue);
				n = n, r = [{
					domID: "worklist-admain",
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: c
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}人次",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: a ? a : o,
							type: "line",
							data: l,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(r, n)
			})
		},
		s = function(e, o, n, r, s) {
			a.getRptStaffjobStatsByStaffId({
				startDate: e,
				endDate: o,
				attriName: r,
				staffId: n
			}).then(function(e) {
				if (t.worklistData = e.item, "" != e.items) $("#worklist-admain").empty(), i(e.items, s);
				else {
					var a = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
					$("#worklist-admain").empty().append(a)
				}
			})
		};
	a.QueryOnlineGroupListByCompanyId().then(function(e) {
		"000000" == e.retCode && (t.GroupsData = e.item)
	}), r(t.shortStartTime, t.shortEndTime, t.groupId), t.selectGroup = function(e, a) {
		t.groupId = "", t.groupId = a ? a : "", t.groupName = e
	}, t.OnavgReceiveTime = function(e, a) {
		t.uname = e, t.staffId = a;
		var o = "总接待会话",
			n = "sessionCount";
		t.shortTwoStartTime = t.shortStartTime, t.shortTwoEndTime = t.shortEndTime, t.dateTwoType = t.dateType, s(t.shortTwoStartTime, t.shortTwoEndTime, a, n, o)
	}, t.queryDetail = function() {
		var e = t.dateTwoType;
		switch (e) {
			case "今天":
				t.shortTwoStartTime = o(0), t.shortTwoEndTime = o(0);
				break;
			case "昨天":
				t.shortTwoStartTime = o(-1), t.shortTwoEndTime = o(-1);
				break;
			case "过去7天":
				t.shortTwoStartTime = o(-7), t.shortTwoEndTime = o(-1);
				break;
			case "过去30天":
				t.shortTwoStartTime = o(-30), t.shortTwoEndTime = o(-1);
				break;
			default:
				var a = t.startDateType,
					n = t.endDateType,
					r = a.replace("年", "-"),
					i = r.replace("月", "-");
				t.shortTwoStartTime = i.replace("日", "");
				var c = n.replace("年", "-"),
					l = c.replace("月", "-");
				t.shortTwoEndTime = l.replace("日", "")
		}
		t.oderisActive = 0;
		var u = "总接待会话",
			d = "sessionCount";
		s(t.shortTwoStartTime, t.shortTwoEndTime, t.staffId, d, u)
	}, t.sessionCount = function() {
		var e = "总接待会话",
			a = "sessionCount";
		s(t.shortTwoStartTime, t.shortTwoEndTime, t.staffId, a, e)
	}, t.oneself = function() {
		var e = "独立接待会话",
			a = "oneself";
		s(t.shortTwoStartTime, t.shortTwoEndTime, t.staffId, a, e)
	}, t.rollIn = function() {
		var e = "转入会话",
			a = "rollIn";
		s(t.shortTwoStartTime, t.shortTwoEndTime, t.staffId, a, e)
	}, t.rollOut = function() {
		var e = "转出会话",
			a = "rollOut";
		s(t.shortTwoStartTime, t.shortTwoEndTime, t.staffId, a, e)
	}
}]).controller("SatisfactionCtrl", ["$rootScope", "$scope", "StatisticsServ", "DialogServ", "DownloadFileServ", function(e, t, a, o, n) {
	t.menuBar.activeItem = "5004";
	var r, i = !1;
	t.isActive = 0, t.endisActive = 0, t.MENDisActive = 1, t.oderisActive = 0, t.primary = 0, t.isDisplay = !0, t.dateType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1;
	var s = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = s(0), t.shortEndTime = s(0);
	var c = !1,
		l = "问题数",
		u = "平均分",
		d = "solved",
		p = "avgScore",
		m = "Madmain",
		g = "endMlistData";
	a.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, $("._option_start_m").change(function() {
		var e = $("._option_start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_start_day option").eq(29).hide(), $("._option_start_day option").eq(30).hide()) : ($("._option_start_day option").eq(29).show(), "04月" == e ? $("._option_start_day option").eq(30).hide() : $("._option_start_day option").eq(30).show()), $("._option_start_day").val("01日")
	}), $("._option_end_m").change(function() {
		var e = $("._option_end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_end_day option").eq(29).hide(), $("._option_end_day option").eq(30).hide()) : ($("._option_end_day option").eq(29).show(), "04月" == e ? $("._option_end_day option").eq(30).hide() : $("._option_end_day option").eq(30).show()), $("._option_end_day").val("01日")
	}), t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._option_start_y option:selected").text(),
			a = $("._option_start_m option:selected").text(),
			o = $("._option_start_day option:selected").text(),
			n = $("._option_end_y option:selected").text(),
			r = $("._option_end_m option:selected").text(),
			i = $("._option_end_day option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, t.exportExcel = function() {
		var e = n(t);
		if (!i) {
			i = !0, r = setTimeout(function() {
				i = !1
			}, 500);
			var o = e.getQueryParam(t.requestUrl);
			a.RptSatisfactionStatsExport(o).then(function(t) {
				e.show(t)
			})
		}
	}, t.queryByTimeAndSource = function() {
		var e = t.dateType;
		switch (e) {
			case "今天":
				t.shortStartTime = s(0), t.shortEndTime = s(0);
				break;
			case "昨天":
				t.shortStartTime = s(-1), t.shortEndTime = s(-1);
				break;
			case "过去7天":
				t.shortStartTime = s(-7), t.shortEndTime = s(-1);
				break;
			case "过去30天":
				t.shortStartTime = s(-30), t.shortEndTime = s(-1);
				break;
			default:
				var a = t.startDateType,
					o = t.endDateType,
					n = a.replace("年", "-"),
					r = n.replace("月", "-");
				t.shortStartTime = r.replace("日", "");
				var i = o.replace("年", "-"),
					f = i.replace("月", "-");
				t.shortEndTime = f.replace("日", "")
		}
		t.isActive = 0, t.MENDisActive = 1, h(t.shortStartTime, t.shortEndTime, p, m, u), y(t.shortStartTime, t.shortEndTime, d, g, l), S(t.shortStartTime, t.shortEndTime, c)
	};
	var f = function() {
			t.totalItems = {}, t.activePageSize = {}, t.pageCount = {}, t.activePageNo = {}, t.content = {}, t.itemNum = {}, t.activePageSize = 10, t.activePageNo = 1
		},
		v = function(t, a, o) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(n) {
				for (var r, i = t ? t : [], s = i.length, c = [], l = [], u = 0, d = null; s > u; u++) d = i[u], c.push(d.coordinate), l.push("0" == d.attriValue ? d.attriValue : d.attriValue.length > 3 ? Math.round(10 * d.attriValue) / 10 : d.attriValue);
				n = n, r = [{
					domID: a,
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: c
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: o,
							type: "line",
							data: l,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(r, n)
			})
		},
		h = function(e, o, n, r, i) {
			a.chatRecordtServiceContent({
				startDate: e,
				endDate: o,
				attriName: n
			}).then(function(e) {
				if ("0" == e.retCode) {
					if ("" != e.items) $("#Madmain").empty(), v(e.items, r, i);
					else {
						var a = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
						$("#Madmain").empty().append(a)
					}
					t.Mlist = e.item
				}
			})
		},
		y = function(e, o, n, r, i) {
			a.endchatRecordtServiceContent({
				startDate: e,
				endDate: o,
				attriName: n
			}).then(function(e) {
				if ("0" == e.retCode) {
					if (t.endMlist = e.item, t.endMlist.resolveRate <= 0) t.endMlist.resolveRate = 0;
					else if (1 == t.endMlist.resolveRate) {
						var a = t.endMlist.resolveRate;
						t.endMlist.resolveRate = 100 * a + "%"
					} else {
						var o = t.endMlist.resolveRate.toFixed(2);
						t.endMlist.resolveRate = o.substring(2, 4) + "%"
					}
					if ("" != e.items) $("#endMlistData").empty(), v(e.items, r, i);
					else {
						var n = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
						$("#endMlistData").empty().append(n)
					}
				}
			})
		},
		S = function(e, o, n) {
			f();
			var r = {};
			r.init = function() {
				r.initPagination(), r.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount ? e.totalCount : "", t.paginationObj.config.isInit = !0
				})
			}, r.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, r.initTableList = function(r) {
				return r = r ? r : {}, a.getQueryEvaluation({
					startDate: e,
					endDate: o,
					isRobot: n,
					page: r.pageNo || t.paginationObj.currentPage || t.activePageNo,
					size: r.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(a) {
					t.totalItems = a.totalCount, t.activePageSize = a.pageSize, t.pageCount = a.pageCount, t.activePageNo = a.pageNo, t.saftBodyData = a.items && a.items.length ? a.items : [];
					var r;
					return r = {
						url: "/data/rptSatisfactionStatsExport/4?",
						startDate: e,
						endDate: o,
						isRobot: n
					}, t.requestUrl = r.url + "startDate=" + r.startDate + "&endDate=" + r.endDate + "&isRobot=" + r.isRobot, a
				})
			}, t.getTableListByPagination = function(e) {
				t.activePageNo = e.currentPage, t.paginationObj.currentPage = e.currentPage, t.paginationObj.pageSize = e.pageSize, r.initTableList()
			}, r.init()
		};
	h(t.shortStartTime, t.shortEndTime, p, m, u), y(t.shortStartTime, t.shortEndTime, d, g, l), S(t.shortStartTime, t.shortEndTime, c), t.avgScore = function() {
		var e = "avgScore";
		h(t.shortStartTime, t.shortEndTime, e, m, u)
	}, t.good = function() {
		var e = "good",
			a = "好评数";
		h(t.shortStartTime, t.shortEndTime, e, m, a)
	}, t.middle = function() {
		var e = "middle",
			a = "中评数";
		h(t.shortStartTime, t.shortEndTime, e, m, a)
	}, t.bad = function() {
		var e = "bad",
			a = "差评";
		h(t.shortStartTime, t.shortEndTime, e, m, a)
	}, t.solved = function() {
		var e = "solved",
			a = "问题数";
		y(t.shortStartTime, t.shortEndTime, e, g, a)
	}, t.notSolved = function() {
		var e = "notSolved",
			a = "问题数";
		y(t.shortStartTime, t.shortEndTime, e, g, a)
	}, t.isRobot = 0, t.humanServiceData = function() {
		var e = !1;
		t.isRobot = 0, S(t.shortStartTime, t.shortEndTime, e)
	}, t.robotServiceData = function() {
		var e = !0;
		t.isRobot = 1, S(t.shortStartTime, t.shortEndTime, e)
	}, t.checkTagAndRemark = function(e, a) {
		var n = null;
		t.modalDomData = {
			title: "评价内容",
			tagInfo: e && e.length > 0 ? e : "空",
			remarkText: a && a.length > 0 ? a : "空"
		}, n = o.modal({
			scope: t,
			templateUrl: "views/public/dialog-modal-comment-detail.html"
		}), n.$promise.then(n.show)
	}
}]).controller("robotReplyServiceCtrl", ["$rootScope", "$scope", "StatisticsServ", "RepositoryServ", "zcGlobal", function(e, t, a, o, n) {
	t.menuBar.activeItem = "5005", t.isActive = 0, t.isDisplay = !0, t.dateType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1, t.userSourceOpt = "用户来源", t.allSourceOpt = "所有来源", t.desktopWebOpt = "桌面网站", t.mobileWebsiteOpt = "移动网站", t.WeChatOpt = "微信", t.appOpt = "APP";
	var r = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = r(0), t.shortEndTime = r(0), t.source = "", a.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, t.exportBtnEnter = function() {
		t.exportBtnState = !0
	}, t.exportBtnLeave = function() {
		t.exportBtnState = !1
	}, t.exportBtnEnterTwo = function() {
		t.exportBtnStateTwo = !0
	}, t.exportBtnLeaveTwo = function() {
		t.exportBtnStateTwo = !1
	}, t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._option_start_y option:selected").text(),
			a = $("._option_start_m option:selected").text(),
			o = $("._option_start_day option:selected").text(),
			n = $("._option_end_y option:selected").text(),
			r = $("._option_end_m option:selected").text(),
			i = $("._option_end_day option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, $("._option_start_m").change(function() {
		var e = $("._option_start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_start_day option").eq(29).hide(), $("._option_start_day option").eq(30).hide()) : ($("._option_start_day option").eq(29).show(), "04月" == e ? $("._option_start_day option").eq(30).hide() : $("._option_start_day option").eq(30).show()), $("._option_start_day").val("01日")
	}), $("._option_end_m").change(function() {
		var e = $("._option_end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_end_day option").eq(29).hide(), $("._option_end_day option").eq(30).hide()) : ($("._option_end_day option").eq(29).show(), "04月" == e ? $("._option_end_day option").eq(30).hide() : $("._option_end_day option").eq(30).show()), $("._option_end_day").val("01日")
	}), t.SelectSourceOpt = function(e) {
		t.userSourceOpt = e
	};
	var i = "answerCount";
	t.queryByTimeAndSource = function() {
		var e = t.dateType,
			a = t.userSourceOpt;
		switch (t.source = "", e) {
			case "今天":
				t.shortStartTime = r(0), t.shortEndTime = r(0);
				break;
			case "昨天":
				t.shortStartTime = r(-1), t.shortEndTime = r(-1);
				break;
			case "过去7天":
				t.shortStartTime = r(-7), t.shortEndTime = r(-1);
				break;
			case "过去30天":
				t.shortStartTime = r(-30), t.shortEndTime = r(-1);
				break;
			default:
				var o = t.startDateType,
					n = t.endDateType,
					s = o.replace("年", "-"),
					d = s.replace("月", "-");
				t.shortStartTime = d.replace("日", "");
				var p = n.replace("年", "-"),
					m = p.replace("月", "-");
				t.shortEndTime = m.replace("日", "")
		}
		switch (a) {
			case "用户来源":
				t.source = "";
				break;
			case "桌面网站":
				t.source = "0";
				break;
			case "移动网站":
				t.source = "4";
				break;
			case "微信":
				t.source = "1";
				break;
			case "APP":
				t.source = "2"
		}
		t.isActive = 0, c(t.shortStartTime, t.shortEndTime, t.source, i, ""), u("-1", "", t.shortStartTime, t.shortEndTime, t.source), $(".childCategory-list a").removeClass("active").first().addClass("active"), l()
	};
	var s = function(t, a, o) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(n) {
				for (var r, i = t ? t : [], s = i.length, c = [], l = [], u = 0, d = null; s > u; u++) d = i[u], c.push(d.coordinate), l.push(d.attriValue);
				n = n, r = [{
					domID: "admain",
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: c
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: a ? a : o,
							type: "line",
							data: l,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(r, n)
			})
		},
		c = function(e, o, n, r, i) {
			if ("" != n) var c = {
				startDate: e,
				endDate: o,
				source: n,
				attriName: r
			};
			else var c = {
				startDate: e,
				endDate: o,
				attriName: r
			};
			a.askrobotServiceContent(c).then(function(a) {
				t.listBodyData = a.item ? a.item : "";
				var c = a.item && a.item.answerCount_ch ? a.item.answerCount_ch : "0";
				if ("" != a.items) $("#admain").empty(), s(a.items, i, c);
				else {
					var l = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
					$("#admain").empty().append(l)
				}
				if ("" != n) {
					var u;
					u = {
						url: "/data/rptRobotAnswerStatsListExport/4?",
						startDate: e,
						endDate: o,
						source: n,
						SessionName: r
					}, t.requestUrl = u.url + "startDate=" + u.startDate + "&endDate=" + u.endDate + "&source=" + u.source + "&attriName=" + u.SessionName
				} else {
					var u;
					u = {
						url: "/data/rptRobotAnswerStatsListExport/4?",
						startDate: e,
						endDate: o,
						SessionName: r
					}, t.requestUrl = u.url + "startDate=" + u.startDate + "&endDate=" + u.endDate + "&attriName=" + u.SessionName
				}
			})
		},
		l = function() {
			if (t.categoryObj.questionTypeId = "-1", t.categoryObj.questionTypeName = "全部", t.categoryObj.typeLevel = 0, "" != t.source) var e = {
				questionTypeId: "-1",
				pageNo: p.pageNo,
				pageSize: p.pagerSize,
				startDate: t.shortStartTime,
				endDate: t.shortEndTime,
				source: t.source
			};
			else var e = {
				questionTypeId: "-1",
				pageNo: p.pageNo,
				pageSize: p.pagerSize,
				startDate: t.shortStartTime,
				endDate: t.shortEndTime
			};
			t.questionTypeid = "-1", u(), h(e).then(function(e) {
				e && (t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0)
			})
		},
		u = function(e, a, o, n, r) {
			var i;
			i = {
				questionTypeid: "undefined" == e ? "-1" : e,
				keyWords: a ? a : "",
				startDate: t.shortStartTime,
				endDate: t.shortEndTime,
				source: r ? r : ""
			};
			var s;
			s = {
				url: "/kb/exportDocListForRobot/4?"
			}, "" != i.source ? t.businessIssuesUrl = s.url + "startDate=" + i.startDate + "&endDate=" + i.endDate + "&source=" + i.source + "&questionTypeId=" + i.questionTypeid + "&keyWords=" + i.keyWords : t.businessIssuesUrl = s.url + "startDate=" + i.startDate + "&endDate=" + i.endDate + "&questionTypeId=" + i.questionTypeid + "&keyWords=" + i.keyWords
		},
		d = !1,
		p = {
			questionTypeId: "-1",
			keyWords: "",
			pageNo: 1,
			pagerSize: 10,
			startDate: t.shortStartTime,
			endDate: t.shortEndTime,
			source: t.source
		},
		m = function() {
			t.formData = {
				keyWords: p.keyWords,
				questionTypeId: p.questionTypeId,
				pageNo: 1,
				pagerSize: 10,
				startDate: p.startDate,
				endDate: p.endDate,
				source: p.source
			}, t.questionTypeid = p.questionTypeId
		},
		g = function() {
			t.totalItems = {}, t.activePageSize = {}, t.activePageNo = {}, t.activePageNo = 1, t.activePageSize = 10
		},
		f = function() {
			t.paginationObj = {
				config: {
					isInit: !1,
					totalItems: 0,
					pageSize: p.pagerSize,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: !0,
					callBack: null
				}
			}
		},
		v = function() {
			t.categoryObj = {
				config: {
					isInit: !0,
					isShowCount: !1,
					interfaceName: "kb/queryGroupList",
					isAutoCallback: !0,
					callBack: null
				}
			}
		},
		h = function(e) {
			if (e = e ? e : {}, "" != t.source) var a = {
				questionTypeId: e.questionTypeId || t.categoryObj.questionTypeId || p.questionTypeId,
				keyWords: d ? e.keyWords || t.formData.keyWords || p.keyWords : p.keyWords,
				pageNo: e.pageNo || t.paginationObj.currentPage || p.pageNo,
				pagerSize: e.pagerSize || t.paginationObj.pageSize || p.pagerSize,
				startDate: e.startDate || t.shortStartTime || p.startDate,
				endDate: e.endDate || t.shortEndTime || p.endDate,
				source: e.source || t.source || p.source
			};
			else var a = {
				questionTypeId: e.questionTypeId || t.categoryObj.questionTypeId || p.questionTypeId,
				keyWords: d ? e.keyWords || t.formData.keyWords || p.keyWords : p.keyWords,
				pageNo: e.pageNo || t.paginationObj.currentPage || p.pageNo,
				pagerSize: e.pagerSize || t.paginationObj.pageSize || p.pagerSize,
				startDate: e.startDate || t.shortStartTime || p.startDate,
				endDate: e.endDate || t.shortEndTime || p.endDate
			};
			return t.questionTypeid = e.questionTypeId || t.categoryObj.questionTypeId || p.questionTypeId, u(a.questionTypeId, a.keyWords, a.startDate, a.endDate, a.source), o.getPagerDocListForRobot(a).then(function(e) {
				return e.retCode !== n.retCodeList.success ? !1 : (t.tableBodyData = {
					list: e.items
				}, t.totalItems = e.totalCount, t.activePageSize = a.pagerSize, t.activePageNo = a.pageNo, t.paginationObj.currentPage = 1, e)
			})
		},
		y = function() {
			m(), g(), f(), v()
		};
	c(t.shortStartTime, t.shortEndTime, t.source, i, ""), u("-1", "", t.shortStartTime, t.shortEndTime, t.source), t.answerCount = function(e) {
		c(t.shortStartTime, t.shortEndTime, t.source, i, e)
	}, t.greetingCount = function(e) {
		var a = "greetingCount";
		c(t.shortStartTime, t.shortEndTime, t.source, a, e)
	}, t.directlyCount = function(e) {
		var a = "directlyCount";
		c(t.shortStartTime, t.shortEndTime, t.source, a, e)
	}, t.apprehendCount = function(e) {
		var a = "apprehendCount";
		c(t.shortStartTime, t.shortEndTime, t.source, a, e)
	}, t.guideCount = function(e) {
		var a = "guideCount";
		c(t.shortStartTime, t.shortEndTime, t.source, a, e)
	}, t.unknownCount = function(e) {
		var a = "unknownCount";
		c(t.shortStartTime, t.shortEndTime, t.source, a, e)
	}, t.getTableListByCategory = function(e, a, o, n) {
		if ($(".childCategory-list:first a").hasClass("active") && $(".childCategory-list:first a").removeClass("active"), t.categoryObj.questionTypeId = e.questionTypeId, t.categoryObj.questionTypeName = e.questionTypeName, t.categoryObj.typeLevel = e.typeLevel, "" != n) var r = {
			questionTypeId: e.questionTypeId,
			pageNo: p.pageNo,
			pageSize: p.pagerSize,
			startDate: a,
			endDate: o,
			source: n
		};
		else var r = {
			questionTypeId: e.questionTypeId,
			pageNo: p.pageNo,
			pageSize: p.pagerSize,
			startDate: a,
			endDate: o
		};
		t.questionTypeid = e.questionTypeId, h(r).then(function(e) {
			e && (t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0)
		})
	}, t.getTableListByPagination = function(e) {
		t.paginationObj.currentPage = e.currentPage, t.paginationObj.pageSize = e.pageSize, t.questionTypeid = e.questionTypeId, h().then(function(e) {
			e && (t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0)
		})
	}, t.searchIssues = function(e) {
		13 === e || "click" === e ? (d = !0, h({
			pageNo: p.pageNo,
			pagerSize: p.pagerSize
		}).then(function(e) {
			e && (t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0)
		})) : d = !1
	}, y()
}]), 
angular.module("Sobot4.C")
.controller("ComponentsCtrl", ["$scope", "ComponentsServ", function(e, t) {
	t.getMenuBar().then(function(t) {
		e.menuBar = t
	})
}])
.controller("ComponentsListCtrl", ["$scope", "ComponentsServ", function(e, t) {
	t.getList().then(function(t) {
		e.listData = t
	}), e.checkboxObj = {
		isAllChecked: !1,
		isSingleChecked: [],
		hasCheckedLen: 0,
		allChecked: function() {
			e.checkboxObj.isAllChecked = !e.checkboxObj.isAllChecked;
			for (var t = 0, a = e.checkboxObj.isSingleChecked.length; a > t; t++) e.checkboxObj.isSingleChecked[t] = e.checkboxObj.isAllChecked
		},
		singleChecked: function(t) {
			e.checkboxObj.isSingleChecked[t] = !e.checkboxObj.isSingleChecked[t], e.checkboxObj.hasCheckedLen > -1 ? e.checkboxObj.isSingleChecked[t] ? e.checkboxObj.hasCheckedLen++ : e.checkboxObj.hasCheckedLen-- : "", e.checkboxObj.hasCheckedLen === e.listData.list.body.length ? e.checkboxObj.isAllChecked = !0 : e.checkboxObj.isAllChecked = !1
		}
	}
}]), 
angular.module("Sobot4.C")
.controller("CreateWorkOrderCtrl", ["$scope", "$state", "CreateWorkOrderServ", "$rootScope", "LoginServ", "$window", "zcGlobal", "WorkOrderCenterServ", "Uuid", "TabServ", "Upload", "DialogServ", "GetEditorServ", 
	function(e, t, a, o, n, r, i, s, c, l, u, d, p) {
	function m() {
		o.userInfo = {}, n.getUserInfo().then(function(e) {
			if ("000000" == e.retCode) {
				var t = e.item;
				for (var n in t) o.userInfo[n] = t[n];
				o.userInfo[i.TempID] = r.sessionStorage[i.TempID], a.queryServiceGroupList({
					companyId: o.userInfo.companyId
				}).then(function(e) {
					"000000" == e.retCode ? o.queryServiceGroupListAll = e.items : o.queryServiceGroupListAll = [], o.queryServiceGroupListAll.push({
						groupName: "不选择客服组",
						groupId: "nev390"
					})
				}), a.queryServiceList({
					companyId: o.userInfo.companyId
				}).then(function(e) {
					"000000" == e.retCode ? o.queryServiceListAll = e.items : o.queryServiceListAll = [], o.queryServiceListAll.push({
						serviceName: "不选择客服",
						serviceId: "nev390"
					})
				})
			} else console.log("获取用户信息->" + e.retCode + " " + e.retMsg)
		}), a.queryDictDataList({
			dictCode: 1009
		}).then(function(e) {
			"000000" == e.retCode ? o.ticketStatusAll = e.items : o.ticketStatusAll = []
		}), a.queryDictDataList({
			dictCode: 1010
		}).then(function(e) {
			"000000" == e.retCode ? o.ticketTypeAll = e.items : o.ticketTypeAll = []
		}), a.queryDictDataList({
			dictCode: 1008
		}).then(function(e) {
			"000000" == e.retCode ? o.ticketLevelAll = e.items : o.ticketLevelAll = []
		}), s.getMenuBar({
			taskType: 4,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			"000000" == e.retCode ? o.loadAlreadyListAll = e.items : o.loadAlreadyListAll = []
		}), e.uploadFlie = function(t) {
			if (t)
				if (e.fileUploadObj.fileGroup.length < 5)
					if (t.size > 20971520) d.alert({
						title: "",
						content: "文件过大，请把文件限制在20M以内",
						placement: "top",
						type: "danger",
						show: !0
					});
					else {
						var a = c(),
							o = t.name.lastIndexOf("."),
							n = t.name.substring(o);
						n = n.toLowerCase();
						var r = /\.(png|jpg|jpeg|rar|zip|doc|docx|xls|xlsx|pdf)$/;
						r.test(n) || (n = ".other");
						var i = {
							fileName: t.name,
							fileSize: t.size,
							fileType: n,
							fileStatus: 2,
							fileNo: t.lastModified,
							fileUuid: a,
							progressPercentage: "上传中..."
						};
						e.fileUploadObj.fileGroup.push(i), u.upload({
							url: "/ws/uploadFile/4",
							data: {
								file: t,
								fileNumKey: a
							}
						}).then(function(t) {
							if ("000000" == t.data.retCode) {
								for (var o = !1, n = e.fileUploadObj.fileGroup, r = 0; r < n.length; r++) n[r].fileUuid == t.config.data.fileNumKey && (n[r].fileUrl = t.data.item.fileUrl, n[r].fileStatus = 4, n[r].progressPercentage = "100%", o = !0);
								if (o) {
									e.fileUploadObj.fileUrlGroup.push(t.data.item.fileUrl);
									var i = e.fileUploadObj.fileUrlGroup;
									e.formData.fileStr = i.join(";")
								}
							} else {
								d.alert({
									title: "" + t.data.retCode,
									content: t.data.retMsg || "错误",
									placement: "top",
									type: "warning",
									show: !0
								});
								for (var n = e.fileUploadObj.fileGroup, r = 0; r < n.length; r++) n[r].fileUuid == a && (n[r].fileStatus = 1)
							}
						}, function(t) {
							d.alert({
								title: "" + t.data.retCode,
								content: t.statusText || "错误",
								placement: "top",
								type: "warning",
								show: !0
							});
							for (var o = e.fileUploadObj.fileGroup, n = 0; n < o.length; n++) o[n].fileUuid == a && (o[n].fileStatus = 1)
						}, function(e) {
							parseInt(100 * e.loaded / e.total)
						})
					}
			else d.alert({
				title: "错误",
				content: "已达最大上传数量",
				placement: "top",
				type: "warning",
				show: !0
			})
		}, e.ueditorConfig = {
			toolbars: [
				["source", "link", "unlink", "bold", "italic", "underline", "forecolor", "fontsize"]
			],
			initialFrameHeight: 200,
			initialFrameWidth: 750,
			zIndex: 0,
			maximumWords: 12e3,
			autoHeightEnabled: !1,
			enableContextMenu: !0,
			contextMenu: [{
				label: "全选",
				cmdName: "selectall"
			}, {
				label: "复制(Ctrl + c)",
				cmdName: "copy"
			}, {
				label: "粘贴(Ctrl + v)",
				cmdName: "paste"
			}],
			wordCount: !1,
			elementPathEnabled: !1
		}, e.formData = {}, e.viewData = {}, e.formData.ticketStatus = 0, e.viewData.ticketStatus = "尚未受理", e.formData.ticketType = 9, e.viewData.ticketType = "其他", e.formData.ticketLevel = 0, e.viewData.ticketLevel = "低", e.fileUploadObj = {
			fileGroup: [],
			fileUrlGroup: []
		}, e.locking = !0
	}
	m(), e.formData.email = o.ordinaryUser && o.ordinaryUser.email ? o.ordinaryUser.email : "", e.newCommit = function() {
		if (e.locking !== !0) return void console.log("返回");
		for (var o = !0, n = e.fileUploadObj.fileGroup, r = 0; r < n.length; r++) 1 == n[r].fileStatus && (o = !1);
		if (o) {
			e.formData.fileStr || delete e.formData.fileStr;
			var i = /^\w+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-z0-9-]*)(?:[a-z0-9](?!-))(?:\.(?!-)))+[a-z]{2,}$/;
			e.formData.email && i.test(e.formData.email) ? e.formData.email.length > 40 ? d.alert({
				title: "",
				content: "邮箱地址过长",
				placement: "top",
				type: "warning",
				show: !0
			}) : e.formData.ticketTitle ? e.formData.ticketTitle.length > 30 ? d.alert({
				title: "",
				content: "请输入有效的标题，最多30个字符",
				placement: "top",
				type: "warning",
				show: !0
			}) : p.init(0) ? p.init(0).length > 1024 ? d.alert({
				title: "",
				content: "请输入有效的描述内容，最多1000个字符",
				placement: "top",
				type: "warning",
				show: !0
			}) : !i.test(e.formData.copyUser) && e.formData.copyUser ? d.alert({
				title: "错误",
				content: "抄送请填写有效的邮箱地址",
				placement: "top",
				type: "warning",
				show: !0
			}) : ("nev390" == e.formData.dealGroupId && (delete e.formData.dealGroupId, delete e.formData.dealGroupName), "nev390" == e.formData.dealUserId && (delete e.formData.dealUserId, delete e.formData.dealUserName), "nev390" == e.formData.ticketType && delete e.formData.ticketType, e.locking = !1, console.log(e.locking), e.formData.ticketContent = p.init(0), a.sendCreateInfo(e.formData).then(function(a) {
				"000000" == a.retCode ? l.open({
					title: e.formData.ticketTitle,
					ticketCode: a.item.ticketCode,
					toState: {
						name: "zc.back.myWorkOrder"
					},
					toParams: {
						userID: a.item.ticketId
					},
					fromState: t.current,
					fromParams: t.params
				}) : (e.locking = !0, d.alert({
					title: "失败",
					content: a.retMsg || "失败",
					placement: "top",
					type: "warning",
					show: !0
				}))
			})) : d.alert({
				title: "",
				content: "请输入有效的描述内容，最多1000个字符",
				placement: "top",
				type: "warning",
				show: !0
			}) : d.alert({
				title: "",
				content: "请输入有效的标题，最多30个字符",
				placement: "top",
				type: "warning",
				show: !0
			}) : d.alert({
				title: "",
				content: "请填写有效的邮箱地址",
				placement: "top",
				type: "warning",
				show: !0
			})
		} else d.alert({
			title: "",
			content: "请删除上传失败文件",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.getMyEmail = function() {
		var t = o.userInfo.serviceEmail;
		e.formData.email = t
	}, e.getCopyUser = function() {
		var t = o.userInfo.serviceEmail;
		e.formData.copyUser = t
	}, e.getQueryServiceGroupList = function(t) {
		var n = o.queryServiceGroupListAll;
		e.formData.dealGroupName = n[t].groupName, e.formData.dealGroupId = n[t].groupId, "nev390" == e.formData.dealGroupId ? a.queryServiceList({
			companyId: o.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? o.queryServiceListAll = e.items : o.queryServiceListAll = [], o.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})
		}) : (delete e.formData.dealUserId, delete e.formData.dealUserName, a.queryServiceList({
			groupId: n[t].groupId,
			companyId: o.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? o.queryServiceListAll = e.items : o.queryServiceListAll = [], o.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})
		}))
	}, e.getQueryServiceList = function(t) {
		var a = o.queryServiceListAll;
		e.formData.dealUserName = a[t].serviceName, e.formData.dealUserId = a[t].serviceId
	}, e.fastNewCommit = function(t, a) {
		e.getTicketStatus(t, a), e.newCommit()
	}, e.getTicketStatus = function(t, a) {
		e.formData.ticketStatus = t, e.viewData.ticketStatus = a
	}, e.getTicketType = function(t, a) {
		e.formData.ticketType = t, e.viewData.ticketType = a
	}, e.getTicketLevel = function(t, a) {
		e.formData.ticketLevel = t, e.viewData.ticketLevel = a
	}, e.getLoadAlreadyListAll = function(t) {
		var n = o.loadAlreadyListAll;
		e.loadAlreadyList = n[t].taskName, a.queryTicketReplyData({
			taskId: n[t].taskId
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.formData.replyType = t.item.replyType;
				var a = o.ticketStatusAll;
				e.formData.ticketStatus = t.item.ticketStatus, e.viewData.ticketStatus = a[t.item.ticketStatus].dictName, e.formData.ticketContent = t.item.replyContent, t.item.dealUserId && (e.formData.dealUserId = t.item.dealUserId, delete e.formData.dealGroupName, delete e.formData.dealGroupId, o.queryServiceListAll = []), t.item.dealUserName && (e.formData.dealUserName = t.item.dealUserName)
			} else console.log("获取预设工单每一项的设置值->" + t.retCode + " " + t.retMsg)
		})
	}, e.cancelUploadFile = function(t, a) {
		for (var o = e.fileUploadObj.fileGroup, n = 0; n < o.length; n++) o[n].fileUuid == a && (o.splice(n, 1), e.fileUploadObj.fileGroup = o)
	}, e.deleteUploadFile = function(t, o, n) {
		n ? a.deleteFile({
			fileNumKey: o,
			fileUrl: n
		}).then(function(t) {
			if ("000000" == t.retCode) {
				d.alert({
					title: "",
					content: "删除附件成功",
					placement: "top",
					type: "success",
					show: !0
				});
				for (var a = e.fileUploadObj.fileGroup, o = 0; o < a.length; o++) a[o].fileUrl == n && (a.splice(o, 1), e.fileUploadObj.fileGroup = a);
				for (var r = e.fileUploadObj.fileUrlGroup, o = 0; o < r.length; o++) r[o] == n && (r.splice(o, 1), e.fileUploadObj.fileUrlGroup = r);
				e.fileUploadObj.fileUrlGroup ? e.formData.fileStr = e.fileUploadObj.fileUrlGroup.join(";") : e.formData.fileStr = ""
			} else d.alert({
				title: "",
				content: "删除附件失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : e.cancelUploadFile(t, o)
	}
}]), 
angular.module("Sobot4.C").controller("FindPwdCtrl", ["$rootScope", "$scope", "$state", "$window", "FindPwdServ", "Uuid", 
	function(e, t, a, o, n, r) {
	t.goRegister = function() {
		location.href = "/console/register"
	}, t.goLogin = function() {
		a.go("login")
	}, t.findFirst = !0, t.findTwo = !1, t.findThree = !1, t.errorState = !1, t.emailState = 0, t.yzmState = 0, t.flag = !0, t.checkEmail = function() {
		var e = t.findEmail || "",
			a = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		"" == e ? (t.retError = "请输入您的邮箱", t.errorState = !0, t.emailState = 1) : !a.test(e) || e.length > 40 ? (t.retError = "邮箱格式不正确，请重新输入", t.errorState = !0, t.emailState = 1) : (t.retError = "", t.errorState = !1, n.getCheckEmail({
			loginUser: e
		}).then(function(e) {
			"000000" != e.retCode ? (t.retError = e.retMsg || "请检查您的邮箱是否正确或已注册", t.errorState = !0, t.emailState = 1) : (t.phoneNumber = e.item, t.retError = "", t.emailState = 2, t.errorState = !1)
		}))
	}, t.sss = {}, t.sss.randk = r(), t.getYzmCode = function() {
		t.sss.randk = r()
	}, t.findpwdFirst = function() {
		t.retError = "", t.errorState = !1;
		var e = t.imgYzm || "";
		"" == e ? (t.retError = "请输入图形验证码", t.errorState = !0) : (t.retError = "", t.errorState = !1, n.getFindPwdFirst({
			loginUser: t.findEmail,
			randomCode: e,
			randomKey: t.sss.randk
		}).then(function(e) {
			t.retError = "", t.errorState = !1,
				"000000" != e.retCode ? ("100023" === e.retCode && (t.yzmState = 1), t.retError = e.retMsg || "由于系统繁忙,麻烦您重新操作", t.errorState = !0) : (t.retError = "", t.errorState = !1, t.yzmState = 2, t.findFirst = !1, t.findTwo = !0, t.phoneNo = e.item.phoneNo, t.serviceEmail = e.item.serviceEmail)
		}))
	}, t.clearErorMsg = function() {
		t.retError = "", t.errorState = !1
	}, t.clearErorMsgPwd = function() {
		t.retError = "", t.errorState = !1
	}, t.getSmsCode = function() {
		var e = t.phoneNumber || "";
		"" != e ? (t.retError = "", t.errorState = !1, t.flag && n.getSmsRandomCode({
			phoneNo: e,
			loginUser: t.serviceEmail,
			randomKey: t.radKey
		}).then(function(e) {
			if ("000000" != e.retCode) t.retError = e.retMsg ? e.retMsg : "系统错误，稍后点击重新发送", t.errorState = !0;
			else {
				t.retError = "", t.errorState = !1;
				var a = 60;
				$(".msg_btn").html('<span class="set_time" style="color:#1CB3B5;font-size:18px;" >' + a + "</span>秒后重新获取"), window.send_code_limit_time = setInterval(function() {
					return parseInt($(".msg_btn").text()) > 1 ? ($(".msg_btn").html('<span style="color:#1CB3B5;font-size:18px;" >' + --a + "</span>秒后重新获取").show(), t.flag = !1, t.flag) : (clearInterval(window.send_code_limit_time), $(".msg_btn").text("重新发送"), t.flag = !0, t.flag)
				}, 1e3)
			}
		})) : (t.retError = "系统错误", t.errorState = !0)
	}, t.findpwdTwo = function() {
		var e = t.smsYzm || "";
		"" == e ? (t.retError = "请输入短信验证码", t.errorState = !0) : (t.retError = "", t.errorState = !1, n.getCheckSmsRandomCode({
			phoneNo: t.phoneNumber || "",
			loginUser: t.serviceEmail,
			randomKey: t.radKey,
			randomCode: e
		}).then(function(a) {
			"000000" != a.retCode ? (t.retError = a.retMsg ? a.retMsg : "系统错误，稍后重新操作", t.errorState = !0) : (t.retError = "", t.errorState = !1, t.findTwo = !1, t.findThree = !0, t.serviceEmail = a.item.loginUser, t.phoneNo = a.item.phoneNo, t.randomCode = e)
		}))
	}, t.checkPwd = function() {
		var e = t.finPwd || "",
			a = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*()_+<>?.,]{8,20}$/;
		e ? a.test(e) ? (t.retError = "", t.errorState = !1) : (t.retError = "密码应为8~20位英文、数字或符号组合", t.errorState = !0) : (t.retError = "请输入新密码", t.errorState = !0)
	}, t.submitNewPwd = function() {
		t.retError = "", t.errorState = !1;
		var e = t.findPwdAgain || "",
			o = t.finPwd || "",
			r = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*()_+<>?.,]{8,20}$/;
		o ? r.test(o) ? o != e ? (t.retError = "两次密码输入不一致，请重新输入", t.errorState = !0) : (t.retError = "", t.errorState = !1, n.getSetServiceNewPwd({
			loginUser: t.serviceEmail || "",
			phoneNo: t.phoneNo || "",
			randomCode: t.randomCode || "",
			loginPwd: o,
			confirmPwd: e
		}).then(function(e) {
			"000000" != e.retCode ? (t.retError = e.retMsg ? e.retMsg : "设置密码失败,请重新操作", t.errorState = !0) : (t.retError = "", t.errorState = !1, setTimeout(function() {
				a.go("login")
			}, 5e3))
		})) : (t.retError = "密码应为8~20位英文、数字或符号组合", t.errorState = !0) : (t.retError = "请输入新密码", t.errorState = !0)
	}, $("._stop_enter").keydown(function() {
		return 13 == event.keyCode ? !1 : void 0
	})
}]), angular.module("Sobot4.C").controller("HelpCenterCtrl", ["$rootScope", function(e) {
	e.companyInfo = {}
}]).controller("HelpCenterLoginCtrl", ["$rootScope", "$scope", "$state", "$window", "AuthServ", "CookieServ", "$location", "zcGlobal", "HelpCenterServ", function(e, t, a, o, n, r, i, s, c) {
	t.loginshowpwd = !1, t.loginshowmail = !1, t.emailshow = !1, t.pwdshow = !1;
	var l = function() {
		var e = t.loginUser || "",
			a = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		return "" == e ? (t.emailtext = "请输入有效邮箱地址", t.emailshow = !0, !1) : !a.test(e) || e.length > 40 ? (t.emailtext = "请输入有效邮箱地址", t.emailshow = !0, !1) : (t.loginshowmail = !0, t.emailtext = "", c.UserCheckEmail({
			loginUser: e
		}).then(function(e) {
			"000000" != e.retCode ? (t.emailtext = e.retMsg || "请检查您的邮箱是否正确", t.emailshow = !0, t.loginshowmail = !1) : (t.loginshowmail = !0, t.emailshow = !1)
		}), void 0)
	};
	t.checkLoginEmail = function() {
		l()
	}, t.checkLoginPwd = function() {
		var e = t.loginPwd.replace(/[ ]/g, "");
		"" == e ? (t.pwdtext = "请您输入注册密码", t.pwdshow = !0) : (t.loginshowpwd = !0, t.pwdtext = "", t.pwdshow = !1)
	}, t.clearErrorEmailTip = function() {
		t.loginshowmail = !1
	}, t.clearErrorPwdTip = function() {
		t.loginshowpwd = !1
	}, t.goFindPwd = function() {
		a.go("helpCenter.forgetPwd")
	}, t.helplogin = function() {
		var n = t.loginUser || "",
			r = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		return "" == n ? (t.emailtext = "请输入有效邮箱地址", t.emailshow = !0, !1) : !r.test(n) || n.length > 40 ? (t.emailtext = "请输入有效邮箱地址", t.emailshow = !0, !1) : (t.loginshowmail = !0, t.emailtext = "", c.UserCheckEmail({
			loginUser: n
		}).then(function(r) {
			"000000" != r.retCode ? (t.emailtext = r.retMsg || "请检查您的邮箱是否正确", t.emailshow = !0, t.loginshowmail = !1) : (t.loginshowmail = !0, t.emailshow = !1, c.helpLogin({
				loginUser: n,
				loginPwd: t.loginPwd || ""
			}).then(function(n) {
				var r = {
					retCode: n.retCode
				};
				r[s.TempID] = n.item, e.userInfo = r, r && "000000" === r.retCode && r[s.TempID] ? (t.loginshowpwd = !0, t.emailshow = !1, c.getCustomerDataInfo().then(function(t) {
					e.companyInfo = t.item
				}), a.go("helpCenter.myWorkOrder"), o.sessionStorage[s.TempID] = r[s.TempID], t.pwdtext = "") : (t.loginshowpwd = !1, t.pwdtext = n.retMsg ? n.retMsg : "系统忙碌，请稍候...", t.pwdshow = !0)
			}))
		}), void 0)
	}
}]).controller("HelpCenterForgetPwdCtrl", ["$rootScope", "$scope", "$state", "$window", "Uuid", "AuthServ", "CookieServ", "$location", "zcGlobal", "HelpCenterServ", "DialogServ", function(e, t, a, o, n, r, i, s, c, l, u) {
	var d = function() {
			var e = t.findEmail || "",
				a = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			"" == e ? (t.emailtext = "请输入您的邮箱", t.emailshow = !0) : !a.test(e) || e.length > 40 ? (t.emailtext = "邮箱格式不正确，请重新输入", t.emailshow = !0) : (t.emailshow = !1, t.loginshowmail = !0, l.UserCheckEmail({
				loginUser: e
			}).then(function(e) {
				"000000" != e.retCode ? (t.emailtext = e.retMsg || "请检查您的邮箱是否正确", t.emailshow = !0, t.loginshowmail = !1) : (t.loginshowmail = !0, t.emailshow = !1)
			}))
		},
		p = function() {
			var e = t.imgYzm || "";
			e ? (t.pwdtext = "", t.loginshowpwd = !1, t.pwdshow = !1) : (t.pwdtext = "请输入图形验证码", t.pwdshow = !0)
		};
	t.loginshowpwd = !1, t.loginshowmail = !1, t.emailshow = !1, t.pwdshow = !1, t.sss = {}, t.sss.randk = n(), t.getYzmCode = function() {
		t.sss.randk = n()
	}, t.goLogin = function() {
		a.go("helpCenter.login")
	}, t.checkEmail = function() {
		d()
	}, t.checkYzm = function() {
		p()
	}, t.helpFindPwd = function() {
		var e = t.findEmail || "",
			o = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		e ? !o.test(e) || e.length > 40 ? (t.emailtext = "邮箱格式不正确，请重新输入", t.emailshow = !0) : (t.emailshow = !1, l.UserCheckEmail({
			loginUser: e
		}).then(function(o) {
			if ("000000" != o.retCode) t.emailtext = o.retMsg || "请检查您的邮箱是否正确", t.emailshow = !0, t.loginshowmail = !1;
			else {
				t.loginshowmail = !0, t.emailshow = !1;
				var n = t.imgYzm || "";
				n ? (t.pwdtext = "", t.pwdshow = !1, t.loginshowpwd = !1, l.getCustomerPwdBack({
					loginUser: e,
					randomKey: t.sss.randk,
					randomCode: n
				}).then(function(e) {
					var o, n;
					"000000" != e.retCode ? (t.pwdtext = e.retMsg || "请检查您的邮箱是否正确", t.pwdshow = !0, t.loginshowpwd = !1) : (t.pwdtext = "", t.pwdshow = !1, t.loginshowpwd = !0, o = {
						content: "您的登录密码已发送至指定地址，请查收邮件，重新登录。页面将在 5 秒后跳转至 登录页面",
						type: "success"
					}, setTimeout(function() {
						a.go("helpCenter.login")
					}, 5e3)), n = u.alert(o), n.$promise.then(n.show)
				})) : (t.pwdtext = "请输入图形验证码", t.pwdshow = !0)
			}
		})) : (t.emailtext = "请输入您的邮箱", t.emailshow = !0)
	}
}]).controller("HelpCenterOrderCtrl", ["$rootScope", "$scope", "$state", "$window", "AuthServ", "CookieServ", "$location", "zcGlobal", "HelpCenterServ", "TabServ", function(e, t, a, o, n, r, i, s, c, l) {
	var u = function() {
			t.totalItems = {}, t.activePageSize = {}, t.pageCount = {}, t.activePageNo = {}, t.content = {}, t.itemNum = {}, t.activePageSize = 10, t.activePageNo = 1
		},
		d = function() {
			u();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, c.helpWorkList({
					pageNo: e.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: e.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(e) {
					return t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.helptBodyData = e.items, e
				})
			}, t.getTableListByPagination = function(a) {
				t.activePageNo = a.currentPage, t.paginationObj.currentPage = a.currentPage, t.paginationObj.pageSize = a.pageSize, e.initTableList()
			}, e.init()
		};
	c.getCustomerDataInfo().then(function(t) {
		e.companyInfo = t.item
	}), d(), t.start = function(e) {
		var a = t.helptBodyData;
		l.open({
			toState: {
				name: "helpCenter.myWorkOrderDetail"
			},
			toParams: {
				workOrderID: a[e].ticketId
			}
		})
	}
}]).controller("HelpCenterOrderDetailCtrl", ["$rootScope", "$scope", "$state", "$window", "AuthServ", "Upload", "Uuid", "CookieServ", "$location", "zcGlobal", "HelpCenterServ", "TabServ", "$stateParams", "DialogServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m) {
	t.MyWorkOrder = function() {
		a.go("helpCenter.myWorkOrder")
	}, u.getCustomerDataInfo().then(function(t) {
		e.companyInfo = t.item
	}), u.userWorkDetail({
		ticketId: p.workOrderID
	}).then(function(e) {
		t.tBaselist = e.item
	}), u.queryTicketReplyByCustomerList({
		ticketId: p.workOrderID
	}).then(function(e) {
		t.tBodyDatalist = e.items
	}), t.ueditorConfig = {
		toolbars: [
			["source", "link", "unlink", "bold", "italic", "underline", "forecolor"]
		],
		initialFrameHeight: 150,
		initialFrameWidth: 500,
		zIndex: 0,
		maximumWords: 12e3,
		autoHeightEnabled: !1,
		enableContextMenu: !0,
		contextMenu: [{
			label: "全选",
			cmdName: "selectall"
		}, {
			label: "清空文档",
			cmdName: "cleardoc",
			exec: function() {
				confirm(lang.confirmclear) && this.execCommand("cleardoc")
			}
		}, {
			label: "复制(Ctrl + c)",
			cmdName: "copy"
		}, {
			label: "粘贴(Ctrl + v)",
			cmdName: "paste"
		}],
		wordCount: !1,
		elementPathEnabled: !1
	}, t.submitReplyContent = function(e) {
		t.ctrlScope = t;
		var a, n = $($("iframe[id*='ueditor_']")[0].contentWindow.document.body).html(),
			r = t.ulfile && t.ulfile.fileUrl ? t.ulfile.fileUrl : "";
		a = 1 == t.repCkbox ? "3" : "", "" != n ? u.addCustomerReplyInfo({
			ticketId: e,
			replyContent: n,
			fileStr: r,
			ticketStatus: a
		}).then(function(e) {
			"000000" == e.retCode && o.location.reload()
		}) : alert("提交内容不能为空！")
	}, t.uploadProfiles = function(e) {
		e && r.upload({
			url: "/ws/customerUploadFile/" + l.ServVersion,
			data: {
				file: e,
				fileNumKey: i()
			}
		}).then(function(e) {
			var a, o, n = e.data;
			n && n.retCode && n.retCode === l.retCodeList.success ? (a = {
				content: n.retMsg || "上传文件成功",
				type: "success"
			}, t.ulfile = n.item, t.fileName = e.config.data.file.name) : (a = {
				scope: t,
				content: n.retMsg || "上传文件失败",
				type: "warning",
				duration: !1
			}, t.alertDomData = {
				collapse: !0,
				triggerCollapse: !1,
				failMsg: n.items
			}), o = m.alert(a), o.$promise.then(o.show)
		})
	}, t.deleteFile = function(e, a) {
		u.DeleteFile({
			fileUrl: e,
			fileNumKey: a
		}).then(function(e) {
			"000000" == e.retCode && (t.ulfile.fileUrl = "", t.fileName = "")
		})
	}
}]), angular.module("Sobot4.C").controller("HomeCtrl", ["$rootScope", "$scope", "HomeServ", "$state", "$timeout", function(e, t, a, o, n) {
	var r = function() {
		a.getMenuBar().then(function(a) {
			if (a) {
				var o = e.userAuthInfo ? e.userAuthInfo.info.cusRoleId : null,
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
						for (var d, p = 0, m = a.menuList.length; m > p; p++) d = a.menuList[p], d.name === c && s.push(d)
					}
					a.menuList = s, t.menuBar = a
				} else n(function() {
					e.authManagement(), r()
				}, 2e3)
			}
		}), 
		e.homeMenuActive = {}, e.homeMenuActive.activeItem = "2001"
	};
	r(), t.reloadPage = function(t) {
		e.homeMenuActive.activeItem = t
	}
}]).controller("HomeServicesGeneralCtrl", ["$rootScope", "$scope", "HomeServ", "$interval", "$http", function(e, t, a, o, n) {
	e.homeMenuActive.activeItem = "2003", t.isActive = 0;
	var r = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = r(0), t.shortEndTime = r(0), t.source = "";
	var i = "total",
		s = function(t, a, o) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(n) {
				for (var r, i = t ? t : [], s = i.length, c = [], l = [], u = 0, d = null; s > u; u++) d = i[u], c.push(d.coordinate), l.push(d.attriValue);
				n = n, r = [{
					domID: "serviceEchat",
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: c
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: a ? a : o,
							type: "line",
							data: l,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(r, n)
			})
		},
		c = function() {
			a.getRealTimeData({}).then(function(e) {
				t.realTimeData = e, t.customerList = e.adminList
			})
		},
		l = function(e, o) {
			a.getHomeServicesGeneralContent({
				startDate: t.shortStartTime,
				endDate: t.shortEndTime,
				attriName: e
			}).then(function(e) {
				t.listBoxt = e.item ? e.item : "";
				var a = e.item && e.item.total_ch ? e.item.total_ch : "";
				if ("" != e.items) $("#serviceEchat").empty(), s(e.items, o, a);
				else {
					var n = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
					$("#serviceEchat").empty().append(n)
				}
			})
		};
	c(), l(i, "");
	var u = o(c, 5e3);
	t.$on("$destroy", function(e) {
		o.cancel(u)
	}), t.total = function(e) {
		l(i, e)
	}, t.robor = function(e) {
		var t = "robot";
		l(t, e)
	}, t.human = function(e) {
		var t = "human";
		l(t, e)
	}, t.queue = function(e) {
		var t = "queue";
		l(t, e)
	}, t.leaveInQueue = function(e) {
		var t = "leaveInQueue";
		l(t, e)
	}
}]).controller("myReceptionCtrl", ["$rootScope", "$scope", "HomeServ", "StatisticsServ", function(e, t, a, o) {
	e.homeMenuActive.activeItem = "2002", t.isActive = 0, t.isDisplay = !0, t.dateType = "今天", t.tadayNew = "今天", t.Yesterday = "昨天", t.pastSeventoday = "过去7天", t.pastThrtoday = "过去30天", t.CusShow = !1;
	var n = function(e) {
		var t = new Date;
		t.setDate(t.getDate() + e);
		var a = t.getFullYear(),
			o = t.getMonth() + 1,
			n = t.getDate();
		return 10 > o && (o = "0" + o), 10 > n && (n = "0" + n), a + "-" + o + "-" + n
	};
	t.shortStartTime = n(0), t.shortEndTime = n(0);
	var r = "sessionCount",
		i = "avgScore",
		s = "接待会话量",
		c = "平均满意度";
	o.CustomDateTime().then(function(e) {
		t.startDateYear = [], t.endDateYear = [];
		var a = (new Date).getFullYear();
		for (var o in e.startDate.startDateYear) e.startDate.startDateYear[o].YY <= a && t.startDateYear.push(e.startDate.startDateYear[o].YY);
		for (var n in e.endDate.endDateYear) e.endDate.endDateYear[n].YY <= a && t.endDateYear.push(e.endDate.endDateYear[n].YY);
		t.startDateMonth = [], t.endDateMonth = [];
		var r = (new Date).getMonth() + 1;
		for (var i in e.startDate.startDateMonth) e.startDate.startDateMonth[i].MM <= r && t.startDateMonth.push(e.startDate.startDateMonth[i].MM);
		for (var s in e.endDate.endDateMonth) e.endDate.endDateMonth[s].MM <= r && t.endDateMonth.push(e.endDate.endDateMonth[s].MM);
		t.startDateDay = e.startDate.startDateDay, t.endDateDay = e.endDate.endDateDay
	}), t.isShow = function() {
		t.isDisplay = !t.isDisplay, t.CusShow = !1
	}, t.toggle = function(e) {
		t.isDisplay = !t.isDisplay, t.dateType = e
	}, $("._option_start_m").change(function() {
		var e = $("._option_start_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_start_day option").eq(29).hide(), $("._option_start_day option").eq(30).hide()) : ($("._option_start_day option").eq(29).show(), "04月" == e ? $("._option_start_day option").eq(30).hide() : $("._option_start_day option").eq(30).show()), $("._option_start_day").val("01日")
	}), $("._option_end_m").change(function() {
		var e = $("._option_end_m option:selected").text().replace(/[ ]/g, "");
		"02月" == e ? ($("._option_end_day option").eq(29).hide(), $("._option_end_day option").eq(30).hide()) : ($("._option_end_day option").eq(29).show(), "04月" == e ? $("._option_end_day option").eq(30).hide() : $("._option_end_day option").eq(30).show()), $("._option_end_day").val("01日")
	}), t.isCustomDate = function() {
		0 == t.CusShow ? t.CusShow = !0 : t.CusShow = !1
	}, t.optionDate = function() {
		t.isDisplay = !t.isDisplay;
		var e = $("._option_start_y option:selected").text(),
			a = $("._option_start_m option:selected").text(),
			o = $("._option_start_day option:selected").text(),
			n = $("._option_end_y option:selected").text(),
			r = $("._option_end_m option:selected").text(),
			i = $("._option_end_day option:selected").text(),
			s = e + a + o,
			c = n + r + i;
		t.dateType = s + "至" + c, t.startDateType = s.replace(/[ ]/g, ""), t.endDateType = c.replace(/[ ]/g, "")
	}, t.queryByTimeAndSource = function() {
		var e = t.dateType;
		switch (e) {
			case "今天":
				t.shortStartTime = n(0), t.shortEndTime = n(0);
				break;
			case "昨天":
				t.shortStartTime = n(-1), t.shortEndTime = n(-1);
				break;
			case "过去7天":
				t.shortStartTime = n(-7), t.shortEndTime = n(-1);
				break;
			case "过去30天":
				t.shortStartTime = n(-30), t.shortEndTime = n(-1);
				break;
			default:
				var a = t.startDateType,
					o = t.endDateType,
					i = a.replace("年", "-"),
					c = i.replace("月", "-");
				t.shortStartTime = c.replace("日", "");
				var l = o.replace("年", "-"),
					p = l.replace("月", "-");
				t.shortEndTime = p.replace("日", "")
		}
		t.isActive = 0, d(t.shortStartTime, t.shortEndTime, r, s), u(t.shortStartTime, t.shortEndTime)
	};
	var l = function(t, a) {
			require.config({
				paths: {
					echarts: "scripts/plugs/echarts"
				}
			}), require(["echarts", "echarts/chart/line"], function(o) {
				for (var n, r = t ? t : [], i = r.length, s = [], c = [], l = 0, u = null; i > l; l++)
					if (u = r[l], s.push(u.coordinate), 0 != u.attriValue) {
						var d = u.attriValue;
						c.push(d.substring(0, 4))
					} else c.push(u.attriValue);
				o = o, n = [{
					domID: "serviceEchat",
					option: {
						tooltip: {
							trigger: "axis"
						},
						calculable: !0,
						xAxis: [{
							type: "category",
							boundaryGap: !1,
							data: s
						}],
						yAxis: [{
							type: "value",
							axisLabel: {
								formatter: "{value}",
								textStyle: {
									axisLine: "red"
								}
							}
						}],
						series: [{
							name: a,
							type: "line",
							data: c,
							smooth: !0,
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#09aeb0"
									}
								}
							},
							markLine: {
								itemStyle: {
									normal: {
										lineStyle: {
											color: "#09aeb0"
										}
									}
								},
								data: []
							}
						}]
					}
				}], e.createChart(n, o)
			})
		},
		u = function(o, n) {
			a.getRptStaffjobStatsDetailByStaffId({
				startDate: o,
				endDate: n,
				staffId: e.userInfo.serviceId
			}).then(function(e) {
				if (t.myReceptionData = e.item, 0 != t.myReceptionData.avgScore) {
					var a = t.myReceptionData.avgScore.toFixed(2);
					t.myReceptionData.avgScore = a.substring(0, 4)
				} else t.myReceptionData.avgScore = "0"
			})
		},
		d = function(t, o, n, r) {
			a.getHomeCustomerServiceContent({
				startDate: t,
				endDate: o,
				staffId: e.userInfo.serviceId,
				attriName: n
			}).then(function(e) {
				if ("" != e.items) $("#serviceEchat").empty(), l(e.items, r);
				else {
					var t = '<div style="text-align: center;line-height: 400px;font-size: 16px;">暂无数据</div>';
					$("#serviceEchat").empty().append(t)
				}
			})
		};
	u(t.shortStartTime, t.shortEndTime), d(t.shortStartTime, t.shortEndTime, r, s), t.sessionCount = function() {
		d(t.shortStartTime, t.shortEndTime, r, s)
	}, t.avgScore = function() {
		d(t.shortStartTime, t.shortEndTime, i, c)
	}
}]).controller("HomeWorkOrderCtrl", ["$scope", "$rootScope", "HomeServ", "WorkOrderCenterServ", "TabServ", "Uuid", "$state", function(e, t, a, o, n, r, i) {
	e.homeMenuActive.activeItem = "2001";
	var s = function() {
			t.totalItems = {}, t.activePageSize = {}, t.pageCount = {}, t.activePageNo = {}, t.content = {}, t.itemNum = {}, t.activePageSize = 10, t.activePageNo = 1
		},
		c = function() {
			s();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, a.QueryTicketByServiceList({
					pageNo: e.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: e.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(e) {
					return t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.content = e.items, e
				})
			}, a.QueryTicketSummary().then(function(e) {
				t.contentNum = e.item
			}), t.getTableListByPagination = function(a) {
				t.activePageNo = a.currentPage, t.paginationObj.currentPage = a.currentPage, t.paginationObj.pageSize = a.pageSize, e.initTableList()
			}, e.init()
		},
		l = function() {
			s();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, a.QueryTicketByGroupList({
					pageNo: e.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: e.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(e) {
					return t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.content = e.items, e
				})
			}, a.QueryTicketSummary().then(function(e) {
				t.contentNum = e.item
			}), t.getTableListByPagination = function(a) {
				t.activePageNo = a.currentPage, t.paginationObj.currentPage = a.currentPage, t.paginationObj.pageSize = a.pageSize, e.initTableList()
			}, e.init()
		},
		u = function() {
			s();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, a.QueryTicketByGroupInitList({
					pageNo: e.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: e.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(e) {
					return t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.content = e.items, e
				})
			}, a.QueryTicketSummary().then(function(e) {
				t.contentNum = e.item
			}), t.getTableListByPagination = function(a) {
				t.activePageNo = a.currentPage, t.paginationObj.currentPage = a.currentPage, t.paginationObj.pageSize = a.pageSize, e.initTableList()
			}, e.init()
		},
		d = function() {
			s();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					t.paginationObj.config.totalItems = e.totalCount, t.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				t.paginationObj = {
					config: {
						isInit: !1,
						totalItems: t.totalItems,
						pageSize: t.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, a.QueryTicketByInitList({
					pageNo: e.pageNo || t.paginationObj.currentPage || t.activePageNo,
					pageSize: e.pageSize || t.paginationObj.pageSize || t.activePageSize
				}).then(function(e) {
					return t.totalItems = e.totalCount, t.activePageSize = e.pageSize, t.pageCount = e.pageCount, t.activePageNo = e.pageNo, t.content = e.items, e
				})
			}, a.QueryTicketSummary().then(function(e) {
				t.contentNum = e.item
			}), t.getTableListByPagination = function(a) {
				t.activePageNo = a.currentPage, t.paginationObj.currentPage = a.currentPage, t.paginationObj.pageSize = a.pageSize, e.initTableList()
			}, e.init()
		};
	t.listBoxTitle = "我处理中的工单", t.isWorkActive = 0, c(), t.myWorkOrder = function() {
		c()
	}, t.myGroupWorkOrder = function() {
		l()
	}, t.myGroupNoOrder = function() {
		u()
	}, t.allNoOrder = function() {
		d()
	}, t.getViewWorkOrderDetail = function(e) {
		n.open({
			title: e.ticketTitle,
			ticketCode: e.ticketCode,
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.ticketId
			},
			fromState: i.current,
			fromParams: i.params
		})
	}
}]), 

angular.module("Sobot4.C").controller("LoginCtrl", 
	["$rootScope", "$scope", "$state", "$window", "LoginServ", 
	"AuthServ", "CookieServ", "$location", "zcGlobal", 
	"$timeout", "TabServ", "StorageServ", 
function(e, t, a, o, n, 
	r, i, s, c, 
	l, u, d) {
	t.errorLoginState = !1, 
	t.goRegister = function() {
		location.href = "/console/register"
	}, 
	t.reloadLogin = function() {
		a.reload("login")
	}, 
	t.goFindPwd = function() {
		a.go("findpwd")
	}, 
	t.checkLoginEmail = function() {
		var e = t.loginUser || "",
			a = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		"" == e ? (t.loginError = "请输入您的邮箱", t.errorLoginState = !0) : a.test(e) ? (t.loginError = "", t.errorLoginState = !1) : (t.loginError = "邮箱格式不正确，请重新输入", t.errorLoginState = !0)
	}, 
	t.checkLoginPwd = function() {
		var e = t.loginPwd ? t.loginPwd : "";
		"" === $.trim(e) ? (t.retError = "请输入登录密码", t.errorLoginState = !0) : (t.loginError = "", t.errorLoginState = !1)
	}, 
	t.clearErrorEmailTip = function() {
		t.loginError = "", t.errorLoginState = !1
	}, 
	t.login = function() {
		l(function() {
			var i = t.loginUser || "",
				s = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			if ("" == i) t.loginError = "请输入您的邮箱", t.errorLoginState = !0;
			else if (s.test(i)) {
				t.loginError = "", t.errorLoginState = !1;
				var l = t.loginPwd ? t.loginPwd : "";
				"" == $.trim(l) ? (t.loginError = "请输入登录密码", t.errorLoginState = !0) : (t.loginError = "", t.errorLoginState = !1, n.login({
					loginUser: i,
					loginPwd: l
				}).then(function(n) {
					var i = {
						retCode: n.retCode
					};
					i[c.TempID] = n.item, e.userInfo = i, i && "000000" === i.retCode && i[c.TempID] ? (t.loginError = "", t.errorLoginState = !1, r.isLogined = !0, o.sessionStorage[c.TempID] = i[c.TempID], e.getUserInfo(), a.go(e.defaultPage)) : (t.loginError = n.retMsg || "登录失败,请重新登录", t.errorLoginState = !0)
				}, function(e) {
					r.isLogined = !1
				}))
			} else t.loginError = "邮箱格式不正确，请重新输入", t.errorLoginState = !0
		}, 500)
	}, t.logout = function() {
		n.logOut({
			loginUser: e.userInfo.serviceEmail
		}).then(function(e) {}), r.isLogined = !1, o.sessionStorage.removeItem(c.TempID), d.clear(), u.clear(), i.del(), a.go("login"), o.location.reload()
	}
}]), angular.module("Sobot4.C").controller("MainCtrl", [
"$rootScope", "$scope", "$cookies", "$state", "LoginServ", 
"CookieServ", "$location", "zcGlobal", "CreateWorkOrderServ", 
"TabServ", "WorkOrderCenterServ", "$window", "Uuid", "AuthServ",
 function(e, t, a, o, n, 
 	r, i, s, c, 
 	l, u, d, p, m) {
	function g(e, t, a) {
		var o = new Date;
		o.setDate(o.getDate() + a), document.cookie = e + "=" + t + "; path=/; expires=" + o.toGMTString()
	}

	function f(e) {
		for (var t = document.cookie.split("; "), a = 0; a < t.length; a++)
			if (t[a].split("=")[0] == e) return t[a].split("=")[1]
	}
	e.getUserInfo = function() {
		e.userInfo = {}, n.getUserInfo().then(function(a) {
			if ("000000" == a.retCode) {
				var o = a.item;
				for (var n in o) e.userInfo[n] = o[n];
				e.userInfo[s.TempID] = d.sessionStorage[s.TempID], e.authManagement();
				var r = function() {
					var a = f("loginStatus");
					t.loginStatus = a || 1, t.loginUrl = "/chat/webchat/toChat.action?uid=" + e.userInfo.serviceId + "&status=" + t.loginStatus
				};
				r()
			}
		})
	}, e.activeTaskIdAll = "301", e.doGroupAll = [], t.newWorkOrder = function() {}, t.changeLoginStatus = function(a) {
		t.loginStatus = a, g("loginStatus", a, 1), t.loginUrl = "/chat/webchat/toChat.action?uid=" + e.userInfo.serviceId + "&status=" + t.loginStatus
	}, t.tabTrigger = function(e) {
		l.trigger(e)
	}, t.tabClose = function(e) {
		l.close(e)
	}, window.addEventListener("resize", function() {
		for (var t in e.myChartObj) e.myChartObj[t].resize()
	}), e.myChartObj = {}, e.createChart = function(t, a) {
		for (var o = 0, n = null, r = null, i = null; o < t.length; o++)
			if (n = t[o], r = document.getElementById(n.domID), r && a && (i = a.init(r), i.setOption(n.option), e.myChartObj[n.domID] = i, e.myChartObj[n.domID].isCreated = !0), 4 == n.domID.length) return !1
	}, e.safeApply = function(e) {
		var t = this.$root.$$phase;
		"$apply" == t || "$digest" == t ? e && "function" == typeof e && e() : this.$apply(e)
	}, e.isObjectValueEqual = function(e, t) {
		var a = Object.getOwnPropertyNames(e),
			o = Object.getOwnPropertyNames(t);
		if (a.length != o.length) return !1;
		for (var n = 0; n < a.length; n++) {
			var r = a[n];
			if (e[r] !== t[r]) return !1
		}
		return !0
	}, e.authManagement = function(t) {
		d.sessionStorage.getItem(s.TempID) && m.getUserAuthInfo().then(function(t) {
			return t.retCode !== s.retCodeList.success ? !1 : void(e.userAuthInfo = {
				info: t.item || null
			})
		})
	}, d.sessionStorage[s.TempID] && e.getUserInfo(), e.$on("userIntercepted", function(e, t, a) {
		o.go("login")
	})
}]), angular.module("Sobot4.C").controller("MsgCtrl", ["$rootScope", "$scope", "$state", "$window", "$stateParams", "MsgServ", function(e, t, a, o, n, r) {
	console.log(a), console.log(n), t.message = "正在加载..如长时间未响应，请联系客服", n.activeId && r.sendMsg({
		activeId: n.activeId || a.params.activeId || ""
	}).then(function(e) {
		console.log(e), "000000" == e.retCode ? t.message = "激活成功" : t.message = e.retMsg
	})
}]), angular.module("Sobot4.C").controller("MyWorkOrderCtrl", ["$scope", "$rootScope", "$state", "CreateWorkOrderServ", "WorkOrderCenterServ", "TabServ", "$stateParams", "$window", "zcGlobal", "LoginServ", "Uuid", "Upload", "DialogServ", "GetEditorServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m) {
	function g() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, e.formData = {}, e.viewData = {}, e.requestTime = "", e.fileUploadObj = {
			fileGroup: [],
			fileUrlGroup: []
		}, e.formDataShadow = {}, e.btn1Active = 1, t.userInfo = {}, l.getUserInfo().then(function(r) {
			if ("000000" == r.retCode) {
				e.role.cusRoleId = r.item.cusRoleId;
				var l = r.item;
				for (var u in l) t.userInfo[u] = l[u];
				t.userInfo[c.TempID] = s.sessionStorage[c.TempID], n.queryTicketById({
					ticketId: i.userID
				}).then(function(n) {
					if ("000000" == n.retCode) {
						n.item.getTicketTime < n.item.updateTime && p.alert({
							title: "",
							content: "该工单已经被编辑，请重新打开",
							placement: "top",
							type: "warning",
							show: !0
						});
						var r = n.item;
						if (r) {
							for (var i in r) switch (i) {
								case "ticketCode":
									e.viewData.ticketCode = r.ticketCode;
									break;
								case "startName":
									e.viewData.startName = r.startName;
									break;
								case "createTime":
									e.viewData.createTime = r.createTime;
									break;
								case "ticketFrom":
									e.viewData.ticketFrom = r.ticketFrom;
									break;
								case "updateTime":
									e.viewData.updateTime = r.updateTime
							}
							e.formData.replyType = 1, e.requestTime = r.getTicketTime, e.formData.ticketTitle = r.ticketTitle, o.queryDictDataList({
								dictCode: 1009
							}).then(function(o) {
								if ("000000" == o.retCode) {
									if (a++, t.ticketStatusAll = o.items, r.ticketStatus >= 0) {
										e.formData.ticketStatus = r.ticketStatus + "";
										var n = t.ticketStatusAll;
										e.viewData.ticketStatus = n[r.ticketStatus].dictName
									}
								} else console.log("获取工单状态下拉列表->" + o.retCode + " " + o.retMsg);
								e.formDataShadow = angular.copy(e.formData)
							}), o.queryDictDataList({
								dictCode: 1010
							}).then(function(o) {
								if ("000000" == o.retCode) {
									if (a++, t.ticketTypeAll = o.items, r.ticketType >= 0) {
										e.formData.ticketType = r.ticketType + "";
										for (var n = t.ticketTypeAll, i = 0; i < n.length; i++) n[i].dictValue == e.formData.ticketType && (e.viewData.ticketType = n[i].dictName)
									}
								} else t.ticketTypeAll = [];
								e.formDataShadow = angular.copy(e.formData)
							}), o.queryDictDataList({
								dictCode: 1008
							}).then(function(o) {
								if ("000000" == o.retCode) {
									if (a++, t.ticketLevelAll = o.items, r.ticketLevel >= 0) {
										e.formData.ticketLevel = r.ticketLevel + "";
										var n = t.ticketLevelAll;
										e.viewData.ticketLevel = n[r.ticketLevel].dictName
									}
								} else t.ticketLevelAll = [];
								e.formDataShadow = angular.copy(e.formData)
							}), r.copyUser && (e.formData.copyUser = r.copyUser), r.dealUserId && (e.formData.dealUserId = r.dealUserId), r.dealUserName && (e.formData.dealUserName = r.dealUserName), r.dealGroupName && (e.formData.dealGroupName = r.dealGroupName), r.dealGroupId ? (e.formData.dealGroupId = r.dealGroupId, o.queryServiceList({
								groupId: r.dealGroupId,
								companyId: t.userInfo.companyId
							}).then(function(e) {
								"000000" == e.retCode ? (a++, t.queryServiceListAll = e.items) : t.queryServiceListAll = [], t.queryServiceListAll.push({
									serviceName: "不选择客服",
									serviceId: "nev390"
								})
							})) : o.queryServiceList({
								companyId: t.userInfo.companyId
							}).then(function(e) {
								"000000" == e.retCode ? (a++, t.queryServiceListAll = e.items) : t.queryServiceListAll = [], t.queryServiceListAll.push({
									serviceName: "不选择客服",
									serviceId: "nev390"
								})
							}), e.formDataShadow = angular.copy(e.formData)
						}
					} else console.log("获取当前工单信息->" + n.retCode + " " + n.retMsg)
				}), o.queryServiceGroupList({
					companyId: t.userInfo.companyId
				}).then(function(e) {
					"000000" == e.retCode ? (a++, t.queryServiceGroupListAll = e.items, t.queryServiceGroupListAll.push({
						groupName: "不选择客服组",
						groupId: "nev390"
					})) : t.queryServiceGroupListAll = []
				}), e.formData.replyType = 1, e.formData.ticketId = i.userID, e.formData.replyContent = "", e.formDataShadow = angular.copy(e.formData)
			} else p.alert({
				title: "",
				content: r.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), n.getMenuBar({
			taskType: 4,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			"000000" == e.retCode ? t.loadAlreadyListAll = e.items : console.log("获取预设工单下拉列表->" + e.retCode + " " + e.retMsg)
		}), e.uploadFlie = function(t) {
			if (t)
				if (e.fileUploadObj.fileGroup.length < 5)
					if (t.size > 20971520) p.alert({
						title: "错误",
						content: "文件超过单个文件最大上限20M",
						placement: "top",
						type: "warning",
						show: !0
					});
					else {
						var a = u(),
							o = t.name.lastIndexOf("."),
							n = t.name.substring(o);
						n = n.toLowerCase();
						var r = /\.(png|jpg|jpeg|rar|zip|doc|docx|xls|xlsx|pdf)$/;
						r.test(n) || (n = ".other");
						var i = {
							fileName: t.name,
							fileSize: t.size,
							fileType: n,
							fileStatus: 2,
							fileNo: t.lastModified,
							fileUuid: a,
							progressPercentage: "上传中..."
						};
						e.fileUploadObj.fileGroup.push(i), d.upload({
							url: "/ws/uploadFile/4",
							data: {
								file: t,
								fileNumKey: a
							}
						}).then(function(t) {
							if ("000000" == t.data.retCode) {
								for (var o = !1, n = e.fileUploadObj.fileGroup, r = 0; r < n.length; r++) n[r].fileUuid == t.config.data.fileNumKey && (n[r].fileUrl = t.data.item.fileUrl, n[r].fileStatus = 4, n[r].progressPercentage = "100%", o = !0);
								if (o) {
									e.fileUploadObj.fileUrlGroup.push(t.data.item.fileUrl);
									var i = e.fileUploadObj.fileUrlGroup;
									e.formData.fileStr = i.join(";")
								}
							} else {
								p.alert({
									title: "" + t.data.retCode,
									content: t.data.retMsg || "错误",
									placement: "top",
									type: "warning",
									show: !0
								});
								for (var n = e.fileUploadObj.fileGroup, r = 0; r < n.length; r++) n[r].fileUuid == a && (n[r].fileStatus = 1)
							}
						}, function(t) {
							p.alert({
								title: "" + t.data.retCode,
								content: t.statusText || "错误",
								placement: "top",
								type: "warning",
								show: !0
							});
							for (var o = e.fileUploadObj.fileGroup, n = 0; n < o.length; n++) o[n].fileUuid == a && (o[n].fileStatus = 1)
						}, function(e) {
							parseInt(100 * e.loaded / e.total)
						})
					}
			else p.alert({
				title: "错误",
				content: "已达最大上传数量",
				placement: "top",
				type: "warning",
				show: !0
			})
		}, e.ueditorConfig = {
			toolbars: [
				["source", "link", "unlink", "bold", "italic", "underline", "forecolor", "fontsize"]
			],
			initialFrameHeight: 200,
			initialFrameWidth: 750,
			zIndex: 0,
			maximumWords: 12e3,
			autoHeightEnabled: !1,
			enableContextMenu: !0,
			contextMenu: [{
				label: "全选",
				cmdName: "selectall"
			}, {
				label: "复制(Ctrl + c)",
				cmdName: "copy"
			}, {
				label: "粘贴(Ctrl + v)",
				cmdName: "paste"
			}],
			wordCount: !1,
			elementPathEnabled: !1
		}, e.ticketFromFlag = !1, o.queryTicketReplyList({
			ticketId: i.userID
		}).then(function(t) {
			"000000" == t.retCode ? e.queryTicketReplyListInfo = t.items : console.log("获取客服回复列表->" + t.retCode + " " + t.retMsg)
		}), o.queryTicketAllEventList({
			ticketId: i.userID
		}).then(function(t) {
			if ("000000" == t.retCode) {
				for (var a = t.items, o = 0; o < a.length; o++) {
					var n = [];
					if (a[o].updateContent) {
						var r = JSON.parse(a[o].updateContent);
						for (var i in r) n.push({
							tit: i,
							cont: r[i]
						});
						a[o].newList = n
					}
				}
				e.queryTicketAllEventList = a
			} else console.log("获取操作历史记录->" + t.retCode + " " + t.retMsg)
		});
		var a = 0,
			m = setInterval(function() {
				5 == a && (clearInterval(m), r.autoSave({
					period: 50,
					data: {
						formData: e.formData,
						viewData: e.viewData,
						fileData: e.fileUploadObj
					}
				}, function(t) {
					t && (e.formData = t.formData, e.viewData = t.viewData, e.fileUploadObj = t.fileData)
				}))
			}, 100);
		e.requestUrl = "/ws/exportSingleTicketInfo/4?ticketId=" + i.userID, e.fileType = "xlsx", e.resMethod = "GET"
	}
	g(), e.addTicketReplyInfo = function() {
		for (var a = !0, n = e.fileUploadObj.fileGroup, i = 0; i < n.length; i++) 1 == n[i].fileStatus && (a = !1);
		if (a) {
			e.formData.fileStr || delete e.formData.fileStr;
			var c = /^\w+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-z0-9-]*)(?:[a-z0-9](?!-))(?:\.(?!-)))+[a-z]{2,}$/;
			if (m.init())
				if (m.init().length > 1024) p.alert({
					title: "",
					content: "请输入有效的描述内容，最多1000个字符",
					placement: "top",
					type: "warning",
					show: !0
				});
				else if (e.formData.ticketTitle)
				if (e.formData.ticketTitle.length > 30) p.alert({
					title: "错误",
					content: "请输入有效的工单标题，最多30个字符",
					placement: "top",
					type: "warning",
					show: !0
				});
				else if (!c.test(e.formData.copyUser) && e.formData.copyUser) p.alert({
				title: "错误",
				content: "抄送请填写有效的邮箱地址",
				placement: "top",
				type: "warning",
				show: !0
			});
			else {
				"nev390" == e.formData.dealGroupId && (delete e.formData.dealGroupId, delete e.formData.dealGroupName), "nev390" == e.formData.dealUserId && (delete e.formData.dealUserId, delete e.formData.dealUserName), "nev390" == e.formData.ticketType && delete e.formData.ticketType;
				var l = {};
				for (var u in e.formData) l[u] = e.formData[u];
				l.getTicketTime = e.requestTime, l.replyContent = m.init(), o.addTicketReplyInfo(l).then(function(e) {
					if ("000000" == e.retCode) {
						r.clearAutoSaveTask();
						var a = t.tabListObj.activeIndex,
							o = t.tabListObj.tabList[a];
						o.data = "", s.sessionStorage.setItem("tabListObj", JSON.stringify(t.tabListObj)), g(), p.alert({
							title: "编辑成功",
							content: "工单已更新",
							placement: "top",
							type: "success",
							show: !0
						})
					} else p.alert({
						title: "",
						content: e.retMsg || "错误",
						placement: "top",
						type: "warning",
						show: !0
					})
				})
			} else p.alert({
				title: "错误",
				content: "请输入有效的工单标题，最多30个字符",
				placement: "top",
				type: "warning",
				show: !0
			});
			else p.alert({
				title: "",
				content: "请输入回复内容",
				placement: "top",
				type: "warning",
				show: !0
			})
		} else p.alert({
			title: "",
			content: "请删除上传失败文件",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.deleteTicketReply = function(t) {
		o.deleteTicketReply({
			dealLogId: t,
			TicketId: i.userID
		}).then(function(t) {
			"000000" == t.retCode ? (p.alert({
				title: "成功",
				content: "删除回复内容",
				placement: "top",
				type: "success",
				show: !0
			}), o.queryTicketReplyList({
				ticketId: i.userID
			}).then(function(t) {
				"000000" == t.retCode ? e.queryTicketReplyListInfo = t.items : console.log("获取客服回复列表->" + t.retCode + " " + t.retMsg)
			}), o.queryTicketAllEventList({
				ticketId: i.userID
			}).then(function(t) {
				if ("000000" == t.retCode) {
					for (var a = t.items, o = 0; o < a.length; o++) {
						var n = [];
						if (a[o].updateContent) {
							var r = JSON.parse(a[o].updateContent);
							for (var i in r) n.push({
								tit: i,
								cont: r[i]
							});
							a[o].newList = n
						}
					}
					e.queryTicketAllEventList = a
				} else console.log("获取操作历史记录->" + t.retCode + " " + t.retMsg)
			})) : console.log("删除留言->" + t.retCode + " " + t.retMsg)
		})
	}, e.getCopyUser = function() {
		var a = t.userInfo.serviceEmail;
		e.formData.copyUser = a
	}, e.getQueryServiceGroupList = function(a) {
		var n = t.queryServiceGroupListAll;
		e.formData.dealGroupName = n[a].groupName, e.formData.dealGroupId = n[a].groupId, "nev390" == e.formData.dealGroupId ? o.queryServiceList({
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? t.queryServiceListAll = e.items : t.queryServiceListAll = [], t.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})
		}) : (delete e.formData.dealUserId, delete e.formData.dealUserName, o.queryServiceList({
			groupId: n[a].groupId,
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? t.queryServiceListAll = e.items : t.queryServiceListAll = [], t.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})
		}))
	}, e.getQueryServiceList = function(a) {
		var o = t.queryServiceListAll;
		e.formData.dealUserName = o[a].serviceName, e.formData.dealUserId = o[a].serviceId
	}, e.fastNewCommit = function(t, a) {
		e.getTicketStatus(t, a), e.addTicketReplyInfo()
	}, e.getTicketStatus = function(t, a) {
		e.formData.ticketStatus = t, e.viewData.ticketStatus = a
	}, e.getTicketType = function(t, a) {
		e.formData.ticketType = t, e.viewData.ticketType = a
	}, e.getTicketLevel = function(t, a) {
		e.formData.ticketLevel = t, e.viewData.ticketLevel = a
	}, e.getLoadAlreadyListAll = function(a) {
		var n = t.loadAlreadyListAll;
		e.loadAlreadyList = n[a].taskName, o.queryTicketReplyData({
			taskId: n[a].taskId
		}).then(function(a) {
			if ("000000" == a.retCode) {
				1 == e.userInfo.replyAuthFlag || (e.formData.replyType = a.item.replyType);
				var o = t.ticketStatusAll;
				e.formData.ticketStatus = a.item.ticketStatus, e.viewData.ticketStatus = o[a.item.ticketStatus].dictName, e.formData.replyContent = a.item.replyContent, a.item.dealUserId && (e.formData.dealUserId = a.item.dealUserId, delete e.formData.dealGroupName, delete e.formData.dealGroupId, t.queryServiceListAll = []), a.item.dealUserName && (e.formData.dealUserName = a.item.dealUserName)
			} else console.log("获取预设工单每一项的设置值->" + a.retCode + " " + a.retMsg)
		})
	}, e.deleteTicketById = function() {
		n.deleteWorkOrderContent({
			ticketIds: i.userID,
			ticketStatus: 98
		}).then(function(e) {
			if ("000000" == e.retCode)
				for (var a = i.userID, o = t.tabListObj.tabList, n = 0; n < o.length; n++) o[n].toParams.userID == a && (r.close(n), $(".modal-backdrop").remove());
			else console.log("删除工单->" + e.retCode + " " + e.retMsg)
		})
	}, e.cancelUploadFile = function(t, a) {
		for (var o = e.fileUploadObj.fileGroup, n = 0; n < o.length; n++) o[n].fileUuid == a && (o.splice(n, 1), e.fileUploadObj.fileGroup = o)
	}, e.deleteUploadFile = function(t, a, n) {
		n ? o.deleteFile({
			fileNumKey: a,
			fileUrl: n
		}).then(function(t) {
			if ("000000" == t.retCode) {
				p.alert({
					title: "",
					content: "删除附件成功",
					placement: "top",
					type: "success",
					show: !0
				});
				for (var a = e.fileUploadObj.fileGroup, o = 0; o < a.length; o++) a[o].fileUrl == n && (a.splice(o, 1), e.fileUploadObj.fileGroup = a);
				for (var r = e.fileUploadObj.fileUrlGroup, o = 0; o < r.length; o++) r[o] == n && (r.splice(o, 1), e.fileUploadObj.fileUrlGroup = r);
				e.fileUploadObj.fileUrlGroup ? e.formData.fileStr = e.fileUploadObj.fileUrlGroup.join(";") : e.formData.fileStr = ""
			} else p.alert({
				title: "",
				content: "删除附件失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : e.cancelUploadFile(t, a)
	}
}]), angular.module("Sobot4.C").controller("helpPwdCtrl", ["$rootScope", "$scope", "$state", "$window", "LoginServ", "AuthServ", "CookieServ", "$location", "zcGlobal", "HelpLoginServ", function(e, t, a, o, n, r, i, s, c, l) {
	t.loginshowpwd = !1, t.loginshowmail = !1, t.emailshow = !1, t.pwdshow = !1, t.checkLoginPwd = function() {
		var e = t.pwdUser || "",
			a = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
		"" == e ? (t.emailshow = !0, t.emailtext = "密码不可为空") : a.test(e) ? (t.loginshowmail = !0, t.emailtext = "") : (t.emailshow = !0, t.emailtext = "密码长度应为6~16个字符")
	}, t.clearErrorPwdTip = function() {
		t.loginshowmail = !1
	}, t.helpPwd = function() {
		l.CustomerPwd({
			confirmPwd: t.pwdUser || "",
			loginPwd: t.loginPwd || "",
			loginUser: "customer@sobot.com"
		}).then(function(n) {
			var r = {
				retCode: n.retCode
			};
			r[c.TempID] = n.item, e.userInfo = r;
			var i = t.pwdUser,
				s = t.loginPwd;
			i === s && i.length > 5 ? (a.go("help-olduser"), o.sessionStorage[c.TempID] = r[c.TempID]) : (t.loginshowpwd = !1, t.pwdtext = "两次填写的密码不一样", t.pwdshow = !0)
		})
	}
}]), angular.module("Sobot4.C").controller("RegisterCtrl", ["$rootScope", "$scope", "$state", "$window", "RegisterServ", "Uuid", "LoginServ", "StorageServ", "CookieServ", "zcGlobal", "TabServ", function(e, t, a, o, n, r, i, s, c, l, u) {
	function d(e) {
		for (var t = document.cookie.split("; "), a = 0; a < t.length; a++)
			if (t[a].split("=")[0] == e) return t[a].split("=")[1]
	}
	$(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), $(window).resize(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), t.regFirst = !0, t.regTwo = !1, t.errorState = !1, t.emailState = 0, t.yzmState = 0, t.dxyzmState = 0, t.pwdState = 0, t.nameState = 0, t.companyState = 0, t.helpDomainState = 0, t.errorMsgMap = [{
		code: "100047",
		value: "yzmState"
	}, {
		code: "100048",
		value: "dxyzmState"
	}, {
		code: "100045",
		value: "dxyzmState"
	}, {
		code: "100030",
		value: "pwdState"
	}], t.reloadRegister = function() {
		location.href = "/console/register"
	}, t.goLogin = function() {
		a.go("login")
	}, t.adv = "", t.flag = !0, t.checkPhoneNum = function() {
		var e = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/,
			a = t.phoneNum;
		a ? (t.retError = "", t.errorState = !1, e.test(a) ? (t.retError = "", t.errorState = !1, t.emailState = 2) : (t.retError = "请您输入正确的手机号", t.errorState = !0, t.emailState = 1)) : (t.retError = "请您输入手机号", t.errorState = !0, t.emailState = 1)
	}, t.checkPwd = function() {
		var e = t.regPwd,
			a = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*()_+<>?.,]{8,20}$/;
		e ? a.test(e) ? t.pwdState = 2 : (t.retError = "密码应为8~20位英文、数字或符号组合", t.errorState = !0, t.pwdState = 1) : (t.retError = "请您输入注册密码", t.errorState = !0, t.pwdState = 1)
	}, t.sss = {}, t.sss.randk = r(), t.getYzmCode = function() {
		t.sss.randk = r()
	}, t.getSmsCode = function() {
		var e = t.phoneNum ? t.phoneNum : "";
		"" != e ? (t.retError = "", t.errorState = !1, t.flag && n.getRegisterSendSms({
			phoneNo: e
		}).then(function(e) {
			if ("000000" != e.retCode) t.retError = e.retMsg ? e.retMsg : "系统错误，稍后点击重新发送", t.errorState = !0;
			else {
				t.retError = "", t.errorState = !1;
				var a = 60;
				$(".get_msg_phone, .msg_btn").html('<span class="set_time">' + a + "</span>秒后重新获取").css("color", "#a1a2a2"), window.send_code_limit_time = setInterval(function() {
					return parseInt($(".get_msg_phone, .msg_btn").text()) > 1 ? ($(".get_msg_phone, .msg_btn").html('<span class="set_time">' + --a + "</span>秒后重新获取"), t.flag = !1, t.flag) : (clearInterval(window.send_code_limit_time), $(".get_msg_phone, .msg_btn").text("重新发送").css("color", "#09aeb0"), t.flag = !0, t.flag)
				}, 1e3)
			}
		})) : (t.retError = "请检查一下您填写的手机号和验证码是否都正确", t.errorState = !0)
	}, t.register = function() {
		t.retError = "", t.errorState = !1;
		var e = $(".reg_checkbox[type='checkbox']").is(":checked");
		if (e) {
			t.retError = "", t.errorState = !1;
			var a = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/,
				o = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*()_+<>?.,]{8,20}$/,
				r = t.phoneNum ? t.phoneNum.replace(/[ ]/g, "") : "",
				i = t.imgYzm,
				s = t.smsYzm,
				c = t.regPwd;
			r ? a.test(r) ? i ? s ? c ? o.test(c) ? (t.retError = "", t.pwdState = 2, t.errorState = !1, n.getRegisterInfoCheck({
				phoneNo: r,
				randomCode: i,
				randomKey: t.sss.randk,
				registerSmsCode: s,
				servicePwd: c
			}).then(function(e) {
				var a = !1;
				if ("000000" != e.retCode) {
					t.retError = e.retMsg ? e.retMsg : "由于系统繁忙,麻烦您稍等重新注册", t.errorState = !0;
					for (var o in t.errorMsgMap) a ? t[t.errorMsgMap[o].value] = 0 : t.errorMsgMap[o].code !== e.retCode ? t[t.errorMsgMap[o].value] = 2 : (t[t.errorMsgMap[o].value] = 1, a = !0)
				} else {
					for (var o in t.errorMsgMap) t[t.errorMsgMap[o].value] = 0;
					t.emailState = 0, t.retError = "", t.errorState = !1, t.regFirst = !1, t.regTwo = !0, t.phoneNumber = e.item.phoneNo, t.registerKey = e.item.registerKey, t.regPwd = c
				}
			})) : (t.retError = "密码应为8~20位英文、数字或符号组合", t.errorState = !0, t.pwdState = 1) : (t.retError = "请您输入注册密码", t.errorState = !0, t.pwdState = 1) : (t.retError = "请您输入短信验证码", t.errorState = !0) : (t.retError = "请您输入验证码", t.errorState = !0, t.yzmState = 1) : (t.retError = "请您输入正确的手机号", t.errorState = !0) : (t.retError = "请您输入手机号", t.errorState = !0)
		} else t.retError = "请同意隐私条款，以注册智齿客服", t.errorState = !0
	}, t.clearErorMsg = function() {
		t.retError = "", t.errorState = !1
	}, t.clearErorMsgEmail = function() {
		t.retError = "", t.errorState = !1
	}, t.clearErorMsgHelp = function() {
		t.retError = "", t.errorState = !1
	}, t.checkName = function() {
		var e = t.regUserName,
			a = /^([a-zA-Z\u4E00-\u9FA5])+$/,
			o = !1;
		e ? e.length > 16 ? (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : a.test(e) ? (o = !0, t.errorState = !1, t.retError = "") : (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : (t.retError = "请输入您的姓名", t.errorState = !0), t.nameState = o ? 2 : 1
	}, t.checkEmail = function() {
		var e = t.regEmail ? t.regEmail : "",
			a = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
			o = !1;
		"" == e ? (t.retError = "请输入您的邮箱", t.errorState = !0) : !a.test(e) || e.length > 40 ? (t.retError = "邮箱格式不正确，请重新输入", t.errorState = !0) : (t.retError = "", t.errorState = !1, n.getRegisterEmailCheck({
			serviceEmail: t.regEmail ? t.regEmail : ""
		}).then(function(e) {
			"000000" != e.retCode ? (t.retError = e.retMsg ? e.retMsg : "请检查您的邮箱是否正确", t.errorState = !0) : (t.retError = "", t.errorState = !1, o = !0, t.emailState = o ? 2 : 1)
		})), t.emailState = o ? 2 : 1
	}, t.checkHelpDomain = function() {
		var e = t.regHelpDomain ? t.regHelpDomain : "",
			a = !1;
		"" == e ? (t.retError = "请输入您的企业域名", t.errorState = !0) : (t.retError = "", t.errorState = !1, n.getRegisterDomainCheck({
			secondDomain: t.regHelpDomain
		}).then(function(e) {
			"000000" != e.retCode ? (t.retError = e.retMsg ? e.retMsg : "企业域名错误", t.errorState = !0) : (t.retError = "", t.errorState = !1, a = !0, t.helpDomainState = a ? 2 : 1)
		})), t.helpDomainState = a ? 2 : 1
	}, t.checkCompanyName = function() {
		var e = t.regCompany,
			a = /^([a-zA-Z\u4E00-\u9FA5]|\\(|\\)|\\,|\\.|\\（|\\）)+$/,
			o = !1;
		e ? e.length > 60 ? (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : a.test(e) ? o = !0 : (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : (t.retError = "请输入您的公司名", t.errorState = !0), t.companyState = o ? 2 : 1
	}, t.regComplete = function() {
		var e = d("adv");
		e ? t.adv = e : t.adv = "", t.retError = "", t.errorState = !1;
		var r = t.phoneNumber ? t.phoneNumber : "",
			i = t.regUserName,
			p = t.regEmail,
			m = t.regHelpDomain,
			g = t.regCompany,
			f = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
			v = /^([a-zA-Z\u4E00-\u9FA5]|\\(|\\)|\\,|\\.|\\（|\\）)+$/,
			h = /^([a-zA-Z\u4E00-\u9FA5])+$/;
		return r || t.regPwd ? void(i ? i.length > 16 ? (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : h.test(i) ? p ? !f.test(p) || p.length > 40 ? (t.retError = "邮箱格式不正确，请重新输入", t.errorState = !0) : m ? g ? g.length > 60 ? (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : v.test(g) ? (t.retError = "", t.errorState = !1, n.getRegComplete({
			phoneNo: r,
			servicePwd: t.regPwd,
			serviceName: i,
			serviceEmail: p,
			secondDomain: m,
			companyName: g,
			unionCode: "000",
			registerKey: t.registerKey,
			adv: t.adv
		}).then(function(e) {
			t.retError = "", t.errorState = !1, "000000" != e.retCode ? (t.retError = e.retMsg ? e.retMsg : "注册失败,请重新注册", t.errorState = !0) : (t.retError = "", t.errorState = !1, o.sessionStorage.removeItem(l.TempID), s.clear(), u.clear(), c.del(), a.go("login"))
		})) : (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : (t.retError = "请输入您的公司名", t.errorState = !0) : (t.retError = "请输入您的企业域名", t.errorState = !0) : (t.retError = "请输入您的邮箱", t.errorState = !0) : (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : (t.retError = "请输入您的姓名", t.errorState = !0)) : !1
	}, t.regCompleteMobile = function() {
		var e = d("adv");
		e ? t.adv = e : t.adv = "", t.retError = "", t.errorState = !1;
		var r = t.phoneNumber ? t.phoneNumber : "",
			i = t.regUserName,
			p = t.regEmail,
			m = t.regHelpDomain,
			g = t.regCompany,
			f = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
			v = /^([a-zA-Z\u4E00-\u9FA5]|\\(|\\)|\\,|\\.|\\（|\\）)+$/,
			h = /^([a-zA-Z\u4E00-\u9FA5])+$/;
		return r || t.regPwd ? void(i ? i.length > 16 ? (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : h.test(i) ? p ? !f.test(p) || p.length > 40 ? (t.retError = "邮箱格式不正确，请重新输入", t.errorState = !0) : m ? g ? g.length > 60 ? (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : v.test(g) ? (t.retError = "", t.errorState = !1, console.log(r + "+" + i + "+" + m), n.getRegComplete({
			phoneNo: r,
			servicePwd: t.regPwd,
			serviceName: i,
			serviceEmail: p,
			secondDomain: m,
			companyName: g,
			unionCode: "000",
			registerKey: t.registerKey,
			adv: t.adv
		}).then(function(e) {
			t.retError = "", t.errorState = !1, "000000" != e.retCode ? (console.log("邮箱重复"), t.register()) : (t.retError = "", t.errorState = !1, o.sessionStorage.removeItem(l.TempID), s.clear(), u.clear(), c.del(), a.go("registerStatus"))
		})) : (t.retError = "请输入有效的公司名称,最多60个字符", t.errorState = !0) : (t.retError = "请输入您的公司名", t.errorState = !0) : (t.retError = "请输入您的企业域名", t.errorState = !0) : (t.retError = "请输入您的邮箱", t.errorState = !0) : (t.retError = "请输入有效的姓名，最多16个字符", t.errorState = !0) : (t.retError = "请输入您的姓名", t.errorState = !0)) : !1
	}
}]).controller("RegisterStatusCtrl", ["$rootScope", "$scope", "$state", "$window", "RegisterServ", "Uuid", "$stateParams", "$timeout", "$location", function(e, t, a, o, n, r, i, s, c) {
	$(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), $(window).resize(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), t.formData = {
		lastTime: 5
	};
	var l = function() {
		s(function() {
			t.formData.lastTime--, t.formData.lastTime <= 0 ? location.href = "http://www.sobot.com" : l()
		}, 1e3)
	};
	l()
}]).controller("RegisterStatusFalseCtrl", ["$rootScope", "$scope", "$state", "$window", "RegisterServ", "Uuid", "$stateParams", "$timeout", function(e, t, a, o, n, r, i, s) {
	$(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), $(window).resize(function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + "px"
	}), t.formData = {
		lastTime: 5
	};
	var c = function() {
		s(function() {
			t.formData.lastTime--, t.formData.lastTime <= 0 ? a.go("register") : c()
		}, 1e3)
	};
	c()
}]), angular.module("Sobot4.C").controller("RepositoryCtrl", ["$scope", "$state", "$stateParams", "RepositoryServ", "MessageServ", "checkServ", "zcGlobal", "$timeout", "TabServ", function(e, t, a, o, n, r, i, s, c) {
	var l = null,
		u = null,
		d = null,
		p = null,
		m = null,
		g = function(a, o) {
			a = a ? a : t.params.parentID, o = o ? o : t.params.typeID;
			for (u in e.menuBar.menuList)
				if (d = e.menuBar.menuList[u], d.activeItemEnableEdit = !1, d && d.id === a)
					for (p in d.menuList) m = d.menuList[p], m && m.id === o && (l = m, l.parentID = d.id, d.activeItemEnableEdit = !0);
			return l
		};
	o.getMenuBar().then(function(t) {
		e.menuBar = t, e.activeMenu = g(), e.menuBar.activeItem = e.activeMenu.parentID + "-" + e.activeMenu.id
	}), e.triggerMenuActive = function(t, a, o, n) {
		e.menuBar.activeItem = o + "-" + n, e.activeMenu = g(o, n)
	}
}]).controller("IssuesManagementCtrl", ["$scope", "$rootScope", "RepositoryServ", "zcGlobal", "checkServ", "pubSubServ", "$q", "$timeout", "$state", "TabServ", "DialogServ", function(e, t, a, o, n, r, i, s, c, l, u) {
	var d = !1,
		p = ["全部", "启用", "停用"],
		m = {
			questionTypeId: "-1",
			keyWords: "",
			docStatus: 0,
			orderType: 1,
			pageNo: 1,
			pagerSize: 20
		},
		g = function(t) {
			e.formData.docStatus = t, e.formData.docStatusText = p[e.formData.docStatus]
		},
		f = function() {
			e.formData = {
				keyWords: m.keyWords,
				docStatusText: p[m.docStatus],
				docStatus: m.docStatus,
				orderType: m.orderType
			}
		},
		v = function() {
			e.paginationObj = {
				config: {
					isInit: !1,
					totalItems: 0,
					pageSize: m.pagerSize,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: !0,
					callBack: null
				}
			}
		},
		h = function() {
			e.categoryObj = {
				config: {
					isInit: !0,
					isShowCount: !0,
					interfaceName: "kb/queryGroupList",
					isAutoCallback: !0,
					callBack: null
				}
			}
		},
		y = function(t) {
			return t = t ? t : {}, a.getIssuesListByCategory({
				questionTypeId: t.questionTypeId || e.categoryObj.questionTypeId || m.questionTypeId,
				keyWords: d ? t.keyWords || e.formData.keyWords || m.keyWords : m.keyWords,
				docStatus: t.docStatus || e.formData.docStatus || m.docStatus,
				orderType: t.orderType || e.formData.orderType || m.orderType,
				pageNo: t.pageNo || e.paginationObj.currentPage || m.pageNo,
				pagerSize: t.pagerSize || e.paginationObj.pageSize || m.pagerSize
			}).then(function(t) {
				return t.retCode !== o.retCodeList.success ? !1 : (e.tableBodyData = {
					list: t.items
				}, e.checkObj = new n, e.isShowStopBtn = !1, e.isShowStartBtn = !1, e.$watch("checkObj.checkedList", function(t, a) {
					if (e.checkObj.isActionBarShow) {
						for (var o = e.checkObj.checkedList, n = o.length, r = !0, i = 0; n > i; i++) n - 1 > i && e.tableBodyData.list[o[i]].statusShow !== e.tableBodyData.list[o[i + 1]].statusShow && (r = !1);
						r ? "启用" === e.tableBodyData.list[o[0]].statusShow ? (e.isShowStopBtn = !0, e.isShowStartBtn = !1) : (e.isShowStopBtn = !1, e.isShowStartBtn = !0) : (e.isShowStopBtn = !0, e.isShowStartBtn = !0)
					}
				}, !0), t)
			})
		},
		S = function() {
			f(), v(), h(), e.active_questionTypeId = m.questionTypeId, e.active_docStatus = m.docStatus, e.active_orderType = m.orderType, e.active_keyWords = m.keyWords, e.requestUrl = "/kb/exportDocList/4?companyId=" + t.userInfo.companyId + "&questionTypeId=" + e.active_questionTypeId + "&docStatus=" + e.active_docStatus + "&orderType=" + e.active_orderType + "&keyWords=" + e.active_keyWords, e.fileType = "xls", e.resMethod = "GET"
		};
	e.getTableListByCategory = function(a) {
		e.categoryObj.questionTypeId = a.questionTypeId, e.categoryObj.questionTypeName = a.questionTypeName, e.categoryObj.typeLevel = a.typeLevel, e.active_questionTypeId = a.questionTypeId, e.requestUrl = "/kb/exportDocList/4?companyId=" + t.userInfo.companyId + "&questionTypeId=" + e.active_questionTypeId + "&docStatus=" + e.active_docStatus + "&orderType=" + e.active_orderType + "&keyWords=" + e.active_keyWords, y({
			questionTypeId: a.questionTypeId,
			pageNo: m.pageNo,
			pageSize: m.pagerSize
		}).then(function(t) {
			t && (e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0)
		})
	}, e.getTableListByPagination = function(t) {
		e.paginationObj.currentPage = t.currentPage, e.paginationObj.pageSize = t.pageSize, y().then(function(t) {
			t && (e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0)
		})
	}, e.stateSelect = function(a) {
		e.active_docStatus = a, e.requestUrl = "/kb/exportDocList/4?companyId=" + t.userInfo.companyId + "&questionTypeId=" + e.active_questionTypeId + "&docStatus=" + e.active_docStatus + "&orderType=" + e.active_orderType + "&keyWords=" + e.active_keyWords, g(a), y({
			pageNo: m.pageNo,
			pagerSize: m.pagerSize
		}).then(function(t) {
			t && (e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0)
		})
	}, e.searchIssues = function(a) {
		13 === a || "click" === a ? (d = !0, e.active_keyWords = e.formData.keyWords, e.requestUrl = "/kb/exportDocList/4?companyId=" + t.userInfo.companyId + "&questionTypeId=" + e.active_questionTypeId + "&docStatus=" + e.active_docStatus + "&orderType=" + e.active_orderType + "&keyWords=" + e.active_keyWords, y({
			pageNo: m.pageNo,
			pagerSize: m.pagerSize
		}).then(function(t) {
			t && (e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0)
		})) : d = !1
	}, e.orderTypeByUpdateTime = function() {
		e.formData.orderType = 1 == e.formData.orderType ? 2 : 1, e.active_orderType = e.formData.orderType, e.requestUrl = "/kb/exportDocList/4?companyId=" + t.userInfo.companyId + "&questionTypeId=" + e.active_questionTypeId + "&docStatus=" + e.active_docStatus + "&orderType=" + e.active_orderType + "&keyWords=" + e.active_keyWords, y()
	}, e.updateCategory = function(t) {
		var n, r = {
				1: "确定",
				2: "确定",
				3: "确定"
			},
			i = u.modal({
				scope: e,
				templateUrl: "views/repository/strap-modal-updateCategory.html"
			});
		switch (e.updateCategoryObj = {
			formData: {
				questionTypeId: e.categoryObj.questionTypeId,
				questionTypeName: e.categoryObj.questionTypeName,
				questionTypeNameNew: "",
				typeLevel: e.categoryObj.typeLevel
			}
		}, t) {
			case 1:
				e.modalDomData = {
					title: "删除分类",
					typeID: t,
					confirmText: r[t]
				}, n = function() {
					return a.removeGroup({
						questionTypeId: e.updateCategoryObj.formData.questionTypeId
					})
				};
				break;
			case 2:
				e.modalDomData = {
					title: "修改分类名称",
					typeID: t,
					confirmText: r[t]
				}, e.updateCategoryObj.formData.questionTypeNameNew = e.updateCategoryObj.formData.questionTypeName, n = function() {
					return a.updateGroup({
						questionTypeId: e.updateCategoryObj.formData.questionTypeId,
						questionTypeName: e.updateCategoryObj.formData.questionTypeNameNew
					})
				};
				break;
			case 3:
				e.modalDomData = {
					title: "添加子分类到" + e.updateCategoryObj.formData.questionTypeName,
					typeID: t,
					confirmText: r[t]
				}, e.updateCategoryObj.formData.questionTypeNameNew = "", n = function() {
					return a.saveGroup({
						parentTypeId: e.updateCategoryObj.formData.questionTypeId,
						questionTypeName: e.updateCategoryObj.formData.questionTypeNameNew,
						typeLevel: e.updateCategoryObj.formData.typeLevel
					})
				}
		}
		i.$promise.then(i.show), e.confirm = function() {
			return 1 === t || e.updateCategoryObj.formData.questionTypeNameNew ? (i.hide(), void n().then(function(e) {
				var t, a;
				t = e && e.retCode && e.retCode === o.retCodeList.success ? {
					title: "",
					content: e.retMsg || "成功",
					type: "success"
				} : {
					title: "",
					content: e.retMsg || "失败",
					type: "warning"
				}, a = u.alert(t), a.$promise.then(a.show).then(s(function() {
					c.reload()
				}, 3e3))
			})) : !1
		}
	}, e.editIssues = function(e) {
		l.open({
			title: e.questionTitle,
			toState: {
				name: "zc.back.editIssues"
			},
			toParams: {
				docID: e.docId
			},
			fromState: c.current,
			fromParams: c.params
		})
	}, e.operateDoc = function(t) {
		var n, r = "",
			i = u.modal({
				scope: e,
				templateUrl: "views/repository/strap-modal-operateDoc.html"
			});
		if (e.checkObj.checkedList.length) {
			switch (r = e.checkObj.getIdStr("docId", e.tableBodyData.list), t) {
				case 1:
					e.modalDomData = {
						title: "删除",
						content: "确认删除？",
						typeID: t
					}, n = function() {
						return a.deleteDoc({
							docIds: r
						})
					};
					break;
				case 2:
					e.modalDomData = {
						title: "停用",
						content: "确认停用？",
						typeID: t
					}, r = e.checkObj.getIdStr("docId", e.tableBodyData.list, "", "", function(e) {
						return "停用" === e.statusShow || 0 == e.validFlag
					}), n = function() {
						return a.updateDocStatus({
							docIds: r,
							usedFlag: 1
						})
					};
					break;
				case 3:
					e.modalDomData = {
						content: "确认启用？",
						typeID: t
					}, r = e.checkObj.getIdStr("docId", e.tableBodyData.list, "", "", function(e) {
						return "启用" === e.statusShow || 0 == e.validFlag
					}), n = function() {
						return a.updateDocStatus({
							docIds: r,
							usedFlag: 0
						})
					};
					break;
				case 4:
					e.modalDomData = {
						title: "批量转移分类",
						typeID: t
					}, e.operateDocObj = {
						categoryObj: {
							config: {
								isInit: !0,
								isShowCount: !0,
								interfaceName: "kb/queryGroupList",
								isAutoCallback: !0,
								isShowAll: !1,
								callBack: null
							}
						}
					}, e.operateDocObj.categoryObj.getCategory = function(t) {
						e.operateDocObj.categoryObj.questionTypeId = t.questionTypeId
					}, n = function() {
						return a.moveDoc({
							questionTypeId: e.operateDocObj.categoryObj.questionTypeId,
							docIds: r
						})
					}
			}
			i.$promise.then(i.show), e.confirm = function() {
				i.hide(), n().then(function(e) {
					var t, a;
					t = e && e.retCode && e.retCode === o.retCodeList.success ? {
						title: "",
						content: e.retMsg || "成功",
						type: "success"
					} : {
						title: "",
						content: e.retMsg || "失败",
						type: "warning"
					}, a = u.alert(t), a.$promise.then(a.show).then(s(function() {
						c.reload()
					}, 3e3))
				})
			}
		}
	}, e.jumpToPage = function() {
		c.go("zc.back.repository.addIssues", {
			parentID: "1001",
			typeID: "103",
			tabsActiveIndex: "1"
		})
	}, S()
}]).controller("IssuesLearningCtrl", ["$scope", "RepositoryServ", "zcGlobal", "checkServ", "pubSubServ", "$timeout", "DialogServ", "$sce", "$state", "$rootScope", function(e, t, a, o, n, r, i, s, c, l) {
	l.currentPageAll = 1;
	var u = function() {
			t.getIssuesLearningTabs({
				id: "1001"
			}).then(function(t) {
				e.tabs = t.tabs, e.tabsList = {
					list: t.tabs
				}
			})
		},
		d = function() {
			u()
		};
	e.tabsActiveCallback = function(t) {
		switch (t) {
			case 0:
				e.tab[t].init();
				break;
			case 1:
				e.tab[t].init()
		}
	}, e.updateCount = function(t, a, o) {
		for (var n = 0; n < e.tableBodyData.list.length; n++) e.tableBodyData.list[n].docId === a && (e.tableBodyData.list[n].smailQuestionNum = e.tableBodyData.list[n].smailQuestionNum - o)
	}, e.tab = [], e.tab[0] = function() {
		var n = {};
		return n.index = 0, n.categoryObj = {
			config: {}
		}, n.paginationObj = {
			config: {}
		}, n.defParamsObj = {
			questionTypeId: "-1",
			pageNo: 1,
			pagerSize: 20
		}, n.init = function() {
			console.log("初始化_t.init"), n.initPagination(), n.initCategory()
		}, n.initPagination = function() {
			e.tab[n.index].paginationObj = {
				config: {
					isInit: !1,
					totalItems: 0,
					pageSize: n.defParamsObj.pagerSize,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: !0,
					callBack: null
				}
			}, e.tab[n.index].paginationObj.currentPage = 1
		}, n.initCategory = function() {
			e.tab[n.index].categoryObj = {
				config: {
					isInit: !0,
					isShowCount: !0,
					interfaceName: "kb/queryGroupListForKnown",
					isAutoCallback: !0,
					callBack: null
				}
			}
		}, n.initTableList = function(o) {
			return o = o ? o : {}, t.getPagerKnownDocList({
				questionTypeId: o.questionTypeId || e.tab[n.index].categoryObj.questionTypeId || n.defParamsObj.questionTypeId,
				pageNo: o.pageNo || e.tab[n.index].paginationObj.currentPage || n.defParamsObj.pageNo,
				pagerSize: o.pagerSize || e.tab[n.index].paginationObj.pageSize || n.defParamsObj.pagerSize
			}).then(function(t) {
				for (var o = 0; o < t.items.length; o++) t.items[o].answerDesc = s.trustAsHtml(t.items[o].answerDesc);
				return t.retCode !== a.retCodeList.success ? !1 : (e.tableBodyData = {
					list: t.items
				}, t)
			})
		}, n.getTableListByCategory = function(t) {
			e.tab[n.index].categoryObj.questionTypeId = t.questionTypeId, n.initTableList({
				questionTypeId: t.questionTypeId,
				pageNo: n.defParamsObj.pageNo,
				pageSize: n.defParamsObj.pagerSize
			}).then(function(t) {
				t && (e.tab[n.index].paginationObj.config.totalItems = t.totalCount, e.tab[n.index].paginationObj.config.isInit = !0)
			})
		}, n.getTableListByPagination = function(t) {
			e.tab[n.index].paginationObj.currentPage = t.currentPage, e.tab[n.index].paginationObj.pageSize = t.pageSize, n.initTableList().then(function(t) {
				t && (e.tab[n.index].paginationObj.config.totalItems = t.totalCount, e.tab[n.index].paginationObj.config.isInit = !0)
			})
		}, n.showIssuesLearning = function(r) {
			l.currentPageAll = 1, console.log("弹出层当前页" + l.currentPageAll);
			var s = {
					docId: "",
					pageNo: 1,
					pagerSize: 20
				},
				u = i.modal({
					scope: e,
					templateUrl: "views/repository/strap-modal-issuesLearning.html"
				}),
				d = function(n) {
					return n = n ? n : {}, t.getPagerDocKnownListByDocId({
						docId: n.docId || r.docId,
						pageNo: n.pageNo || e.issuesLearningObj.paginationObj.currentPage || s.pageNo,
						pagerSize: n.pagerSize || e.issuesLearningObj.paginationObj.pageSize || s.pagerSize
					}).then(function(t) {
						return t.retCode !== a.retCodeList.success ? !1 : (e.issuesLearningObj.tableListData = {
							list: t.items
						}, e.issuesLearningObj.checkObj = new o, t)
					})
				},
				p = function() {
					e.issuesLearningObj.paginationObj = {
						config: {
							isInit: !0,
							totalItems: 0,
							pageSize: s.pagerSize,
							prevText: "< 上一页",
							nextText: "下一页 >",
							moreText: "···",
							isAutoCallback: !0,
							callBack: null
						}
					}
				},
				m = function(t) {
					e.issuesLearningObj.modalDomData = {
						title: "问题学习"
					}, u.$promise.then(u.show), p(), d({
						docId: r.docId,
						pageNo: s.pageNo,
						pagerSize: s.pagerSize
					}).then(function(t) {
						t && (e.issuesLearningObj.formData = {
							issuesDocId: r.docId,
							issuesTitle: r.questionTitle,
							issuesContent: r.answerDesc
						}, e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount)
					}).then(function() {
						angular.isFunction(t) && t()
					})
				};
			e.issuesLearningObj = {}, e.issuesLearningObj.getTableListByPagination = function(t) {
				e.issuesLearningObj.paginationObj.currentPage = t.currentPage, e.issuesLearningObj.paginationObj.pageSize = t.pageSize, l.currentPageAll = t.currentPage, console.log("弹出层当前页" + l.currentPageAll), d().then(function(t) {
					t && (e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount, e.issuesLearningObj.paginationObj.config.isInit = !0)
				})
			}, e.issuesLearningObj.updateDocKnown = function(a, o) {
				13 === a.keyCode ? (o.isEnabledEdit = !o.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== o.questionTitle && t.updateDocKnown({
					learnId: o.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					o.questionTitle = e.issuesLearningObj.formData.questionTitle
				})) : 27 === a.keyCode && (a.stopPropagation(), o.isEnabledEdit = !o.isEnabledEdit)
			}, e.issuesLearningObj.updateDocKnownBlur = function(a) {
				a.isEnabledEdit = !a.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== a.questionTitle && t.updateDocKnown({
					learnId: a.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					a.questionTitle = e.issuesLearningObj.formData.questionTitle
				})
			}, e.issuesLearningObj.operateDocKnownAdd = function(s) {
				var u = "",
					d = null,
					p = !1,
					m = {
						questionTypeId: "-1",
						keyWords: "",
						docStatus: 0,
						orderType: 1,
						pageNo: 1,
						pagerSize: 20
					},
					g = null;
				if (e.issuesLearningObj.checkObj.checkedList.length) switch (u = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), s) {
					case 4:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-addIssues-issuesLearning.html"
						});
						var f = e.issuesLearningObj.checkObj.checkedList.sort(function(e, t) {
								return e > t ? 1 : -1
							}),
							v = f.length,
							h = e.issuesLearningObj.tableListData.list,
							y = {
								id: "line-addIssues",
								model: ""
							};
						console.log(h), e.addIssuesObj = {
							modalDomData: {
								title: "添加问题"
							},
							docStatusTextArr: ["启用", "停用"],
							ueditorConfig: {
								zIndex: 1100
							},
							defLineObj: {
								id: y.id + "-0"
							},
							lineList: function() {
								for (var e = [], t = 0; v > t; t++) t > 1 && e.push({
									id: y.id + "-" + (e.length + 1),
									inputVal: null,
									model: ""
								});
								return e
							}(),
							formData: {
								questionTitle: h[f[0]].questionTitle,
								questionList: function() {
									for (var e = [], t = 0; v > t; t++) t && e.push(h[f[t]].questionTitle);
									return e
								}(),
								answerDesc: "",
								docStatus: 0
							},
							addLine: function(t) {
								document.getElementById(e.addIssuesObj.defLineObj.id).focus(), t && (e.addIssuesObj.lineList.push({
									id: y.id + "-" + (e.addIssuesObj.lineList.length + 1),
									inputVal: t,
									model: ""
								}), e.addIssuesObj.formData.questionList[0] = "")
							},
							removeLine: function(t) {
								var a = e.addIssuesObj.lineList.length,
									o = null,
									n = [],
									r = [];
								r[0] = e.addIssuesObj.formData.questionList[0];
								for (var i = 0; a > i; i++) o = e.addIssuesObj.lineList[i], i !== t && (n.push(o), n[n.length - 1].id = y.id + "-" + n.length, r.push(e.addIssuesObj.formData.questionList[i + 1]));
								e.addIssuesObj.formData.questionList = r, e.addIssuesObj.lineList = n
							},
							selectCategory: function() {
								e.selectCategory = {
									categoryObj: {
										config: {
											isInit: !0,
											isShowCount: !0,
											interfaceName: "kb/queryGroupList",
											isAutoCallback: !0,
											isShowAll: !1,
											callBack: null,
											reduceCategoryCount: null
										}
									}
								}, e.selectCategory.getCategory = function(t) {
									e.selectCategory.categoryObj.data = t
								};
								var t = i.modal({
									scope: e,
									templateUrl: "views/public/strap-modal-selectCategory.html"
								});
								e.modalDomData = {
									title: "选择分类",
									pathStr: ""
								}, t.$promise.then(t.show), e.selectCategory.confirm = function() {
									e.addIssuesObj.formData.pathStr = e.selectCategory.categoryObj.data.pathStr, e.addIssuesObj.formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, t.hide()
								}
							},
							confirm: function() {
								for (var o, s = e.addIssuesObj.formData.questionList, c = s.length, p = [], g = 0; c > g; g++) o = s[g], o && p.push(o);
								s = p, console.log("fa"), console.log(UE.getEditor("editor02").getContent()), t.saveDoc({
									questionTypeId: e.addIssuesObj.formData.questionTypeId,
									questionTitle: e.addIssuesObj.formData.questionTitle,
									questionList: s,
									answerDesc: UE.getEditor("editor02").getContent(),
									linkquestionList: [],
									usedFlag: e.addIssuesObj.formData.docStatus
								}).then(function(e) {
									var o;
									e && e.retCode && e.retCode === a.retCodeList.success ? (o = i.alert({
										content: e.retMsg || "成功",
										type: "success"
									}), o.$promise.then(o.show), d.hide(), console.log("刷新"), t.updateDocKnownStatus({
										learnIds: u,
										companyId: l.userInfo.companyId
									}).then(function(e) {
										console.log(n), console.log(n.init), console.log(e), console.log(r), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init(), n.initTableList()
									})) : (o = i.alert({
										content: e.retMsg || "失败",
										type: "warning"
									}), o.$promise.then(o.show))
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, d.$promise.then(d.show);
						break;
					case 5:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-dolinkDocUnKnown-issuesLearning.html"
						}), g = function(n) {
							return n = n ? n : {}, t.getIssuesListByCategory({
								questionTypeId: n.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || m.questionTypeId,
								keyWords: p ? n.keyWords || e.dolinkDocUnKnown.formData.keyWords || m.keyWords : m.keyWords,
								docStatus: 0,
								orderType: 1,
								pageNo: n.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || m.pageNo,
								pagerSize: n.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || m.pagerSize
							}).then(function(t) {
								return t.retCode !== a.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
									list: t.items
								}, e.dolinkDocUnKnown.checkObj = new o, t)
							})
						}, e.dolinkDocUnKnown = {
							modalDomData: {
								title: "关联问题"
							},
							formData: {
								docId: "",
								keyWords: ""
							},
							categoryObj: {
								config: {
									isInit: !0,
									isShowCount: !0,
									interfaceName: "kb/queryGroupList",
									isAutoCallback: !0,
									callBack: null
								}
							},
							paginationObj: {
								config: {
									isInit: !0,
									totalItems: 0,
									pageSize: m.pagerSize,
									prevText: "< 上一页",
									nextText: "下一页 >",
									moreText: "···",
									isAutoCallback: !0,
									callBack: null
								}
							},
							confirm: function() {
								d.hide(), t.doPassDocKnown({
									docId: e.dolinkDocUnKnown.formData.docId,
									learnIds: u
								}).then(function(e) {
									n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init();
									var t, o;
									t = e && e.retCode && e.retCode === a.retCodeList.success ? {
										title: "",
										content: e.retMsg || "成功",
										type: "success"
									} : {
										title: "",
										content: e.retMsg || "失败",
										type: "warning"
									}, o = i.alert(t), o.$promise.then(o.show)
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
							e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, g({
								questionTypeId: t.questionTypeId,
								pageNo: m.pageNo,
								pageSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
							e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, g().then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.searchQuestion = function(t) {
							13 === t.keyCode || "click" === t ? (p = !0, g({
								pageNo: m.pageNo,
								pagerSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})) : p = !1
						}, d.$promise.then(d.show)
				}
			}, e.issuesLearningObj.operateDocKnown = function(a) {
				console.log(r);
				var o = "",
					i = "",
					c = r.docId;
				if (e.issuesLearningObj.checkObj.checkedList.length) {
					switch (o = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), a) {
						case 1:
							i = t.deleteDocKnown({
								ids: o
							});
							break;
						case 2:
							i = t.doPassDocKnown({
								docId: c,
								learnIds: o
							});
							break;
						case 3:
							i = t.doKnownToUnKnown({
								learnIds: o
							})
					}
					i.then(function() {
						n.showIssuesLearningReload(r, l.currentPageAll, s.pagerSize)
					})
				}
			}, e.issuesLearningObj.reloadPage = function() {
				c.reload()
			}, m()
		}, n.showIssuesLearningReload = function(r, s, u) {
			var d = {
					docId: "",
					pageNo: s || 1,
					pagerSize: u || 20
				},
				p = function(n) {
					return n = n ? n : {}, t.getPagerDocKnownListByDocId({
						docId: n.docId || r.docId,
						pageNo: n.pageNo || e.issuesLearningObj.paginationObj.currentPage || d.pageNo,
						pagerSize: n.pagerSize || e.issuesLearningObj.paginationObj.pageSize || d.pagerSize
					}).then(function(t) {
						return console.log(t), t.retCode !== a.retCodeList.success ? !1 : (e.issuesLearningObj.tableListData = {
							list: t.items
						}, e.issuesLearningObj.checkObj = new o, t)
					})
				},
				m = function() {
					e.issuesLearningObj.paginationObj = {
						config: {
							isInit: !0,
							totalItems: 0,
							pageSize: d.pagerSize,
							prevText: "< 上一页",
							nextText: "下一页 >",
							moreText: "···",
							isAutoCallback: !0,
							callBack: null
						}
					}
				},
				g = function(t) {
					e.issuesLearningObj.modalDomData = {
						title: "问题学习"
					}, m(), p({
						docId: r.docId,
						pageNo: d.pageNo,
						pagerSize: d.pagerSize
					}).then(function(t) {
						t || retuen, console.log("第一次查询列表页码" + d.pageNo), console.log("是否有数据｜"), console.log(t), 0 == t.items.length ? (console.log("无数据"), console.log(t), console.log("第二次查询页码" + (d.pageNo - 1)), p({
							docId: r.docId,
							pageNo: d.pageNo - 1,
							pagerSize: d.pagerSize
						}).then(function(t) {
							console.log("第二次查询"), console.log(t), t && (0 == t.items.length && d.pageNo - 1 == 0 && c.reload(), e.issuesLearningObj.paginationObj.config.jumpToPage = d.pageNo - 1, l.currentPageAll = d.pageNo - 1, console.log("前一页数据"), console.log(r), e.issuesLearningObj.formData = {
								issuesDocId: r.docId,
								issuesTitle: r.questionTitle,
								issuesContent: r.answerDesc
							}, console.log("有数据"), e.issuesLearningObj.formData = {
								issuesDocId: r.docId,
								issuesTitle: r.questionTitle,
								issuesContent: r.answerDesc
							}, e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount, console.log("总条数"), console.log(t.totalCount))
						})) : (e.issuesLearningObj.paginationObj.config.jumpToPage = d.pageNo, l.currentPageAll = d.pageNo, console.log("有数据"), e.issuesLearningObj.formData = {
							issuesDocId: r.docId,
							issuesTitle: r.questionTitle,
							issuesContent: r.answerDesc
						}, e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount)
					}).then(function() {
						angular.isFunction(t) && t()
					})
				};
			e.issuesLearningObj = {}, e.issuesLearningObj.getTableListByPagination = function(t) {
				e.issuesLearningObj.paginationObj.currentPage = t.currentPage, e.issuesLearningObj.paginationObj.pageSize = t.pageSize, p().then(function(t) {
					t && (e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount, e.issuesLearningObj.paginationObj.config.isInit = !0)
				})
			}, e.issuesLearningObj.updateDocKnown = function(a, o) {
				13 === a.keyCode ? (o.isEnabledEdit = !o.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== o.questionTitle && t.updateDocKnown({
					learnId: o.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					o.questionTitle = e.issuesLearningObj.formData.questionTitle
				})) : 27 === a.keyCode && (a.stopPropagation(), o.isEnabledEdit = !o.isEnabledEdit)
			}, e.issuesLearningObj.updateDocKnownBlur = function(a) {
				a.isEnabledEdit = !a.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== a.questionTitle && t.updateDocKnown({
					learnId: a.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					a.questionTitle = e.issuesLearningObj.formData.questionTitle
				})
			}, e.issuesLearningObj.operateDocKnownAdd = function(s) {
				var u = "",
					d = null,
					p = !1,
					m = {
						questionTypeId: "-1",
						keyWords: "",
						docStatus: 0,
						orderType: 1,
						pageNo: 1,
						pagerSize: 20
					},
					g = null;
				if (e.issuesLearningObj.checkObj.checkedList.length) switch (u = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), s) {
					case 4:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-addIssues-issuesLearning.html"
						});
						var f = e.issuesLearningObj.checkObj.checkedList.sort(function(e, t) {
								return e > t ? 1 : -1
							}),
							v = f.length,
							h = e.issuesLearningObj.tableListData.list,
							y = {
								id: "line-addIssues",
								model: ""
							};
						console.log(h), e.addIssuesObj = {
							modalDomData: {
								title: "添加问题"
							},
							docStatusTextArr: ["启用", "停用"],
							ueditorConfig: {
								zIndex: 1100
							},
							defLineObj: {
								id: y.id + "-0"
							},
							lineList: function() {
								for (var e = [], t = 0; v > t; t++) t > 1 && e.push({
									id: y.id + "-" + (e.length + 1),
									inputVal: null,
									model: ""
								});
								return e
							}(),
							formData: {
								questionTitle: h[f[0]].questionTitle,
								questionList: function() {
									for (var e = [], t = 0; v > t; t++) t && e.push(h[f[t]].questionTitle);
									return e
								}(),
								answerDesc: "",
								docStatus: 0
							},
							addLine: function(t) {
								document.getElementById(e.addIssuesObj.defLineObj.id).focus(), t && (e.addIssuesObj.lineList.push({
									id: y.id + "-" + (e.addIssuesObj.lineList.length + 1),
									inputVal: t,
									model: ""
								}), e.addIssuesObj.formData.questionList[0] = "")
							},
							removeLine: function(t) {
								var a = e.addIssuesObj.lineList.length,
									o = null,
									n = [],
									r = [];
								r[0] = e.addIssuesObj.formData.questionList[0];
								for (var i = 0; a > i; i++) o = e.addIssuesObj.lineList[i], i !== t && (n.push(o), n[n.length - 1].id = y.id + "-" + n.length, r.push(e.addIssuesObj.formData.questionList[i + 1]));
								e.addIssuesObj.formData.questionList = r, e.addIssuesObj.lineList = n
							},
							selectCategory: function() {
								e.selectCategory = {
									categoryObj: {
										config: {
											isInit: !0,
											isShowCount: !0,
											interfaceName: "kb/queryGroupList",
											isAutoCallback: !0,
											isShowAll: !1,
											callBack: null,
											reduceCategoryCount: null
										}
									}
								}, e.selectCategory.getCategory = function(t) {
									e.selectCategory.categoryObj.data = t
								};
								var t = i.modal({
									scope: e,
									templateUrl: "views/public/strap-modal-selectCategory.html"
								});
								e.modalDomData = {
									title: "选择分类",
									pathStr: ""
								}, t.$promise.then(t.show), e.selectCategory.confirm = function() {
									e.addIssuesObj.formData.pathStr = e.selectCategory.categoryObj.data.pathStr, e.addIssuesObj.formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, t.hide()
								}
							},
							confirm: function() {
								for (var o, s = e.addIssuesObj.formData.questionList, c = s.length, p = [], g = 0; c > g; g++) o = s[g], o && p.push(o);
								s = p, console.log(UE.getEditor("editor02").getContent()), t.saveDoc({
									questionTypeId: e.addIssuesObj.formData.questionTypeId,
									questionTitle: e.addIssuesObj.formData.questionTitle,
									questionList: s,
									answerDesc: UE.getEditor("editor02").getContent(),
									linkquestionList: [],
									usedFlag: e.addIssuesObj.formData.docStatus
								}).then(function(e) {
									var o;
									e && e.retCode && e.retCode === a.retCodeList.success ? (o = i.alert({
										content: e.retMsg || "成功",
										type: "success"
									}), o.$promise.then(o.show), d.hide(), console.log("刷新"), t.updateDocKnownStatus({
										learnIds: u,
										companyId: l.userInfo.companyId
									}).then(function(e) {
										console.log(n), console.log(n.init), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init(), n.initTableList()
									})) : (o = i.alert({
										content: e.retMsg || "失败",
										type: "warning"
									}), o.$promise.then(o.show))
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, d.$promise.then(d.show);
						break;
					case 5:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-dolinkDocUnKnown-issuesLearning.html"
						}), g = function(n) {
							return n = n ? n : {}, t.getIssuesListByCategory({
								questionTypeId: n.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || m.questionTypeId,
								keyWords: p ? n.keyWords || e.dolinkDocUnKnown.formData.keyWords || m.keyWords : m.keyWords,
								docStatus: 0,
								orderType: 1,
								pageNo: n.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || m.pageNo,
								pagerSize: n.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || m.pagerSize
							}).then(function(t) {
								return t.retCode !== a.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
									list: t.items
								}, e.dolinkDocUnKnown.checkObj = new o, t)
							})
						}, e.dolinkDocUnKnown = {
							modalDomData: {
								title: "关联问题"
							},
							formData: {
								docId: "",
								keyWords: ""
							},
							categoryObj: {
								config: {
									isInit: !0,
									isShowCount: !0,
									interfaceName: "kb/queryGroupList",
									isAutoCallback: !0,
									callBack: null
								}
							},
							paginationObj: {
								config: {
									isInit: !0,
									totalItems: 0,
									pageSize: m.pagerSize,
									prevText: "< 上一页",
									nextText: "下一页 >",
									moreText: "···",
									isAutoCallback: !0,
									callBack: null
								}
							},
							confirm: function() {
								d.hide(), t.doPassDocKnown({
									docId: e.dolinkDocUnKnown.formData.docId,
									learnIds: u
								}).then(function(e) {
									n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init();
									var t, o;
									t = e && e.retCode && e.retCode === a.retCodeList.success ? {
										title: "",
										content: e.retMsg || "成功",
										type: "success"
									} : {
										title: "",
										content: e.retMsg || "失败",
										type: "warning"
									}, o = i.alert(t), o.$promise.then(o.show)
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
							e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, g({
								questionTypeId: t.questionTypeId,
								pageNo: m.pageNo,
								pageSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
							e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, g().then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.searchQuestion = function(t) {
							13 === t.keyCode || "click" === t ? (p = !0, g({
								pageNo: m.pageNo,
								pagerSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})) : p = !1
						}, d.$promise.then(d.show)
				}
			}, e.issuesLearningObj.operateDocKnown = function(a) {
				console.log(r);
				var o = "",
					i = "",
					s = r.docId;
				if (e.issuesLearningObj.checkObj.checkedList.length) {
					switch (o = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), a) {
						case 1:
							i = t.deleteDocKnown({
								ids: o
							});
							break;
						case 2:
							i = t.doPassDocKnown({
								docId: s,
								learnIds: o
							});
							break;
						case 3:
							i = t.doKnownToUnKnown({
								learnIds: o
							})
					}
					i.then(function() {
						n.showIssuesLearningReload(r, l.currentPageAll, d.pagerSize)
					})
				}
			}, e.issuesLearningObj.reloadPage = function() {
				c.reload()
			}, g()
		}, n.showIssuesLearningReload_creat = function(r, s, u) {
			var d = {
					docId: "",
					pageNo: s || 1,
					pagerSize: u || 20
				},
				p = i.modal({
					scope: e,
					templateUrl: "views/repository/strap-modal-issuesLearning.html"
				}),
				m = function(n) {
					return n = n ? n : {}, t.getPagerDocKnownListByDocId({
						docId: n.docId || r.docId,
						pageNo: n.pageNo || e.issuesLearningObj.paginationObj.currentPage || d.pageNo,
						pagerSize: n.pagerSize || e.issuesLearningObj.paginationObj.pageSize || d.pagerSize
					}).then(function(t) {
						return console.log(t), t.retCode !== a.retCodeList.success ? !1 : (e.issuesLearningObj.tableListData = {
							list: t.items
						}, e.issuesLearningObj.checkObj = new o, t)
					})
				},
				g = function() {
					e.issuesLearningObj.paginationObj = {
						config: {
							isInit: !0,
							totalItems: 0,
							pageSize: d.pagerSize,
							prevText: "< 上一页",
							nextText: "下一页 >",
							moreText: "···",
							isAutoCallback: !0,
							callBack: null
						}
					}
				},
				f = function(t) {
					e.issuesLearningObj.modalDomData = {
						title: "问题学习"
					}, p.$promise.then(p.show), g(), m({
						docId: r.docId,
						pageNo: d.pageNo,
						pagerSize: d.pagerSize
					}).then(function(t) {
						t && (console.log("第一次查询列表页码" + d.pageNo), console.log("是否有数据｜"), console.log(t), 0 == t.items.length ? (console.log("无数据"), console.log(t), console.log("第二次查询页码" + (d.pageNo - 1)), m({
							docId: r.docId,
							pageNo: d.pageNo - 1,
							pagerSize: d.pagerSize
						}).then(function(t) {
							console.log("第二次查询"), console.log(t), t && (0 == t.items.length && d.pageNo - 1 == 0 && c.reload(), e.issuesLearningObj.paginationObj.config.jumpToPage = d.pageNo - 1, l.currentPageAll = d.pageNo - 1, console.log("前一页数据"), console.log(r), e.issuesLearningObj.formData = {
								issuesDocId: r.docId,
								issuesTitle: r.questionTitle,
								issuesContent: r.answerDesc
							}, console.log("有数据"), e.issuesLearningObj.formData = {
								issuesDocId: r.docId,
								issuesTitle: r.questionTitle,
								issuesContent: r.answerDesc
							}, e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount, console.log("总条数"), console.log(t.totalCount))
						})) : (e.issuesLearningObj.paginationObj.config.jumpToPage = d.pageNo, l.currentPageAll = d.pageNo, console.log("有数据"), e.issuesLearningObj.formData = {
							issuesDocId: r.docId,
							issuesTitle: r.questionTitle,
							issuesContent: r.answerDesc
						}, e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount))
					}).then(function() {
						angular.isFunction(t) && t()
					})
				};
			e.issuesLearningObj = {}, e.issuesLearningObj.getTableListByPagination = function(t) {
				e.issuesLearningObj.paginationObj.currentPage = t.currentPage, e.issuesLearningObj.paginationObj.pageSize = t.pageSize, m().then(function(t) {
					t && (e.issuesLearningObj.paginationObj.config.totalItems = t.totalCount, e.issuesLearningObj.paginationObj.config.isInit = !0)
				})
			}, e.issuesLearningObj.updateDocKnown = function(a, o) {
				13 === a.keyCode ? (o.isEnabledEdit = !o.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== o.questionTitle && t.updateDocKnown({
					learnId: o.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					o.questionTitle = e.issuesLearningObj.formData.questionTitle
				})) : 27 === a.keyCode && (a.stopPropagation(), o.isEnabledEdit = !o.isEnabledEdit)
			}, e.issuesLearningObj.updateDocKnownBlur = function(a) {
				a.isEnabledEdit = !a.isEnabledEdit, e.issuesLearningObj.formData.questionTitle !== a.questionTitle && t.updateDocKnown({
					learnId: a.learnId,
					questionTitle: e.issuesLearningObj.formData.questionTitle
				}).then(function(t) {
					a.questionTitle = e.issuesLearningObj.formData.questionTitle
				})
			}, e.issuesLearningObj.operateDocKnownAdd = function(s) {
				var u = "",
					d = null,
					p = !1,
					m = {
						questionTypeId: "-1",
						keyWords: "",
						docStatus: 0,
						orderType: 1,
						pageNo: 1,
						pagerSize: 20
					},
					g = null;
				if (e.issuesLearningObj.checkObj.checkedList.length) switch (u = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), s) {
					case 4:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-addIssues-issuesLearning.html"
						});
						var f = e.issuesLearningObj.checkObj.checkedList.sort(function(e, t) {
								return e > t ? 1 : -1
							}),
							v = f.length,
							h = e.issuesLearningObj.tableListData.list,
							y = {
								id: "line-addIssues",
								model: ""
							};
						console.log(h), e.addIssuesObj = {
							modalDomData: {
								title: "添加问题"
							},
							docStatusTextArr: ["启用", "停用"],
							ueditorConfig: {
								zIndex: 1100
							},
							defLineObj: {
								id: y.id + "-0"
							},
							lineList: function() {
								for (var e = [], t = 0; v > t; t++) t > 1 && e.push({
									id: y.id + "-" + (e.length + 1),
									inputVal: null,
									model: ""
								});
								return e
							}(),
							formData: {
								questionTitle: h[f[0]].questionTitle,
								questionList: function() {
									for (var e = [], t = 0; v > t; t++) t && e.push(h[f[t]].questionTitle);
									return e
								}(),
								answerDesc: "",
								docStatus: 0
							},
							addLine: function(t) {
								document.getElementById(e.addIssuesObj.defLineObj.id).focus(), t && (e.addIssuesObj.lineList.push({
									id: y.id + "-" + (e.addIssuesObj.lineList.length + 1),
									inputVal: t,
									model: ""
								}), e.addIssuesObj.formData.questionList[0] = "")
							},
							removeLine: function(t) {
								var a = e.addIssuesObj.lineList.length,
									o = null,
									n = [],
									r = [];
								r[0] = e.addIssuesObj.formData.questionList[0];
								for (var i = 0; a > i; i++) o = e.addIssuesObj.lineList[i], i !== t && (n.push(o), n[n.length - 1].id = y.id + "-" + n.length, r.push(e.addIssuesObj.formData.questionList[i + 1]));
								e.addIssuesObj.formData.questionList = r, e.addIssuesObj.lineList = n
							},
							selectCategory: function() {
								e.selectCategory = {
									categoryObj: {
										config: {
											isInit: !0,
											isShowCount: !0,
											interfaceName: "kb/queryGroupList",
											isAutoCallback: !0,
											isShowAll: !1,
											callBack: null,
											reduceCategoryCount: null
										}
									}
								}, e.selectCategory.getCategory = function(t) {
									e.selectCategory.categoryObj.data = t
								};
								var t = i.modal({
									scope: e,
									templateUrl: "views/public/strap-modal-selectCategory.html"
								});
								e.modalDomData = {
									title: "选择分类",
									pathStr: ""
								}, t.$promise.then(t.show), e.selectCategory.confirm = function() {
									e.addIssuesObj.formData.pathStr = e.selectCategory.categoryObj.data.pathStr, e.addIssuesObj.formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, t.hide()
								}
							},
							confirm: function() {
								for (var o, s = e.addIssuesObj.formData.questionList, c = s.length, p = [], g = 0; c > g; g++) o = s[g], o && p.push(o);
								s = p, console.log(UE.getEditor("editor02").getContent()), t.saveDoc({
									questionTypeId: e.addIssuesObj.formData.questionTypeId,
									questionTitle: e.addIssuesObj.formData.questionTitle,
									questionList: s,
									answerDesc: UE.getEditor("editor02").getContent(),
									linkquestionList: [],
									usedFlag: e.addIssuesObj.formData.docStatus
								}).then(function(e) {
									var o;
									e && e.retCode && e.retCode === a.retCodeList.success ? (o = i.alert({
										content: e.retMsg || "成功",
										type: "success"
									}), o.$promise.then(o.show), d.hide(), console.log("刷新"), t.updateDocKnownStatus({
										learnIds: u,
										companyId: l.userInfo.companyId
									}).then(function(e) {
										console.log(n), console.log(n.init), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init(), n.initTableList()
									})) : (o = i.alert({
										content: e.retMsg || "失败",
										type: "warning"
									}), o.$promise.then(o.show))
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, d.$promise.then(d.show);
						break;
					case 5:
						d = i.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-dolinkDocUnKnown-issuesLearning.html"
						}), g = function(n) {
							return n = n ? n : {}, t.getIssuesListByCategory({
								questionTypeId: n.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || m.questionTypeId,
								keyWords: p ? n.keyWords || e.dolinkDocUnKnown.formData.keyWords || m.keyWords : m.keyWords,
								docStatus: 0,
								orderType: 1,
								pageNo: n.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || m.pageNo,
								pagerSize: n.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || m.pagerSize
							}).then(function(t) {
								return t.retCode !== a.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
									list: t.items
								}, e.dolinkDocUnKnown.checkObj = new o, t)
							})
						}, e.dolinkDocUnKnown = {
							modalDomData: {
								title: "关联问题"
							},
							formData: {
								docId: "",
								keyWords: ""
							},
							categoryObj: {
								config: {
									isInit: !0,
									isShowCount: !0,
									interfaceName: "kb/queryGroupList",
									isAutoCallback: !0,
									callBack: null
								}
							},
							paginationObj: {
								config: {
									isInit: !0,
									totalItems: 0,
									pageSize: m.pagerSize,
									prevText: "< 上一页",
									nextText: "下一页 >",
									moreText: "···",
									isAutoCallback: !0,
									callBack: null
								}
							},
							confirm: function() {
								d.hide(), t.doPassDocKnown({
									docId: e.dolinkDocUnKnown.formData.docId,
									learnIds: u
								}).then(function(e) {
									n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize), n.init();
									var t, o;
									t = e && e.retCode && e.retCode === a.retCodeList.success ? {
										title: "",
										content: e.retMsg || "成功",
										type: "success"
									} : {
										title: "",
										content: e.retMsg || "失败",
										type: "warning"
									}, o = i.alert(t), o.$promise.then(o.show)
								})
							},
							returnLast: function() {
								console.log(l.currentPageAll), n.showIssuesLearningReload_creat(r, l.currentPageAll, m.pagerSize)
							},
							reloadPage: function() {
								c.reload()
							}
						}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
							e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, g({
								questionTypeId: t.questionTypeId,
								pageNo: m.pageNo,
								pageSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
							e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, g().then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})
						}, e.dolinkDocUnKnown.searchQuestion = function(t) {
							13 === t.keyCode || "click" === t ? (p = !0, g({
								pageNo: m.pageNo,
								pagerSize: m.pagerSize
							}).then(function(t) {
								t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
							})) : p = !1
						}, d.$promise.then(d.show)
				}
			}, e.issuesLearningObj.operateDocKnown = function(a) {
				console.log(r);
				var o = "",
					i = "",
					s = r.docId;
				if (e.issuesLearningObj.checkObj.checkedList.length) {
					switch (o = e.issuesLearningObj.checkObj.getIdStr("learnId", e.issuesLearningObj.tableListData.list), a) {
						case 1:
							i = t.deleteDocKnown({
								ids: o
							});
							break;
						case 2:
							i = t.doPassDocKnown({
								docId: s,
								learnIds: o
							});
							break;
						case 3:
							i = t.doKnownToUnKnown({
								learnIds: o
							})
					}
					i.then(function() {
						n.showIssuesLearningReload(r, l.currentPageAll, d.pagerSize)
					})
				}
			}, e.issuesLearningObj.reloadPage = function() {
				c.reload()
			}, f()
		}, {
			init: n.init,
			index: n.index,
			formData: n.formData,
			categoryObj: n.categoryObj,
			paginationObj: n.paginationObj,
			getTableListByCategory: n.getTableListByCategory,
			getTableListByPagination: n.getTableListByPagination,
			showIssuesLearning: n.showIssuesLearning,
			showIssuesLearningReload: n.showIssuesLearningReload,
			showIssuesLearningReload_creat: n.showIssuesLearningReload_creat
		}
	}(), e.tab[1] = function() {
		var n = {};
		return n.index = 1, n.formData = {}, n.categoryObj = {
			config: {}
		}, n.paginationObj = {
			config: {}
		}, n.defParamsObj = {
			keyWords: "",
			unKnownType: null,
			pageNo: 1,
			pagerSize: 20
		}, n.checkObj = new o, n.isEnabledKeyWords = !1, n.init = function() {
			n.initFormData(), n.initPagination(), n.initTableList().then(function(t) {
				t && (e.tab[n.index].paginationObj.config.totalItems = t.totalCount, e.tab[n.index].paginationObj.config.isInit = !0)
			})
		}, n.initFormData = function() {
			e.tab[n.index].formData = {
				keyWords: "",
				unKnownType: 0,
				unKnowntypeText: "",
				unKnownTypeArr: ["类型", "客服标记", "机器学习"]
			}, e.tab[n.index].formData.unKnowntypeText = e.tab[n.index].formData.unKnownTypeArr[e.tab[n.index].formData.unKnownType]
		}, n.initPagination = function() {
			e.tab[n.index].paginationObj = {
				config: {
					isInit: !0,
					totalItems: 0,
					pageSize: n.defParamsObj.pagerSize,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: !0,
					callBack: null
				}
			}
		}, n.initTableList = function(r) {
			return r = r ? r : {}, t.getPagerDocUnknownList({
				keyWords: n.isEnabledKeyWords ? r.keyWords || e.tab[n.index].formData.keyWords || n.defParamsObj.keyWords : n.defParamsObj.keyWords,
				unKnownType: r.unKnownType || e.tab[n.index].formData.unKnownType || n.defParamsObj.unKnownType,
				pageNo: r.pageNo || e.tab[n.index].paginationObj.currentPage || n.defParamsObj.pageNo,
				pagerSize: r.pagerSize || e.tab[n.index].paginationObj.pageSize || n.defParamsObj.pagerSize
			}).then(function(t) {
				return t.retCode !== a.retCodeList.success ? !1 : (e.tableBodyData = {
					list: t.items
				}, e.tab[n.index].checkObj = new o, t)
			})
		}, n.getTableListByPagination = function(t) {
			e.tab[n.index].paginationObj.currentPage = t.currentPage, e.tab[n.index].paginationObj.pageSize = t.pageSize, n.initTableList()
		}, n.searchIssues = function(t) {
			13 === t || "click" === t ? (n.isEnabledKeyWords = !0, n.initTableList({
				pageNo: n.defParamsObj.pageNo,
				pagerSize: n.defParamsObj.pagerSize
			}).then(function(t) {
				t && (e.tab[n.index].paginationObj.config.totalItems = t.totalCount, e.tab[n.index].paginationObj.config.isInit = !0)
			})) : n.isEnabledKeyWords = !1
		}, n.stateSelect = function(t) {
			e.tab[n.index].formData.unKnownType = t, e.tab[n.index].formData.unKnowntypeText = e.tab[n.index].formData.unKnownTypeArr[e.tab[n.index].formData.unKnownType], 0 == t && (e.tab[n.index].formData.unKnownType = null), n.initTableList().then(function(t) {
				t && (e.tab[n.index].paginationObj.config.totalItems = t.totalCount, e.tab[n.index].paginationObj.config.isInit = !0)
			})
		}, n.updateDocUnknown = function(a, o) {
			13 === a.keyCode ? (o.isEnabledEdit = !o.isEnabledEdit, e.tab[n.index].formData.questionTitle !== o.questionTitle && t.updateDocUnKnown({
				learnId: o.learnId,
				questionTitle: e.tab[n.index].formData.questionTitle
			}).then(function(t) {
				o.questionTitle = e.tab[n.index].formData.questionTitle
			})) : 27 === a.keyCode && (a.stopPropagation(), o.isEnabledEdit = !o.isEnabledEdit)
		}, n.updateDocUnknownBlur = function(a) {
			a.isEnabledEdit = !a.isEnabledEdit, e.tab[n.index].formData.questionTitle !== a.questionTitle && t.updateDocUnKnown({
				learnId: a.learnId,
				questionTitle: e.tab[n.index].formData.questionTitle
			}).then(function(t) {
				a.questionTitle = e.tab[n.index].formData.questionTitle
			})
		}, n.operateDocUnknown = function(r) {
			var s = "",
				c = null,
				l = !1,
				u = {
					questionTypeId: "-1",
					keyWords: "",
					docStatus: 0,
					orderType: 1,
					pageNo: 1,
					pagerSize: 5
				},
				d = null;
			if (e.tab[n.index].checkObj.checkedList.length) switch (s = e.tab[n.index].checkObj.getIdStr("learnId", e.tableBodyData.list), r) {
				case 1:
					t.deleteDocUnKnown({
						learnIds: s
					}).then(function(e) {
						n.init();
						var t, o;
						t = e && e.retCode && e.retCode === a.retCodeList.success ? {
							title: "",
							content: e.retMsg || "成功",
							type: "success"
						} : {
							title: "",
							content: e.retMsg || "失败",
							type: "warning"
						}, o = i.alert(t), o.$promise.then(o.show)
					});
					break;
				case 2:
					c = i.modal({
						scope: e,
						templateUrl: "views/repository/strap-modal-addIssues.html"
					});
					var p = e.tab[n.index].checkObj.checkedList.sort(function(e, t) {
							return e > t ? 1 : -1
						}),
						m = p.length,
						g = e.tableBodyData.list,
						f = {
							id: "line-addIssues",
							model: ""
						};
					e.addIssuesObj = {
						modalDomData: {
							title: "添加问题"
						},
						docStatusTextArr: ["启用", "停用"],
						ueditorConfig: {
							zIndex: 1100
						},
						defLineObj: {
							id: f.id + "-0"
						},
						lineList: function() {
							for (var e = [], t = 0; m > t; t++) t > 1 && e.push({
								id: f.id + "-" + (e.length + 1),
								inputVal: null,
								model: ""
							});
							return e
						}(),
						formData: {
							questionTitle: g[p[0]].questionTitle,
							questionList: function() {
								for (var e = [], t = 0; m > t; t++) t && e.push(g[p[t]].questionTitle);
								return e
							}(),
							answerDesc: "",
							docStatus: 0
						},
						addLine: function(t) {
							document.getElementById(e.addIssuesObj.defLineObj.id).focus(), t && (e.addIssuesObj.lineList.push({
								id: f.id + "-" + (e.addIssuesObj.lineList.length + 1),
								inputVal: t,
								model: ""
							}), e.addIssuesObj.formData.questionList[0] = "")
						},
						removeLine: function(t) {
							var a = e.addIssuesObj.lineList.length,
								o = null,
								n = [],
								r = [];
							r[0] = e.addIssuesObj.formData.questionList[0];
							for (var i = 0; a > i; i++) o = e.addIssuesObj.lineList[i], i !== t && (n.push(o), n[n.length - 1].id = f.id + "-" + n.length, r.push(e.addIssuesObj.formData.questionList[i + 1]));
							e.addIssuesObj.formData.questionList = r, e.addIssuesObj.lineList = n
						},
						selectCategory: function() {
							e.selectCategory = {
								categoryObj: {
									config: {
										isInit: !0,
										isShowCount: !0,
										interfaceName: "kb/queryGroupList",
										isAutoCallback: !0,
										isShowAll: !1,
										callBack: null,
										reduceCategoryCount: null
									}
								}
							}, e.selectCategory.getCategory = function(t) {
								e.selectCategory.categoryObj.data = t
							};
							var t = i.modal({
								scope: e,
								templateUrl: "views/public/strap-modal-selectCategory.html"
							});
							e.modalDomData = {
								title: "选择分类",
								pathStr: ""
							}, t.$promise.then(t.show), e.selectCategory.confirm = function() {
								e.addIssuesObj.formData.pathStr = e.selectCategory.categoryObj.data.pathStr, e.addIssuesObj.formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, t.hide()
							}
						},
						confirm: function() {
							for (var o, r = e.addIssuesObj.formData.questionList, l = r.length, u = [], d = 0; l > d; d++) o = r[d], o && u.push(o);
							r = u, t.saveDoc({
								questionTypeId: e.addIssuesObj.formData.questionTypeId,
								questionTitle: e.addIssuesObj.formData.questionTitle,
								questionList: r,
								answerDesc: UE.getEditor("editor01").getContent(),
								linkquestionList: [],
								usedFlag: e.addIssuesObj.formData.docStatus
							}).then(function(e) {
								var o;
								e && e.retCode && e.retCode === a.retCodeList.success ? (o = i.alert({
									content: e.retMsg || "成功",
									type: "success"
								}), o.$promise.then(o.show), c.hide(), t.updateDocUnKnownStatus({
									learnIds: s
								}).then(function(e) {
									n.init()
								})) : (o = i.alert({
									content: e.retMsg || "失败",
									type: "warning"
								}), o.$promise.then(o.show))
							})
						}
					}, c.$promise.then(c.show);
					break;
				case 3:
					c = i.modal({
						scope: e,
						templateUrl: "views/repository/strap-modal-dolinkDocUnKnown.html"
					}), d = function(n) {
						return n = n ? n : {}, t.getIssuesListByCategory({
							questionTypeId: n.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || u.questionTypeId,
							keyWords: l ? n.keyWords || e.dolinkDocUnKnown.formData.keyWords || u.keyWords : u.keyWords,
							docStatus: 0,
							orderType: 1,
							pageNo: n.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || u.pageNo,
							pagerSize: n.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || u.pagerSize
						}).then(function(t) {
							return t.retCode !== a.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
								list: t.items
							}, e.dolinkDocUnKnown.checkObj = new o, t)
						})
					}, e.dolinkDocUnKnown = {
						modalDomData: {
							title: "关联问题"
						},
						formData: {
							docId: "",
							keyWords: ""
						},
						categoryObj: {
							config: {
								isInit: !0,
								isShowCount: !0,
								interfaceName: "kb/queryGroupList",
								isAutoCallback: !0,
								callBack: null
							}
						},
						paginationObj: {
							config: {
								isInit: !0,
								totalItems: 0,
								pageSize: u.pagerSize,
								prevText: "< 上一页",
								nextText: "下一页 >",
								moreText: "···",
								isAutoCallback: !0,
								callBack: null
							}
						},
						confirm: function() {
							c.hide(), t.dolinkDocUnKnown({
								docId: e.dolinkDocUnKnown.formData.docId,
								learnIds: s
							}).then(function(e) {
								n.init();
								var t, o;
								t = e && e.retCode && e.retCode === a.retCodeList.success ? {
									title: "",
									content: e.retMsg || "成功",
									type: "success"
								} : {
									title: "",
									content: e.retMsg || "失败",
									type: "warning"
								}, o = i.alert(t), o.$promise.then(o.show)
							})
						}
					}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
						e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, d({
							questionTypeId: t.questionTypeId,
							pageNo: u.pageNo,
							pageSize: u.pagerSize
						}).then(function(t) {
							t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
						})
					}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
						e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, d().then(function(t) {
							t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
						})
					}, e.dolinkDocUnKnown.searchQuestion = function(t) {
						13 === t.keyCode || "click" === t ? (l = !0, d({
							pageNo: u.pageNo,
							pagerSize: u.pagerSize
						}).then(function(t) {
							t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
						})) : l = !1
					}, c.$promise.then(c.show)
			}
		}, {
			init: n.init,
			index: n.index,
			formData: n.formData,
			stateSelect: n.stateSelect,
			searchIssues: n.searchIssues,
			paginationObj: n.paginationObj,
			getTableListByPagination: n.getTableListByPagination,
			updateDocUnknown: n.updateDocUnknown,
			updateDocUnknownBlur: n.updateDocUnknownBlur,
			operateDocUnknown: n.operateDocUnknown,
			checkObj: n.checkObj,
			operateDoc: n.operateDoc
		}
	}(), d()
}]).controller("AddIssuesCtrl", ["$scope", "$stateParams", "RepositoryServ", "Upload", "zcGlobal", "checkServ", "$rootScope", "DialogServ", function(e, t, a, o, n, r, i, s) {
	e.tabsActiveIndex = t.tabsActiveIndex;
	var c = function() {
			a.getAddIssuesTabs().then(function(t) {
				e.tabs = t.tabs, e.tabsList = {
					list: t.tabs
				}
			})
		},
		l = function() {
			c()
		};
	e.filterStr = function(e, t, a, o) {
		return e.map(function(e) {
			return e[t] = e[t].substr(0, a) + o, e
		})
	}, e.showFooter = [!0, !1], e.tabsActiveCallback = function(t) {
		switch (t = parseInt(t), parseInt(t)) {
			case 0:
				e.tab[t].init();
				break;
			case 1:
				e.tab[t].init();
				break;
			default:
				e.tab[0].init()
		}
	}, e.tab = [], e.tab[0] = function() {
		var t = {};
		t.index = 0, t.lineObj = {
			id: "line-tab-addIssues",
			model: ""
		}, t.defLineObj = {
			id: t.lineObj.id + "-0"
		}, t.lineList = [], t.relatedproblemList = [], t.docStatusTextArr = ["启用", "停用"], t.formData = {
			docStatus: 0,
			docStatusText: t.docStatusTextArr[0],
			questionList: [],
			linkquestionList: []
		}, t.updateDocStatus = function(a) {
			e.tab[t.index].formData.docStatus = a, e.tab[t.index].formData.docStatusText = t.docStatusTextArr[e.tab[t.index].formData.docStatus]
		}, t.init = function() {
			e.tab[t.index].lineList = t.lineList, e.tab[t.index].formData = t.formData, e.tab[t.index].relatedproblem.list = [], t.relatedproblemList = []
		}, t.clearData = function() {
			e.tab[t.index].formData = {
				docStatus: 0,
				docStatusText: t.docStatusTextArr[0],
				questionList: [],
				linkquestionList: []
			}, e.tab[t.index].lineList = [], e.tab[t.index].relatedproblem.list = [], t.formData = {
				docStatus: 0,
				docStatusText: t.docStatusTextArr[0],
				questionList: [],
				linkquestionList: []
			}, t.lineList = [], t.relatedproblemList = []
		}, t.addLine = function(a) {
			document.getElementById(t.defLineObj.id).focus(), a && (t.lineList.push({
				id: t.lineObj.id + "-" + (t.lineList.length + 1),
				inputVal: a,
				model: ""
			}), e.tab[t.index].formData.questionList[0] = "", e.tab[t.index].lineList = t.lineList)
		}, t.removeLine = function(a) {
			var o = t.lineList.length,
				n = null,
				r = [],
				i = [];
			i[0] = e.tab[t.index].formData.questionList[0];
			for (var s = 0; o > s; s++) n = t.lineList[s], s !== a && (r.push(n), r[r.length - 1].id = t.lineObj.id + "-" + r.length, i.push(e.tab[t.index].formData.questionList[s + 1]));
			e.tab[t.index].formData.questionList = i, t.lineList = r, e.tab[t.index].lineList = t.lineList
		}, t.selectCategory = function() {
			e.selectCategory = {
				categoryObj: {
					config: {
						isInit: !0,
						isShowCount: !0,
						interfaceName: "kb/queryGroupList",
						isAutoCallback: !0,
						isShowAll: !1,
						callBack: null
					}
				}
			}, e.selectCategory.getCategory = function(t) {
				e.selectCategory.categoryObj.data = t
			};
			var a = s.modal({
				scope: e,
				templateUrl: "views/public/strap-modal-selectCategory.html"
			});
			e.modalDomData = {
				title: "选择分类",
				pathStr: ""
			}, a.$promise.then(a.show), e.selectCategory.confirm = function() {
				e.tab[t.index].formData.pathStr = e.selectCategory.categoryObj.data.pathStr, e.tab[t.index].formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, a.hide()
			}
		}, t.stateSelect = function(e) {
			t.updateDocStatus(e)
		}, t.addIssues = function() {
			for (var o, r = e.tab[t.index].formData.questionList, i = r.length, c = [], l = 0; i > l; l++) o = r[l], o && c.push(o);
			r = c, a.saveDoc({
				questionTypeId: e.tab[t.index].formData.questionTypeId,
				questionTitle: e.tab[t.index].formData.questionTitle,
				questionList: r,
				answerDesc: UE.getEditor("editor").getContent(),
				linkquestionList: e.tab[t.index].formData.linkquestionList,
				usedFlag: e.tab[t.index].formData.docStatus
			}).then(function(t) {
				var a, o;
				t && t.retCode && t.retCode === n.retCodeList.success ? (a = {
					content: t.retMsg || "成功",
					type: "success"
				}, e.tab[0].clearData()) : a = {
					content: t.retMsg || "失败",
					type: "warning"
				}, o = s.alert(a), o.$promise.then(o.show)
			})
		};
		var o = ["关联", "编辑"];
		return t.relatedproblem = {
			defObj: {
				name: "relatedproblem",
				value: "",
				isShowBtn: !1,
				btnText: o[0],
				isRelated: !1
			},
			list: []
		}, t.relatedproblem.create = function() {
			console.log(t.relatedproblemList.length);
			var a = {
				name: "relatedproblem-" + (t.relatedproblemList.length + 1),
				value: "",
				isShowBtn: !1,
				btnText: o[0],
				isRelated: !1
			};
			t.relatedproblemList.push(a), i.safeApply(function() {
				e.tab[t.index].relatedproblem.list = t.relatedproblemList
			})
		}, t.relatedproblem.toggleShow = function(a, o) {
			for (var n = e.tab[t.index].relatedproblem.list, r = n.length, s = 0; r > s; s++) s === a ? (e.tab[t.index].relatedproblem.list[s].isShowBtn = !0, e.tab[t.index].relatedproblem.list[s].isShowEditBtn = !!o) : e.tab[t.index].relatedproblem.list[s].isShowBtn = !1;
			i.safeApply(function() {
				return e.tab[t.index].relatedproblem.list
			})
		}, t.relatedproblem.remove = function(a) {
			for (var o, n = e.tab[t.index].relatedproblem.list, r = n.length, i = [], s = e.tab[t.index].formData.linkquestionList, c = s.length, l = [], u = 0; r > u; u++) o = n[u], u !== a && i.push(o);
			t.relatedproblemList = i, e.tab[t.index].relatedproblem.list = t.relatedproblemList;
			for (var u = 0; c > u; u++) o = s[u], u !== a && l.push(o);
			e.tab[t.index].formData.linkquestionList = l
		}, t.relatedproblem.edit = function(i, c) {
			var l = s.modal({
					scope: e,
					templateUrl: "views/repository/strap-modal-dolinkDocUnKnown.html"
				}),
				u = {
					questionTypeId: "-1",
					keyWords: "",
					docStatus: 0,
					orderType: 1,
					pageNo: 1,
					pagerSize: 5
				},
				d = !1,
				p = function(t) {
					return t = t ? t : {}, a.getIssuesListByCategory({
						questionTypeId: t.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || u.questionTypeId,
						keyWords: d ? t.keyWords || e.dolinkDocUnKnown.formData.keyWords || u.keyWords : u.keyWords,
						docStatus: 0,
						orderType: 1,
						pageNo: t.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || u.pageNo,
						pagerSize: t.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || u.pagerSize
					}).then(function(t) {
						return t.retCode !== n.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
							list: t.items
						}, e.dolinkDocUnKnown.checkObj = new r, t)
					})
				};
			e.dolinkDocUnKnown = {
				modalDomData: {
					title: "关联问题"
				},
				formData: {
					docId: "",
					keyWords: ""
				},
				relatedproblemTitle: c.subDoc || "",
				categoryObj: {
					config: {
						isInit: !0,
						isShowCount: !0,
						interfaceName: "kb/queryGroupList",
						isAutoCallback: !0,
						callBack: null
					}
				},
				paginationObj: {
					config: {
						isInit: !0,
						totalItems: 0,
						pageSize: u.pagerSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
				e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, p({
					questionTypeId: t.questionTypeId,
					pageNo: u.pageNo,
					pageSize: u.pagerSize
				}).then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})
			}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
				e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, p().then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})
			}, e.dolinkDocUnKnown.searchQuestion = function(t) {
				13 === t.keyCode || "click" === t ? (d = !0, p({
					pageNo: u.pageNo,
					pagerSize: u.pagerSize
				}).then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})) : d = !1
			}, e.dolinkDocUnKnown.confirm = function() {
				if (e.dolinkDocUnKnown.formData.docId) {
					l.hide(), e.tab[t.index].formData.linkquestionList[i][1] = e.dolinkDocUnKnown.formData.docId, c.isRelated = !0, c.isRelated ? c.btnText = o[1] : c.btnText = o[0];
					for (var a = e.dolinkDocUnKnown.tableBodyData.list, n = a.length, r = 0; n > r; r++) e.dolinkDocUnKnown.formData.docId === a[r].docId && (c.subDoc = a[r].questionTitle)
				}
			}, l.$promise.then(l.show)
		}, {
			clearData: t.clearData,
			init: t.init,
			index: t.index,
			defLineObj: t.defLineObj,
			lineList: t.lineList,
			formData: t.formData,
			addLine: t.addLine,
			removeLine: t.removeLine,
			selectCategory: t.selectCategory,
			stateSelect: t.stateSelect,
			addIssues: t.addIssues,
			relatedproblem: t.relatedproblem
		}
	}(), e.tab[1] = function() {
		var t = {};
		return t.index = 1, t.fileObj = {
			btnText: "选择文件",
			btnText2: "重新选择",
			file: ""
		}, t.init = function() {
			e.tab[t.index].fileObj = t.fileObj
		}, t.uploadFile = function() {
			var a = e.tab[t.index].fileObj.file;
			e.tab[t.index].fileObj.file = null, a && a.size && o.upload({
				url: "/kb/importDoc/" + n.ServVersion,
				data: {
					file: a
				}
			}).then(function(a) {
				var o, r, i = a.data;
				i && i.retCode && i.retCode === n.retCodeList.success ? (o = {
					content: i.retMsg || "成功",
					type: "success"
				}, e.tab[t.index].fileObj.file = "") : (o = {
					scope: e,
					content: i.retMsg || "失败",
					type: "warning"
				}, e.alertDomData = {
					collapse: !0,
					triggerCollapse: !1,
					failMsg: i.items
				}, e.alertDomData.failMsg.length ? o.duration = !1 : ""), r = s.alert(o), r.$promise.then(r.show)
			}, function(e) {}, function(e) {
				parseInt(100 * e.loaded / e.total)
			})
		}, {
			init: t.init,
			index: t.index,
			fileObj: t.fileObj,
			uploadFile: t.uploadFile
		}
	}(), l()
}]).controller("EditIssuesCtrl", ["$scope", "$stateParams", "RepositoryServ", "zcGlobal", "checkServ", "$rootScope", "$timeout", "DialogServ", "TabServ", function(e, t, a, o, n, r, i, s, c) {
	var l = t.docID,
		u = ["关联", "编辑"],
		d = ({
			defObj: {
				name: "relatedproblem",
				value: "",
				isShowBtn: !1,
				btnText: u[1],
				isRelated: !1
			},
			list: []
		}, []),
		d = [],
		p = function() {
			a.showDoc({
				docId: l
			}).then(function(t) {
				return t.retCode !== o.retCodeList.success ? !1 : void(e.formData = t.item)
			}).then(function() {
				a.pagerLinkQuestion({
					docId: l
				}).then(function(t) {
					return t.retCode !== o.retCodeList.success ? !1 : (e.relatedproblem.list = t.items, d = t.items, void c.autoSave({
						period: 500,
						data: {
							formData: e.formData,
							relatedproblemList: e.relatedproblem.list
						}
					}, function(t) {
						t && (e.formData = t.formData ? t.formData : e.formData, e.relatedproblem.list = t.relatedproblemList ? t.relatedproblemList : e.relatedproblem.list, d = t.relatedproblemList ? t.relatedproblemList : e.relatedproblem.list)
					}))
				})
			}).then(function() {})
		},
		m = function() {
			p()
		};
	e.filterStr = function(e, t, a, o) {
		return e.map(function(e) {
			return e[t] = e[t].substr(0, a) + o, e
		})
	}, e.docStatusTextArr = ["启用", "停用"], e.relatedproblem = {
		btnText: u[1],
		list: [],
		create: function() {
			var t = {
				name: "relatedproblem-" + (e.relatedproblem.list.length + 1),
				value: "",
				isShowBtn: !1,
				btnText: u[0],
				isRelated: !1,
				isCreated: !0
			};
			e.relatedproblem.list.push(t), r.safeApply(function() {})
		},
		toggleShow: function(t, a) {
			for (var o = e.relatedproblem.list, n = o.length, i = 0; n > i; i++) i === t ? (e.relatedproblem.list[i].isShowBtn = !0, e.relatedproblem.list[i].isShowEditBtn = !!a) : e.relatedproblem.list[i].isShowBtn = !1;
			r.safeApply(function() {
				return e.relatedproblem.list
			})
		},
		remove: function(t) {
			for (var o, n = e.relatedproblem.list, r = n.length, i = [], s = e.relatedproblem.list[t], c = 0; r > c; c++) o = n[c], c !== t && i.push(o);
			d = i, e.relatedproblem.list = d, a.deleteLinkQuestion({
				docId: l,
				answerId: s.answerId
			})
		},
		update: function(e) {
			return e = e ? e : {}, a.updateLinkQuestion({
				answerId: e.answerId,
				docId: e.docId,
				subDocId: e.subDocId,
				answerDesc: e.answerDesc
			})
		},
		save: function(e) {
			return e = e ? e : {}, a.saveLinkQuestion({
				docId: e.docId,
				subDocId: e.subDocId,
				answerDesc: e.answerDesc
			})
		},
		saveAnswerDesc: function(t, a) {
			13 === t.keyCode && e.relatedproblem.list[a].answerDesc && (e.relatedproblem.list[a].hasOwnProperty("isCreated") ? e.relatedproblem.list[a].isRelated && e.relatedproblem.update({
				answerId: e.relatedproblem.list[a].answerId,
				docId: l,
				subDocId: e.relatedproblem.list[a].subDocId,
				answerDesc: e.relatedproblem.list[a].answerDesc
			}) : e.relatedproblem.update({
				answerId: e.relatedproblem.list[a].answerId,
				docId: l,
				subDocId: e.relatedproblem.list[a].subDocId,
				answerDesc: e.relatedproblem.list[a].answerDesc
			}))
		},
		saveAnswerDescBlur: function(t) {
			e.relatedproblem.list[t].answerDesc && (e.relatedproblem.list[t].hasOwnProperty("isCreated") ? e.relatedproblem.list[t].isRelated && e.relatedproblem.update({
				answerId: e.relatedproblem.list[t].answerId,
				docId: l,
				subDocId: e.relatedproblem.list[t].subDocId,
				answerDesc: e.relatedproblem.list[t].answerDesc
			}) : e.relatedproblem.update({
				answerId: e.relatedproblem.list[t].answerId,
				docId: l,
				subDocId: e.relatedproblem.list[t].subDocId,
				answerDesc: e.relatedproblem.list[t].answerDesc
			}))
		},
		edit: function(t, r) {
			var i = s.modal({
					scope: e,
					templateUrl: "views/repository/strap-modal-dolinkDocUnKnown.html"
				}),
				c = {
					questionTypeId: "-1",
					keyWords: "",
					docStatus: 0,
					orderType: 1,
					pageNo: 1,
					pagerSize: 5
				},
				d = !1,
				p = function(t) {
					return t = t ? t : {}, a.getIssuesListByCategory({
						questionTypeId: t.questionTypeId || e.dolinkDocUnKnown.categoryObj.questionTypeId || c.questionTypeId,
						keyWords: d ? t.keyWords || e.dolinkDocUnKnown.formData.keyWords || c.keyWords : c.keyWords,
						docStatus: 0,
						orderType: 1,
						pageNo: t.pageNo || e.dolinkDocUnKnown.paginationObj.currentPage || c.pageNo,
						pagerSize: t.pagerSize || e.dolinkDocUnKnown.paginationObj.pageSize || c.pagerSize
					}).then(function(t) {
						return t.retCode !== o.retCodeList.success ? !1 : (e.dolinkDocUnKnown.tableBodyData = {
							list: t.items
						}, e.dolinkDocUnKnown.checkObj = new n, t)
					})
				};
			e.dolinkDocUnKnown = {
				modalDomData: {
					title: "关联问题"
				},
				formData: {
					docId: "",
					keyWords: ""
				},
				relatedproblemTitle: r.subDoc || "",
				categoryObj: {
					config: {
						isInit: !0,
						isShowCount: !0,
						interfaceName: "kb/queryGroupList",
						isAutoCallback: !0,
						callBack: null
					}
				},
				paginationObj: {
					config: {
						isInit: !0,
						totalItems: 0,
						pageSize: c.pagerSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.dolinkDocUnKnown.getTableListByCategory = function(t) {
				e.dolinkDocUnKnown.categoryObj.questionTypeId = t.questionTypeId, e.dolinkDocUnKnown.categoryObj.questionTypeName = t.questionTypeName, e.dolinkDocUnKnown.categoryObj.typeLevel = t.typeLevel, p({
					questionTypeId: t.questionTypeId,
					pageNo: c.pageNo,
					pageSize: c.pagerSize
				}).then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})
			}, e.dolinkDocUnKnown.getTableListByPagination = function(t) {
				e.dolinkDocUnKnown.paginationObj.currentPage = t.currentPage, e.dolinkDocUnKnown.paginationObj.pageSize = t.pageSize, p().then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})
			}, e.dolinkDocUnKnown.searchQuestion = function(t) {
				13 === t.keyCode || "click" === t ? (d = !0, p({
					pageNo: c.pageNo,
					pagerSize: c.pagerSize
				}).then(function(t) {
					t && (e.dolinkDocUnKnown.paginationObj.config.totalItems = t.totalCount, e.dolinkDocUnKnown.paginationObj.config.isInit = !0)
				})) : d = !1
			}, e.dolinkDocUnKnown.confirm = function() {
				e.dolinkDocUnKnown.formData.docId && (i.hide(), e.relatedproblem.list[t].subDocId = e.dolinkDocUnKnown.formData.docId, e.relatedproblem.list[t].hasOwnProperty("isCreated") ? e.relatedproblem.list[t].isRelated ? e.relatedproblem.update({
					answerId: e.relatedproblem.list[t].answerId,
					docId: l,
					subDocId: e.relatedproblem.list[t].subDocId,
					answerDesc: e.relatedproblem.list[t].answerDesc
				}) : e.relatedproblem.save({
					docId: l,
					subDocId: e.relatedproblem.list[t].subDocId,
					answerDesc: e.relatedproblem.list[t].answerDesc
				}).then(function(a) {
					if (a.retCode === o.retCodeList.success) {
						e.relatedproblem.list[t].answerId = a.item, r.isRelated = !0, r.isRelated ? r.btnText = u[1] : r.btnText = u[0];
						for (var n = e.dolinkDocUnKnown.tableBodyData.list, i = n.length, s = 0; i > s; s++) e.dolinkDocUnKnown.formData.docId === n[s].docId && (r.subDoc = n[s].questionTitle)
					}
				}) : e.relatedproblem.update({
					answerId: e.relatedproblem.list[t].answerId,
					docId: l,
					subDocId: e.relatedproblem.list[t].subDocId,
					answerDesc: e.relatedproblem.list[t].answerDesc
				}))
			}, i.$promise.then(i.show)
		}
	}, e.editQuestion = function() {
		var t = {
				keyWords: "",
				pageNo: 1,
				pagerSize: 10
			},
			r = 1,
			i = s.modal({
				scope: e,
				templateUrl: "views/repository/strap-modal-editQuestion.html"
			}),
			c = !1,
			u = function(r) {
				return r = r ? r : {}, a.pagerSimilarQuestion({
					docId: l,
					keyWords: c ? r.keyWords || e.editQuestionObj.formData.keyWords || t.keyWords : t.keyWords,
					pageNo: r.pageNo || e.editQuestionObj.paginationObj.currentPage || t.pageNo,
					pagerSize: r.pagerSize || e.editQuestionObj.paginationObj.pageSize || t.pagerSize
				}).then(function(t) {
					return t.retCode !== o.retCodeList.success ? !1 : (e.editQuestionObj.tableBodyData.list = t.items, e.editQuestionObj.checkObj = new n, t)
				})
			},
			d = function() {
				u().then(function(t) {
					t && (e.editQuestionObj.paginationObj.config.totalItems = t.totalCount, e.editQuestionObj.paginationObj.config.isInit = !0, e.formData.smailQuestionNum = t.totalCount, e.editQuestionObj.paginationObj.config.jumpToPage = r)
				})
			};
		e.editQuestionObj = {
			modalDomData: {
				title: "编辑相似问法"
			},
			formData: {
				keyWords: ""
			},
			paginationObj: {
				config: {
					isInit: !1,
					totalItems: 0,
					pageSize: t.pagerSize,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: !0,
					callBack: null
				}
			},
			tableBodyData: {
				list: null
			},
			getTableListByPagination: function(t) {
				e.editQuestionObj.paginationObj.currentPage = t.currentPage, e.editQuestionObj.paginationObj.pageSize = t.pageSize, r = t.currentPage, u().then(function(t) {
					t && (e.editQuestionObj.paginationObj.config.totalItems = t.totalCount, e.editQuestionObj.paginationObj.config.isInit = !0, e.formData.smailQuestionNum = t.totalCount)
				})
			},
			searchQuestion: function(a) {
				13 === a.keyCode || "click" === a ? (c = !0, u({
					pageNo: t.pageNo,
					pagerSize: t.pagerSize
				}).then(function(t) {
					t && (e.editQuestionObj.paginationObj.config.totalItems = t.totalCount, e.editQuestionObj.paginationObj.config.isInit = !0)
				})) : c = !1
			},
			updateQuestion: function(t, o) {
				13 === t.keyCode ? (o.isEnabledEdit = !o.isEnabledEdit, e.editQuestionObj.formData.questionTitle !== o.questionTitle && a.updateQuestion({
					docId: l,
					questionId: o.questionId,
					questionTitle: e.editQuestionObj.formData.questionTitle
				}).then(function(t) {
					o.questionTitle = e.editQuestionObj.formData.questionTitle
				})) : 27 === t.keyCode && (t.stopPropagation(), o.isEnabledEdit = !o.isEnabledEdit)
			},
			updateQuestionBlur: function(t) {
				t.isEnabledEdit = !t.isEnabledEdit, e.editQuestionObj.formData.questionTitle !== t.questionTitle && a.updateQuestion({
					docId: l,
					questionId: t.questionId,
					questionTitle: e.editQuestionObj.formData.questionTitle
				}).then(function(a) {
					t.questionTitle = e.editQuestionObj.formData.questionTitle
				})
			},
			deleteQuestion: function() {
				var t = "";
				e.editQuestionObj.checkObj.checkedList.length && (t = e.editQuestionObj.checkObj.getIdStr("questionId", e.editQuestionObj.tableBodyData.list), a.deleteQuestion({
					docId: l,
					ids: t
				}).then(function(e) {
					"000000" == e.retCode && d()
				}))
			},
			editQuestionConfirm: function() {
				var t = "";
				if (e.editQuestionObj.checkObj.checkedList.length) {
					t = e.editQuestionObj.checkObj.getIdStr("questionId", e.editQuestionObj.tableBodyData.list);
					var n = {
							questionTypeId: "-1",
							keyWords: "",
							docStatus: 0,
							orderType: 1,
							pageNo: 1,
							pagerSize: 5
						},
						r = s.modal({
							scope: e,
							templateUrl: "views/repository/strap-modal-moveQuestion.html"
						}),
						i = !1,
						c = function(t) {
							return t = t ? t : {}, a.getIssuesListByCategory({
								questionTypeId: t.questionTypeId || e.moveQuestionObj.categoryObj.questionTypeId || n.questionTypeId,
								keyWords: i ? t.keyWords || e.moveQuestionObj.formData.keyWords || n.keyWords : n.keyWords,
								docStatus: t.docStatus || e.moveQuestionObj.formData.docStatus || n.docStatus,
								orderType: t.orderType || e.moveQuestionObj.formData.orderType || n.orderType,
								pageNo: t.pageNo || e.moveQuestionObj.paginationObj.currentPage || n.pageNo,
								pagerSize: t.pagerSize || e.moveQuestionObj.paginationObj.pageSize || n.pagerSize
							}).then(function(t) {
								return t.retCode !== o.retCodeList.success ? !1 : (e.moveQuestionObj.tableBodyData.list = t.items, t)
							})
						};
					e.moveQuestionObj = {
						modalDomData: {
							title: "转移相似问法"
						},
						formData: {
							keyWords: ""
						},
						categoryObj: {
							config: {
								isInit: !0,
								isShowCount: !0,
								interfaceName: "kb/queryGroupList",
								isAutoCallback: !0,
								callBack: null
							}
						},
						paginationObj: {
							config: {
								isInit: !1,
								totalItems: 0,
								pageSize: n.pagerSize,
								prevText: "< 上一页",
								nextText: "下一页 >",
								moreText: "···",
								isAutoCallback: !0,
								callBack: null
							}
						},
						tableBodyData: {
							list: null
						},
						getTableListByCategory: function(t) {
							e.moveQuestionObj.categoryObj.questionTypeId = t.questionTypeId, e.moveQuestionObj.categoryObj.questionTypeName = t.questionTypeName, e.moveQuestionObj.categoryObj.typeLevel = t.typeLevel, c({
								questionTypeId: t.questionTypeId,
								pageNo: n.pageNo,
								pageSize: n.pagerSize
							}).then(function(t) {
								t && (e.moveQuestionObj.paginationObj.config.totalItems = t.totalCount, e.moveQuestionObj.paginationObj.config.isInit = !0)
							})
						},
						getTableListByPagination: function(t) {
							e.moveQuestionObj.paginationObj.currentPage = t.currentPage, e.moveQuestionObj.paginationObj.pageSize = t.pageSize, c().then(function(t) {
								e.moveQuestionObj.paginationObj.config.totalItems = t.totalCount, e.moveQuestionObj.paginationObj.config.isInit = !0
							})
						},
						searchQuestion: function(t) {
							13 === t.keyCode || "click" === t ? (i = !0, c({
								pageNo: n.pageNo,
								pagerSize: n.pagerSize
							}).then(function(t) {
								t && (e.moveQuestionObj.paginationObj.config.totalItems = t.totalCount, e.moveQuestionObj.paginationObj.config.isInit = !0)
							})) : i = !1
						},
						moveSmailQuestionsConfirm: function() {
							e.moveQuestionObj.formData.docId && t && a.moveSmailQuestions({
								ids: t,
								oldDocId: l,
								docId: e.moveQuestionObj.formData.docId
							}).then(function(e) {
								var t, a;
								t = e && e.retCode && e.retCode === o.retCodeList.success ? {
									title: "",
									content: e.retMsg || "成功",
									type: "success"
								} : {
									title: "",
									content: e.retMsg || "失败",
									type: "warning"
								}, a = s.alert(t), a.$promise.then(a.show), r.hide(), d()
							})
						}
					}, r.$promise.then(r.show)
				}
			}
		}, i.$promise.then(i.show), d()
	}, e.addQuestion = function() {
		var t = s.modal({
				scope: e,
				templateUrl: "views/repository/strap-modal-addQuestion.html"
			}),
			n = {
				id: "line",
				inputVal: "",
				model: ""
			},
			r = [],
			c = function() {
				t.$promise.then(t.show).then(function() {
					i(function() {
						document.getElementById(e.addQuestionObj.defLineObj.id).focus()
					}, 1e3)
				})
			};
		e.addQuestionObj = {
			modalDomData: {
				title: "添加相似问法"
			},
			formData: {
				questionList: []
			},
			defLineObj: {
				id: n.id + "-0"
			},
			lineList: [],
			addLine: function(t) {
				return document.getElementById(e.addQuestionObj.defLineObj.id).focus(), t ? (r.push({
					id: n.id + "-" + (r.length + 1),
					inputVal: t,
					model: ""
				}), e.addQuestionObj.formData.questionList[0] = "", void(e.addQuestionObj.lineList = r)) : void s.alert({
					title: "",
					content: "请输入相似问题问法",
					placement: "top",
					type: "warning",
					show: !0
				})
			},
			removeLine: function(t) {
				var a = r.length,
					o = null,
					i = [],
					s = [];
				s[0] = e.addQuestionObj.formData.questionList[0];
				for (var c = 0; a > c; c++) o = r[c], c !== t && (i.push(o), i[i.length - 1].id = n.id + "-" + i.length, s.push(e.addQuestionObj.formData.questionList[c + 1]));
				e.addQuestionObj.formData.questionList = s, r = i, e.addQuestionObj.lineList = r
			},
			confirm: function() {
				for (var n, r = e.addQuestionObj.formData.questionList, i = r.length, c = [], u = 0; i > u; u++) n = r[u], n && c.push(n);
				r = c, a.saveSimilarQuestion({
					docId: l,
					questionList: r
				}).then(function(a) {
					var n, i;
					a && a.retCode && a.retCode === o.retCodeList.success ? (n = {
						title: "",
						content: a.retMsg || "成功",
						type: "success"
					}, e.formData.smailQuestionNum = e.formData.smailQuestionNum + r.length, t.hide()) : n = {
						title: "",
						content: a.retMsg || "失败",
						type: "warning"
					}, i = s.alert(n), i.$promise.then(i.show)
				})
			}
		}, c()
	}, e.selectCategory = function() {
		e.selectCategory.categoryObj = {
			config: {
				isInit: !0,
				isShowCount: !0,
				interfaceName: "kb/queryGroupList",
				isAutoCallback: !0,
				isShowAll: !1,
				callBack: null
			}
		}, e.selectCategory.getCategory = function(t) {
			e.selectCategory.categoryObj.data = t
		};
		var t = s.modal({
			scope: e,
			templateUrl: "views/public/strap-modal-selectCategory.html"
		});
		e.modalDomData = {
			title: "选择分类",
			pathStr: ""
		}, t.$promise.then(t.show), e.selectCategory.confirm = function() {
			e.formData.allGroupName = e.selectCategory.categoryObj.data.pathStr, e.formData.questionTypeId = e.selectCategory.categoryObj.data.questionTypeId, t.hide()
		}
	}, e.updateDoc = function() {
		a.updateDoc({
			docId: l,
			questionTitle: e.formData.questionTitle,
			answerDesc: UE.getEditor("editor").getContent(),
			questionTypeId: e.formData.questionTypeId,
			usedFlag: e.formData.statusShow
		}).then(function(e) {
			var t, a;
			t = e && e.retCode && e.retCode === o.retCodeList.success ? {
				title: "",
				content: e.retMsg || "成功",
				type: "success"
			} : {
				title: "",
				content: e.retMsg || "失败",
				type: "warning"
			}, a = s.alert(t), a.$promise.then(a.show)
		})
	}, m()
}]), angular.module("Sobot4.C").controller("SettingsCtrl", ["$scope", "$state", "SettingsServ", "$window", "Upload", "LoginServ", "DialogServ", function(e, t, a, o, n, r, i) {
	var s = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, r.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : i.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.menuBar = {}, e.menuBar.activeClass = "10", e.ueditorConfig = {
			toolbars: [
				["source", "link", "unlink", "bold", "italic", "underline", "forecolor"]
			],
			initialFrameHeight: 150,
			initialFrameWidth: 650,
			zIndex: 0,
			maximumWords: 1e3,
			autoHeightEnabled: !1,
			enableContextMenu: !0,
			contextMenu: [{
				label: "全选",
				cmdName: "selectall"
			}, {
				label: "清空文档",
				cmdName: "cleardoc",
				exec: function() {
					confirm(lang.confirmclear) && this.execCommand("cleardoc")
				}
			}, {
				label: "复制(Ctrl + c)",
				cmdName: "copy"
			}, {
				label: "粘贴(Ctrl + v)",
				cmdName: "paste"
			}],
			wordCount: !1,
			elementPathEnabled: !1
		}, e.setColorPickerBorder = function() {
			$("#colorPicker").css("border", "2px solid #84d7d8")
		}, e.removeColorPickerBorder = function() {
			$("#colorPicker").css("border", "0")
		}
	};
	s(), e.triggerMenuActive = function(t) {
		e.menuBar.activeClass = t
	}
}]).controller("SettingsInfoCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "Upload", function(e, t, a, o, n) {
	var r = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataInfo = {}, e.menuBar.activeClass = "10", o.getQueryCusRobotConfig().then(function(t) {
			"000000" == t.retCode ? (e.formDataInfo.robotName = t.item.robotName, e.formDataInfo.robotLogo = t.item.robotLogo, e.formDataInfo.chinchinType = t.item.chinchinType, e.formDataInfo.chinchinBaseType = t.item.chinchinBaseType, e.formDataInfo.configId = t.item.configId, e.uploadFlie = function(t) {
				t && n.upload({
					url: "/basic/editCusRobotConfigLog/4",
					data: {
						file: t,
						configId: e.formDataInfo.configId
					}
				}).then(function(t) {
					"000000" == t.data.retCode ? e.formDataInfo.robotLogo = t.data.item : a.alert({
						title: "" + t.data.retCode,
						content: t.data.retMsg || "错误",
						placement: "top",
						type: "warning",
						show: !0
					})
				}, function(e) {}, function(e) {})
			}) : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	r(), e.saveInfo = function() {
		e.formDataInfo.robotName ? e.formDataInfo.robotName.length > 40 ? a.alert({
			title: "",
			content: "请输入有效的机器人昵称，最多40个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : o.saveUpdateCusRobotConfigSet(e.formDataInfo).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "",
			content: "请输入有效的机器人昵称，最多20个字符",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.goDefaultRobotLogo = function() {
		o.getDefaultCusRobotConfigLog({
			robotLogo: "http://www.sobot.com/img/logo.png",
			configId: e.formDataInfo.configId
		}).then(function(t) {
			"000000" == t.retCode ? e.formDataInfo.robotLogo = t.item.robotLogo : a.alert({
				title: "",
				content: "恢复失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}
}]).controller("SettingsAutoCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "GetEditorServ", function(e, t, a, o, n) {
	var r = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataAuto = {}, e.menuBar.activeClass = "11", o.getQueryCusRobotConfig().then(function(t) {
			"000000" == t.retCode ? (e.formDataAuto.helloWord = t.item.helloWord, e.formDataAuto.adminHelloWord = t.item.adminHelloWord, e.formDataAuto.unknownWord = t.item.unknownWord, e.formDataAuto.customerOutTimes = t.item.customerOutTimes, e.formDataAuto.customerOutDoc = t.item.customerOutDoc, e.formDataAuto.serviceOutTimes = t.item.serviceOutTimes, e.formDataAuto.serviceOutDoc = t.item.serviceOutDoc, e.formDataAuto.customerOffTimes = t.item.customerOffTimes, e.formDataAuto.customerOffDoc = t.item.customerOffDoc, e.formDataAuto.configId = t.item.configId) : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	r(), e.saveAutoResponse = function() {
		n.init(0) ? n.init(1) ? n.init(2) ? n.init(3) ? n.init(4) ? n.init(5) ? (e.formDataAuto.helloWord = n.init(0), e.formDataAuto.adminHelloWord = n.init(1), e.formDataAuto.unknownWord = n.init(2), e.formDataAuto.customerOutDoc = n.init(3), e.formDataAuto.serviceOutDoc = n.init(4), e.formDataAuto.customerOffDoc = n.init(5), o.saveUpdateRobotConfigReply(e.formDataAuto).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})) : a.alert({
			title: "保存失败",
			content: "请填写用户超时下线",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写客服超时提示",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写用户超时提示",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写未知问题说辞",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写人工客服欢迎语",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写机器人欢迎语",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.getCustomerOutTimes = function(t) {
		e.formDataAuto.customerOutTimes = t
	}, e.getServiceOutTimes = function(t) {
		e.formDataAuto.serviceOutTimes = t
	}, e.getCustomerOffTimes = function(t) {
		e.formDataAuto.customerOffTimes = t
	}
}]).controller("SettingsMessageCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "Upload", "GetEditorServ", function(e, t, a, o, n, r) {
	var i = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataMseeage = {}, e.menuBar.activeClass = "12", o.getQueryCusRobotConfig().then(function(t) {
			"000000" == t.retCode ? (e.formDataMseeage.msgTxt = t.item.msgTxt, e.formDataMseeage.msgTmp = t.item.msgTmp, e.formDataMseeage.configId = t.item.configId) : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	i(), e.saveWorkOrderResponse = function() {
		e.formDataMseeage.msgTxt ? e.formDataMseeage.msgTmp ? (e.formDataMseeage.msgTxt = r.init(0), e.formDataMseeage.msgTmp = r.init(1), o.editCusRobotConfig(e.formDataMseeage).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})) : a.alert({
			title: "保存失败",
			content: "请填写留言内容模板",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "保存失败",
			content: "请填写留言引导文案",
			placement: "top",
			type: "warning",
			show: !0
		})
	}
}]).controller("SLASettingsCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "Upload", "GetEditorServ", function(e, t, a, o, n, r) {
	var i = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	i()
}]).controller("SettingsChannelPcCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "Upload", function(e, t, a, o, n) {
	var r = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataPcInt = {}, e.formDataPcHigh = {}, e.formDataPc = {}, e.viewDataPc = {}, e.groupFormDataPc = {}, e.groupViewDataPc = {}, e.menuBar.activeClass = "20", e.channelPcActiveTab = 0, e.$on("colorPicked", function(t, a) {
			e.formDataMobileInt && (e.formDataMobileInt.rebotTheme = a), e.formDataPcInt && (e.formDataPcInt.rebotTheme = a)
		}), o.getSelectConfigInfo({
			channelType: 0
		}).then(function(t) {
			"000000" == t.retCode ? (e.formDataPcInt.serviceButton = t.item.serviceButton, e.formDataPcInt.serviceOnDoc = t.item.serviceOnDoc, e.formDataPcInt.rebotTheme = t.item.rebotTheme, e.formDataPcHigh.joinType = t.item.joinType, e.formDataPcHigh.groupFlag = t.item.groupFlag, e.formDataPcHigh.voiceFlag = t.item.voiceFlag, e.formDataPcHigh.isInvite = t.item.isInvite, e.formDataPc.configId = t.item.configId, e.formDataPc.channelType = t.item.channelType, e.viewDataPc.oldSystemNum = "http://www.sobot.com/chat/pc/index.html?sysNum=" + t.item.systemNum, e.viewDataPc.systemNum = '<script src="http://www.sobot.com/chat/pc/pc.min.js?sysNum=' + t.item.systemNum + '" id="zhichiload" ></script>') : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	r(), e.channelPcShow = function(t) {
		e.channelPcActiveTab = t
	}, e.saveChannelPcBasic = function() {
		e.formDataPcInt.serviceOnDoc ? e.formDataPcInt.serviceOnDoc.length > 40 ? a.alert({
			title: "失败",
			content: "长度不能超过40字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.formDataPcInt.rebotTheme ? e.formDataPcInt.rebotTheme.length > 7 ? a.alert({
			title: "失败",
			content: "主题颜色超长",
			placement: "top",
			type: "warning",
			show: !0
		}) : o.saveUpdateConfigInSettings({
			serviceButton: e.formDataPcInt.serviceButton,
			serviceOnDoc: e.formDataPcInt.serviceOnDoc,
			rebotTheme: e.formDataPcInt.rebotTheme,
			configId: e.formDataPc.configId,
			channelType: e.formDataPc.channelType
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "失败",
			content: "主题颜色不能为空",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "失败",
			content: "请填写客服在线文案",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.saveChannelPcOther = function() {
		o.saveUpdateConfigInfoForSet({
			joinType: e.formDataPcHigh.joinType,
			groupFlag: e.formDataPcHigh.groupFlag,
			voiceFlag: e.formDataPcHigh.voiceFlag,
			isInvite: e.formDataPcHigh.isInvite,
			configId: e.formDataPc.configId,
			channelType: e.formDataPc.channelType
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.setQueueTime = function(t) {
		e.formDataPcHigh.queueTime = t
	}, e.setGroupPc = function() {
		o.selectCusReceiveGroupInfoIsExist({
			channelType: 0
		}).then(function(t) {
			"000000" == t.retCode ? (e.groupFormDataPc.itemsAll = t.item.itemsAll, e.groupFormDataPc.itemsInfo = t.item.itemsInfo, e.groupViewDataPc = {}, e.groupViewDataPc.recGroupNameActive = "", e.groupViewDataPc.groupNameActive = "选择分组",
				e.groupViewDataPc.groupIdActive = "", e.groupViewDataPc.countGroupIdActive = 0) : a.alert({
				title: "",
				content: t.retMsg || "分组数据加载失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.setGroupAll = function(t, a, o) {
		e.groupViewDataPc.groupNameActive = a, e.groupViewDataPc.countGroupIdActive = o, e.groupViewDataPc.groupIdActive = t
	}, e.addGroupInfo = function() {
		if (e.groupViewDataPc.recGroupNameActive)
			if (e.groupViewDataPc.recGroupNameActive.length > 6) a.alert({
				title: "失败",
				content: "入口名称不能超过6个字符",
				placement: "top",
				type: "warning",
				show: !0
			});
			else if (e.groupViewDataPc.groupIdActive) {
			for (var t = !0, o = e.groupFormDataPc.itemsInfo, n = 0; n < o.length; n++) e.groupViewDataPc.recGroupNameActive == o[n].recGroupName && (a.alert({
				title: "失败",
				content: "入口名称不能重复",
				placement: "top",
				type: "warning",
				show: !0
			}), t = !1);
			t && (o.push({
				recGroupName: e.groupViewDataPc.recGroupNameActive,
				groupName: e.groupViewDataPc.groupNameActive,
				groupId: e.groupViewDataPc.groupIdActive,
				countGroupId: e.groupViewDataPc.countGroupIdActive,
				channelType: 0
			}), e.groupViewDataPc = {
				recGroupNameActive: "",
				groupNameActive: "选择分组",
				groupIdActive: "",
				countGroupIdActive: 0
			})
		} else a.alert({
			title: "失败",
			content: "请选择分组",
			placement: "top",
			type: "warning",
			show: !0
		});
		else a.alert({
			title: "失败",
			content: "入口名称不能为空",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.deleteGroupInfo = function(t) {
		for (var a = e.groupFormDataPc.itemsInfo, o = 0; o < a.length; o++) a[o].recGroupName == t.recGroupName && a.splice(o, 1);
		e.groupFormDataPc.itemsInfo = a
	}, e.saveInsertCusReceiveGroupInfo = function() {
		var t = e.groupFormDataPc.itemsInfo;
		0 == t.length ? t = [] : t;
		for (var n = 0; n < t.length; n++) t[n].sortId = n + 1;
		var r = {
			items: t,
			chanelType: 0
		};
		o.insertCusReceiveGroupInfo(r).then(function(e) {
			"000000" == e.retCode ? ($("#pcOptions").modal("hide"), a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			})) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}
}]).controller("SettingsChannelMobileCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", function(e, t, a, o) {
	var n = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataMobileInt = {}, e.formDataMobileHigh = {}, e.formDataMobile = {}, e.viewDataMobile = {}, e.groupFormDataMobile = {}, e.groupViewDataMobile = {}, e.menuBar.activeClass = "21", e.channelMobileActiveTab = 0, e.$on("colorPicked", function(t, a) {
			e.formDataMobileInt && (e.formDataMobileInt.rebotTheme = a), e.formDataPcInt && (e.formDataPcInt.rebotTheme = a)
		}), o.getSelectConfigInfo({
			channelType: 1
		}).then(function(t) {
			"000000" == t.retCode ? (e.formDataMobileInt.serviceButton = t.item.serviceButton, e.formDataMobileInt.serviceOnDoc = t.item.serviceOnDoc, e.formDataMobileInt.rebotTheme = t.item.rebotTheme, e.formDataMobileHigh.joinType = t.item.joinType, e.formDataMobileHigh.groupFlag = t.item.groupFlag, e.formDataMobile.configId = t.item.configId, e.formDataMobile.channelType = t.item.channelType, e.viewDataMobile.oldSystemNum = "http://www.sobot.com/chat/h5/index.html?sysNum=" + t.item.systemNum, e.viewDataMobile.systemNum = '<script src="http://www.sobot.com/chat/h5/h5.min.js?sysNum=' + t.item.systemNum + '" id="zhichiload" ></script>') : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	n(), e.channelMobileShow = function(t) {
		e.channelMobileActiveTab = t
	}, e.saveChannelMobileBasic = function() {
		e.formDataMobileInt.serviceOnDoc ? e.formDataMobileInt.serviceOnDoc.length > 40 ? a.alert({
			title: "失败",
			content: "长度不能超过40字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.formDataMobileInt.rebotTheme ? e.formDataMobileInt.rebotTheme.length > 7 ? a.alert({
			title: "失败",
			content: "主题颜色超长",
			placement: "top",
			type: "warning",
			show: !0
		}) : o.saveUpdateConfigInSettings({
			serviceButton: e.formDataMobileInt.serviceButton,
			serviceOnDoc: e.formDataMobileInt.serviceOnDoc,
			rebotTheme: e.formDataMobileInt.rebotTheme,
			configId: e.formDataMobile.configId,
			channelType: e.formDataMobile.channelType
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "失败",
			content: "主题颜色不能为空",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "失败",
			content: "请填写客服在线文案",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.saveChannelMobileOther = function() {
		o.saveUpdateConfigInfoForSet({
			joinType: e.formDataMobileHigh.joinType,
			groupFlag: e.formDataMobileHigh.groupFlag,
			configId: e.formDataMobile.configId,
			channelType: e.formDataMobile.channelType
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.setQueueTimeMobile = function(t) {
		e.formDataMobileHigh.queueTime = t
	}, e.setGroupMobile = function() {
		o.selectCusReceiveGroupInfoIsExist({
			channelType: 1
		}).then(function(t) {
			"000000" == t.retCode && (e.groupFormDataMobile.itemsAll = t.item.itemsAll, e.groupFormDataMobile.itemsInfo = t.item.itemsInfo, e.groupViewDataMobile = {}, e.groupViewDataMobile.recGroupNameActive = "", e.groupViewDataMobile.groupNameActive = "选择分组", e.groupViewDataMobile.groupIdActive = "", e.groupViewDataMobile.countGroupIdActive = 0)
		})
	}, e.setGroupAllMobile = function(t, a, o) {
		e.groupViewDataMobile.groupNameActive = a, e.groupViewDataMobile.countGroupIdActive = o, e.groupViewDataMobile.groupIdActive = t
	}, e.addGroupInfoMobile = function() {
		if (e.groupViewDataMobile.recGroupNameActive)
			if (e.groupViewDataMobile.recGroupNameActive.length > 6) a.alert({
				title: "失败",
				content: "入口名称不能超过6个字符",
				placement: "top",
				type: "warning",
				show: !0
			});
			else if (e.groupViewDataMobile.groupIdActive) {
			for (var t = !0, o = e.groupFormDataMobile.itemsInfo, n = 0; n < o.length; n++) e.groupViewDataMobile.recGroupNameActive == o[n].recGroupName && (a.alert({
				title: "失败",
				content: "入口名称不能重复",
				placement: "top",
				type: "warning",
				show: !0
			}), t = !1);
			t && (o.push({
				recGroupName: e.groupViewDataMobile.recGroupNameActive,
				groupName: e.groupViewDataMobile.groupNameActive,
				groupId: e.groupViewDataMobile.groupIdActive,
				countGroupId: e.groupViewDataMobile.countGroupIdActive,
				channelType: 1
			}), e.groupViewDataMobile = {
				recGroupNameActive: "",
				groupNameActive: "选择分组",
				groupIdActive: "",
				countGroupIdActive: 0
			})
		} else a.alert({
			title: "失败",
			content: "请选择分组",
			placement: "top",
			type: "warning",
			show: !0
		});
		else a.alert({
			title: "失败",
			content: "入口名称不能为空",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.deleteGroupInfoMobile = function(t) {
		for (var a = e.groupFormDataMobile.itemsInfo, o = 0; o < a.length; o++) a[o].recGroupName == t.recGroupName && a.splice(o, 1);
		e.groupFormDataMobile.itemsInfo = a
	}, e.saveInsertCusReceiveGroupInfoMobile = function() {
		var t = e.groupFormDataMobile.itemsInfo;
		0 == t.length ? t = [] : t;
		for (var n = 0; n < t.length; n++) t[n].sortId = n + 1;
		var r = {
			items: t,
			chanelType: 1
		};
		o.insertCusReceiveGroupInfo(r).then(function(e) {
			"000000" == e.retCode ? ($("#mobileOptions").modal("hide"), a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			})) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}
}]).controller("SettingsChannelAppCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", function(e, t, a, o) {
	var n = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.formDataAppInt = {}, e.formDataAppHigh = {}, e.formDataApp = {}, e.viewDataApp = {}, e.menuBar.activeClass = "22", e.channelAppActiveTab = 0, o.getSelectConfigInfo({
			channelType: 2
		}).then(function(t) {
			"000000" == t.retCode ? (e.formDataAppHigh.joinType = t.item.joinType, e.formDataApp.configId = t.item.configId, e.formDataApp.channelType = t.item.channelType, e.viewDataApp.systemNum = "http://www.sobot.com/chat/h5/index.html?sysNum=" + t.item.systemNum + "&source=2") : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	n(), e.channelAppShow = function(t) {
		e.channelAppActiveTab = t
	}, e.setQueueTimeApp = function(t) {
		e.formDataAppHigh.queueTime = t
	}, e.saveChannelAppOther = function() {
		o.saveUpdateConfigInfoForSet({
			joinType: e.formDataAppHigh.joinType,
			configId: e.formDataApp.configId,
			channelType: e.formDataApp.channelType
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}
}]).controller("SettingsChannelWeCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "$state", "Upload", "GetEditorServ", function(e, t, a, o, n, r, i) {
	var s = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.viewDataWe = {}, e.formDataWe = {}, e.tmpWe = {}, e.viewDataWeDrag = {}, e.viewDataWeItem = {}, e.menuBar.activeClass = "23", e.channelWeActiveTab = 0, e.viewDataWeItem.activeId = "", e.viewDataWeItem.flag = 0, e.viewDataWeItem.sysNum = "http://www.sobot.com/chat/h5/index.html?sysNum=", n.params.auth_code && (o.insertConfigForWeixin({
			auth_code: n.params.auth_code
		}).then(function(t) {
			o.getSelectPlatformConfigInfo({
				platformType: 0
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeItem.sysNum = "http://www.sobot.com/chat/h5/index.html?sysNum=" + t.item + "&source=1", e.viewDataWeItem.items = t.items) : a.alert({
					title: "失败",
					content: "微信初始化失败",
					placement: "top",
					type: "warning",
					show: !0
				})
			})
		}), e.tmpWe = {
			showDragActiveAppId: "",
			showDragActive: 0,
			appIdActive: "",
			platformIdActive: "",
			appNameActive: "",
			weUrl: ""
		}), e.viewDataWeDrag = {
			listData: []
		}, e.weGroupActive = {}, e.weGroupActiveShadow = {}, e.weGroupSetting = {}, o.getSelectPlatformConfigInfo({
			platformType: 0
		}).then(function(t) {
			"000000" == t.retCode ? (e.viewDataWeItem.sysNum = "http://www.sobot.com/chat/h5/index.html?sysNum=" + t.item + "&source=1", e.viewDataWeItem.items = t.items, e.uploadFlie = function(t) {
				t && r.upload({
					url: "/basic/editMenuLog/4",
					data: {
						file: t,
						menuId: e.weGroupActive.menuId
					}
				}).then(function(t) {
					"000000" == t.data.retCode ? (e.weGroupActive.menuContent = t.data.item, e.weGroupActive.menuType = 4, e.weGroupSetting.uploadBtnFlag = 0, e.weGroupSetting.delBtnFlag = 1, o.getSelectMenuInfo({
						appId: e.tmpWe.appIdActive,
						platformId: e.tmpWe.platformIdActive
					}).then(function(t) {
						"000000" == t.retCode && (e.viewDataWeDrag.listData = t.items, l())
					})) : a.alert({
						title: "" + t.data.retCode,
						content: t.data.retMsg || "错误",
						placement: "top",
						type: "warning",
						show: !0
					})
				}, function(e) {}, function(e) {})
			}) : a.alert({
				title: "失败",
				content: "微信初始化失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	};
	s(), e.channelWeShow = function(t) {
		e.channelWeActiveTab = t
	}, e.insertWeixin = function() {
		o.getToWeixin().then(function(t) {
			"000000" == t.retCode ? (e.tmpWe.weUrl = t.url, e.channelWeActiveTab = 2) : a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.weShowDrag = function(t, a, n) {
		e.tmpWe.appIdActive = t, e.tmpWe.platformIdActive = a, e.tmpWe.appNameActive = n, t == e.tmpWe.showDragActiveAppId ? (e.tmpWe.showDragActive ? e.tmpWe.showDragActive = 0 : e.tmpWe.showDragActive = 1, e.tmpWe.showDragActiveAppId = t) : o.getSelectMenuInfo({
			appId: e.tmpWe.appIdActive,
			platformId: e.tmpWe.platformIdActive
		}).then(function(a) {
			"000000" == a.retCode ? (e.viewDataWeDrag.listData = a.items, l(), e.tmpWe.showDragActive = 1, e.tmpWe.showDragActiveAppId = t, e.sortableOptions = {
				update: c
			}, e.weGroupSetting = {
				weActiveClass: "999",
				activeParentIndex: "999",
				activeSonIndex: "999",
				weChatContentActive: 1,
				uploadBtnFlag: 1,
				delBtnFlag: 0
			}, e.weGroupActive = {
				sonLength: 0,
				haveLength: 0,
				activeIndex: 999,
				addTitle: "",
				titleLevel: "",
				activeTitle: "",
				menuId: "",
				menuContent: "",
				menuType: ""
			}, e.weGroupActiveShadow = {
				sonLength: 0,
				haveLength: 0,
				activeIndex: 999,
				addTitle: "",
				titleLevel: "",
				activeTitle: "",
				menuId: "",
				menuContent: "",
				menuType: ""
			}, $(".drag-content-body-default").css("display", "block").siblings().css("display", "none")) : console.log("初始化自定义当前菜单->" + a.retCode + " " + a.retMsg)
		})
	};
	var c = function(t, a) {
			var n = {
				items: e.viewDataWeDrag.listData
			};
			o.updateMenuSort(n).then(function(t) {
				o.getSelectMenuInfo({
					appId: e.tmpWe.appIdActive,
					platformId: e.tmpWe.platformIdActive
				}).then(function(t) {
					"000000" == t.retCode && (e.viewDataWeDrag.listData = t.items, e.weGroupSetting = {
						weActiveClass: "999",
						activeParentIndex: "999",
						activeSonIndex: "999",
						weChatContentActive: 1
					}, e.weGroupActive = {
						sonLength: 0,
						haveLength: 0,
						activeIndex: 999,
						addTitle: "",
						titleLevel: "",
						activeTitle: "",
						menuId: "",
						menuContent: "",
						menuType: ""
					}, e.weGroupActiveShadow = {
						sonLength: 0,
						haveLength: 0,
						activeIndex: 999,
						addTitle: "",
						titleLevel: "",
						activeTitle: "",
						menuId: "",
						menuContent: "",
						menuType: ""
					}, l(), $("#dragBox").css("display", "block"), e.sortableOptions = {
						connectWith: ".connectedItemsExample .list",
						update: c
					}, $(".drag-content-body-default").css("display", "block").siblings().css("display", "none"))
				})
			})
		},
		l = function() {
			var t = 0,
				a = 42 * e.viewDataWeDrag.listData.length;
			if (t += a, e.viewDataWeDrag.listData[0]) {
				var o = 36 * e.viewDataWeDrag.listData[0].team.length;
				t += o
			}
			if (e.viewDataWeDrag.listData[1]) {
				var o = 36 * e.viewDataWeDrag.listData[1].team.length;
				t += o
			}
			if (e.viewDataWeDrag.listData[2]) {
				var o = 36 * e.viewDataWeDrag.listData[2].team.length;
				t += o
			}
			t += 30, $(".drag-content-body").css("height", t)
		};
	e.addTwoActiveClass = function(t, a) {
		e.weGroupSetting.weActiveClass = t + "-" + a, e.weGroupSetting.weChatContentActive = 1, e.weGroupSetting.activeParentIndex = t, e.weGroupSetting.activeSonIndex = a;
		var o = e.viewDataWeDrag.listData,
			n = o[t].team[a].menuName,
			r = o[t].team[a].menuId,
			i = "",
			s = "";
		if (o[t].team[a].menuType) switch (s = o[t].team[a].menuType, (o[t].team[a].menuContent || 0 == o[t].team[a].menuContent) && (i = o[t].team[a].menuContent), o[t].team[a].menuType) {
			case 1:
				$(".drag-content-body-two-msg").css("display", "block").siblings().css("display", "none"), e.weGroupSetting.weChatContentActive = 1, e.weGroupSetting.uploadBtnFlag = 1, e.weGroupSetting.delBtnFlag = 0;
				break;
			case 2:
				$(".drag-content-body-two-web").css("display", "block").siblings().css("display", "none");
				break;
			case 3:
				$(".drag-content-body-two-per").css("display", "block").siblings().css("display", "none");
				break;
			case 4:
				$(".drag-content-body-two-msg").css("display", "block").siblings().css("display", "none"), e.weGroupSetting.weChatContentActive = 2, e.weGroupSetting.uploadBtnFlag = 0, e.weGroupSetting.delBtnFlag = 1
		} else $(".drag-content-body-two-def").css("display", "block").siblings().css("display", "none");
		e.weGroupActive = {
			sonLength: 0,
			haveLength: 0,
			activeIndex: 999,
			addTitle: "",
			titleLevel: "二级菜单:",
			activeTitle: n,
			menuId: r,
			menuContent: i,
			menuType: s
		}, e.weGroupActiveShadow = {
			sonLength: 0,
			haveLength: 0,
			activeIndex: 999,
			addTitle: "",
			titleLevel: "二级菜单:",
			activeTitle: n,
			menuId: r,
			menuContent: i,
			menuType: s
		}
	}, e.addOneActiveClass = function(t) {
		e.weGroupSetting.weActiveClass = t + "", e.weGroupSetting.activeParentIndex = t, e.weGroupSetting.activeSonIndex = 86;
		var a = e.viewDataWeDrag.listData,
			o = e.weGroupSetting.activeParentIndex,
			n = (e.weGroupSetting.activeSonIndex, a[o].menuName),
			r = a[o].menuId,
			i = "",
			s = "",
			c = a[o].team.length,
			l = 5 - a[o].team.length;
		if (c) $(".drag-content-body-oneHave").css("display", "block").siblings().css("display", "none");
		else if (a[o].menuType) switch (s = a[o].menuType, (a[o].menuContent || 0 == a[o].menuContent) && (i = a[o].menuContent), a[o].menuType) {
			case 1:
				$(".drag-content-body-two-msg").css("display", "block").siblings().css("display", "none"), e.weGroupSetting.weChatContentActive = 1, e.weGroupSetting.uploadBtnFlag = 1, e.weGroupSetting.delBtnFlag = 0;
				break;
			case 2:
				$(".drag-content-body-two-web").css("display", "block").siblings().css("display", "none");
				break;
			case 3:
				$(".drag-content-body-two-per").css("display", "block").siblings().css("display", "none");
				break;
			case 4:
				$(".drag-content-body-two-msg").css("display", "block").siblings().css("display", "none"), e.weGroupSetting.weChatContentActive = 2, e.weGroupSetting.uploadBtnFlag = 0, e.weGroupSetting.delBtnFlag = 1
		} else $(".drag-content-body-one").css("display", "block").siblings().css("display", "none");
		e.weGroupActive = {
			sonLength: l,
			haveLength: c,
			activeIndex: 999,
			addTitle: "",
			titleLevel: "一级菜单:",
			activeTitle: n,
			menuId: r,
			menuContent: i,
			menuType: s
		}, e.weGroupActiveShadow = {
			sonLength: l,
			haveLength: c,
			activeIndex: 999,
			addTitle: "",
			titleLevel: "一级菜单:",
			activeTitle: n,
			menuId: r,
			menuContent: i,
			menuType: s
		}
	}, e.deleteSecondTitle = function() {
		"999" != e.weGroupSetting.weActiveClass && $("#weChatDelete").modal("show")
	}, e.deleteSecondTitleConfirm = function() {
		var t = e.viewDataWeDrag.listData,
			n = e.weGroupSetting.activeParentIndex,
			r = e.weGroupSetting.activeSonIndex;
		86 == r ? 0 == t[n].team.length ? o.deleteWeixinMenu({
			menuId: e.weGroupActive.menuId,
			menuLevel: 1,
			appId: e.tmpWe.appIdActive
		}).then(function(t) {
			"000000" == t.retCode && ($("#weChatDelete").modal("hide"), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeDrag.listData = t.items, l(), e.weGroupSetting = {
					weActiveClass: "999",
					activeParentIndex: "999",
					activeSonIndex: "999",
					weChatContentActive: 1
				}, e.weGroupActive = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, e.weGroupActiveShadow = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, $(".drag-content-body-default").css("display", "block").siblings().css("display", "none")) : console.log("初始化自定义当前菜单->" + t.retCode + " " + t.retMsg)
			}))
		}) : a.alert({
			title: "错误",
			content: "当前一级菜单仍有二级选项，不能删除",
			placement: "top",
			type: "warning",
			show: !0
		}) : o.deleteWeixinMenu({
			menuId: e.weGroupActive.menuId,
			menuLevel: 2,
			appId: e.tmpWe.appIdActive
		}).then(function(t) {
			"000000" == t.retCode ? ($("#weChatDelete").modal("hide"), l(), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeDrag.listData = t.items, l(), e.weGroupSetting = {
					weActiveClass: "999",
					activeParentIndex: "999",
					activeSonIndex: "999",
					weChatContentActive: 1
				}, e.weGroupActive = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, e.weGroupActiveShadow = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, $(".drag-content-body-default").css("display", "block").siblings().css("display", "none")) : console.log("初始化自定义当前菜单->" + t.retCode + " " + t.retMsg)
			})) : console.log("删除二级菜单->" + t.retCode + " " + t.retMsg)
		})
	}, e.reNameSecondTitle = function() {
		var t = (e.viewDataWeDrag.listData, e.weGroupSetting.activeParentIndex, e.weGroupSetting.activeSonIndex);
		"999" != e.weGroupSetting.weActiveClass && (86 == t ? $("#weChatReNameFirstTitle").modal("show") : $("#weChatReNameSecondTitle").modal("show"))
	}, e.reNameSecondTitleConfirm = function() {
		var t = (e.viewDataWeDrag.listData, e.weGroupSetting.activeParentIndex, e.weGroupSetting.activeSonIndex),
			n = e.weGroupActive.activeTitle,
			r = e.weGroupActive.menuId;
		if (n) 86 == t ? o.updateMenuInfoName({
			menuId: r,
			menuName: n
		}).then(function(t) {
			"000000" == t.retCode ? (e.weGroupActiveShadow.activeTitle = n, $("#weChatReNameFirstTitle").modal("hide"), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? e.viewDataWeDrag.listData = t.items : console.log("重新读取数据列表失败->" + t.retCode + " " + t.retMsg)
			})) : (a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			}), console.log("重命名一级菜单->" + t.retCode + " " + t.retMsg))
		}) : o.updateMenuInfoName({
			menuId: r,
			menuName: n
		}).then(function(t) {
			"000000" == t.retCode ? ($("#weChatReNameSecondTitle").modal("hide"), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? e.viewDataWeDrag.listData = t.items : console.log("重新读取数据列表失败->" + t.retCode + " " + t.retMsg)
			})) : (a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			}), console.log("重命名二级菜单->" + t.retCode + " " + t.retMsg))
		});
		else {
			a.alert({
				title: "错误",
				content: "标题不能为空",
				placement: "top",
				type: "warning",
				show: !0
			});
			var i = e.weGroupActiveShadow.activeTitle;
			e.weGroupActive.activeTitle = i
		}
	}, e.reNameSecondTitleCancel = function() {
		var t = e.weGroupActiveShadow.activeTitle;
		e.weGroupActive.activeTitle = t
	}, e.addFirstTitle = function() {
		var t = e.viewDataWeDrag.listData,
			o = t.length,
			n = 3 - t.length;
		o >= 3 ? a.alert({
			title: "",
			content: "最多只能添加三个一级菜单，当前已达设置上限",
			placement: "top",
			type: "warning",
			show: !0
		}) : (e.weGroupActive = {
			sonLength: n,
			haveLength: o,
			activeIndex: e.weGroupActiveShadow.activeIndex,
			addTitle: "",
			titleLevel: e.weGroupActiveShadow.titleLevel,
			activeTitle: e.weGroupActiveShadow.activeTitle,
			menuId: "",
			menuContent: "",
			menuType: ""
		}, $("#addFirstTitleConfirm").modal("show"))
	}, e.addFirstTitleConfirm = function() {
		var t = e.viewDataWeDrag.listData,
			n = (t.length, 3 - t.length, e.weGroupActive.addTitle);
		n ? o.addInsertPlatformWeixin({
			menuLevel: 1,
			appId: e.tmpWe.appIdActive,
			platformId: e.tmpWe.platformIdActive,
			appName: e.tmpWe.appNameActive,
			menuName: n
		}).then(function(t) {
			"000000" == t.retCode ? o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (a.alert({
					title: "",
					content: "添加成功",
					placement: "top",
					type: "success",
					show: !0
				}), e.viewDataWeDrag.listData = t.items, e.weGroupSetting = {
					weActiveClass: "999",
					activeParentIndex: "999",
					activeSonIndex: "999",
					weChatContentActive: 1
				}, e.weGroupActive = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, e.weGroupActiveShadow = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, $("#addFirstTitleConfirm").modal("hide"), $(".drag-content-body-default").css("display", "block").siblings().css("display", "none"), l()) : a.alert({
					title: "",
					content: t.retMsg || "失败",
					placement: "top",
					type: "warning",
					show: !0
				})
			}) : a.alert({
				title: "",
				content: t.retMsg || "添加失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : (a.alert({
			title: "错误",
			content: "标题不能为空",
			placement: "top",
			type: "warning",
			show: !0
		}), e.weGroupActive.addTitle = "")
	}, e.addFirstTitleCancel = function() {
		var t = e.weGroupActiveShadow;
		e.weGroupActive = t
	}, e.addSecondTitle = function(t) {
		var o = e.viewDataWeDrag.listData,
			n = o[t].team.length,
			r = o[t].menuId,
			i = 5 - o[t].team.length,
			s = t;
		n >= 5 ? a.alert({
			title: "",
			content: "最多只能添加五个二级菜单，当前已达设置上限",
			placement: "top",
			type: "warning",
			show: !0
		}) : (e.weGroupActive = {
			sonLength: i,
			haveLength: n,
			activeIndex: s,
			addTitle: "",
			titleLevel: e.weGroupActiveShadow.titleLevel,
			activeTitle: e.weGroupActiveShadow.activeTitle,
			menuId: r,
			menuContent: "",
			menuType: ""
		}, $("#addSecondTitleConfirm").modal("show"))
	}, e.addSecondTitleConfirm = function() {
		var t = (e.weGroupActive.activeIndex, e.weGroupActive.haveLength, e.weGroupActive.sonLength, e.weGroupActive.addTitle),
			n = e.weGroupActive.menuId;
		e.viewDataWeDrag.listData;
		t ? o.addInsertPlatformWeixin({
			menuLevel: 2,
			menuId: n,
			appId: e.tmpWe.appIdActive,
			platformId: e.tmpWe.platformIdActive,
			appName: e.tmpWe.appNameActive,
			menuName: t
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "添加成功",
				placement: "top",
				type: "success",
				show: !0
			}), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeDrag.listData = t.items, e.weGroupSetting = {
					weActiveClass: "999",
					activeParentIndex: "999",
					activeSonIndex: "999",
					weChatContentActive: 1
				}, e.weGroupActive = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, e.weGroupActiveShadow = {
					sonLength: 0,
					haveLength: 0,
					activeIndex: 999,
					addTitle: "",
					titleLevel: "",
					activeTitle: "",
					menuId: "",
					menuContent: "",
					menuType: ""
				}, $("#addSecondTitleConfirm").modal("hide"), $(".drag-content-body-default").css("display", "block").siblings().css("display", "none"), l()) : a.alert({
					title: "",
					content: t.retMsg || "失败",
					placement: "top",
					type: "warning",
					show: !0
				})
			})) : a.alert({
				title: "",
				content: t.retMsg || "添加失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : (a.alert({
			title: "错误",
			content: "标题不能为空",
			placement: "top",
			type: "warning",
			show: !0
		}), e.weGroupActive.addTitle = "")
	}, e.addSecondTitleCancel = function() {
		var t = e.weGroupActiveShadow;
		e.weGroupActive = t
	}, e.updateMenuInfo = function(t) {
		e.weGroupActive.menuContent ? (e.weGroupActive.menuType = t, o.updateMenuInfo({
			menuId: e.weGroupActive.menuId,
			menuType: e.weGroupActive.menuType,
			menuContent: e.weGroupActive.menuContent
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeDrag.listData = t.items, l()) : console.log("重新加载->" + t.retCode + " " + t.retMsg)
			})) : a.alert({
				title: "",
				content: t.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})) : a.alert({
			title: "",
			content: "请输入内容",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.pushInfoToWeixin = function() {
		o.pushInfoToWeixin({
			appId: e.tmpWe.appIdActive,
			platformId: e.tmpWe.platformIdActive
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "推送成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "推送失败",
				placement: "top",
				type: "danger",
				show: !0
			})
		})
	}, e.contTabChange = function(t, a) {
		e.weGroupActive.menuContent = "", e.weGroupSetting.uploadBtnFlag = 1, e.weGroupSetting.delBtnFlag = 0, e.weGroupSetting.weChatContentActive = t, o.selectMenuWordOrPicture({
			menuType: a,
			menuId: e.weGroupActive.menuId
		}).then(function(t) {
			"000000" == t.retCode && (e.weGroupActive.menuContent = t.item, 4 == a && (e.weGroupActive.menuContent ? (e.weGroupSetting.uploadBtnFlag = 0, e.weGroupSetting.delBtnFlag = 1) : (e.weGroupSetting.uploadBtnFlag = 1, e.weGroupSetting.delBtnFlag = 0)))
		})
	}, e.delWePic = function() {
		e.weGroupActive.menuType = 0, e.weGroupActive.menuContent = "", o.updateMenuInfo({
			menuId: e.weGroupActive.menuId,
			menuType: e.weGroupActive.menuType,
			menuContent: e.weGroupActive.menuContent
		}).then(function(t) {
			"000000" == t.retCode && (e.weGroupSetting.uploadBtnFlag = 1, e.weGroupSetting.delBtnFlag = 0, a.alert({
				title: "",
				content: "删除成功",
				placement: "top",
				type: "success",
				show: !0
			}), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode && (e.viewDataWeDrag.listData = t.items, l())
			}))
		})
	}, e.goToMeg = function() {
		e.weGroupSetting.weChatContentActive = 1, $(".drag-content-body-two-msg").css("display", "block").siblings().css("display", "none")
	}, e.goToWeb = function() {
		$(".drag-content-body-two-web").css("display", "block").siblings().css("display", "none")
	}, e.goToPer = function() {
		o.updateMenuInfo({
			menuId: e.weGroupActive.menuId,
			menuType: 3,
			menuContent: ""
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode ? (e.viewDataWeDrag.listData = t.items, l()) : console.log("重新加载->" + t.retCode + " " + t.retMsg)
			})) : a.alert({
				title: "",
				content: t.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), $(".drag-content-body-two-per").css("display", "block").siblings().css("display", "none")
	}, e.goDefault = function() {
		e.weGroupActive.menuType = 0, e.weGroupActive.menuContent = "", o.updateMenuInfo({
			menuId: e.weGroupActive.menuId,
			menuType: e.weGroupActive.menuType,
			menuContent: e.weGroupActive.menuContent
		}).then(function(t) {
			"000000" == t.retCode && (a.alert({
				title: "",
				content: "修改成功",
				placement: "top",
				type: "success",
				show: !0
			}), o.getSelectMenuInfo({
				appId: e.tmpWe.appIdActive,
				platformId: e.tmpWe.platformIdActive
			}).then(function(t) {
				"000000" == t.retCode && (e.viewDataWeDrag.listData = t.items, l())
			}))
		}), 86 == e.weGroupSetting.activeSonIndex ? $(".drag-content-body-one").css("display", "block").siblings().css("display", "none") : $(".drag-content-body-two-def").css("display", "block").siblings().css("display", "none")
	}, e.setQueueTimeWe = function(t) {
		e.viewDataWeItem.weFormData.queueTime = t
	}, e.showWeSetting = function(t) {
		e.viewDataWeItem.activeId == t.appId && 1 == e.viewDataWeItem.flag ? e.viewDataWeItem.flag = 0 : e.viewDataWeItem.flag = 1, e.viewDataWeItem.activeId = t.appId, e.viewDataWeItem.weFormData = {
			platformType: 0,
			platformId: t.platformId,
			joinType: t.joinType || 2,
			queueFlag: t.queueFlag || 2,
			queueTime: t.queueTime || 10,
			queueDoc: t.queueDoc || "说辞文案",
			attentionDoc: t.attentionDoc || "关注公众号说辞",
			appId: t.appId
		}
	}, e.saveWeSetting = function() {
		console.log(i.init(0)), i.init(0) ? 0 == e.viewDataWeItem.weFormData.queueFlag ? o.saveUpdatePlatformConfig(e.viewDataWeItem.weFormData).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : e.viewDataWeItem.weFormData.queueDoc ? o.saveUpdatePlatformConfig(e.viewDataWeItem.weFormData).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "错误",
			content: "文本不能为空",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "",
			content: "关注公众号说辞不能为空",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.bigSizeImage = function(t) {
		$("#bigSizeImg").modal("show"), e.tmpImg = {}, e.tmpImg.url = t
	}
}]).controller("SettingsChannelThirdCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "$state", function(e, t, a, o, n) {
	var r = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.viewDataThird = {}, e.viewDataThirdActive = 0, e.viewDataThirdItem = {}, e.menuBar.activeClass = "24", e.viewDataThirdItem.activeId = "", e.viewDataThirdItem.flag = 0, n.params.token && o.insertPlatformConfigInfo({
			token: n.params.token
		}).then(function(e) {})
	};
	r(), e.viewDetailThird = function(t) {
		1 == t && (e.viewDataThirdActive = t, o.getSelectPlatformConfigInfo({
			platformType: t
		}).then(function(t) {
			"000000" == t.retCode && (e.viewDataThirdItem.items = t.items)
		}), o.getToRongyun().then(function(t) {
			"000000" == t.retCode ? e.viewDataThirdItem.goUrl = t.url : t.retMsg && a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}, function() {}))
	}, e.showThirdSetting = function(t, a) {
		e.viewDataThirdItem.activeId == t.appId && 1 == e.viewDataThirdItem.flag ? e.viewDataThirdItem.flag = 0 : e.viewDataThirdItem.flag = 1, e.viewDataThirdItem.activeId = t.appId, e.viewDataThirdItem.weFormData = {
			platformType: 1,
			platformId: t.platformId,
			joinType: t.joinType || 2,
			queueFlag: t.queueFlag || 2,
			queueTime: t.queueTime || 10,
			queueDoc: t.queueDoc || "排队说辞",
			appId: t.appId
		}
	}, e.saveThirdSetting = function() {
		0 == e.viewDataThirdItem.weFormData.queueFlag ? o.saveUpdatePlatformConfig(e.viewDataThirdItem.weFormData).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : e.viewDataThirdItem.weFormData.queueDoc ? o.saveUpdatePlatformConfig(e.viewDataThirdItem.weFormData).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "保存成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "错误",
			content: "文本不能为空",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.setQueueTimeThird = function(t) {
		e.viewDataThirdItem.weFormData.queueTime = t
	}, e.viewDataThird.items = [{
		title: "接入融云",
		src: "images/ry.jpg"
	}]
}]).controller("SettingsAccountCtrl", ["$scope", "LoginServ", "DialogServ", "SettingsServ", "$state", "$window", "Upload", "GetAccountListServ", function(e, t, a, o, n, r, i, s) {
	function c(t) {
		s.getList({
			pageNo: t ? t : e.newPageConfig.config.tempPageNo,
			pageSize: e.newPageConfig.config.pageSize
		}).then(function(t) {
			"000000" == t.retCode ? (e.viewDataAccountCus.countlist = t.items, e.newPageConfig = {
				config: {
					totalItems: t.totalCount,
					pageSize: t.pageSize,
					pageNo: t.pageNo,
					totalPages: t.pageCount,
					pageList: t.pageList,
					tempPageNo: t.pageNo
				}
			}, 0 === t.items.length && e.jumpTo(e.newPageConfig.config.pageNo - 1)) : e.content = {}
		})
	}

	function l(t) {
		s.getInvoiceList({
			pageNo: t ? t : e.newPageConfig_invoice.config.tempPageNo,
			pageSize: e.newPageConfig_invoice.config.pageSize
		}).then(function(t) {
			if ("000000" == t.retCode) {
				for (var a = t.items, o = 0; o < a.length; o++) a[o].auditRemark || (a[o].auditRemark = "无");
				e.invoiceData.list = a, e.newPageConfig_invoice = {
					config: {
						totalItems: t.totalCount,
						pageSize: t.pageSize,
						pageNo: t.pageNo,
						totalPages: t.pageCount,
						pageList: t.pageList,
						tempPageNo: t.pageNo
					}
				}, 0 === t.items.length && e.jumpTo(e.newPageConfig_invoice.config.pageNo - 1)
			} else e.content = {}
		})
	}

	function u(t) {
		s.getVoiceList({
			pageNo: t ? t : e.newPageConfig_voice.config.tempPageNo,
			pageSize: e.newPageConfig_voice.config.pageSize
		}).then(function(t) {
			"000000" == t.retCode ? (e.voiceData.time = t.item.time, e.voiceData.list = t.item.items, 0 !== t.totalCount && (e.newPageConfig_voice = {
				config: {
					totalItems: t.totalCount,
					pageSize: t.pageSize,
					pageNo: t.pageNo,
					totalPages: t.pageCount,
					pageList: t.pageList,
					tempPageNo: t.pageNo
				}
			}), 0 === t.items.length && e.jumpTo(e.newPageConfig_voice.config.pageNo - 1)) : e.content = {}
		})
	}

	function d() {
		o.getCurrentCompanyPayInfo().then(function(t) {
			if ("000000" == t.retCode) {
				e.viewDataAccount = t.item;
				var n = e.viewDataAccount.accountMoney.toFixed(2) + "",
					r = n.split(".");
				switch (e.viewDataAccountCus["int"] = r[0], e.viewDataAccountCus.decimal = r[1], e.viewDataAccount.accountStatus) {
					case -1:
						e.viewDataAccountCus.accountStatusName = "免费版（未激活）";
						break;
					case 0:
						e.viewDataAccountCus.accountStatusName = "免费版";
						break;
					case 1:
						e.viewDataAccountCus.accountStatusName = "试用版";
						break;
					case 2:
						e.viewDataAccountCus.accountStatusName = "专业版"
				}
				e.viewDataAccountCus.usedFileSize = e.viewDataAccount.usedFileSize, e.viewDataAccountCus.fileSize = e.viewDataAccount.fileSize, -1 == e.viewDataAccount.usedQaNum ? e.viewDataAccountCus.qaNum = "error" : e.viewDataAccountCus.qaNum = e.viewDataAccount.qaNum - e.viewDataAccount.usedQaNum, o.getPayRenewInfo().then(function(t) {
					console.log("2016.4.14new查询续期详情列表 |"), console.log(t), "000000" == t.retCode && (e.PayRenewInfo.infoList = t.items)
				})
			} else a.alert({
				title: "",
				content: t.retMsg || "请联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}

	function p() {
		o.getSelectCusCompanyInfo().then(function(t) {
			if ("000000" == t.retCode) {
				var n = t.item.item1,
					r = t.item.items,
					s = t.item.itemsIndu,
					c = t.item.itemsScale;
				if (n && (e.formData.companyName = n.companyName, e.formData.companySite = n.companySite || "", e.formData.companyScale = n.companyScale, e.formData.contactName = n.contactName || "", e.formData.contactPhone = n.contactPhone || "", e.formData.companyAddress = n.companyAddress || "", e.formData.email = n.email || "", e.formData.support = n.support || "", e.viewData.secondDomain = n.secondDomain, e.viewData.logoUrl = n.logoUrl, e.uploadFlie = function(t) {
						t && i.upload({
							url: "/basic/uploadLogPicture/4",
							data: {
								file: t
							}
						}).then(function(t) {
							"000000" == t.data.retCode ? e.viewData.logoUrl = t.data.item : a.alert({
								title: "" + t.data.retCode,
								content: t.data.retMsg || "错误",
								placement: "top",
								type: "warning",
								show: !0
							})
						}, function(e) {}, function(e) {})
					}), r) {
					var l = r;
					if (l.unshift({
							provinceId: "999",
							provinceName: "选择省份"
						}), e.viewData.provinceList = l, n.provinceId) {
						var u = n.provinceId;
						e.formData.provinceId = u;
						for (var d = e.viewData.provinceList, p = "", m = 0; m < d.length; m++) d[m].provinceId == u && (p = d[m].provinceName, e.viewData.provinceName = p);
						o.getSelectCity({
							provinceId: u
						}).then(function(t) {
							if ("000000" == t.retCode) {
								var a = t.item;
								if (a.unshift({
										cityId: "999",
										cityName: "选择城市"
									}), e.viewData.cityList = a, n.cityId) {
									var r = n.cityId;
									e.formData.cityId = r;
									for (var i = e.viewData.cityList, s = "", c = 0; c < i.length; c++) i[c].cityId == r && (s = i[c].cityName, e.viewData.cityName = s);
									o.getSelectArea({
										cityId: r
									}).then(function(t) {
										if ("000000" == t.retCode) {
											var a = t.item;
											if (a.unshift({
													areaId: "999",
													areaName: "选择地区"
												}), e.viewData.areaList = a, n.areaId) {
												var o = n.areaId;
												e.formData.areaId = o;
												for (var r = e.viewData.areaList, i = "", s = 0; s < r.length; s++) r[s].areaId == o && (i = r[s].areaName, e.viewData.areaName = i)
											} else e.formData.areaId = "999", e.viewData.areaName = "选择地区"
										}
									})
								} else e.formData.cityId = "999", e.viewData.cityName = "选择城市", e.formData.areaId = "999", e.viewData.areaName = "选择地区"
							}
						})
					} else e.formData.provinceId = "999", e.viewData.provinceName = "选择省份", e.formData.cityId = "999", e.viewData.cityName = "选择城市", e.formData.areaId = "999", e.viewData.areaName = "选择地区"
				}
				if (s)
					if (e.viewData.itemsInduList = s, n.companyIndustry) {
						var g = n.companyIndustry;
						e.formData.companyIndustry = g;
						for (var f = e.viewData.itemsInduList, v = "", m = 0; m < f.length; m++) f[m].dictValue == g && (v = f[m].dictName, e.viewData.itemsInduName = v)
					} else {
						e.formData.companyIndustry = "0";
						for (var f = e.viewData.itemsInduList, v = "", m = 0; m < f.length; m++) "0" == f[m].dictValue && (v = f[m].dictName, e.viewData.itemsInduName = v)
					}
				if (c)
					if (e.viewData.itemsScaleList = c, n.companyScale) {
						var g = n.companyScale;
						e.formData.companyScale = g;
						for (var h = e.viewData.itemsScaleList, y = "", m = 0; m < h.length; m++) h[m].dictValue == g && (y = h[m].dictName, e.viewData.itemsScaleName = y)
					} else {
						e.formData.companyScale = "0";
						for (var h = e.viewData.itemsScaleList, y = "", m = 0; m < h.length; m++) "0" == h[m].dictValue && (y = h[m].dictName, e.viewData.itemsScaleName = y)
					}
			}
		})
	}

	function m() {
		o.getPayBillTemplate().then(function(t) {
			"000000" == t.retCode && (e.invoiceData.toBeMadeBillMoney = t.item.toBeMadeBillMoney, e.invoiceData.totalMadeBillMoney = t.item.totalMadeBillMoney, e.invoiceData.billTitle = t.item.billTitle, e.invoiceData.postAddress = t.item.postAddress, e.viewDateInvoice = {
				billMoney: ""
			})
		})
	}
	e.$watch("viewDateAccountMoneyObj.workOrderNum", function(t, a) {
		var o = /^\d{0,5}$/;
		o.test(e.viewDateAccountMoneyObj.workOrderNum) || (e.viewDateAccountMoneyObj.workOrderNum = a)
	}), e.$watch("viewDateAccountMoneyObj.payAmount", function(t, a) {
		var o = /^[.\d]{0,11}$/;
		o.test(e.viewDateAccountMoneyObj.payAmount) || (e.viewDateAccountMoneyObj.payAmount = a)
	}), e.$watch("viewDateInvoice.billMoney", function(t, a) {
		var o = /^[.\d]{0,15}$/;
		o.test(e.viewDateInvoice.billMoney) || (e.viewDateInvoice.billMoney = a)
	}), e.$watch("viewDateAccountMoneyObj.imNum", function(t, a) {
		var o = /^\d{0,5}$/;
		o.test(e.viewDateAccountMoneyObj.imNum) || (e.viewDateAccountMoneyObj.imNum = a)
	});
	var g = function() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, t.getUserInfo().then(function(t) {
			"000000" == t.retCode ? e.role.cusRoleId = t.item.cusRoleId : a.alert({
				title: "",
				content: t.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), e.newPageConfig = {
			config: {
				totalItems: 0,
				pageSize: 5,
				pageNo: 1,
				totalPages: 1,
				pageList: [1],
				tempPageNo: 1
			}
		}, e.newPageConfig_invoice = {
			config: {
				totalItems: 0,
				pageSize: 5,
				pageNo: 1,
				totalPages: 1,
				pageList: [1],
				tempPageNo: 1
			}
		}, e.newPageConfig_voice = {
			config: {
				totalItems: 0,
				pageSize: 5,
				pageNo: 1,
				totalPages: 1,
				pageList: [1],
				tempPageNo: 1
			}
		}, e.menuBar.activeClass = "00", e.viewData = {}, e.formData = {}, e.viewDataAccount = {}, e.viewDataAccountCus = {}, e.formDataAccount = {}, e.tempAccount = {}, e.PayRenewInfo = {}, e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {}, e.accountSubmit = {}, e.invoiceData = {}, e.viewDateInvoice = {}, e.voiceData = {}, e.tmpData = {}, e.channelAccountActiveTab = 0, o.getCurrentCompanyPayInfo().then(function(t) {
			if ("000000" == t.retCode) {
				e.viewDataAccount = t.item;
				var n = e.viewDataAccount.accountMoney.toFixed(2) + "",
					r = n.split(".");
				switch (e.viewDataAccountCus["int"] = r[0], e.viewDataAccountCus.decimal = r[1], e.viewDataAccount.accountStatus) {
					case -1:
						e.viewDataAccountCus.accountStatusName = "免费版（未激活）";
						break;
					case 0:
						e.viewDataAccountCus.accountStatusName = "免费版";
						break;
					case 1:
						e.viewDataAccountCus.accountStatusName = "试用版";
						break;
					case 2:
						e.viewDataAccountCus.accountStatusName = "专业版"
				}
				e.viewDataAccountCus.usedFileSize = e.viewDataAccount.usedFileSize, e.viewDataAccountCus.fileSize = e.viewDataAccount.fileSize, -1 == e.viewDataAccount.usedQaNum ? e.viewDataAccountCus.qaNum = "error" : e.viewDataAccountCus.qaNum = e.viewDataAccount.qaNum - e.viewDataAccount.usedQaNum, o.getPayRenewInfo().then(function(t) {
					console.log("2016.4.14new查询续期详情列表 |"), console.log(t), "000000" == t.retCode && (e.PayRenewInfo.infoList = t.items)
				})
			} else a.alert({
				title: "",
				content: t.retMsg || "请联系管理员",
				placement: "top",
				type: "warning",
				show: !0
			})
		}), s.getList({
			pageNo: e.newPageConfig.config.pageNo,
			pageSize: e.newPageConfig.config.pageSize
		}).then(function(t) {
			e.viewDataAccountCus.countlist = t.items, e.newPageConfig = {
				config: {
					totalItems: t.totalCount,
					pageSize: t.pageSize,
					pageNo: t.pageNo,
					totalPages: t.pageCount,
					pageList: t.pageList,
					tempPageNo: t.pageNo
				}
			}
		})
	};
	g(), e.jumpTo = function(t) {
		"..." != t && (1 > t || t > e.newPageConfig.config.totalPages || t != e.newPageConfig.config.pageNo && c(t))
	}, e.jumpToInvoice = function(t) {
		console.log(t), "..." != t && (1 > t || t > e.newPageConfig_invoice.config.totalPages || t != e.newPageConfig_invoice.config.pageNo && l(t))
	}, e.jumpToVoice = function(t) {
		"..." != t && (1 > t || t > e.newPageConfig_voice.config.totalPages || t != e.newPageConfig_voice.config.pageNo && u(t))
	}, e.channelAccountShow = function(t) {
		e.channelAccountActiveTab = t, 0 == t && (d(), c()), 1 == t && p(), 2 == t && (m(), l()), 3 == t && u()
	}, e.payInit = function() {
		e.viewDateAccountMoneyObj = {
			remarkInfo: "",
			payAmount: 0
		}
	}, e.sendAddRechargerOrder = function() {
		e.viewDateAccountMoneyObj.payAmount ? e.viewDateAccountMoneyObj.payAmount < .02 ? a.alert({
			title: "失败",
			content: "最小金额为0.02元",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.viewDateAccountMoneyObj.payAmount > 1e8 ? a.alert({
			title: "失败",
			content: "充值金额已超上限",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.viewDateAccountMoneyObj.remarkInfo.length > 200 ? a.alert({
			title: "失败",
			content: "描述超过最大长度",
			placement: "top",
			type: "warning",
			show: !0
		}) : o.sendAddRechargerOrder({
			payType: 0,
			payAmount: e.viewDateAccountMoneyObj.payAmount,
			payChannel: 0,
			remarkInfo: e.viewDateAccountMoneyObj.remarkInfo
		}).then(function(e) {
			if ("000000" == e.retCode) {
				var t = e.item,
					o = angular.element('<a href="' + t + '" target="_blank"></a>');
				angular.element(document.body).append(o), o[0].click(), o.remove(), $("#pay").modal("hide"), $("#payConfirm").modal("show")
			} else a.alert({
				title: "",
				content: e.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "失败",
			content: "充值金额不能为0",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.payReload = function() {
		d(), c()
	}, e.upgradeInit = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			workOrderNum: 0,
			imNum: 0,
			robotNum: 1
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.accountMoneyObj = t.item, e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.robotIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1004":
						e.accountMoneyObj.robotIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeConfirm = function() {
		0 == e.viewDateAccountMoneyObj.workOrderNum && 0 == e.viewDateAccountMoneyObj.imNum && 0 == e.viewDateAccountMoneyObj.robotNum ? a.alert({
			title: "失败",
			content: "请填写升级数量",
			placement: "top",
			type: "warning",
			show: !0
		}) : ($("#upgradeConfirm").modal("show"), $("#upgrade").modal("hide"))
	}, e.upgradeTrue = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		t.workOrderNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.workOrderIndex].prodId] = parseFloat(t.workOrderNum)), t.imNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.imIndex].prodId] = parseFloat(t.imNum)), 1 == t.robotNum && (n[e.accountMoneyObj.productList[e.accountMoneyObj.robotIndex].prodId] = t.robotNum), o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 1,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "服务升级成功！",
				placement: "top",
				type: "success",
				show: !0
			}), e.payReload()) : a.alert({
				title: "",
				content: "服务升级失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeInitHaveBot = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			workOrderNum: 0,
			imNum: 0
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.accountMoneyObj = t.item, e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeConfirmHaveBot = function() {
		0 == e.viewDateAccountMoneyObj.workOrderNum && 0 == e.viewDateAccountMoneyObj.imNum ? a.alert({
			title: "失败",
			content: "请填写升级数量",
			placement: "top",
			type: "warning",
			show: !0
		}) : ($("#upgradeConfirmHaveBot").modal("show"), $("#upgradeHaveBot").modal("hide"))
	}, e.upgradeTrueHaveBot = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		t.workOrderNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.workOrderIndex].prodId] = parseFloat(t.workOrderNum)), t.imNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.imIndex].prodId] = parseFloat(t.imNum)), o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 1,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "服务升级成功！",
				placement: "top",
				type: "success",
				show: !0
			}), e.payReload()) : a.alert({
				title: "",
				content: "服务升级失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.setRobotQuestionNum = function(t) {
		var a = e.robotQuestionNum;
		e.viewDateAccountMoneyObj.qusetion = a[t]
	}, e.upgradeQuestionInit = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			qusetion: 10
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.accountMoneyObj = t.item, e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeQuestionTrue = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		n[e.accountMoneyObj.productList[e.accountMoneyObj.qaIndex].prodId] = parseFloat(t.qusetion) / 10, o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 1,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (a.alert({
				title: "",
				content: "服务升级成功！",
				placement: "top",
				type: "success",
				show: !0
			}), e.payReload()) : a.alert({
				title: "",
				content: "服务升级失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.renewalInit = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			workOrderNum: 0,
			imNum: 0,
			robotNum: 0
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.accountMoneyObj = t.item, e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.robotIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1004":
						e.accountMoneyObj.robotIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.renewalConfirm = function() {
		0 == e.viewDateAccountMoneyObj.workOrderNum && 0 == e.viewDateAccountMoneyObj.imNum && 0 == e.viewDateAccountMoneyObj.robotNum ? a.alert({
			title: "失败",
			content: "请填写升级数量",
			placement: "top",
			type: "warning",
			show: !0
		}) : ($("#renewalConfirm").modal("show"), $("#renewal").modal("hide"))
	}, e.renewalTrue = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		t.workOrderNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.workOrderIndex].prodId] = parseFloat(t.workOrderNum)), t.imNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.imIndex].prodId] = parseFloat(t.imNum)), 1 == t.robotNum && (n[e.accountMoneyObj.productList[e.accountMoneyObj.robotIndex].prodId] = parseFloat(t.robotNum)), o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 2,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (e.payReload(), a.alert({
				title: "",
				content: "服务续期成功！",
				placement: "top",
				type: "success",
				show: !0
			})) : a.alert({
				title: "",
				content: "服务续期失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeWorkOrderInit = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			workOrderNum: 0
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				angular.copy(t.item, e.accountMoneyObj), e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.robotIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1004":
						e.accountMoneyObj.robotIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeWorkOrderConfirm = function() {
		0 == e.viewDateAccountMoneyObj.workOrderNum ? a.alert({
			title: "失败",
			content: "请输入有效的坐席数量",
			placement: "top",
			type: "warning",
			show: !0
		}) : ($("#upgradeWorkOrderConfirm").modal("show"), $("#upgradeWorkOrder").modal("hide"))
	}, e.upgradeWorkOrderTrue = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		t.workOrderNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.workOrderIndex].prodId] = parseFloat(t.workOrderNum)), o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 1,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (e.payReload(), a.alert({
				title: "",
				content: "服务升级成功！",
				placement: "top",
				type: "success",
				show: !0
			})) : a.alert({
				title: "",
				content: "服务升级失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeImInit = function(t) {
		e.accountMoneyObj = {}, e.viewDateAccountMoneyObj = {
			imNum: 0
		}, o.getProductInfo({
			prodType: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				angular.copy(t.item, e.accountMoneyObj), e.accountMoneyObj.workOrderIndex = 0, e.accountMoneyObj.imIndex = 0, e.accountMoneyObj.robotIndex = 0, e.accountMoneyObj.qaIndex = 0;
				for (var o = e.accountMoneyObj.productList, n = 0; n < o.length; n++) switch (o[n].prodId) {
					case "1005":
						e.accountMoneyObj.workOrderIndex = n;
						break;
					case "1001":
						e.accountMoneyObj.imIndex = n;
						break;
					case "1004":
						e.accountMoneyObj.robotIndex = n;
						break;
					case "1002":
						e.accountMoneyObj.qaIndex = n;
						break;
					case "1003":
						e.accountMoneyObj.qaIndex = n
				}
			} else a.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.upgradeImConfirm = function() {
		0 == e.viewDateAccountMoneyObj.imNum ? a.alert({
			title: "失败",
			content: "请输入有效的坐席数量",
			placement: "top",
			type: "warning",
			show: !0
		}) : ($("#imWorkOrderConfirm").modal("show"), $("#imWorkOrder").modal("hide"))
	}, e.upgradeImTrue = function() {
		var t = e.viewDateAccountMoneyObj,
			n = {};
		t.imNum > 0 && (n[e.accountMoneyObj.productList[e.accountMoneyObj.imIndex].prodId] = parseFloat(t.imNum)), o.shopOrder({
			order: {
				orderItemMap: n,
				prodType: 1,
				sign: e.accountMoneyObj.sign
			}
		}).then(function(t) {
			"000000" == t.retCode ? (e.payReload(), a.alert({
				title: "",
				content: "服务升级成功！",
				placement: "top",
				type: "success",
				show: !0
			})) : a.alert({
				title: "",
				content: "服务升级失败！",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.getPayBillList = function() {
		o.getPayBillList().then(function(e) {}, function() {})
	}, e.getPayBillTemplate = function() {
		o.getPayBillTemplate().then(function(e) {}, function() {})
	}, e.addInvoiceConfirm = function() {
		e.viewDateInvoice.billMoney < 50 ? a.alert({
			title: "失败",
			content: "输入金额最低为50元",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.viewDateInvoice.billMoney > e.invoiceData.toBeMadeBillMoney ? a.alert({
			title: "失败",
			content: "输入金额超过上限",
			placement: "top",
			type: "warning",
			show: !0
		}) : (e.viewDateInvoice = {
			billMoney: e.viewDateInvoice.billMoney,
			billTitle: e.invoiceData.billTitle,
			postAddress: "",
			receiveName: "",
			receivePhone: ""
		}, o.getSelectCusCompanyInfo().then(function(t) {
			if ("000000" == t.retCode) {
				var a = t.item.item1,
					o = ["provinceName", "cityName", "areaName", "companyAddress"],
					n = [];
				if (a.companyAddress)
					for (var r = 0; r < o.length; r++) a[o[r]] ? n.push(a[o[r]]) : n.push("");
				var i = n.join("");
				console.log(i), e.viewDateInvoice.postAddress = i
			}
		}), $("#invoice").modal("show"))
	}, e.submitInvoiceConfirm = function() {
		var t = /^.{1,20}$/,
			n = /^.{1,20}$/;
		e.viewDateInvoice.billTitle ? e.viewDateInvoice.billTitle.length > 60 ? a.alert({
			title: "失败",
			content: "请输入有效的公司抬头，最多60个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : e.viewDateInvoice.postAddress ? e.viewDateInvoice.postAddress.length > 100 ? a.alert({
			title: "失败",
			content: "请输入有效的详细地址，最多100个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : t.test(e.viewDateInvoice.receiveName) ? n.test(e.viewDateInvoice.receivePhone) ? o.addBill(e.viewDateInvoice).then(function(t) {
			if ("000000" == t.retCode) {
				$("#invoice").modal("hide"), a.alert({
					title: "",
					content: "提交成功",
					placement: "top",
					type: "success",
					show: !0
				});
				var n = {};
				n.init = function() {
					n.initPagination(), n.initTableList().then(function(t) {
						t && (e.paginationObjInvoice.config.totalItems = t.totalCount, e.paginationObjInvoice.config.pageSize = t.pageSize, e.paginationObjInvoice.config.isInit = !0)
					})
				}, n.initPagination = function() {
					e.paginationObjInvoice = {
						config: {
							isInit: !1,
							totalItems: 1,
							pageSize: 1,
							prevText: "< 上一页",
							nextText: "下一页 >",
							moreText: "···",
							isAutoCallback: !0,
							callBack: null
						}
					}
				}, n.initTableList = function(t) {
					return t = t ? t : {}, o.getPayBillList({
						pageNo: t.pageNo || e.paginationObjInvoice.currentPage || 1,
						pageSize: t.pageSize || e.paginationObjInvoice.pageSize || 10
					}).then(function(t) {
						if ("000000" == t.retCode) {
							for (var a = t.items, o = 0; o < a.length; o++) a[o].auditRemark || (a[o].auditRemark = "无");
							return e.invoiceData.list = a, t
						}
					}, function(e) {})
				}, e.getTableListByPaginationInvoice = function(t) {
					e.paginationObjInvoice.currentPage = t.currentPage, e.paginationObjInvoice.pageSize = t.pageSize, n.initTableList()
				}, n.init(), o.getPayBillTemplate().then(function(t) {
					"000000" == t.retCode ? (e.invoiceData.toBeMadeBillMoney = t.item.toBeMadeBillMoney, e.invoiceData.totalMadeBillMoney = t.item.totalMadeBillMoney, e.viewDateInvoice = {
						billMoney: 0
					}) : a.alert({
						title: "失败",
						content: t.retMsg || "失败",
						placement: "top",
						type: "warning",
						show: !0
					})
				})
			} else a.alert({
				title: "",
				content: t.retMsg || "提交失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		}) : a.alert({
			title: "失败",
			content: "请输入有效的电话号码，最多20个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "失败",
			content: "请输入有效的姓名，最多20个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "失败",
			content: "请输入有效的详细地址，最多100个字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : a.alert({
			title: "失败",
			content: "请输入有效的公司抬头，最多60个字符",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.cancelBill = function(t, a, o) {
		e.tmpData = {
			money: t,
			billId: a,
			title: o
		}
	}, e.cancelBillTrue = function() {
		o.deleteBillFromService({
			billId: e.tmpData.billId
		}).then(function(t) {
			"000000" == t.retCode && ($("#cancleInvoiceConfirm").modal("hide"), e.tmpData = {}, o.getPayBillList({
				pageNo: 1,
				pageSize: 5
			}).then(function(t) {
				if ("000000" == t.retCode) {
					for (var a = t.items, o = 0; o < a.length; o++) a[o].auditRemark || (a[o].auditRemark = "无");
					e.invoiceData.list = a
				}
			}, function() {}), o.getPayBillTemplate().then(function(t) {
				"000000" == t.retCode && (e.invoiceData.toBeMadeBillMoney = t.item.toBeMadeBillMoney, e.invoiceData.totalMadeBillMoney = t.item.totalMadeBillMoney, e.viewDateInvoice = {
					billMoney: 0
				})
			}, function() {}))
		}, function() {})
	}, e.clearTmpObj = function() {
		e.tmpData = {}
	}, e.getSelectCity = function(t) {
		e.formData.provinceId = t;
		for (var a = e.viewData.provinceList, n = "", r = 0; r < a.length; r++) a[r].provinceId == t && (n = a[r].provinceName, e.viewData.provinceName = n);
		e.viewData.cityName = "选择城市", e.viewData.areaName = "选择地区", e.formData.cityId = "999", e.formData.areaId = "999", o.getSelectCity({
			provinceId: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				var a = t.item;
				a.unshift({
					cityId: "999",
					cityName: "选择城市"
				}), e.viewData.cityList = a;
				var o = [];
				o.unshift({
					areaId: "999",
					areaName: "选择地区"
				}), e.viewData.areaList = o
			} else {
				var a = [];
				a.unshift({
					cityId: "999",
					cityName: "选择城市"
				}), e.viewData.cityList = a;
				var o = [];
				o.unshift({
					areaId: "999",
					areaName: "选择地区"
				}), e.viewData.areaList = o
			}
		})
	}, e.getSelectArea = function(t) {
		e.formData.cityId = t;
		for (var a = e.viewData.cityList, n = "", r = 0; r < a.length; r++) a[r].cityId == t && (n = a[r].cityName, e.viewData.cityName = n);
		e.viewData.areaName = "选择地区", e.formData.areaId = "999", o.getSelectArea({
			cityId: t
		}).then(function(t) {
			if ("000000" == t.retCode) {
				var a = t.item;
				a.unshift({
					areaId: "999",
					areaName: "选择地区"
				}), e.viewData.areaList = a
			} else a = [], a.unshift({
				areaId: "999",
				areaName: "选择地区"
			}), e.viewData.areaList = a
		})
	}, e.updateSelectArea = function(t) {
		e.formData.areaId = t;
		for (var a = e.viewData.areaList, o = "", n = 0; n < a.length; n++) a[n].areaId == t && (o = a[n].areaName, e.viewData.areaName = o)
	}, e.saveCompanyInfo = function() {
		var t = /[0-9a-zA-Z]{4,16}/,
			n = /.{1,20}/;
		e.formData.companyName ? e.formData.companyName.length > 60 ? a.alert({
			title: "",
			content: "请输入有效的公司名称，最多60个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : e.formData.companySite.length > 60 ? a.alert({
			title: "",
			content: "请输入有效的网址，最多60个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : t.test(e.formData.support) ? e.formData.contactName ? e.formData.contactName.length > 20 ? a.alert({
			title: "",
			content: "请输入有效的姓名，最多20个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : n.test(e.formData.contactPhone) ? e.formData.companyAddress.length > 100 ? a.alert({
			title: "",
			content: "地址最多输入100字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : ("999" == e.formData.provinceId ? e.formData.provinceId = "" : e.formData.provinceId, "999" == e.formData.cityId ? e.formData.cityId = "" : e.formData.cityId, "999" == e.formData.areaId ? e.formData.areaId = "" : e.formData.areaId, o.saveUpdateCusCompanyInfo({
			companyName: e.formData.companyName || "",
			companySite: e.formData.companySite || "",
			supportEmail: e.formData.support + e.formData.email || "",
			companyIndustry: e.formData.companyIndustry || "",
			companyScale: e.formData.companyScale || "",
			contactName: e.formData.contactName || "",
			contactPhone: e.formData.contactPhone || "",
			companyAddress: e.formData.companyAddress || "",
			provinceId: e.formData.provinceId || "",
			cityId: e.formData.cityId || "",
			areaId: e.formData.areaId || ""
		}).then(function(e) {
			"000000" == e.retCode ? a.alert({
				title: "",
				content: "公司信息提交成功",
				placement: "top",
				type: "success",
				show: !0
			}) : a.alert({
				title: "",
				content: e.retMsg || "保存失败",
				placement: "top",
				type: "danger",
				show: !0
			})
		})) : a.alert({
			title: "",
			content: "请输入有效的电话号码，最多20个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : a.alert({
			title: "",
			content: "请输入有效的姓名，最多20个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : a.alert({
			title: "",
			content: "请输入有效的邮箱前缀，支持英文字母及数字，长度为4到16个字符",
			placement: "top",
			type: "danger",
			show: !0
		}) : a.alert({
			title: "",
			content: "请输入有效的公司名称，最多60个字符",
			placement: "top",
			type: "danger",
			show: !0
		})
	}, e.getCompanyIndustry = function(t) {
		e.formData.companyIndustry = t;
		for (var a = e.viewData.itemsInduList, o = "", n = 0; n < a.length; n++) a[n].dictId == t && (o = a[n].dictName, e.viewData.itemsInduName = o)
	}, e.getCompanyIndustry = function(t) {
		e.formData.companyIndustry = t;
		for (var a = e.viewData.itemsInduList, o = "", n = 0; n < a.length; n++) a[n].dictValue == t && (o = a[n].dictName, e.viewData.itemsInduName = o)
	}, e.getCompanyScale = function(t) {
		e.formData.companyScale = t;
		for (var a = e.viewData.itemsScaleList, o = "", n = 0; n < a.length; n++) a[n].dictValue == t && (o = a[n].dictName, e.viewData.itemsScaleName = o)
	}, e.robotQuestionNum = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
}]), angular.module("Sobot4.C").controller("SidebarCtrl", ["$scope", "$timeout", "SidebarServ", "$tooltip", "$rootScope", function(e, t, a, o, n) {
	var r = function() {
		a.getSidebarInfo().then(function(a) {
			if (a) {
				var o = n.userAuthInfo ? n.userAuthInfo.info.cusRoleId : null,
					i = [],
					s = [];
				if (o) {
					switch (o) {
						case "1111":
							i = ["home", "workOrderCenter", "userAndGroup"];
							break;
						case "2222":
							i = ["home", "workOrderCenter", "repository", "userAndGroup", "statistics", "settings"];
							break;
						case "3333":
							i = ["home", "workOrderCenter", "repository", "userAndGroup", "statistics", "settings"];
							break;
						case "5555":
							i = ["home", "workOrderCenter", "userAndGroup"]
					}
					for (var c, l = 0, u = i.length; u > l; l++) {
						c = i[l];
						for (var d, p = 0, m = a.list.length; m > p; p++) d = a.list[p], d.name === c && s.push(d)
					}
					a.list = s, e.sidebarInfo = a, e.sidebarInfo.activeItem = 0
				} else t(function() {
					n.authManagement(), r()
				}, 2e3)
			}
		})
	};
	vir()
}]), angular.module("Sobot4.C").controller("SiteInfoCtrl", ["$rootScope", function(e) {
	e.siteInfo = {
		title: "智齿客服控制台",
		url: "www.sobot.com",
		des: "Sobot 4.0智能客服工作台是基于angular & bootStrap的系统。",
		keywords: "Sobot 4.0,AngularJS,BootStrap",
		logo: {
			src: "images/logo-50x50.jpg",
			alt: "智齿客服"
		}
	}
}]), angular.module("Sobot4.C").controller("StatisticsCtrl", ["$scope", "$state", "StatisticsServ", function(e, t, a) {
	e.menuBar = {}, e.menuBar.activeItem = "5001", e.reloadPage = function(t) {
		e.menuBar.activeItem = t
	}
}]), angular.module("Sobot4.C").controller("UserAndGroupCtrl", ["SidebarServ", "$rootScope", "$scope", "$state", "$window", "AuthServ", "$stateParams", "UserAndGroupServ", "MessageServ", "checkServ", "zcGlobal", "$timeout", "TabServ", "DialogServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m) {
	a.ctrlScope = a;
	var g = null,
		f = null,
		v = null,
		h = null,
		y = null,
		S = function(e) {
			e.item.serviceStatus0 = e.item.serviceStatus0 || "0", e.item.serviceStatus1 = e.item.serviceStatus1 || "0", e.item.serviceStatus9 = e.item.serviceStatus9 || "0"
		},
		b = function(e, t) {
			e = e ? e : o.params.parentID, t = t ? t : o.params.typeID;
			for (f in a.menuBar.menuList)
				if (v = a.menuBar.menuList[f], v && v.id === e)
					for (h in v.menuList) y = v.menuList[h], y && y.id === t && (g = y, g.parentID = v.id);
			return g
		},
		D = function() {
			a.totalItems = {}, a.activePageSize = {}, a.pageCount = {}, a.activePageNo = {}, a.content = {}, a.itemNum = {}, a.activePageSize = 10, a.activePageNo = 1
		},
		I = function(e) {
			a.totalItems = e.totalCount, a.activePageSize = e.pageSize, a.pageCount = e.pageCount, a.activePageNo = e.pageNo, a.content = e.items, a.itemNum = e.item, a.isAllStatus = !1;
			var t = e.item && e.item.serviceVo ? e.item.serviceVo.cusRoleId : "";
			for (var o in a.content) a.content[o].flag = !1, "2222" == t || "3333" == t ? "3333" == t && "3333" != a.content[o].cusRoleId ? a.content[o].isStatus = !0 : "2222" != t || "1111" != a.content[o].cusRoleId && "5555" != a.content[o].cusRoleId ? a.content[o].isStatus = !1 : a.content[o].isStatus = !0 : a.content[o].isStatus = !1;
			for (var n in a.content) "1" == a.content[n].serviceStatus ? (a.content[n].serviceStatus = "启用中", a.content[n].isUserDetail = !1, a.content[n].isViewUserDetail = !0) : "9" == a.content[n].serviceStatus ? (a.content[n].serviceStatus = "已停用", a.content[n].isUserDetail = !0, a.content[n].isViewUserDetail = !1) : "0" == a.content[n].serviceStatus && (a.content[n].serviceStatus = "待激活", a.content[n].isUserDetail = !0, a.content[n].isViewUserDetail = !1)
		},
		w = function() {
			a.totalItems = {}, a.activePageSize = {}, a.pageCount = {}, a.activePageNo = {}, a.content = {}, a.activePageSize = 10, a.activePageNo = 1;
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getUserGroupContent({
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return a.totalItems = e.totalCount, a.activePageSize = e.pageSize, a.pageCount = e.pageCount, a.activePageNo = e.pageNo, a.content = e.items, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		T = function(e, t) {
			var o = e.cusRoleId;
			if ("3333" == o || "2222" == o) {
				a.isAllStatus = !0;
				for (var n in t) "3333" == t[n].cusRoleId ? (t[n].flag = !1, t[n].isStatus = !1) : "2222" == t[n].cusRoleId && "2222" == o ? (a.isAllStatus = !1, t[n].flag = !1, t[n].isStatus = !1) : (t[n].flag = !0, t[n].isStatus = !0)
			} else a.isAllStatus = !1
		},
		k = function(e) {
			a.totalItems = e.totalCount, a.activePageSize = e.pageSize, a.pageCount = e.pageCount, a.activePageNo = e.pageNo, a.content = e.items, T(e.item.serviceVo, a.content), a.itemNum = e.item;
			for (var t in a.content) "1" == a.content[t].serviceStatus ? (a.content[t].serviceStatus = "启用中", a.content[t].isUserDetail = !1, a.content[t].isViewUserDetail = !0) : "9" == a.content[t].serviceStatus ? (a.content[t].serviceStatus = "已停用", a.content[t].isUserDetail = !0, a.content[t].isViewUserDetail = !1) : "0" == a.content[t].serviceStatus && (a.content[t].serviceStatus = "待激活", a.content[t].isUserDetail = !0, a.content[t].isViewUserDetail = !1);
			a.checkObj = new l
		},
		C = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 0,
					serviceStatus: 100,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), I(e), e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		O = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 1,
					serviceStatus: 100,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), I(e), e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		L = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 2,
					serviceStatus: 100,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return I(e), S(e), e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		N = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 0,
					serviceStatus: 1,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !0, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		j = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 0,
					serviceStatus: 9,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !1, a.isUserEnabled = !0, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		P = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 0,
					serviceStatus: 0,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					S(e), k(e), a.content = e.items;
					for (var t in a.content) a.content[t].flag = !0;
					return a.isAllStatus = !0, a.isUserDisable = !1, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		q = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 1,
					serviceStatus: 1,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !0, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		A = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 1,
					serviceStatus: 9,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !1, a.isUserEnabled = !0, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		x = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 1,
					serviceStatus: 0,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					S(e), k(e), a.content = e.items;
					for (var t in a.content) a.content[t].flag = !0;
					return a.isAllStatus = !0, a.isUserDisable = !1, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		M = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 2,
					serviceStatus: 1,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !0, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		U = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 2,
					serviceStatus: 9,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return S(e), k(e), a.isUserDisable = !1, a.isUserEnabled = !0, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		E = function() {
			D();
			var e = {};
			e.init = function() {
				e.initPagination(), e.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, e.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, e.initTableList = function(e) {
				return e = e ? e : {}, s.getWorkCustomerContent({
					flag: 2,
					serviceStatus: 0,
					pageNo: e.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: e.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					S(e), k(e), a.content = e.items;
					for (var t in a.content) a.content[t].flag = !0;
					return a.isAllStatus = !0, a.isUserDisable = !1, a.isUserEnabled = !1, e
				})
			}, a.getTableListByPagination = function(t) {
				a.activePageNo = t.currentPage, a.paginationObj.currentPage = t.currentPage, a.paginationObj.pageSize = t.pageSize, e.initTableList()
			}, e.init()
		},
		z = function(e, t, a) {
			"" == a ? "101" == e ? w() : "1001" == e && "101" == t ? w() : "1001" == e && "102" == t ? C() : "1001" == e && "103" == t ? O() : "1001" == e && "104" == t && L() : G(a)
		},
		G = function(e) {
			D();
			var t = {};
			t.init = function() {
				t.initPagination(), t.initTableList().then(function(e) {
					a.paginationObj.config.totalItems = e.totalCount, a.paginationObj.config.isInit = !0
				})
			}, t.initPagination = function() {
				a.paginationObj = {
					config: {
						isInit: !1,
						totalItems: a.totalItems,
						pageSize: a.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, t.initTableList = function(t) {
				return t = t ? t : {}, s.getQueryGroupService({
					groupId: e,
					pageNo: t.pageNo || a.paginationObj.currentPage || a.activePageNo,
					pageSize: t.pageSize || a.paginationObj.pageSize || a.activePageSize
				}).then(function(e) {
					return a.totalItems = e.totalCount, a.activePageSize = e.pageSize, a.pageCount = e.pageCount, a.activePageNo = e.pageNo, a.content = e.items, e
				})
			}, a.getTableListByPagination = function(e) {
				a.activePageNo = e.currentPage, a.paginationObj.currentPage = e.currentPage, a.paginationObj.pageSize = e.pageSize, t.initTableList()
			}, t.init()
		};
	a.isUserActive = 0, s.getMenuBar().then(function(e) {
		return a.menuBar = e, s.getTriggerSilderActive().then(function(e) {
			a.menuBar.menuList.push({
				id: "1002",
				title: "工单客服组",
				cusRoleId: e.item.serviceVo && e.item.serviceVo.cusRoleId ? e.item.serviceVo.cusRoleId : "",
				name: "user",
				isNew: !0,
				isEdit: !1,
				isSet: !1,
				type: "1",
				menuList: []
			}), a.menuBar.menuList.push({
				id: "1003",
				title: "在线客服组",
				cusRoleId: e.item.serviceVo && e.item.serviceVo.cusRoleId ? e.item.serviceVo.cusRoleId : "",
				name: "user",
				isNew: !0,
				isEdit: !1,
				isSet: !1,
				type: "1",
				menuList: []
			});
			var t = e.item.ticketGroups ? e.item.ticketGroups : "",
				o = e.item.onlineGroups ? e.item.onlineGroups : "";
			if ("" != t && e.item.ticketGroups.length > 0)
				for (var n = 0, r = e.item.ticketGroups.length; r > n; n++) a.menuBar.menuList[1].menuList.push({
					id: n + 101 + "",
					title: e.item.ticketGroups[n].groupName,
					groupId: e.item.ticketGroups[n].groupId,
					sref: "zc.back.userAndGroup.workOrderCustomerGroup({parentID: '1002', typeID:" + (n + 101) + ", groupID: '" + e.item.ticketGroups[n].groupId + "'})"
				});
			if ("" != o && e.item.onlineGroups.length > 0)
				for (var n = 0, i = e.item.onlineGroups.length; i > n; n++) a.menuBar.menuList[2].menuList.push({
					id: n + 101 + "",
					title: e.item.onlineGroups[n].groupName,
					groupId: e.item.onlineGroups[n].groupId,
					sref: "zc.back.userAndGroup.onlineSkillGroup({parentID: '1003', typeID:" + (n + 101) + ", groupID: '" + e.item.onlineGroups[n].groupId + "'})"
				})
		})
	}).then(function(e) {
		a.activeMenu = b(), a.menuBar.activeItem = a.activeMenu.parentID + "-" + a.activeMenu.id, z(a.activeMenu.parentID, a.activeMenu.id, o.params.groupID ? o.params.groupID : ""), a.parentMenuId = a.activeMenu.parentID, a.childMenuId = a.activeMenu.id
	}), a.selectCustomerAll = function() {
		var e = a.parentMenuId,
			t = a.childMenuId;
		"1001" == e && "102" == t ? C() : "1001" == e && "103" == t ? O() : "1001" == e && "104" == t && L()
	}, a.selectCustomerInEnabling = function() {
		var e = a.parentMenuId,
			t = a.childMenuId;
		"1001" == e && "102" == t ? N() : "1001" == e && "103" == t ? q() : "1001" == e && "104" == t && M()
	}, a.selectCustomerDisabled = function() {
		var e = a.parentMenuId,
			t = a.childMenuId;
		"1001" == e && "102" == t ? j() : "1001" == e && "103" == t ? A() : "1001" == e && "104" == t && U()
	}, a.selectCustomerNonActivated = function() {
		var e = a.parentMenuId,
			t = a.childMenuId;
		"1001" == e && "102" == t ? P() : "1001" == e && "103" == t ? x() : "1001" == e && "104" == t && E()
	}, a.selectStatus = function(e, t, o) {
		var r = null,
			i = "";
		switch (e) {
			case "启用中":
				i = "9";
				break;
			case "已停用":
				i = "1";
				break;
			case "待激活":
				i = "88"
		}
		var c = {};
		switch (o) {
			case "1":
				c = {
					serviceStatus: i,
					serviceId: t,
					flag: 1
				};
				break;
			case "2":
				c = {
					serviceStatus: i,
					serviceId: t,
					flag: 2
				};
				break;
			default:
				c = {
					serviceStatus: i,
					serviceId: t
				}
		}
		s.UpdateServiceStatus(c).then(function(e) {
			if ("000000" == e.retCode) console.log(e), "2" == o ? (a.modalDomData = {
				title: "激活链接信息",
				activateLink: e.item.url,
				defaultPwd: e.item.pw
			}, r = m.modal({
				scope: a,
				templateUrl: "views/public/strap-modal-activateInfo.html"
			}), r.$promise.then(r.show)) : n.location.reload();
			else {
				var t = e.retMsg ? e.retMsg : "更改失败";
				alert(t)
			}
		})
	}, a.triggerSliderActive = function(e) {
		"3" == e && s.getTriggerSilderActive().then(function(e) {
			a.groupcontent = e.item
		})
	}, a.triggerMenuActive = function(e, t, o, n, r) {
		a.menuBar.activeItem = o + "-" + n, a.activeMenu = b(o, n), z(o, n, r), a.parentMenuId = o, a.childMenuId = n
	}, a.checkAddEmail = function() {
		var e = a.formData.userEmail ? a.formData.userEmail : "",
			t = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		return e ? !t.test(e) || e.length > 40 ? (a.retError = "邮箱不合法", a.errorState = !0, !1) : void s.setCheckEmail({
			email: e
		}).then(function(e) {
			"000000" != e.retCode && e.retMsg ? (a.retError = e.retMsg, a.errorState = !0) : (a.retError = "", a.errorState = !1)
		}) : (a.retError = "邮箱不能为空", a.errorState = !0, !1)
	}, a.checkUserNick = function() {
		var e = a.formData.userNickname ? a.formData.userNickname.replace(/[ ]/g, "") : "";
		return !e || e.length > 8 ? (a.retError = "请输入有效的昵称", a.errorState = !0, !1) : (a.retError = "", void(a.errorState = !1))
	}, a.createItem = function(e) {
		a.modalParams = null;
		var t = null;
		switch (a.retError = "", a.errorState = !1, e) {
			case "1":
				s.getQueryDictDataList({
					dictCode: "1012"
				}).then(function(e) {
					a.userRoleList = e.items, a.dictValue = e.items.dictValue, a.modalDomData = {
						title: "添加新用户"
					}, a.formData = {}, t = m.modal({
						scope: a,
						templateUrl: "views/public/strap-modal-addUser.html"
					})
				}).then(function() {
					t.$promise.then(t.show), a.clearUserNameText(), a.confirm = function(e) {
						var o = $("#userRole").find("option:checked").text(),
							r = e.userName ? a.formData.userName.replace(/[ ]/g, "") : "",
							i = e.userEmail ? a.formData.userEmail : "",
							c = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
							l = /^([a-zA-Z\u4E00-\u9FA5])+$/;
						if (!i) return a.retError = "邮箱不能为空", a.errorState = !0, !1;
						if (!c.test(i) || i.length > 40) return a.retError = "邮箱不合法", a.errorState = !0, !1;
						a.retError = "", a.errorState = !1;
						var u = e.userNickname ? a.formData.userNickname.replace(/[ ]/g, "") : "";
						return !u || u.length > 8 ? (a.retError = "请输入有效的昵称", a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, !r || r.length > 8 ? (a.retError = "请输入您的真实姓名", a.errorState = !0, !1) : l.test(r) ? (a.retError = "", a.errorState = !1, s.setAddServiceInfoConfirm({
							cusRoleId: a.formData.userRole,
							email: a.formData.userEmail,
							cusRoleName: o,
							name: a.formData.userName,
							nick: a.formData.userNickname
						}).then(function(e) {
							return "000000" != e.retCode ? (a.retError = e.retMsg, a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, t.hide(), n.location.reload(), void 0)
						}), void 0) : (a.retError = "请输入您的真实姓名", a.errorState = !0, !1))
					}
				});
				break;
			case "2":
				s.getUserList({
					flag: 0
				}).then(function(e) {
					a.modalDomData = {
						title: "新建工单组",
						userGroupTitle: "工单组名称",
						isEdit: !1,
						selectObj: {
							title: "点击选择客服",
							placeholder: "搜索客服姓名",
							userList: e.items
						},
						selectedObj: {
							title: "已选择的客服",
							userList: []
						}
					}, a.formData = {}, t = m.modal({
						scope: a,
						templateUrl: "views/public/strap-modal-userGroup.html"
					})
				}).then(function() {
					t.$promise.then(t.show), a.clearUserNameText(), a.confirm = function(e) {
						var o = e.userGroup || "",
							r = "",
							i = /[`~!@#$^&*()+=|\\\[\]\{\}:;'\,.<>\/?~！@￥%]/;
						for (var c in a.modalDomData.selectedObj.userList) r += a.modalDomData.selectedObj.userList[c].serviceId + ",";
						return o ? o.length > 10 ? (a.retError = "新建工单组的名称不能超过十个字符", a.errorState = !0, !1) : i.test(o) ? (a.retError = "新建工单组的名称不能有特殊字符", a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, s.getQueryGroupCusServiceInfoConfirm({
							groupName: o,
							strServiceId: r,
							viewFlag: 0,
							flag: 0
						}).then(function(e) {
							"000000" == e.retCode ? (a.retError = "", a.errorState = !1, a.groupcontent = {
								ticketGroups: {
									groupName: o
								}
							}, t.hide(), n.location.reload()) : (a.retError = e.retMsg, a.errorState = !0)
						}), void 0) : (a.retError = "请输入新建工单组的名称", a.errorState = !0, !1)
					}, d(function() {
						a.$broadcast("rebuild:me")
					}, 300)
				});
				break;
			case "3":
				s.getUserList({
					flag: 1
				}).then(function(e) {
					a.modalDomData = {
						title: "新建在线技能组",
						userGroupTitle: "技能组名称",
						isEdit: !1,
						selectObj: {
							title: "点击选择客服",
							placeholder: "搜索客服姓名",
							userList: e.items
						},
						selectedObj: {
							title: "已选择的客服",
							userList: []
						}
					}, a.formData = {}, t = m.modal({
						scope: a,
						templateUrl: "views/public/strap-modal-userGroup.html"
					})
				}).then(function() {
					t.$promise.then(t.show), a.clearUserNameText(), a.confirm = function(e) {
						var o = e.userGroup || "",
							r = "",
							i = /[`~!@#$^&*()+=|\\\[\]\{\}:;'\,.<>\/?~！@￥%]/;
						for (var c in a.modalDomData.selectedObj.userList) r += a.modalDomData.selectedObj.userList[c].serviceId + ",";
						return o ? o.length > 10 ? (a.retError = "新建技能组的名称不能超过十个字符", a.errorState = !0, !1) : i.test(o) ? (a.retError = "新建技能组的名称不能有特殊字符", a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, s.getQueryGroupCusServiceInfoConfirm({
							groupName: o,
							strServiceId: r,
							viewFlag: 0,
							flag: 1
						}).then(function(e) {
							"000000" == e.retCode ? (a.retError = "", a.errorState = !1, a.groupcontent = {
								ticketGroups: {
									groupName: o
								}
							}, t.hide(), n.location.reload()) : (a.retError = e.retMsg, a.errorState = !0)
						}), void 0) : (a.retError = "请输入新建技能组的名称", a.errorState = !0, !1)
					}, d(function() {
						a.$broadcast("rebuild:me")
					}, 300)
				})
		}
	}, a.enterItem = function(e, t) {
		for (var a = 0; a < t.length; a++) t[a].hoverState = !1;
		e.hoverState = !0
	}, a.leaveItem = function(e) {
		e.hoverState = !1
	}, a.clearUserNameText = function() {
		a.ctrlScope.userNameText = ""
	}, a.editItem = function(e, t, o) {
		a.modalParams = null;
		var r = null;
		switch (a.retError = "", a.errorState = !1, e) {
			case "2":
				s.getQueryGroupEditServiceInfo({
					groupId: t,
					flag: 0
				}).then(function(e) {
					a.modalDomData = {
						title: "编辑工单客服组",
						userGroupTitle: "工单组客服名称",
						isEdit: !1,
						selectObj: {
							title: "点击选择客服",
							placeholder: "搜索客服姓名",
							userList: e.items
						},
						selectedObj: {
							title: "已选择的客服",
							userList: e.item
						},
						isDeleteBtn: {
							title: "删除客服组"
						}
					}, a.formData = {
						userGroup: o,
						groupId: t
					}, r = m.modal({
						scope: a,
						templateUrl: "views/public/dialog-modal-userGroup.html"
					})
				}).then(function() {
					r.$promise.then(r.show), a.clearUserNameText(), a.deleteCustomerGroup = function(e) {
						var t = confirm("确认要删除客服组" + o + "吗？");
						1 == t && s.DeleteGroupInfo({
							groupId: e
						}).then(function(e) {
							var t, a;
							"000000" == e.retCode && (r.hide(), t = {
								content: "删除成功",
								type: "success"
							}, setTimeout(function() {
								n.location.reload()
							}, 2e3)), a = m.alert(t), a.$promise.then(a.show)
						})
					}, a.confirm = function(e) {
						var o = e.userGroup || "",
							i = "",
							c = /[`~!@#$^&*()+=|\\\[\]\{\}:;'\,.<>\/?~！@￥%]/;
						for (var l in a.modalDomData.selectedObj.userList) i += a.modalDomData.selectedObj.userList[l].serviceId + ",";
						return o ? o.length > 10 ? (a.retError = "工单客服组的名称不能超过十个字符", a.errorState = !0, !1) : c.test(o) ? (a.retError = "工单客服组的名称不能有特殊字符", a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, s.UpdateGroupEditInfoConfirm({
							groupName: o,
							groupId: t,
							strServiceId: i,
							flag: 0
						}).then(function(e) {
							"000000" == e.retCode ? (a.retError = "", a.errorState = !1, a.groupcontent = {
								ticketGroups: {
									groupName: o
								}
							}, G(t), r.hide(), n.location.reload()) : (a.retError = e.retMsg, a.errorState = !0)
						}), void 0) : (a.retError = "请输入工单客服组的名称", a.errorState = !0, !1)
					}, d(function() {
						a.$broadcast("rebuild:me")
					}, 300)
				});
				break;
			case "3":
				s.getQueryGroupEditServiceInfo({
					groupId: t,
					flag: 1
				}).then(function(e) {
					a.modalDomData = {
						title: "编辑在线技能组",
						userGroupTitle: "在线技能组名称",
						isEdit: !1,
						selectObj: {
							title: "点击选择客服",
							placeholder: "搜索客服姓名",
							userList: e.items
						},
						selectedObj: {
							title: "已选择的客服",
							userList: e.item
						},
						isDeleteBtn: {
							title: "删除技能组"
						}
					}, a.formData = {
						userGroup: o,
						groupId: t
					}, r = m.modal({
						scope: a,
						templateUrl: "views/public/dialog-modal-userGroup.html"
					})
				}).then(function() {
					r.$promise.then(r.show), a.clearUserNameText(), a.deleteCustomerGroup = function(e) {
						var t = confirm("确认要删除技能组{" + o + "}吗？");
						1 == t && s.DeleteGroupInfo({
							groupId: e
						}).then(function(e) {
							var t, a;
							"000000" == e.retCode && (r.hide(), t = {
								content: "删除成功",
								type: "success"
							}, setTimeout(function() {
								n.location.reload()
							}, 2e3)), a = m.alert(t), a.$promise.then(a.show)
						})
					}, a.confirm = function(e) {
						var o = e.userGroup || "",
							n = "",
							i = /[`~!@#$^&*()+=|\\\[\]\{\}:;'\,.<>\/?~！@￥%]/;
						for (var c in a.modalDomData.selectedObj.userList) n += a.modalDomData.selectedObj.userList[c].serviceId + ",";
						return o ? o.length > 10 ? (a.retError = "在线技能组的名称不能超过十个字符", a.errorState = !0, !1) : i.test(o) ? (a.retError = "在线技能组的名称不能有特殊字符", a.errorState = !0, !1) : (a.retError = "", a.errorState = !1, s.UpdateGroupEditInfoConfirm({
							groupName: o,
							groupId: t,
							strServiceId: n,
							flag: 1
						}).then(function(e) {
							"000000" == e.retCode ? (a.retError = "", a.errorState = !1, a.groupcontent = {
								ticketGroups: {
									groupName: o
								}
							}, G(t), r.hide()) : (a.retError = e.retMsg, a.errorState = !0)
						}), void 0) : (a.retError = "请输入在线技能组的名称", a.errorState = !0, !1)
					}, d(function() {
						a.$broadcast("rebuild:me")
					}, 300)
				})
		}
	}, a.updateUserList = function(e, t) {
		var o = [],
			n = "",
			r = a.modalDomData.selectObj.userList,
			i = a.modalDomData.selectedObj.userList;
		if (0 === e) {
			for (var s in r) n = r[s], n.serviceId == t.serviceId ? a.modalDomData.selectedObj.userList.push(n) : o.push(n);
			a.modalDomData.selectObj.userList = o
		} else if (1 === e) {
			for (var s in i) n = i[s], n.serviceId == t.serviceId ? a.modalDomData.selectObj.userList.push(n) : o.push(n);
			a.modalDomData.selectedObj.userList = o
		}
		a.$broadcast("rebuild:me")
	}, a.operateDoc = function(e) {
		var t = "",
			o = m.modal({
				scope: a,
				templateUrl: "views/repository/strap-modal-operateDoc.html"
			}),
			r = null;
		if (a.checkObj.checkedList.length) {
			t = a.checkObj.getIdStr(["serviceId", "cusRoleId"], a.content);
			var i = t.split(",").length;
			switch (e) {
				case 1:
					a.modalDomData = {
						content: "确定要删除这" + i + "个用户吗？",
						typeID: e
					}, r = {
						serviceIdAndRoleId: t,
						serviceStatusFlag: -1
					};
					break;
				case 2:
					a.modalDomData = {
						content: "确认启用这" + i + "个用户吗？",
						typeID: e
					}, r = {
						serviceIdAndRoleId: t,
						serviceStatusFlag: 1
					};
					break;
				case 3:
					a.modalDomData = {
						content: "确认停用这" + i + "个用户吗？",
						typeID: e
					}, r = {
						serviceIdAndRoleId: t,
						serviceStatusFlag: 9
					}
			}
			o.$promise.then(o.show), a.clearUserNameText(), a.confirm = function() {
				o.hide(), s.batchOperation(r).then(function(e) {
					var t, a;
					e && e.retCode && "000000" == e.retCode ? (t = {
						title: "",
						content: e.retMsg || "成功",
						type: "success"
					}, d(function() {
						n.location.reload()
					}, 2e3)) : t = {
						title: "",
						content: e.retMsg || "失败",
						type: "warning"
					}, a = m.alert(t), a.$promise.then(a.show)
				})
			}
		}
	}, a.viewOrdinaryUserDetail = function(e, t, a) {
		p.open({
			title: a.uname,
			toState: {
				name: "zc.back.ordinaryUserDetail"
			},
			toParams: {
				userID: a.id
			},
			fromState: o.current,
			fromParams: o.params
		})
	}, a.viewUserDetail = function(e, t, a) {
		p.open({
			title: a.serviceName,
			toState: {
				name: "zc.back.userDetail"
			},
			toParams: {
				userID: a.serviceId
			},
			fromState: o.current,
			fromParams: o.params
		})
	}
}]), angular.module("Sobot4.C").controller("userDetailCtrl", ["$scope", "$rootScope", "Upload", "$state", "$stateParams", "TabServ", "UserAndGroupServ", "DialogServ", "zcGlobal", "checkServ", "$window", "StorageServ", "CookieServ", "LoginServ", "AuthServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m, g) {
	e.selectContent = 0;
	var f = n.userID,
		v = function() {
			i.getQueryDictDataList({
				dictCode: "1012"
			}).then(function(t) {
				e.userRoleList = t.items
			})
		},
		h = function() {
			e.totalItems = {}, e.activePageSize = {}, e.pageCount = {}, e.activePageNo = {}, e.content = {}, e.itemNum = {}, e.activePageNo = 1, e.activePageSize = 12
		},
		y = function(t, a) {
			i.QueryTicketByServicerDealNum({
				serviceEmail: t
			}).then(function(t) {
				e.queryTicketTotalNumList = t.items
			}), h();
			var o = {};
			o.init = function() {
				o.initPagination(), o.initTableList().then(function(t) {
					e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0
				})
			}, o.initPagination = function() {
				e.paginationObj = {
					config: {
						isInit: !1,
						totalItems: e.totalItems,
						pageSize: e.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, o.initTableList = function(o) {
				return o = o ? o : {}, i.QueryTicketByServicerDealList({
					serviceEmail: t,
					ticketStatus: a.ticketStatus,
					pageNo: o.pageNo || e.paginationObj.currentPage || e.activePageNo,
					pageSize: o.pageSize || e.paginationObj.pageSize || e.activePageSize
				}).then(function(t) {
					return e.totalItems = t.totalCount, e.activePageSize = t.pageSize, e.pageCount = t.pageCount, e.activePageNo = t.pageNo, e.content = t.items, t
				})
			}, e.getTableListByPagination = function(t) {
				e.activePageNo = t.currentPage, e.paginationObj.currentPage = t.currentPage, e.paginationObj.pageSize = t.pageSize, o.initTableList()
			}, o.init()
		};
	i.getUserDetail({
		serviceId: f
	}).then(function(t) {
		e.userDetail = t.item.perInfo, e.userWorkGroupList = t.item.groupMap && t.item.groupMap.ticketgroup ? t.item.groupMap.ticketgroup : "", e.userOnlineGroupLIst = t.item.groupMap && t.item.groupMap.onlinegroup ? t.item.groupMap.onlinegroup : "";
		var a = t.item.perInfo.serviceInfo.serviceEmail;
		y(a, "");
		var o = t.item.serviceVo.serviceId,
			n = t.item.serviceVo.cusRoleId,
			r = t.item.perInfo.serviceInfo.serviceId,
			s = t.item.perInfo.serviceInfo.cusRoleId;
		"0" == e.userDetail.serviceInfo.phoneNo && (e.userDetail.serviceInfo.phoneNo = ""), o == r ? (e.isDisplayImg = !1, e.isUploadImg = !0) : "3333" == n ? (e.isDisplayImg = !1, e.isUploadImg = !0) : "2222" != n || "1111" != s && "5555" != s ? (e.isDisplayImg = !0, e.isUploadImg = !1) : (e.isDisplayImg = !1, e.isUploadImg = !0), "3333" == n && "3333" != s ? (e.isSuperUser = !0, e.superName = "超级管理员") : e.isSuperUser = !1, "2222" == n || "3333" == n ? o == r ? (e.isDeleteUser = !1, e.isDisplay = !1, e.isUpdateRoleName = !0) : "2222" != n || "2222" != s && "3333" != s ? (e.isDisplay = !0, e.isUpdateRoleName = !1, e.isDeleteUser = !0, v()) : (e.isDeleteUser = !1, e.isDisplay = !1, e.isUpdateRoleName = !0) : (e.isDeleteUser = !1, e.isDisplay = !1, e.isUpdateRoleName = !0), "5555" != s ? (e.onlineNum = !0, "3333" == n ? (e.isOnlineNum = !1, e.isOnlineNumUpadate = !0) : "2222" == n && "1111" == s ? (e.isOnlineNum = !1, e.isOnlineNumUpadate = !0) : (e.isOnlineNum = !0, e.isOnlineNumUpadate = !1)) : e.onlineNum = !1;
		var c = t.item.perInfo.jurisdiction;
		"3333" != s ? "0" == c ? (e.workPowers = !1, e.replyPowers = !1) : "1" == c && (e.workPowers = !0, e.replyPowers = !0, i.getQueryDictDataList({
			dictCode: "1015"
		}).then(function(t) {
			e.userTicketList = t.items
		}), i.getQueryDictDataList({
			dictCode: "1013"
		}).then(function(t) {
			e.userReplyList = t.items
		})) : (e.workPowers = !1, e.replyPowers = !1);
		var l = t.item.perInfo.show;
		"0" == l && (e.isUpadate = !0, e.flagUpdate = !1, e.isUpdateUserPwd = !1), "1" == l && (e.isUpadate = !1, e.flagUpdate = !0, e.isUpdateUserPwd = !0), "5555" == s ? (e.isDisplayWorkGroup = !0, e.isDisplayOnlineGroup = !1, "2222" == n || "3333" == n ? (e.isWorkDisplayGroup = !0, e.isUpdateWorkGroup = !0) : (e.isWorkDisplayGroup = !1, e.isUpdateWorkGroup = !1)) : (e.isDisplayWorkGroup = !0, e.isDisplayOnlineGroup = !0, "2222" == n && "3333" != s ? (e.isWorkDisplayGroup = !0, e.isUpdateWorkGroup = !0, e.isDisplayGroup = !0, e.isUpdateGroup = !0) : "3333" == n ? (e.isWorkDisplayGroup = !0, e.isUpdateWorkGroup = !0, e.isDisplayGroup = !0, e.isUpdateGroup = !0) : (e.isWorkDisplayGroup = !1, e.isUpdateWorkGroup = !1, e.isDisplayGroup = !1, e.isUpdateGroup = !1));
		var u = e.userDetail.serviceInfo.cusRoleId;
		"2222" == u && (e.roleName = "管理员"), "3333" == u && (e.roleName = "超级管理员"), "1111" == u && (e.roleName = "在线客服"), "5555" == u && (e.roleName = "工单客服");
		var d = e.userDetail.serviceInfo.ticketAuthFlag;
		"0" == d && (e.ticketName = "查看所有的工单"), "1" == d && (e.ticketName = "查看自己组内的工单"), "2" == d && (e.ticketName = "查看分配给自己的工单");
		var p = e.userDetail.serviceInfo.replyAuthFlag;
		"0" == p && (e.replyName = "公开回复"), "1" == p && (e.replyName = "仅私密回复");
		var m = e.userDetail.serviceInfo.serviceStatus;
		"1" == m && (e.userDetail.serviceInfo.serviceStatus = "启用中"), "9" == m && (e.userDetail.serviceInfo.serviceStatus = "已停用"), "0" == m && (e.userDetail.serviceInfo.serviceStatus = "待激活")
	}), e.triggerSelectContentActive = function(t, a, o) {
		e.selectContent = t, y(a, o)
	}, e.deleteUserGroup = function(e, t) {
		var a = t.serviceId;
		return e && a ? void i.DeleteUserInGroup({
			groupId: e,
			serviceId: a
		}).then(function(e) {
			"000000" == e.retCode && u.location.reload()
		}) : !1
	}, e.displayUserGroup = function(t, a, o) {
		var n = "",
			r = null;
		e.userGroupAll = null;
		var c;
		"0" == a && (c = "所在工单客服分组"), "1" == a && (c = "所在在线客服分组"), e.modalDomData = {
			title: c
		}, r = s.modal({
			scope: e,
			templateUrl: "views/public/dialog-modal-addGroup.html"
		}), r.$promise.then(r.show);
		var d = "";
		for (var p in o) d += o[p].groupId + ",";
		"0" != a && "1" != a || i.QueryGroupListByGroupType({
			serviceId: t,
			flag: a,
			existGroupIds: d
		}).then(function(t) {
			e.checkObj = new l, e.userGroupAll = t.item, e.isGroup = a
		}), e.updateUserGroupByFlag = function() {
			e.checkObj.checkedList.length && (n = e.checkObj.getIdStr("groupId", e.userGroupAll), i.UpdateServiceGroupRelInfo({
				serviceId: t,
				groupIds: n,
				flag: e.isGroup
			}).then(function(e) {
				r.hide(), "000000" == e.retCode && u.location.reload()
			}))
		}
	}, e.DeleteCustomer = function(e, t, a) {
		var o = confirm("确定要删除该用户吗？点击确定该用户的所有信息均被删除!");
		1 == o && i.DeleteCusServiceInfo({
			serviceId: t,
			cusRoleId: a
		}).then(function(t) {
			"000000" == t.retCode && r.close(e)
		})
	}, e.alertUpdatePwd = function(t) {
		var a = null;
		e.modalDomData = {
			title: "密码设置"
		}, a = s.modal({
			scope: e,
			templateUrl: "views/public/dialog-modal-updatePwd.html"
		}), a.$promise.then(a.show), e.ResetUserPassword = function(o) {
			var n = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*()_+<>?.,]{8,20}$/;
			return o && n.test(o) ? (e.errorMsg = "", void i.ResetPassword({
				serviceId: t,
				password: o
			}).then(function(e) {
				if ("000000" == e.retCode) alert("修改密码成功！"), a.hide();
				else {
					var t = e.retMsg ? e.retMsg : "修改失败";
					alert(t)
				}
			})) : (e.errorMsg = "密码应为8~20位英文、数字或符号组合", !1)
		}
	}, e.getViewWorkOrderDetail = function(e) {
		r.open({
			title: e.ticketTitle,
			ticketCode: e.ticketCode,
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.ticketId
			},
			fromState: o.current,
			fromParams: o.params
		})
	}, t.ordinaryUser = {
		email: ""
	}, e.createCustomerOrder = function(e) {
		t.ordinaryUser.email = "", t.ordinaryUser.email = e
	}, e.updateUserBaseInfoOnlineNum = function(t, a) {
		var o = /^[1-9]\d*|0$/;
		if ("" != a && !o.test(a)) return e.userDetail.serviceInfo.maxAccept = "", !1;
		if (a > 100) {
			var n = "修改接待上线有误，请稍候重新输入";
			alert(n)
		} else i.UpdateServiceInfo({
			serviceId: t,
			maxAccept: a ? a : "-1"
		}).then(function(e) {
			if ("000000" != e.retCode) {
				var t = "修改接待上线有误，请稍候重新输入";
				alert(t)
			} else u.location.reload()
		})
	}, e.updateUserBaseInfoNick = function(e, t) {
		var a = t ? t.replace(/[ ]/g, "") : "";
		if ("" == a) alert("不能为空，请重新修改！");
		else {
			if ("" != a && a.length > 8) return alert("不能超过8个字符，请重新修改！"), !1;
			i.UpdateServiceInfo({
				serviceId: e,
				serviceNick: a
			}).then(function(e) {
				if ("000000" != e.retCode) {
					var t = "修改昵称有误，请稍候重新输入";
					alert(t)
				} else u.location.reload()
			})
		}
	}, e.updateUserBaseInfoName = function(t, a) {
		var o = a ? a.replace(/[ ]/g, "") : "",
			n = /^([a-zA-Z\u4E00-\u9FA5])+$/;
		return "" == o ? (alert("请输入有效的真实姓名"), !1) : "" != o && o.length > 8 ? (alert("不能超过8个字符，请重新修改！"), !1) : n.test(o) ? void i.UpdateServiceInfo({
			serviceId: t,
			serviceName: o
		}).then(function(e) {
			if ("000000" != e.retCode) {
				var t = "修改真实姓名有误，请稍候重新输入";
				alert(t)
			} else u.location.reload()
		}) : (e.userDetail.uname = "", alert("请输入有效的真实姓名"), !1)
	}, e.updateUserBaseInfoPhoneNo = function(t, a) {
		var o = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/,
			n = a ? a : "";
		return "" == n ? !1 : o.test(n) ? void i.UpdateServiceInfo({
			serviceId: t,
			phoneNo: n
		}).then(function(e) {
			if ("000000" != e.retCode) {
				var t = "修改手机号有误，请稍候重新输入";
				alert(t)
			} else u.location.reload()
		}) : (e.userDetail.serviceInfo.phoneNo = "", alert("手机号有误，请重新修改或置空"), !1)
	}, e.updateUserBaseInfoQQ = function(t, a) {
		var o = /[1-9][0-9]{4,}/,
			n = a ? a : "";
		return "" == n ? !1 : o.test(n) ? void i.UpdateServiceInfo({
			serviceId: t,
			serviceQQ: n
		}).then(function(e) {
			if ("000000" != e.retCode) {
				var t = "修改QQ号有误，请稍候重新输入";
				alert(t)
			} else u.location.reload()
		}) : (e.userDetail.serviceInfo.serviceQq = "", alert("QQ号有误，请重新修改或置空"), !1)
	}, e.updateUserBaseInfoRemark = function(e, t) {
		i.UpdateServiceInfo({
			serviceId: e,
			serviceRemark: t
		}).then(function(e) {
			if ("000000" != e.retCode) {
				var t = "修改备注有误，请稍候重新输入";
				alert(t)
			} else u.location.reload()
		})
	}, e.updateUserBaseInfoWorkFlag = function(t, a) {
		i.UpdateServiceInfo({
			serviceId: t,
			ticketAuthFlag: a
		}).then(function(t) {
			"000000" == t.retCode ? ("0" == a && (e.ticketName = "查看所有的工单"), "1" == a && (e.ticketName = "查看自己组内的工单"), "2" == a && (e.ticketName = "查看分配给自己的工单"), u.location.reload()) : alert("修改失败，请联系管理员！")
		})
	}, e.updateUserBaseInfoReplyFlag = function(t, a) {
		i.UpdateServiceInfo({
			serviceId: t,
			replyAuthFlag: a
		}).then(function(t) {
			"000000" == t.retCode ? ("0" == a && (e.replyName = "公开回复"), "1" == a && (e.replyName = "仅私密回复"), u.location.reload()) : alert("修改失败，请联系管理员！")
		})
	}, e.updateValue = function(e, t, a) {
		if (a) var o = {
			serviceId: e.serviceId,
			cusRoleId: t.dictValue,
			cusRoleName: t.dictName,
			oldRoleId: e.cusRoleId,
			oldRoleName: e.cusRoleName || "",
			updateTime: a
		};
		else var o = {
			serviceId: e.serviceId,
			cusRoleId: t.dictValue,
			cusRoleName: t.dictName,
			oldRoleId: e.cusRoleId,
			oldRoleName: e.cusRoleName || ""
		};
		i.UpdateCusRole(o).then(function(e) {
			if ("000000" == e.retCode) u.location.reload();
			else if ("999999" != e.retCode) {
				var t = e.retMsg;
				"" != t && alert(e.retMsg)
			}
		})
	}, e.uploadProfileImage = function(t, o, n) {
		a.upload({
			url: "/basic/uploadPicture/" + c.ServVersion,
			data: {
				file: t,
				serviceId: o,
				cusRoleId: n
			}
		}).then(function(t) {
			var a, o, n = t.data;
			n && n.retCode && n.retCode === c.retCodeList.success ? (a = {
				content: n.retMsg || "上传头像成功",
				type: "success"
			}, setTimeout(function() {
				u.location.reload()
			}, 3e3)) : (a = {
				scope: e,
				content: n.retMsg || "上传头像失败",
				type: "warning",
				duration: !1
			}, e.alertDomData = {
				collapse: !0,
				triggerCollapse: !1,
				failMsg: n.items
			}), o = s.alert(a), o.$promise.then(o.show)
		})
	}, e.alertSuperRole = function(a, n, l) {
		var f = null;
		"1111" == l && (e.cusName = "在线客服"), "2222" == l && (e.cusName = "管理员"), "5555" == l && (e.cusName = "工单客服"), e.modalDomData = {
			title: "转换超级管理员"
		}, e.ctrlScope = e, e.ctrlScope.superPwd = "", f = s.modal({
			scope: e,
			templateUrl: "views/public/dialog-modal-superPwd.html"
		}), f.$promise.then(f.show), e.ctrlScope.retError = "", e.ctrlScope.errorState = !1, e.superRoleChange = function() {
			var s = e.ctrlScope.superPwd ? e.ctrlScope.superPwd : "";
			if (e.ctrlScope.retError = "", e.ctrlScope.errorState = !1, "" == s) e.ctrlScope.retError = "请填写正确的账号密码", e.ctrlScope.errorState = !0;
			else {
				if (e.ctrlScope.retError = "", e.ctrlScope.errorState = !1, n) var l = {
					serviceId: a,
					password: s,
					updateTime: n
				};
				else var l = {
					serviceId: a,
					password: s
				};
				i.ExchangeServiceRole(l).then(function(a) {
					"000000" == a.retCode ? (e.ctrlScope.retError = "完成超级管理员转换，5秒后跳转 登录页", e.ctrlScope.errorState = !0, m.logOut({
						loginUser: t.userInfo.serviceEmail
					}).then(function(e) {}), g.isLogined = !1, setTimeout(function() {
						f.hide(), u.sessionStorage.removeItem(c.TempID), d.clear(), r.clear(), p.del(), u.location.reload(), o.go("login")
					}, 5e3)) : (e.ctrlScope.retError = a.retMsg || "请填写正确的账号密码", e.ctrlScope.errorState = !0)
				})
			}
		}
	}, e.$broadcast("rebuild:me")
}]), angular.module("Sobot4.C").controller("ordinaryUserDetailCtrl", ["$scope", "$rootScope", "Upload", "$state", "$stateParams", "TabServ", "UserAndGroupServ", function(e, t, a, o, n, r, i) {
	var s = n.userID;
	e.selectContent = 0;
	var c = function() {
			e.totalItems = {}, e.activePageSize = {}, e.pageCount = {}, e.activePageNo = {}, e.content = {}, e.itemNum = {}, e.activePageSize = 12, e.activePageNo = 1
		},
		l = function(t, a) {
			i.QueryCustomerStartTicketNumByServicer({
				customerEmail: t
			}).then(function(t) {
				e.queryTicketTotalNumList = t.items
			}), c();
			var o = {};
			o.init = function() {
				o.initPagination(), o.initTableList().then(function(t) {
					e.paginationObj.config.totalItems = t.totalCount, e.paginationObj.config.isInit = !0
				})
			}, o.initPagination = function() {
				e.paginationObj = {
					config: {
						isInit: !1,
						totalItems: e.totalItems,
						pageSize: e.activePageSize,
						prevText: "< 上一页",
						nextText: "下一页 >",
						moreText: "···",
						isAutoCallback: !0,
						callBack: null
					}
				}
			}, o.initTableList = function(o) {
				return o = o ? o : {}, i.QueryCustomerStartTicketListByServicer({
					customerEmail: t,
					ticketStatus: a.ticketStatus,
					pageNo: o.pageNo || e.paginationObj.currentPage || e.activePageNo,
					pageSize: o.pageSize || e.paginationObj.pageSize || e.activePageSize
				}).then(function(t) {
					return e.totalItems = t.totalCount, e.activePageSize = t.pageSize, e.pageCount = t.pageCount, e.activePageNo = t.pageNo, e.content = t.items, t
				})
			}, e.getTableListByPagination = function(t) {
				e.activePageNo = t.currentPage, e.paginationObj.currentPage = t.currentPage, e.paginationObj.pageSize = t.pageSize, o.initTableList()
			}, o.init()
		};
	i.QueryCustomerInfoPidEmail({
		customerId: s
	}).then(function(t) {
		e.userDetail = t.item && t.item.customerInfo ? t.item.customerInfo : "";
		var a = t.item && t.item.customerInfo.email ? t.item.customerInfo.email : "";
		l(a, "")
	}), e.triggerSelectContentActive = function(t, a, o) {
		e.selectContent = t, l(a, o)
	}, e.getViewWorkOrderDetail = function(e) {
		r.open({
			title: e.ticketTitle,
			ticketCode: e.ticketCode,
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.ticketId
			},
			fromState: o.current,
			fromParams: o.params
		})
	}, t.ordinaryUser = {
		email: ""
	}, e.createOrdinaryOrder = function(e) {
		t.ordinaryUser.email = "", t.ordinaryUser.email = e
	}, e.updateUserInfoNick = function(e, t) {
		var a = t ? t.replace(/[ ]/g, "") : "";
		i.UpdateCustomerInfo({
			customerId: e,
			customerNick: a
		}).then(function(e) {})
	}, e.updateUserInfoName = function(t, a) {
		var o = a ? a.replace(/[ ]/g, "") : "",
			n = /^([a-zA-Z\u4E00-\u9FA5])+$/;
		return n.test(o) ? void i.UpdateCustomerInfo({
			customerId: t,
			customerName: o
		}).then(function(e) {}) : (e.userDetail.uname = "", alert("请输入有效的真实姓名"), !1)
	}, e.updateUserInfoPhoneNo = function(t, a) {
		var o = /^(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/;
		return "" == a || o.test(a) ? void i.UpdateCustomerInfo({
			customerId: t,
			customerPhone: a
		}).then(function(e) {}) : (e.userDetail.tel = "", alert("手机号有误，请重新修改或置空"), !1)
	}, e.updateUserInfoQQ = function(t, a) {
		var o = /[1-9][0-9]{4,}/;
		return "" == a || o.test(a) ? void i.UpdateCustomerInfo({
			customerId: t,
			customerQQ: a
		}).then(function(e) {}) : (e.userDetail.qq = "", alert("QQ号有误，请重新修改或置空"), !1)
	}, e.updateUserInfoRemark = function(e, t) {
		i.UpdateCustomerInfo({
			customerId: e,
			customerRemark: t
		}).then(function(e) {})
	}, e.$broadcast("rebuild:me")
}]), 
angular.module("Sobot4.C").controller("WorkOrderCenterCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "WorkOrderCenterServ", "zcGlobal", "TabServ", "CreateWorkOrderServ", "LoginServ", "$window", "$timeout", "Uuid", "$popover", "DialogServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m) {
	function g() {
		e.role = {
			cusRoleId: "",
			cusRoleName: ""
		}, e.formData = {}, e.viewData = {}, t.userInfo = {}, c.getUserInfo().then(function(a) {
			if ("000000" == a.retCode) {
				e.role.cusRoleId = a.item.cusRoleId;
				var o = a.item;
				for (var n in o) t.userInfo[n] = o[n];
				t.userInfo[r.TempID] = l.sessionStorage[r.TempID], e.formData.replyType = 1
			} else m.alert({
				title: "",
				content: a.retMsg || "获取用户信息失败，请重新登录或联系管理员",
				placement: "top",
				type: "success",
				show: !0
			})
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
		}), e.ueditorConfig = {
			toolbars: [
				["source", "link", "unlink", "bold", "italic", "underline", "forecolor"]
			],
			initialFrameHeight: 150,
			initialFrameWidth: 500,
			zIndex: 0,
			maximumWords: 12e3,
			autoHeightEnabled: !1,
			enableContextMenu: !0,
			contextMenu: [{
				label: "全选",
				cmdName: "selectall"
			}, {
				label: "清空文档",
				cmdName: "cleardoc",
				exec: function() {
					confirm(lang.confirmclear) && this.execCommand("cleardoc")
				}
			}, {
				label: "复制(Ctrl + c)",
				cmdName: "copy"
			}, {
				label: "粘贴(Ctrl + v)",
				cmdName: "paste"
			}],
			wordCount: !1,
			elementPathEnabled: !1
		}
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
		}), n.getMenuBar({
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
		f(), m.alert({
			title: "成功",
			content: "刷新列表",
			placement: "top",
			type: "success",
			show: !0
		})
	}, e.triggerMenuActive = function(t) {
		e.activeTaskName = t.taskName, e.activeTicketNum = t.ticketNum
	}
}]).controller("WorkOrderClassCtrl", [
	"$scope", "$rootScope", "$state", "$stateParams", "WorkOrderCenterServ", "zcGlobal", 
	"TabServ", "CreateWorkOrderServ", "LoginServ", "$window", "$timeout", "Uuid", 
	"$popover", "DialogServ", "GetPageListServ", "GetWorkOrderListServ", "GetEditorServ", 
function(
	e, t, a, o, n, r, 
	i, s, c, l, u, d, 
	p, m, g, f, v) {

	function h() {
		e.newPageConfig = {
			config: {
				totalItems: 0,
				pageSize: 15,
				pageNo: 1,
				totalPages: 1,
				pageList: [1],
				tempPageNo: 1
			}
		}, 
		e.sortCol = "updateTime", 
		e.sortSeq = "desc", 
		e.activeTaskStatus = 1, 
		e.activeTicketStatus = "", 
		e.queryTicketTotalNumList = [], 
		e.querySimpleTicketInfo = {}, 
		e.isAllChecked = !1, 
		e.isSingleChecked = {}, 
		e.hasCheckedLength = 0, 
		e.workOrderGroupChoosed = [], 
		e.workOrderGroupTicketId = [], 
		e.workOrderGroupTicketCode = [], 
		e.workOrderGroupIndex = [], 
		e.content = {}, 
		$(".zc-bottom-bar").css("display", "none"), 
		e.requestUrl = "/ws/queryExportTicketList/4?taskId=" + o.typeID + "&taskStatus=1&ticketStatus=" + e.activeTicketStatus, e.fileType = "xlsx", e.resMethod = "GET", 
		n.getMenuBar({
			taskType: 3,
			taskStatus: 1,
			usedType: 2
		}).then(function(o) {
			if ("000000" == o.retCode) {
				t.menuBarWork = o.items;
				for (var n = 0; n < t.menuBarWork.length; n++) t.menuBarWork[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1001", typeID: ' + t.menuBarWork[n].taskId + "})", t.menuBarWork[n].taskId == a.params.typeID && (e.activeTaskName = t.menuBarWork[n].taskName, e.activeTicketNum = t.menuBarWork[n].ticketNum)
			} else t.menuBarWork = {}
		}), 
		n.getMenuBar({
			taskType: 2,
			taskStatus: 1,
			usedType: 2
		}).then(function(o) {
			if ("000000" == o.retCode) {
				t.menuBarSLA = o.items;
				for (var n = 0; n < t.menuBarSLA.length; n++) t.menuBarSLA[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1002", typeID: ' + t.menuBarSLA[n].taskId + "})", t.menuBarSLA[n].taskId == a.params.typeID && (e.activeTaskName = t.menuBarSLA[n].taskName, e.activeTicketNum = t.menuBarSLA[n].ticketNum)
			} else t.menuBarSLA = {}
		}), 
		n.getQueryTicketTotalNumList({
			taskId: o.typeID,
			taskStatus: 1
		}).then(function(t) {
			"000000" == t.retCode ? e.queryTicketTotalNumList = t.items : e.queryTicketTotalNumList = []
		}), 
		f.getList({
			taskId: o.typeID,
			taskStatus: e.activeTaskStatus,
			ticketStatus: e.activeTicketStatus,
			pageNo: 1,
			pageSize: e.newPageConfig.config.pageSize,
			sortCol: e.sortCol,
			sortSeq: e.sortSeq
		}).then(function(t) {
			"000000" == t.retCode ? (e.loadListTime = t.item, e.content = t, e.newPageConfig = {
				config: {
					totalItems: t.totalCount,
					pageSize: t.pageSize,
					pageNo: t.pageNo,
					totalPages: t.pageCount,
					pageList: t.pageList,
					tempPageNo: t.pageNo
				}
			}) : e.content = {}
		})
	}

	function y() {
		n.getMenuBar({
			taskType: 3,
			taskStatus: 1,
			usedType: 2
		}).then(function(o) {
			if ("000000" == o.retCode) {
				t.menuBarWork = o.items;
				for (var n = 0; n < t.menuBarWork.length; n++) t.menuBarWork[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1001", typeID: ' + t.menuBarWork[n].taskId + "})", t.menuBarWork[n].taskId == a.params.typeID && (e.activeTaskName = t.menuBarWork[n].taskName, e.activeTicketNum = t.menuBarWork[n].ticketNum)
			} else t.menuBarWork = {}
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

	function S() {
		n.getQueryTicketTotalNumList({
			taskId: o.typeID,
			taskStatus: 1
		}).then(function(t) {
			if ("000000" == t.retCode) {
				e.queryTicketTotalNumList = t.items;
				for (var a = !0, o = e.queryTicketTotalNumList, n = 0; n < o.length; n++) o[n].ticketStatus === e.activeTicketStatus && (a = !1);
				a && (e.activeTicketStatus = ""), b()
			} else e.queryTicketTotalNumList = []
		})
	}

	function b(t) {
		f.getList({
			taskId: o.typeID,
			taskStatus: e.activeTaskStatus,
			ticketStatus: e.activeTicketStatus,
			pageNo: t ? t : e.newPageConfig.config.tempPageNo,
			pageSize: e.newPageConfig.config.pageSize,
			sortCol: e.sortCol,
			sortSeq: e.sortSeq
		}).then(function(t) {
			"000000" == t.retCode ? (D(), e.loadListTime = t.item, e.content = t, e.newPageConfig = {
				config: {
					totalItems: t.totalCount,
					pageSize: t.pageSize,
					pageNo: t.pageNo,
					totalPages: t.pageCount,
					pageList: t.pageList,
					tempPageNo: t.pageNo
				}
			}, 0 === t.items.length && e.jumpTo(e.newPageConfig.config.pageNo - 1)) : e.content = {}
		})
	}

	function D() {
		e.isAllChecked = !1, e.isSingleChecked = {}, e.hasCheckedLength = 0, e.workOrderGroupChoosed = [], e.workOrderGroupTicketId = [], e.workOrderGroupTicketCode = [], e.workOrderGroupIndex = [], $(".zc-bottom-bar").css("display", "none")
	}

	function I(e, t) {
		for (var a = 0; a < e.length; a++)
			if (e[a] == t) return !0;
		return !1
	}
	h(), e.changeTicketLevelSort = function() {
		e.sortCol = "ticketLevel", "desc" == e.sortSeq ? e.sortSeq = "asc" : e.sortSeq = "desc", D(), b(1)
	}, e.changeUpdateTimeSort = function() {
		e.sortCol = "updateTime", "desc" == e.sortSeq ? e.sortSeq = "asc" : e.sortSeq = "desc", D(), b(1)
	}, e.jumpTo = function(t) {
		"..." != t && (1 > t || t > e.newPageConfig.config.totalPages || t != e.newPageConfig.config.pageNo && b(t))
	}, e.triggerSelectContentActive = function(t) {
		e.activeTicketStatus === t || (e.activeTicketStatus = t, e.requestUrl = "/ws/queryExportTicketList/4?taskId=" + o.typeID + "&taskStatus=1&ticketStatus=" + e.activeTicketStatus, b(1))
	}, e.getQuerySimpleTicketInfo = function(t, a) {
		n.querySimpleTicketInfo({
			ticketId: t
		}).then(function(t) {
			"000000" == t.retCode ? e.querySimpleTicketInfo = t.item : e.querySimpleTicketInfo = {}
		})
	}, e.allChecked = function(t) {
		if (e.isAllChecked = !e.isAllChecked, e.isAllChecked) {
			$(".zc-bottom-bar").css("display", "block"), e.hasCheckedLength = t.length;
			for (var a = 0; a < t.length; a++) I(e.workOrderGroupChoosed, t[a]) || (e.workOrderGroupChoosed.push(t[a]), e.workOrderGroupTicketId.push(t[a].ticketId), e.workOrderGroupTicketCode.push(t[a].ticketCode), e.workOrderGroupIndex.push(a));
			for (var a = 0; a < t.length; a++) e.isSingleChecked[a] = !0
		} else {
			$(".zc-bottom-bar").css("display", "none"), e.hasCheckedLength = 0, e.workOrderGroupChoosed.length = 0, e.workOrderGroupTicketId.length = 0, e.workOrderGroupTicketCode.length = 0, e.workOrderGroupIndex.length = 0;
			for (var a = 0; a < t.length; a++) e.isSingleChecked[a] = !1
		}
	}, e.singleChecked = function(t, a, o) {
		if (e.isSingleChecked[o] = !e.isSingleChecked[o], e.isSingleChecked[o]) e.hasCheckedLength++, I(e.workOrderGroupChoosed, a) || (e.workOrderGroupChoosed.push(a), e.workOrderGroupTicketId.push(a.ticketId), e.workOrderGroupTicketCode.push(a.ticketCode), e.workOrderGroupIndex.push(o), $(".zc-bottom-bar").css("display", "block"));
		else {
			e.hasCheckedLength--;
			for (var n = 0; n < e.workOrderGroupChoosed.length; n++) a == e.workOrderGroupChoosed[n] && (e.workOrderGroupChoosed.splice(n, 1), e.workOrderGroupTicketId.splice(n, 1), e.workOrderGroupTicketCode.splice(n, 1), e.workOrderGroupIndex.splice(n, 1));
			0 == e.hasCheckedLength && $(".zc-bottom-bar").css("display", "none")
		}
		e.hasCheckedLength == t.length ? e.isAllChecked = !0 : e.isAllChecked = !1
	}, e.cancelChoose = function() {
		e.isAllChecked = !1, e.isSingleChecked = {}, e.hasCheckedLength = 0, e.workOrderGroupChoosed.length = 0, e.workOrderGroupTicketId.length = 0, e.workOrderGroupTicketCode.length = 0, e.workOrderGroupIndex.length = 0, $(".zc-bottom-bar").css("display", "none")
	}, e.getDefaultDropdownInfo = function() {
		e.formData = {}, e.viewData = {}, e.formData.getTicketTime = e.loadListTime, e.formData.replyType = 1, e.formData.ticketIds = e.workOrderGroupTicketId.join(";"), 1 == e.workOrderGroupTicketId.length ? i.open({
			ticketCode: e.workOrderGroupTicketCode[0],
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.workOrderGroupTicketId[0]
			},
			fromState: a.current,
			fromParams: a.params
		}) : ($("#editWorkOrder").modal("show"), s.queryDictDataList({
			dictCode: 1009
		}).then(function(e) {
			"000000" == e.retCode ? (t.ticketStatusAll = e.items, t.ticketStatusAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : t.ticketStatusAll = []
		}), s.queryDictDataList({
			dictCode: 1010
		}).then(function(e) {
			"000000" == e.retCode ? (t.ticketTypeAll = e.items, t.ticketTypeAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : t.ticketTypeAll = []
		}), s.queryDictDataList({
			dictCode: 1008
		}).then(function(e) {
			"000000" == e.retCode ? (t.ticketLevelAll = e.items, t.ticketLevelAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : t.ticketLevelAll = []
		}), n.getMenuBar({
			taskType: 4,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			"000000" == e.retCode && (t.loadAlreadyListAll = e.items)
		}), e.formData.dealGroupName = "不改变", e.formData.dealGroupId = "-100", e.formData.dealUserName = "不改变", e.formData.dealUserId = "-100", e.viewData.ticketType = "不改变", e.viewData.ticketStatus = "不改变", e.viewData.ticketLevel = "不改变", e.formData.ticketType = "-100", e.formData.ticketStatus = "-100", e.formData.ticketLevel = "-100", e.formData.replyContent = "", e.formDataShadow = {}, e.formDataShadow = angular.copy(e.formData), s.queryServiceGroupList({
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (t.queryServiceGroupListAll = e.items, t.queryServiceGroupListAll.push({
				groupName: "不改变",
				groupId: "-100"
			}), t.queryServiceGroupListAll.push({
				groupName: "不选择客服组",
				groupId: "nev390"
			})) : t.queryServiceGroupListAll = []
		}), t.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}])
	}, e.deleteTicketById = function() {
		var t = e.workOrderGroupTicketId.join(";");
		e.workOrderGroupTicketCode.join("#");
		n.deleteWorkOrderContent({
			ticketIds: t,
			ticketStatus: 98
		}).then(function(t) {
			"000000" == t.retCode ? (m.alert({
				title: "选中" + e.workOrderGroupTicketCode.length + "条工单",
				content: "删除成功",
				placement: "top",
				type: "success",
				show: !0
			}), e.formData = {}, e.viewData = {}, y(), S()) : m.alert({
				title: "",
				content: t.retMsg || "删除失败",
				placement: "top",
				type: "success",
				show: !0
			})
		})
	}, e.editConfirm = function() {
		v.init() ? v.init().length > 1024 ? m.alert({
			title: "提示 ",
			content: "请输入编辑内容，最多1000字符",
			placement: "top",
			type: "warning",
			show: !0
		}) : ("nev390" == e.formData.dealGroupId && (delete e.formData.dealGroupId, delete e.formData.dealGroupName), "nev390" == e.formData.dealUserId && (delete e.formData.dealUserId, delete e.formData.dealUserName), "nev390" == e.formData.ticketStatus && delete e.formData.ticketStatus, $("#editWorkOrder").modal("hide"), $("#editWorkOrderCon").modal("show")) : m.alert({
			title: "提示 ",
			content: "请输入编辑内容，最多1000字符",
			placement: "top",
			type: "warning",
			show: !0
		})
	}, e.updateBatchTicket = function() {
		e.formData.replyContent = v.init(), n.updateBatchTicket(e.formData).then(function(t) {
			"000000" == t.retCode ? (e.formData = {}, e.viewData = {}, y(), S(), m.alert({
				title: "成功",
				content: "已编辑",
				placement: "top",
				type: "success",
				show: !0
			})) : m.alert({
				title: "",
				content: t.retMsg || "失败",
				placement: "top",
				type: "warning",
				show: !0
			})
		})
	}, e.viewWorkOrderDetail = function(e) {
		i.open({
			title: e.ticketTitle,
			ticketCode: e.ticketCode,
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.ticketId
			},
			fromState: a.current,
			fromParams: a.params
		})
	}, e.getQueryServiceGroupList = function(a) {
		var o = t.queryServiceGroupListAll;
		e.formData.dealGroupName = o[a].groupName, e.formData.dealGroupId = o[a].groupId, "nev390" == e.formData.dealGroupId ? s.queryServiceList({
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (t.queryServiceListAll = e.items, t.queryServiceListAll.push({
				serviceName: "不改变",
				serviceId: "-100"
			}), t.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})) : t.queryServiceListAll = []
		}) : "-100" == e.formData.dealGroupId ? (e.formData.dealUserName = "不改变", e.formData.dealUserId = "-100", t.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}]) : (delete e.formData.dealUserId, delete e.formData.dealUserName, s.queryServiceList({
			groupId: o[a].groupId,
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (t.queryServiceListAll = e.items, t.queryServiceListAll.push({
				serviceName: "不改变",
				serviceId: "-100"
			}), t.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})) : t.queryServiceListAll = []
		}))
	}, e.getQueryServiceList = function(a) {
		var o = t.queryServiceListAll;
		e.formData.dealUserName = o[a].serviceName, e.formData.dealUserId = o[a].serviceId, "-100" == e.formData.dealUserId && (e.formData.dealGroupName = "不改变", e.formData.dealGroupId = "-100", s.queryServiceGroupList({
			companyId: t.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (t.queryServiceGroupListAll = e.items, t.queryServiceGroupListAll.push({
				groupName: "不改变",
				groupId: "-100"
			}), t.queryServiceGroupListAll.push({
				groupName: "不选择客服组",
				groupId: "nev390"
			})) : t.queryServiceGroupListAll = []
		}), t.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}])
	}, e.getTicketStatus = function(t, a) {
		e.formData.ticketStatus = t, e.viewData.ticketStatus = a
	}, e.getTicketType = function(t, a) {
		e.formData.ticketType = t, e.viewData.ticketType = a
	}, e.getTicketLevel = function(t, a) {
		e.formData.ticketLevel = t, e.viewData.ticketLevel = a
	}, e.getLoadAlreadyListAll = function(a) {
		var o = t.loadAlreadyListAll;
		e.loadAlreadyList = o[a].taskName, s.queryTicketReplyData({
			taskId: o[a].taskId
		}).then(function(a) {
			if ("000000" == a.retCode) {
				1 == e.userInfo.replyAuthFlag || (e.formData.replyType = a.item.replyType);
				var o = t.ticketStatusAll;
				e.formData.ticketStatus = a.item.ticketStatus, e.viewData.ticketStatus = o[a.item.ticketStatus].dictName, e.formData.replyContent = a.item.replyContent, a.item.dealUserId && (e.formData.dealUserId = a.item.dealUserId, delete e.formData.dealGroupName, delete e.formData.dealGroupId, t.queryServiceListAll = []), a.item.dealUserName && (e.formData.dealUserName = a.item.dealUserName)
			}
		})
	}
}]).controller("SearchServiceCtrl", ["GetDateRangeServ", "$scope", "$rootScope", "$state", "$stateParams", "WorkOrderCenterServ", "zcGlobal", "TabServ", "CreateWorkOrderServ", "LoginServ", "$window", "$timeout", "Uuid", "$popover", "DialogServ", "GetWorkOrderListServ", "GetEditorServ", "GetPageListServ", function(e, t, a, o, n, r, i, s, c, l, u, d, p, m, g, f, v, h) {
	function y() {
		var o = e.init();
		if (t.datePlugs = {
				creatTodayPlugs: e.format(o.today),
				creatYesterdayPlugs: e.format(o.yesterday),
				updateTodayPlugs: e.format(o.today),
				updateYesterdayPlugs: e.format(o.yesterday)
			}, t.queryType = [{
				typeName: "模糊查询",
				typeValue: "ALL"
			}, {
				typeName: "工单编号",
				typeValue: "CODE"
			}, {
				typeName: "工单标题",
				typeValue: "TITLE"
			}, {
				typeName: "工单发起邮箱",
				typeValue: "EMAIL"
			}, {
				typeName: "工单受理客服组",
				typeValue: "GROUP"
			}, {
				typeName: "工单受理客服姓名",
				typeValue: "NAME"
			}], t.creatTime = [{
				typeName: "所有",
				startTime: "-100",
				endTime: "-100"
			}, {
				typeName: "今天",
				startTime: o.today,
				endTime: o.today
			}, {
				typeName: "昨天",
				startTime: o.yesterday,
				endTime: o.yesterday
			}, {
				typeName: "最近7天",
				startTime: o.past7,
				endTime: o.today
			}, {
				typeName: "最近30天",
				startTime: o.past30,
				endTime: o.today
			}, {
				typeName: "自定义",
				startTime: e.commit(t.datePlugs.updateYesterdayPlugs),
				endTime: e.commit(t.datePlugs.updateTodayPlugs)
			}], t.updateTime = [{
				typeName: "所有",
				startTime: "-100",
				endTime: "-100"
			}, {
				typeName: "今天",
				startTime: o.today,
				endTime: o.today
			}, {
				typeName: "昨天",
				startTime: o.yesterday,
				endTime: o.yesterday
			}, {
				typeName: "最近7天",
				startTime: o.past7,
				endTime: o.today
			}, {
				typeName: "最近30天",
				startTime: o.past30,
				endTime: o.today
			}, {
				typeName: "自定义",
				startTime: e.commit(t.datePlugs.creatYesterdayPlugs),
				endTime: e.commit(t.datePlugs.creatTodayPlugs)
			}], t.searchQueryType = {
				typeName: "模糊查询",
				typeValue: "ALL"
			}, t.queryContent = "", t.searchCreatTime = {
				typeName: "所有",
				startTime: "-100",
				endTime: "-100"
			}, t.searchUpdateTime = {
				typeName: "所有",
				startTime: "-100",
				endTime: "-100"
			}, t.searchQueryServiceGroup = {
				groupName: "所有受理客服组",
				groupId: "-100"
			}, t.searchQueryService = {
				serviceName: "所有受理客服",
				serviceId: "-100"
			}, t.searchTicketStatus = {
				dictName: "所有状态",
				dictValue: "-100"
			}, t.searchTicketType = {
				dictName: "所有类型",
				dictValue: "-100"
			}, t.searchTicketLevel = {
				dictName: "所有优先级",
				dictValue: "-100"
			}, t.formDataSearch = {}, t.formData.ticketStatus = 0, t.viewData.ticketStatus = "尚未受理", t.formData.ticketType = 9, t.viewData.ticketType = "其他", t.formData.ticketLevel = 0, t.viewData.ticketLevel = "低", t.newPageConfig = {
				config: {
					totalItems: 0,
					pageSize: 15,
					pageNo: 1,
					totalPages: 1,
					pageList: [1],
					tempPageNo: 1
				}
			}, t.sortCol = "updateTime", t.sortSeq = "desc", t.activeTaskStatus = 1, t.activeTicketStatus = "", t.queryTicketTotalNumList = [], t.querySimpleTicketInfo = {}, t.isAllChecked = !1, t.isSingleChecked = {}, t.hasCheckedLength = 0, t.workOrderGroupChoosed = [], t.workOrderGroupTicketId = [], t.workOrderGroupTicketCode = [], t.workOrderGroupIndex = [], t.content = {
				items: []
			}, t.queryServiceGroupListSearch = [], t.queryServiceListSearch = [], t.ticketStatusSearch = [], t.ticketTypeSearch = [], t.ticketLevelSearch = [], $(".zc-bottom-bar").css("display", "none"), a.userInfo = {}, l.getUserInfo().then(function(e) {
				if ("000000" == e.retCode) {
					var o = e.item;
					for (var n in o) a.userInfo[n] = o[n];
					a.userInfo[i.TempID] = u.sessionStorage[i.TempID], c.queryServiceGroupList({
						companyId: a.userInfo.companyId
					}).then(function(e) {
						"000000" == e.retCode ? t.queryServiceGroupListSearch = e.items : t.queryServiceGroupListSearch = [], t.queryServiceGroupListSearch.unshift({
							groupName: "所有受理客服组",
							groupId: "-100"
						})
					}), c.queryServiceList({
						companyId: a.userInfo.companyId
					}).then(function(e) {
						"000000" == e.retCode ? t.queryServiceListSearch = e.items : t.queryServiceListSearch = [], t.queryServiceListSearch.unshift({
							serviceName: "所有受理客服",
							serviceId: "-100"
						})
					})
				} else console.log("获取用户信息->" + e.retCode + " " + e.retMsg)
			}), c.queryDictDataList({
				dictCode: 1009
			}).then(function(e) {
				"000000" == e.retCode ? (t.ticketStatusSearch = e.items, t.ticketStatusSearch.unshift({
					dictName: "所有状态",
					dictValue: "-100"
				})) : t.ticketStatusSearch = []
			}), c.queryDictDataList({
				dictCode: 1010
			}).then(function(e) {
				"000000" == e.retCode ? (t.ticketTypeSearch = e.items, t.ticketTypeSearch.unshift({
					dictName: "所有类型",
					dictValue: "-100"
				})) : t.ticketTypeSearch = []
			}), c.queryDictDataList({
				dictCode: 1008
			}).then(function(e) {
				"000000" == e.retCode ? (t.ticketLevelSearch = e.items, t.ticketLevelSearch.unshift({
					dictName: "所有优先级",
					dictValue: "-100"
				})) : t.ticketLevelSearch = []
			}), $("#creatTimeStart").daterangepicker({
				singleDatePicker: !0,
				showDropdowns: !0,
				autoApply: !0
			}, function(e, a, o) {
				t.searchCreatTime.startTime = e.format("YYYYMMDD")
			}), $("#creatTimeEnd").daterangepicker({
				singleDatePicker: !0,
				showDropdowns: !0,
				autoApply: !0
			}, function(e, a, o) {
				t.searchCreatTime.endTime = e.format("YYYYMMDD")
			}), $("#updateTimeStart").daterangepicker({
				singleDatePicker: !0,
				showDropdowns: !0,
				autoApply: !0
			}, function(e, a, o) {
				t.searchUpdateTime.startTime = e.format("YYYYMMDD")
			}), $("#updateTimeEnd").daterangepicker({
				singleDatePicker: !0,
				showDropdowns: !0,
				autoApply: !0
			}, function(e, a, o) {
				t.searchUpdateTime.endTime = e.format("YYYYMMDD")
			}), u.sessionStorage.getItem("searchObj")) {
			var n = u.sessionStorage.getItem("searchObj") ? JSON.parse(u.sessionStorage.getItem("searchObj")) : null;
			for (var r in n) switch (r) {
				case "sortCol":
					t.sortCol = n.sortCol, t.formDataSearch.sortCol = n.sortCol;
					break;
				case "sortSeq":
					t.sortSeq = n.sortSeq, t.formDataSearch.sortSeq = n.sortSeq;
					break;
				case "queryContent":
					t.queryContent = n.queryContent, t.formDataSearch.queryContent = n.queryContent;
					break;
				case "queryType":
					for (var s = 0; s < t.queryType.length; s++) t.queryType[s].typeValue == n.queryType && (t.searchQueryType = {
						typeName: t.queryType[s].typeName,
						typeValue: t.queryType[s].typeValue
					});
					t.formDataSearch.queryType = n.queryType;
					break;
				case "createStartTime":
					t.searchCreatTime.startTime = n.createStartTime, t.formDataSearch.createStartTime = n.createStartTime;
					break;
				case "createEndTime":
					t.searchCreatTime.endTime = n.createEndTime, t.formDataSearch.createEndTime = n.createEndTime;
					break;
				case "updateStartTime":
					t.searchUpdateTime.startTime = n.updateStartTime, t.formDataSearch.updateStartTime = n.updateStartTime;
					break;
				case "updateEndTime":
					t.searchUpdateTime.endTime = n.updateEndTime, t.formDataSearch.updateEndTime = n.updateEndTime;
					break;
				case "dealGroupId":
					t.searchQueryServiceGroup = {
						groupName: n.groupName,
						groupId: n.dealGroupId
					}, t.formDataSearch.dealGroupId = n.dealGroupId;
					break;
				case "dealUserId":
					t.searchQueryService = {
						serviceName: n.serviceName,
						serviceId: n.dealUserId
					}, t.formDataSearch.dealUserId = n.dealUserId;
					break;
				case "creatTypeName":
					"自定义" === n.creatTypeName && (t.datePlugs.creatYesterdayPlugs = e.format(n.createStartTime), t.datePlugs.creatTodayPlugs = e.format(n.createEndTime));
					for (var s = 0; s < t.creatTime.length; s++) t.creatTime[s].typeName == n.creatTypeName && (t.searchCreatTime = {
						typeName: t.creatTime[s].typeName,
						startTime: t.creatTime[s].startTime,
						endTime: t.creatTime[s].endTime
					});
					break;
				case "updateTypeName":
					"自定义" === n.creatTypeName && (t.datePlugs.updateYesterdayPlugs = e.format(n.updateStartTime), t.datePlugs.updateTodayPlugs = e.format(n.updateEndTime));
					for (var s = 0; s < t.updateTime.length; s++) t.updateTime[s].typeName == n.updateTypeName && (t.searchUpdateTime = {
						typeName: t.updateTime[s].typeName,
						startTime: t.updateTime[s].startTime,
						endTime: t.updateTime[s].endTime
					});
					break;
				case "ticketStatus":
					t.searchTicketStatus = {
						dictName: n.ticketStatusName,
						dictValue: n.ticketStatus
					}, t.formDataSearch.ticketStatus = n.ticketStatus;
					break;
				case "ticketType":
					t.searchTicketType = {
						dictName: n.ticketTypeName,
						dictValue: n.ticketType
					}, t.formDataSearch.ticketType = n.ticketType;
					break;
				case "ticketLevel":
					t.searchTicketLevel = {
						dictName: n.ticketLevelName,
						dictValue: n.ticketLevel
					}, t.formDataSearch.ticketLevel = n.ticketLevel
			}
			t.formDataSearch.pageNo = t.newPageConfig.config.pageNo, t.formDataSearch.pageSize = t.newPageConfig.config.pageSize, f.getSearchList(t.formDataSearch).then(function(e) {
				if ("000000" == e.retCode) {
					t.loadListTime = e.item, t.content.items = e.items, t.newPageConfig = {
						config: {
							totalItems: e.totalCount,
							pageSize: e.pageSize,
							pageNo: e.pageNo,
							totalPages: e.pageCount,
							pageList: e.pageList,
							tempPageNo: e.pageNo
						}
					};
					var a = angular.isObject(n) ? JSON.stringify(n) : n;
					u.sessionStorage.setItem("searchObj", a), 0 === e.items.length && t.jumpTo(t.newPageConfig.config.pageNo - 1)
				} else g.alert({
					title: "",
					content: e.retMsg || "错误",
					placement: "top",
					type: "warning",
					show: !0
				})
			})
		}
	}

	function S() {
		r.getMenuBar({
			taskType: 3,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			if ("000000" == e.retCode) {
				a.menuBarWork = e.items;
				for (var n = 0; n < a.menuBarWork.length; n++) a.menuBarWork[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1001", typeID: ' + a.menuBarWork[n].taskId + "})", a.menuBarWork[n].taskId == o.params.typeID && (t.activeTaskName = a.menuBarWork[n].taskName, t.activeTicketNum = a.menuBarWork[n].ticketNum)
			} else a.menuBarWork = {}
		}), r.getMenuBar({
			taskType: 2,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			if ("000000" == e.retCode) {
				a.menuBarSLA = e.items;
				for (var n = 0; n < a.menuBarSLA.length; n++) a.menuBarSLA[n].serf = 'zc.back.workOrderCenter.workOrderClass({parentID: "1002", typeID: ' + a.menuBarSLA[n].taskId + "})", a.menuBarSLA[n].taskId == o.params.typeID && (t.activeTaskName = a.menuBarSLA[n].taskName, t.activeTicketNum = a.menuBarSLA[n].ticketNum)
			} else a.menuBarSLA = {}
		})
	}

	function b() {
		D()
	}

	function D(e) {
		return t.queryContent ? (t.formDataSearch.queryContent = t.queryContent, t.formDataSearch.queryType = t.searchQueryType.typeValue, "-100" !== t.searchCreatTime.startTime && (t.formDataSearch.createStartTime = t.searchCreatTime.startTime), "-100" !== t.searchCreatTime.endTime && (t.formDataSearch.createEndTime = t.searchCreatTime.endTime), "-100" !== t.searchUpdateTime.startTime && (t.formDataSearch.updateStartTime = t.searchUpdateTime.startTime), "-100" !== t.searchUpdateTime.endTime && (t.formDataSearch.updateEndTime = t.searchUpdateTime.endTime), "-100" !== t.searchQueryServiceGroup.groupId && (t.formDataSearch.dealGroupId = t.searchQueryServiceGroup.groupId), "-100" !== t.searchQueryService.serviceId && (t.formDataSearch.dealUserId = t.searchQueryService.serviceId), "-100" !== t.searchTicketStatus.dictValue && (t.formDataSearch.ticketStatus = t.searchTicketStatus.dictValue), "-100" !== t.searchTicketType.dictValue && (t.formDataSearch.ticketType = t.searchTicketType.dictValue), "-100" !== t.searchTicketLevel.dictValue && (t.formDataSearch.ticketLevel = t.searchTicketLevel.dictValue), t.formDataSearch.pageNo = e ? e : t.newPageConfig.config.tempPageNo, t.formDataSearch.pageSize = t.newPageConfig.config.pageSize, t.formDataSearch.sortCol = t.sortCol, t.formDataSearch.sortSeq = t.sortSeq, void f.getSearchList(t.formDataSearch).then(function(e) {
			if ("000000" == e.retCode) {
				I(), t.loadListTime = e.item, t.content.items = e.items, t.newPageConfig = {
					config: {
						totalItems: e.totalCount,
						pageSize: e.pageSize,
						pageNo: e.pageNo,
						totalPages: e.pageCount,
						pageList: e.pageList,
						tempPageNo: e.pageNo
					}
				};
				var a = {};
				for (var o in t.formDataSearch) switch (a[o] = t.formDataSearch[o], o) {
					case "dealGroupId":
						for (var n = 0; n < t.queryServiceGroupListSearch.length; n++) t.queryServiceGroupListSearch[n].groupId == t.formDataSearch.dealGroupId && (a.groupName = t.queryServiceGroupListSearch[n].groupName);
						break;
					case "dealUserId":
						for (var n = 0; n < t.queryServiceListSearch.length; n++) t.queryServiceListSearch[n].serviceId == t.formDataSearch.dealUserId && (a.serviceName = t.queryServiceListSearch[n].serviceName);
						break;
					case "ticketStatus":
						for (var n = 0; n < t.ticketStatusSearch.length; n++) t.ticketStatusSearch[n].dictValue == t.formDataSearch.ticketStatus && (a.ticketStatusName = t.ticketStatusSearch[n].dictName);
						break;
					case "ticketType":
						for (var n = 0; n < t.ticketTypeSearch.length; n++) t.ticketTypeSearch[n].dictValue == t.formDataSearch.ticketType && (a.ticketTypeName = t.ticketTypeSearch[n].dictName);
						break;
					case "ticketLevel":
						for (var n = 0; n < t.ticketLevelSearch.length; n++) t.ticketLevelSearch[n].dictValue == t.formDataSearch.ticketLevel && (a.ticketLevelName = t.ticketLevelSearch[n].dictName)
				}
				a.creatTypeName = t.searchCreatTime.typeName, a.updateTypeName = t.searchUpdateTime.typeName;
				var r = angular.isObject(a) ? JSON.stringify(a) : a;
				u.sessionStorage.setItem("searchObj", r), 0 === e.items.length && t.jumpTo(t.newPageConfig.config.pageNo - 1)
			} else g.alert({
				title: "",
				content: e.retMsg || "错误",
				placement: "top",
				type: "warning",
				show: !0
			})
		})) : void g.alert({
			title: "",
			content: "请输入搜索内容",
			placement: "top",
			type: "warning",
			show: !0
		})
	}

	function I() {
		t.isAllChecked = !1, t.isSingleChecked = {}, t.hasCheckedLength = 0, t.workOrderGroupChoosed = [], t.workOrderGroupTicketId = [], t.workOrderGroupTicketCode = [], t.workOrderGroupIndex = [], $(".zc-bottom-bar").css("display", "none")
	}

	function w(e, t) {
		for (var a = 0; a < e.length; a++)
			if (e[a] == t) return !0;
		return !1
	}
	y(), t.changeTicketLevelSort = function() {
		t.sortCol = "ticketLevel", "desc" == t.sortSeq ? t.sortSeq = "asc" : t.sortSeq = "desc", I(), D(1)
	}, t.changeUpdateTimeSort = function() {
		t.sortCol = "updateTime", "desc" == t.sortSeq ? t.sortSeq = "asc" : t.sortSeq = "desc", I(), D(1)
	}, t.changeQueryType = function(e, a) {
		t.searchQueryType = {
			typeName: e,
			typeValue: a
		}
	}, t.changeCreatTime = function(a, o, n) {
		"自定义" == a ? t.searchCreatTime = {
			typeName: a,
			startTime: e.commit(t.datePlugs.creatYesterdayPlugs),
			endTime: e.commit(t.datePlugs.creatTodayPlugs)
		} : t.searchCreatTime = {
			typeName: a,
			startTime: o,
			endTime: n
		}
	}, t.changeUpdateTime = function(a, o, n) {
		"自定义" == a ? t.searchUpdateTime = {
			typeName: a,
			startTime: e.commit(t.datePlugs.updateYesterdayPlugs),
			endTime: e.commit(t.datePlugs.updateTodayPlugs)
		} : t.searchUpdateTime = {
			typeName: a,
			startTime: o,
			endTime: n
		}
	}, t.searchCommit = function(e) {
		if (13 === e || "click" === e) {
			if (t.formDataSearch = {}, !t.queryContent) return void g.alert({
				title: "",
				content: "请输入搜索内容",
				placement: "top",
				type: "warning",
				show: !0
			});
			t.formDataSearch.queryContent = t.queryContent, t.formDataSearch.queryType = t.searchQueryType.typeValue, "-100" !== t.searchCreatTime.startTime && (t.formDataSearch.createStartTime = t.searchCreatTime.startTime), "-100" !== t.searchCreatTime.endTime && (t.formDataSearch.createEndTime = t.searchCreatTime.endTime), "-100" !== t.searchUpdateTime.startTime && (t.formDataSearch.updateStartTime = t.searchUpdateTime.startTime), "-100" !== t.searchUpdateTime.endTime && (t.formDataSearch.updateEndTime = t.searchUpdateTime.endTime), "-100" !== t.searchQueryServiceGroup.groupId && (t.formDataSearch.dealGroupId = t.searchQueryServiceGroup.groupId), "-100" !== t.searchQueryService.serviceId && (t.formDataSearch.dealUserId = t.searchQueryService.serviceId), "-100" !== t.searchTicketStatus.dictValue && (t.formDataSearch.ticketStatus = t.searchTicketStatus.dictValue), "-100" !== t.searchTicketType.dictValue && (t.formDataSearch.ticketType = t.searchTicketType.dictValue), "-100" !== t.searchTicketLevel.dictValue && (t.formDataSearch.ticketLevel = t.searchTicketLevel.dictValue), t.formDataSearch.pageNo = t.newPageConfig.config.pageNo, t.formDataSearch.pageSize = t.newPageConfig.config.pageSize, t.formDataSearch.sortCol = t.sortCol, t.formDataSearch.sortSeq = t.sortSeq, f.getSearchList(t.formDataSearch).then(function(e) {
				if ("000000" == e.retCode) {
					console.log(e), t.loadListTime = e.item, t.content.items = e.items, t.newPageConfig = {
						config: {
							totalItems: e.totalCount,
							pageSize: e.pageSize,
							pageNo: e.pageNo,
							totalPages: e.pageCount,
							pageList: e.pageList,
							tempPageNo: e.pageNo
						}
					};
					var a = {};
					for (var o in t.formDataSearch) switch (a[o] = t.formDataSearch[o], o) {
						case "dealGroupId":
							for (var n = 0; n < t.queryServiceGroupListSearch.length; n++) t.queryServiceGroupListSearch[n].groupId == t.formDataSearch.dealGroupId && (a.groupName = t.queryServiceGroupListSearch[n].groupName);
							break;
						case "dealUserId":
							for (var n = 0; n < t.queryServiceListSearch.length; n++) t.queryServiceListSearch[n].serviceId == t.formDataSearch.dealUserId && (a.serviceName = t.queryServiceListSearch[n].serviceName);
							break;
						case "ticketStatus":
							for (var n = 0; n < t.ticketStatusSearch.length; n++) t.ticketStatusSearch[n].dictValue == t.formDataSearch.ticketStatus && (a.ticketStatusName = t.ticketStatusSearch[n].dictName);
							break;
						case "ticketType":
							for (var n = 0; n < t.ticketTypeSearch.length; n++) t.ticketTypeSearch[n].dictValue == t.formDataSearch.ticketType && (a.ticketTypeName = t.ticketTypeSearch[n].dictName);
							break;
						case "ticketLevel":
							for (var n = 0; n < t.ticketLevelSearch.length; n++) t.ticketLevelSearch[n].dictValue == t.formDataSearch.ticketLevel && (a.ticketLevelName = t.ticketLevelSearch[n].dictName)
					}
					a.creatTypeName = t.searchCreatTime.typeName, a.updateTypeName = t.searchUpdateTime.typeName;
					var r = angular.isObject(a) ? JSON.stringify(a) : a;
					u.sessionStorage.setItem("searchObj", r)
				} else g.alert({
					title: "",
					content: e.retMsg || "错误",
					placement: "top",
					type: "warning",
					show: !0
				})
			})
		}
	}, t.getQueryServiceGroupListSearch = function(e, o) {
		t.searchQueryServiceGroup = {
			groupName: o,
			groupId: e
		}, "-100" == t.searchQueryServiceGroup.groupId ? c.queryServiceList({
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? t.queryServiceListSearch = e.items : t.queryServiceListSearch = [], t.queryServiceListSearch.unshift({
				serviceName: "所有受理客服",
				serviceId: "-100"
			})
		}) : (t.searchQueryService = {
			serviceName: "所有受理客服",
			serviceId: "-100"
		}, c.queryServiceList({
			groupId: e,
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? t.queryServiceListSearch = e.items : t.queryServiceListSearch = [], t.queryServiceListSearch.unshift({
				serviceName: "所有受理客服",
				serviceId: "-100"
			})
		}))
	}, t.getQueryServiceListSearch = function(e, a) {
		t.searchQueryService = {
			serviceName: a,
			serviceId: e
		}
	}, t.getTicketStatusSearch = function(e, a) {
		t.searchTicketStatus = {
			dictName: a,
			dictValue: e
		}
	}, t.getTicketTypeSearch = function(e, a) {
		t.searchTicketType = {
			dictName: a,
			dictValue: e
		}
	}, t.getTicketLevelSearch = function(e, a) {
		t.searchTicketLevel = {
			dictName: a,
			dictValue: e
		}
	}, t.jumpTo = function(e) {
		"..." != e && (1 > e || e > t.newPageConfig.config.totalPages || e != t.newPageConfig.config.pageNo && D(e))
	}, t.getQuerySimpleTicketInfo = function(e, a) {
		r.querySimpleTicketInfo({
			ticketId: e
		}).then(function(e) {
			"000000" == e.retCode ? t.querySimpleTicketInfo = e.item : t.querySimpleTicketInfo = {}
		})
	}, t.allChecked = function(e) {
		if (t.isAllChecked = !t.isAllChecked, t.isAllChecked) {
			$(".zc-bottom-bar").css("display", "block"), t.hasCheckedLength = e.length;
			for (var a = 0; a < e.length; a++) w(t.workOrderGroupChoosed, e[a]) || (t.workOrderGroupChoosed.push(e[a]), t.workOrderGroupTicketId.push(e[a].ticketId), t.workOrderGroupTicketCode.push(e[a].ticketCode), t.workOrderGroupIndex.push(a));
			for (var a = 0; a < e.length; a++) t.isSingleChecked[a] = !0
		} else {
			$(".zc-bottom-bar").css("display", "none"), t.hasCheckedLength = 0, t.workOrderGroupChoosed.length = 0, t.workOrderGroupTicketId.length = 0, t.workOrderGroupTicketCode.length = 0, t.workOrderGroupIndex.length = 0;
			for (var a = 0; a < e.length; a++) t.isSingleChecked[a] = !1
		}
	}, t.singleChecked = function(e, a, o) {
		if (t.isSingleChecked[o] = !t.isSingleChecked[o], t.isSingleChecked[o]) t.hasCheckedLength++, w(t.workOrderGroupChoosed, a) || (t.workOrderGroupChoosed.push(a), t.workOrderGroupTicketId.push(a.ticketId), t.workOrderGroupTicketCode.push(a.ticketCode), t.workOrderGroupIndex.push(o), $(".zc-bottom-bar").css("display", "block"));
		else {
			t.hasCheckedLength--;
			for (var n = 0; n < t.workOrderGroupChoosed.length; n++) a == t.workOrderGroupChoosed[n] && (t.workOrderGroupChoosed.splice(n, 1), t.workOrderGroupTicketId.splice(n, 1), t.workOrderGroupTicketCode.splice(n, 1), t.workOrderGroupIndex.splice(n, 1));
			0 == t.hasCheckedLength && $(".zc-bottom-bar").css("display", "none")
		}
		t.hasCheckedLength == e.length ? t.isAllChecked = !0 : t.isAllChecked = !1
	}, t.cancelChoose = function() {
		t.isAllChecked = !1, t.isSingleChecked = {}, t.hasCheckedLength = 0, t.workOrderGroupChoosed.length = 0, t.workOrderGroupTicketId.length = 0, t.workOrderGroupTicketCode.length = 0, t.workOrderGroupIndex.length = 0, $(".zc-bottom-bar").css("display", "none")
	}, t.getDefaultDropdownInfo = function() {
		t.formData = {}, t.viewData = {}, t.formData.getTicketTime = t.loadListTime, t.formData.replyType = 1, t.formData.ticketIds = t.workOrderGroupTicketId.join(";"), 1 == t.workOrderGroupTicketId.length ? s.open({
			ticketCode: t.workOrderGroupTicketCode[0],
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: t.workOrderGroupTicketId[0]
			},
			fromState: o.current,
			fromParams: o.params
		}) : ($("#editWorkOrder").modal("show"), c.queryDictDataList({
			dictCode: 1009
		}).then(function(e) {
			"000000" == e.retCode ? (a.ticketStatusAll = e.items, a.ticketStatusAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : a.ticketStatusAll = []
		}), c.queryDictDataList({
			dictCode: 1010
		}).then(function(e) {
			"000000" == e.retCode ? (a.ticketTypeAll = e.items, a.ticketTypeAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : a.ticketTypeAll = []
		}), c.queryDictDataList({
			dictCode: 1008
		}).then(function(e) {
			"000000" == e.retCode ? (a.ticketLevelAll = e.items, a.ticketLevelAll.push({
				dictName: "不改变",
				dictValue: "-100"
			})) : a.ticketLevelAll = []
		}), r.getMenuBar({
			taskType: 4,
			taskStatus: 1,
			usedType: 2
		}).then(function(e) {
			"000000" == e.retCode && (a.loadAlreadyListAll = e.items)
		}), t.formData.dealGroupName = "不改变", t.formData.dealGroupId = "-100", t.formData.dealUserName = "不改变", t.formData.dealUserId = "-100", t.viewData.ticketType = "不改变", t.viewData.ticketStatus = "不改变", t.viewData.ticketLevel = "不改变", t.formData.ticketType = "-100", t.formData.ticketStatus = "-100", t.formData.ticketLevel = "-100", t.formData.replyContent = "", t.formDataShadow = {}, t.formDataShadow = angular.copy(t.formData), c.queryServiceGroupList({
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (a.queryServiceGroupListAll = e.items, a.queryServiceGroupListAll.push({
				groupName: "不改变",
				groupId: "-100"
			}), a.queryServiceGroupListAll.push({
				groupName: "不选择客服组",
				groupId: "nev390"
			})) : a.queryServiceGroupListAll = []
		}), a.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}])
	}, t.deleteTicketById = function() {
		var e = t.workOrderGroupTicketId.join(";");
		t.workOrderGroupTicketCode.join("#");
		r.deleteWorkOrderContent({
			ticketIds: e,
			ticketStatus: 98
		}).then(function(e) {
			"000000" == e.retCode ? (g.alert({
				title: "选中" + t.workOrderGroupTicketCode.length + "条工单",
				content: "删除成功",
				placement: "top",
				type: "success",
				show: !0
			}), t.formData = {}, t.viewData = {}, S(), b()) : g.alert({
				title: "",
				content: e.retMsg || "删除失败",
				placement: "top",
				type: "success",
				show: !0
			})
		})
	}, t.editConfirm = function() {
		a.isObjectValueEqual(t.formDataShadow, t.formData) && "" == v.init() ? g.alert({
			title: "提示 ",
			content: "未更改任意项",
			placement: "top",
			type: "success",
			show: !0
		}) : ("nev390" == t.formData.dealGroupId && (delete t.formData.dealGroupId, delete t.formData.dealGroupName), "nev390" == t.formData.dealUserId && (delete t.formData.dealUserId, delete t.formData.dealUserName), "nev390" == t.formData.ticketStatus && delete t.formData.ticketStatus, $("#editWorkOrder").modal("hide"), $("#editWorkOrderCon").modal("show"))
	}, t.updateBatchTicket = function() {
		t.formData.replyContent = v.init(), r.updateBatchTicket(t.formData).then(function(e) {
			"000000" == e.retCode ? (t.formData = {}, t.viewData = {}, S(), b(), g.alert({
				title: "成功",
				content: "已编辑",
				placement: "top",
				type: "success",
				show: !0
			})) : g.alert({
				title: "",
				content: e.retMsg || "失败",
				placement: "top",
				type: "success",
				show: !0
			})
		})
	}, t.viewWorkOrderDetail = function(e) {
		s.open({
			title: e.ticketTitle,
			ticketCode: e.ticketCode,
			toState: {
				name: "zc.back.myWorkOrder"
			},
			toParams: {
				userID: e.ticketId
			},
			fromState: o.current,
			fromParams: o.params
		})
	}, t.getQueryServiceGroupList = function(e) {
		var o = a.queryServiceGroupListAll;
		t.formData.dealGroupName = o[e].groupName, t.formData.dealGroupId = o[e].groupId, "nev390" == t.formData.dealGroupId ? c.queryServiceList({
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (a.queryServiceListAll = e.items, a.queryServiceListAll.push({
				serviceName: "不改变",
				serviceId: "-100"
			}), a.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})) : a.queryServiceListAll = []
		}) : "-100" == t.formData.dealGroupId ? (t.formData.dealUserName = "不改变", t.formData.dealUserId = "-100", a.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}]) : (delete t.formData.dealUserId, delete t.formData.dealUserName, c.queryServiceList({
			groupId: o[e].groupId,
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (a.queryServiceListAll = e.items, a.queryServiceListAll.push({
				serviceName: "不改变",
				serviceId: "-100"
			}), a.queryServiceListAll.push({
				serviceName: "不选择客服",
				serviceId: "nev390"
			})) : a.queryServiceListAll = []
		}))
	}, t.getQueryServiceList = function(e) {
		var o = a.queryServiceListAll;
		t.formData.dealUserName = o[e].serviceName, t.formData.dealUserId = o[e].serviceId, "-100" == t.formData.dealUserId && (t.formData.dealGroupName = "不改变", t.formData.dealGroupId = "-100", c.queryServiceGroupList({
			companyId: a.userInfo.companyId
		}).then(function(e) {
			"000000" == e.retCode ? (a.queryServiceGroupListAll = e.items, a.queryServiceGroupListAll.push({
				groupName: "不改变",
				groupId: "-100"
			}), a.queryServiceGroupListAll.push({
				groupName: "不选择客服组",
				groupId: "nev390"
			})) : a.queryServiceGroupListAll = []
		}), a.queryServiceListAll = [{
			serviceName: "不改变",
			serviceId: "-100"
		}, {
			serviceName: "不选择客服",
			serviceId: "nev390"
		}])
	}, t.getTicketStatus = function(e, a) {
		t.formData.ticketStatus = e, t.viewData.ticketStatus = a
	}, t.getTicketType = function(e, a) {
		t.formData.ticketType = e, t.viewData.ticketType = a
	}, t.getTicketLevel = function(e, a) {
		t.formData.ticketLevel = e, t.viewData.ticketLevel = a
	}, t.getLoadAlreadyListAll = function(e) {
		var o = a.loadAlreadyListAll;
		t.loadAlreadyList = o[e].taskName, c.queryTicketReplyData({
			taskId: o[e].taskId
		}).then(function(e) {
			if ("000000" == e.retCode) {
				1 == t.userInfo.replyAuthFlag || (t.formData.replyType = e.item.replyType);
				var o = a.ticketStatusAll;
				t.formData.ticketStatus = e.item.ticketStatus, t.viewData.ticketStatus = o[e.item.ticketStatus].dictName, t.formData.replyContent = e.item.replyContent, e.item.dealUserId && (t.formData.dealUserId = e.item.dealUserId, delete t.formData.dealGroupName, delete t.formData.dealGroupId, a.queryServiceListAll = []), e.item.dealUserName && (t.formData.dealUserName = e.item.dealUserName)
			}
		})
	}
}]), angular.module("Sobot4.C").controller("chatCtrl", ["$rootScope", function(e) {
	var t = document.getElementById("main"),
		a = null;
	e.$on("$viewContentLoaded", function() {
		if (t && !a) {
			a = echarts.init(t);
			var e = {
				tooltip: {
					backgroundColor: "#ffffff",
					show: !0,
					borderColor: "#AAA",
					textStyle: {
						color: "black",
						fontSize: "18px",
						fontWeight: "blod",
						fontFamily: "Courir new"
					}
				},
				series: [{
					name: "Map",
					type: "map",
					mapLocation: {
						x: "left",
						y: "top",
						height: 800,
						width: 800
					},
					selectedMode: "multiple",
					itemStyle: {
						normal: {
							borderWidth: 1,
							borderColor: "#037e7f",
							color: "#09c3c5",
							label: {
								show: !1
							}
						},
						emphasis: {
							borderWidth: 1,
							borderColor: "",
							color: "#06b2b4",
							label: {
								show: !0,
								textStyle: {
									color: "#fff"
								}
							}
						}
					},
					data: [{
						name: "",
						value: Math.round(1e3 * Math.random()),
						itemStyle: {
							normal: {
								color: "#09c3c5",
								label: {
									show: !1,
									textStyle: {
										color: "#fff",
										fontSize: 15
									}
								}
							},
							emphasis: {
								borderWidth: 5,
								borderColor: "yellow",
								color: "#cd5c5c",
								label: {
									show: !1,
									textStyle: {
										color: "blue"
									}
								}
							}
						}
					}]
				}]
			};
			a.setOption(e)
		}
	})
}]), angular.module("Sobot4.C").controller("OpenAPICtrl", ["$scope", function(e) {}]).controller("OpenAPILoginCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "OpenAPIServ", "AuthServ", "$window", "zcGlobal", function(e, t, a, o, n, r, i, s) {
	e.TempID = o.TempID, r.isLogined = !0, i.sessionStorage[s.TempID] = e.TempID, n.checkToken().then(function(e) {
		e.retCode !== s.retCodeList.success ? a.go("login") : window.location = "/console/home/homeWorkOrder"
	})
}]), angular.module("Sobot4.D").directive("zcPaginationNew", ["GetPageListServ", "GetWorkOrderListServ", function(e, t) {
	return {
		restrict: "A",
		templateUrl: "views/public/zc-pagination-new.html",
		replace: !1,
		scope: {
			config: "=",
			jumpTo: "="
		},
		link: function(e) {}
	}
}]).directive("zcPagination", ["$rootScope", "$timeout", "pubSubServ", function(e, t, a) {
	return {
		restrict: "EA",
		templateUrl: "views/public/zc-pagination.html",
		require: "?ngModel",
		replace: !1,
		scope: {
			paginationObj: "=",
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
		link: function(e, t, a, o) {
			e.paginationObj ? "" : e.paginationObj = {}, e.paginationObj.isInited = !1;
			var n = null,
				r = ["isInit", "totalItems", "pageSize", "jumpToPage", "prevText", "nextText", "moreText", "isAutoCallback", "callBack"],
				i = r.length,
				s = {
					isInit: !1,
					totalItems: 0,
					pageSize: 15,
					prevText: "< 上一页",
					nextText: "下一页 >",
					moreText: "···",
					isAutoCallback: null,
					callBack: null
				},
				c = function() {
					for (var t = {}, a = !angular.isUndefined(e.config), o = 0, n = null; i > o; o++) n = r[o], angular.isUndefined(e[n]) ? a && !angular.isUndefined(e.config[n]) ? t[n] = e.config[n] : t[n] = s[n] : t[n] = e[n];
					return t
				},
				l = null,
				u = !1,
				d = function() {
					e.paginationObj.isInited = !0, u = !0, e.pageList = [], e.currentPage = 1, l = Math.ceil(n.totalItems / n.pageSize), e.prevPage = function() {
						e.currentPage > 1 && (e.currentPage--, u = !1, p())
					}, e.nextPage = function() {
						e.currentPage < l && (e.currentPage++, u = !1, p())
					}, e.jumpTo = function(t) {
						angular.isNumber(t) && t > 0 && l >= t && (e.currentPage = t, u = !1, p())
					}, e.$watch("currentPage", function(e, t, a) {
						a.isDisablePrev = 1 == e, a.isDisableNext = e === l, a.paginationObj.currentPage = a.currentPage
					}), p()
				},
				p = function() {
					var t = e.currentPage,
						a = [];
					if (n.totalItems) {
						if (7 >= l)
							for (var o = 0; l > o; o++) a.push(o + 1);
						else if (4 >= t) a = [1, 2, 3, 4, 5, n.moreText, l];
						else if (3 >= l - t) switch (l - t) {
							case 3:
								a = [1, n.moreText, t - 1, t, t + 1, t + 2, l];
								break;
							case 2:
								a = [1, n.moreText, t - 2, t - 1, t, t + 1, l];
								break;
							case 1:
								a = [1, n.moreText, t - 3, t - 2, t - 1, t, l];
								break;
							case 0:
								a = [1, n.moreText, t - 4, t - 3, t - 2, t - 1, l]
						} else a = [1, n.moreText, t - 1, t, t + 1, n.moreText, l];
						if (e.pageList = a, !u) {
							var r = !1,
								i = null;
							e.paginationObj.callBack = function(t) {
								return angular.isFunction(t) ? "" : t = n.callBack, i = r ? {
									params: {
										totalItems: n.totalItems,
										currentPage: e.currentPage,
										pageSize: n.pageSize
									}
								} : {
									totalItems: n.totalItems,
									currentPage: e.currentPage,
									pageSize: n.pageSize
								}, t && t(i)
							}, n.isAutoCallback && (r = !0, e.paginationObj.callBack())
						}
					}
				};
			e.paginationObj.init = function(e) {
				!e && n || (n = c()), d()
			}, e.$watch("config", function(t, a) {
				t && e.config.isInit && e.paginationObj.init(!0), t && e.config.jumpToPage && e.jumpTo(e.config.jumpToPage)
			}, !0), e.config = n = c(), n.isInit && d()
		}
	}
}]).directive("zcCategory", ["zcGlobal", "MainServ", "$rootScope", "pubSubServ", "$parse", "$q", "$timeout", function(e, t, a, o, n, r, i) {
	return {
		restrict: "EA",
		templateUrl: "views/public/zc-category.html",
		replace: !1,
		scope: {
			categoryObj: "=",
			config: "=",
			isInit: "=",
			isShowCount: "=",
			interfaceName: "@",
			isAutoCallback: "=",
			isShowAll: "=",
			callBack: "&"
		},
		link: function(a, o, n) {
			a.categoryObj ? "" : a.categoryObj = {}, a.categoryObj.isInited = !1, a.pathArr ? "" : a.pathArr = [];
			var r = null,
				i = ["isInit", "isShowCount", "interfaceName", "isAutoCallback", "isShowAll", "callBack", "reduceCategoryCount"],
				s = i.length,
				c = {
					isInDirective: null,
					isInit: !0,
					isShowCount: !0,
					interfaceName: null,
					isAutoCallback: !0,
					isShowAll: !0,
					callBack: null,
					reduceCategoryCount: function(e) {
						a.categoryList[0].list[0].docNum = a.categoryList[0].list[0].docNum - e;
						for (var t = 0; t < a.categoryList.length; t++)
							for (var o = 0; o < a.categoryList[t].list.length; o++) {
								var n = a.categoryList[t].list[o]; - 1 != n.questionTypeId && n.typeLevel + "-" + n.questionTypeId === a.categoryList[t].activeItem && (n.docNum = n.docNum - e)
							}
					}
				},
				l = "-1",
				u = function(e, t) {
					for (var a = 0, o = e.length, n = []; o > a; a++) t > a && n.push(e[a]);
					return n
				},
				d = function() {
					for (var e = {}, t = !angular.isUndefined(a.config), o = 0, n = null; s > o; o++) n = i[o], angular.isUndefined(a[n]) ? t && !angular.isUndefined(a.config[n]) ? e[n] = a.config[n] : e[n] = c[n] : e[n] = a[n];
					return e
				},
				p = function() {
					a.categoryObj.isInited = !0, m()
				},
				m = function(o) {
					return r.interfaceName ? (o = {
						questionTypeId: o && o.questionTypeId ? o.questionTypeId : "-1",
						questionTypeName: o && o.questionTypeName ? o.questionTypeName : "全部",
						typeLevel: o && o.typeLevel ? o.typeLevel : 0
					}, a.categoryObj.questionTypeId = o.questionTypeId, a.questionTypeid = o.questionTypeId, void t.getIssuesCategory({
						questionTypeId: o.questionTypeId
					}, r.interfaceName).then(function(t) {
						if (t.retCode === e.retCodeList.success) {
							angular.isArray(a.categoryList) ? "" : a.categoryList = [];
							var o, n, r, i, s, c = a.categoryList;
							t.items && t.items.length ? (i = t.items[0], n = i.typeLevel, r = i.questionTypeDesc, 1 === n ? (s = {
								activeItem: "0-" + l,
								list: [{
									questionTypeId: l,
									questionTypeName: "全部",
									docNum: t.item,
									typeLevel: "0",
									questionTypeDesc: r
								}]
							}, s.list = s.list.concat(t.items), o = s) : o = {
								activeItem: "",
								list: t.items
							}, c[n - 1] = o, a.categoryList = u(c, n)) : a.categoryList = u(c, a.currentLevel)
						}
					}).then(function() {
						var e = !1,
							t = null,
							n = null;
						a.categoryObj.callBack = function(i) {
							return angular.isFunction(i) ? "" : i = r.callBack, n = {
								questionTypeId: o.questionTypeId,
								questionTypeName: o.questionTypeName,
								typeLevel: o.typeLevel,
								pathStr: a.categoryObj.pathStr,
								pathArr: a.pathArr
							}, t = e ? {
								params: n
							} : n, i && i(t)
						}, r.isAutoCallback && (e = !0, a.categoryObj.callBack())
					})) : void console.log("你还没有定义分类的接口！")
				};
			a.getChildCategory = function(e, t) {
				var o = parseInt(t.typeLevel),
					n = u(a.pathArr, o);
				n[o] = t.questionTypeName, a.pathArr = n, a.currentLevel = o, e.activeItem = o + "-" + t.questionTypeId;
				for (var r = 0, i = a.pathArr.length, s = null, c = ""; i > r; r++) s = a.pathArr[r], s && (c += s, r !== i - 1 && (c += '<span style="margin: 0 5px;">/</span>'));
				a.categoryObj.pathStr = c, a.categoryObj.selectedCategoryID = t.questionTypeId, m({
					questionTypeId: t.questionTypeId,
					questionTypeName: t.questionTypeName,
					typeLevel: t.typeLevel
				})
			}, a.categoryObj.init = function(e) {
				!e && r || (r = d()), p()
			}, a.config = r = d(), r.isInit && p()
		}
	}
}]).directive("zcEditor", ["RepositoryServ", "$window", "$timeout", "zcGlobal", function(e, t, a, o) {
	return {
		restrict: "EA",
		require: "?ngModel",
		scope: {
			config: "=",
			ready: "=",
			delay: "=",
			isShowRelatedproblem: "=",
			callBack: "&"
		},
		link: function(e, n, r, i) {
			t.UEDITOR_HOME_URL = "script/plugs/ueditor/";
			var s, c = !1;
			s = function() {
				function a() {
					this.bindRender(), this.initEditor()
				}
				return a.prototype.initEditor = function() {
					if ("undefined" != typeof UE) {
						var a, s, l = this,
							u = "/console/scripts/plugs/ueditor/",
							d = {
								UEDITOR_HOME_URL: u,
								langPath: u + "lang/",
								themePath: u + "themes/",
								serverUrl: "/kb/docUploadFile/4",
								toolbars: [
									["source", "link", "unlink", "bold", "italic", "underline", "forecolor", "fontsize", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "emotion", "wordimage", "insertimage", "insertvideo", "insertorderedlist", "insertunorderedlist", "attachment"]
								],
								initialFrameHeight: 224,
								initialFrameWidth: "100%",
								zIndex: 0,
								maximumWords: 12e3,
								autoHeightEnabled: !1,
								autoFloatEnabled: !1,
								enableContextMenu: !0,
								contextMenu: [{
									label: "全选",
									cmdName: "selectall"
								}, {
									label: "清空文档",
									cmdName: "cleardoc",
									exec: function() {
										confirm(lang.confirmclear) && this.execCommand("cleardoc")
									}
								}, {
									label: "复制(Ctrl + c)",
									cmdName: "copy"
								}, {
									label: "粘贴(Ctrl + v)",
									cmdName: "paste"
								}]
							};
						if (a = e.config ? angular.extend(d, e.config) : d, s = r.id ? r.id : "_editor" + Date.now(), n[0].id = s, e.isShowRelatedproblem && e.callBack) {
							var p = a.toolbars[0].length;
							UE.registerUI("relatedproblem", function(t, a) {
								return new UE.ui.Button({
									name: "关联问题",
									title: "关联问题",
									cssRules: "background-position: -700px -40px;",
									onclick: function() {
										e.callBack()
									}
								})
							}, p, s)
						}
						return l.editor = new UE.ui.Editor(a), l.editor.render(s), l.editor.ready(function() {
							l.editor.execCommand("serverparam", o.TempID, t.sessionStorage[o.TempID]), l.editorReady = !0, l.editor.addListener("contentChange", function() {
								i.$setViewValue(l.editor.getContent()), c || e.$$phase || e.$apply(), c = !1
							}), l.modelContent && l.modelContent.length > 0 && l.setEditorContent(), "function" == typeof e.ready && e.ready(l.editor), e.$on("$destroy", function() {
								!r.id && UE.delEditor && UE.delEditor(s)
							})
						})
					}
				}, a.prototype.setEditorContent = function(e) {
					var t = this;
					e || (e = this.modelContent), t.editor && t.editorReady && t.editor.setContent(e)
				}, a.prototype.bindRender = function() {
					var e = this;
					i.$render = function() {
						e.modelContent = i.$isEmpty(i.$viewValue) ? "" : i.$viewValue, c = !0, e.setEditorContent()
					}, i.$render()
				}, a
			}();
			var l = function() {
				a(function() {
					t.UE.ui ? (e.delay = e.delay ? e.delay : 0, a(function() {
						new s
					}, e.delay)) : (console.log("文件较大正在努力加载"), setTimeout(function() {
						location.reload()
					}, 1e3))
				}, 200)
			};
			l()
		}
	}
}]).directive("zcTabs", ["DialogServ", function(e) {
	return {
		restrict: "EA",
		templateUrl: "views/public/zc-tabs.html",
		replace: !1,
		transclude: !0,
		scope: {
			tabsList: "=",
			isInitTabsHead: "=",
			tabsActive: "=",
			tabsActiveIndex: "=",
			tabsActiveCallback: "&",
			tabsDestroyDialog: "="
		},
		link: function(t, a, o) {
			t.showTabs = !1;
			var n = t.tabsList,
				r = n && n.length ? n.length : 0,
				i = t.tabsActive;
			t.$watchCollection("tabsList", function(e, a) {
				angular.isArray(e) ? (t.tabs = e, t.showTabs = !0, angular.isNumber(i) && (t.tabsActiveIndex = i >= 0 && r >= i ? i : 0, t.triggerTab(t.tabsActiveIndex))) : t.showTabs = !1
			}), t.triggerTab = function(a) {
				("undefined" != typeof t.tabsDestroyDialog && t.tabsDestroyDialog || t.tabsDestroyDialog) && e.destroy(), t.tabsActiveIndex = a, t.tabsActiveCallback ? t.tabsActiveCallback({
					index: a
				}) : t.tabs[a].tabsActiveCallback && t.tabs[a].tabsActiveCallback({
					index: a
				})
			}
		}
	}
}]).directive("focusMe", ["$timeout", "$parse", function(e, t) {
	return {
		link: function(a, o, n) {
			var r = t(n.focusMe);
			a.$watch(r, function(t) {
				t === !0 && e(function() {
					o[0].focus()
				})
			}), o.bind("blur", function() {
				a.$apply(r.assign(a, !1))
			})
		}
	}
}]).directive("browserAutocompelteForm", function() {
	return {
		priority: 10,
		link: function(e, t, a) {
			t.on("submit", function(e) {
				$("input[ng-model]", t).each(function(e, t) {
					"checkbox" !== angular.element(this).attr("type") && "radio" !== angular.element(this).attr("type") && angular.element(this).controller("ngModel").$setViewValue($(this).val())
				})
			})
		}
	}
}).directive("zcNodata", function() {
	return {
		restrict: "EA",
		templateUrl: "views/public/zc-nodata.html",
		replace: !1,
		transclude: !0,
		scope: {
			isNodata: "=",
			nodataText: "@"
		},
		link: function(e, t, a) {
			angular.isUndefined(e.nodataText) || (e.nodataText ? "" : e.nodataText = "暂无数据！")
		}
	}
}).directive("zcScrollbars", ["zcScrollBar", "$timeout", function(e, t) {
	return {
		scope: {
			ngScrollbarsConfig: "&",
			delay: "="
		},
		link: function(a, o, n) {
			a.delay || (a.delay = 500);
			var r = e.defaults,
				i = $.mCustomScrollbar.defaults,
				s = a.ngScrollbarsConfig();
			s || (s = {});
			for (var c in r)
				if (r.hasOwnProperty(c)) switch (c) {
					case "scrollButtons":
						s.hasOwnProperty(c) || (i.scrollButtons = r[c]);
						break;
					case "axis":
						s.hasOwnProperty(c) || (i.axis = r[c]);
						break;
					default:
						s.hasOwnProperty(c) || (s[c] = r[c])
				}
				t(function() {
					o.mCustomScrollbar(s)
				}, a.delay)
		}
	}
}]).directive("zcDownFile", ["$http", function(e) {
	return {
		restrict: "A",
		scope: !0,
		link: function(t, a, o) {
			var n = $(a);
			n.on("click", function(t) {
				n.prop("disabled", !0), t.preventDefault();
				var a = (new Date).getTime();
				e({
					url: o.zcDownFile,
					method: o.zcMethod ? o.zcMethod : "GET"
				}).success(function(e, t, a, o) {
					if (n.prop("disabled", !1), "000000" == e.retCode || "0" == e.retCode) {
						var r = document.createElement("a");
						r.setAttribute("href", e.item), r.setAttribute("target", "_blank"), r.setAttribute("id", "openWindow"), document.body.appendChild(r), r.click()
					} else {
						var i = e.retMsg ? e.retMsg : "暂无相关数据！";
						alert(i)
					}
				}).error(function(e, t, o, r) {
					var i = (new Date).getTime() - a;
					n.prop("disabled", !1), i >= r.timeout ? alert("请求已超时...") : alert("数据较大请耐心等待...")
				})
			})
		}
	}
}]).directive("zcAutoEllipsis", ["$timeout", function(e) {
	return {
		restrict: "EA",
		template: '<div class="zcAutoEllipsis" ng-transclude></div>',
		replace: !1,
		transclude: !0,
		scope: !0,
		link: function(t, a, o) {
			var n, r, i = o.zcAutoEllipsis ? o.zcAutoEllipsis : "auto",
				s = "...";
			e(function() {
				n = a.text(), "auto" === i || (r = n.slice(0, i) + s, a.text(r))
			}, 0)
		}
	}
}]).directive("zcColorPicker", ["$compile", function(e) {
	return {
		restrict: "EA",
		scope: {
			setColor: "&"
		},
		link: function(t, a, o) {
			function n() {
				return angular.isDefined(o.disabled) ? !o.disabled : !0
			}

			function r(e) {
				t.$emit("colorPicked", e), t.hoveredColor = e, g(e), t.latestColor = m()
			}

			function i(e) {
				r(e), c()
			}

			function s(e) {
				t.hoveredColor = e
			}

			function c() {
				I.css("display", "none")
			}

			function l(e) {
				var t = n();
				if (t) {
					e.stopPropagation();
					v(a);
					I.css({
						left: 540,
						top: 300
					}), I.css("display", "block"), I[0].focus()
				}
			}

			function u(e) {
				e.stopPropagation()
			}

			function d() {
				var e = document.createElement("input");
				return e.setAttribute("type", "color"), "text" !== e.type
			}

			function p() {
				var e = window.localStorage.getItem("ui-color-picker");
				if (!e) return null;
				try {
					e = JSON.parse(e)
				} catch (t) {
					return null
				}
				return e
			}

			function m() {
				var e = p();
				return e ? e.latestColor : []
			}

			function g(e) {
				var t = p() || {},
					a = m();
				if (a && a instanceof Array) {
					var o = a.indexOf(e); - 1 != o && a.splice(o, 1), a.unshift(e)
				} else a = [e];
				a.length > 10 && (a = a.slice(0, 10)), t.latestColor = a, window.localStorage.setItem("ui-color-picker", JSON.stringify(t))
			}

			function f(e, t) {
				for (var a = 0, o = 0, n = 0, r = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) a += e.offsetLeft, o += e.offsetTop, t || "BODY" !== e.tagName ? (n += e.scrollLeft, r += e.scrollTop) : (n += document.documentElement.scrollLeft || e.scrollLeft, r += document.documentElement.scrollTop || e.scrollTop), e = e.offsetParent;
				return {
					top: o,
					left: a,
					scrollX: n,
					scrollY: r
				}
			}

			function v(e) {
				var t, a = f(e[0]);
				return "top" === w ? t = {
					top: a.top - 147,
					left: a.left
				} : "right" === w ? t = {
					top: a.top,
					left: a.left + 126
				} : "bottom" === w ? t = {
					top: a.top + e[0].offsetHeight + 2,
					left: a.left
				} : "left" === w && (t = {
					top: a.top,
					left: a.left - 150
				}), {
					top: t.top + "px",
					left: t.left + "px"
				}
			}
			var h = t.setColor() || o.defaultColor || "#09aeb0",
				y = {
					clearText: "默认颜色",
					defaultColor: h,
					latestText: "最近使用",
					commonText: "主题颜色",
					commonColor: [
						["#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646"],
						["#f2f2f2", "#808080", "#ddd8c2", "#c6d9f1", "#dbe5f1", "#f2dbdb", "#eaf1dd", "#e5dfec", "#daeef3", "#fde9d9"],
						["#d9d9d9", "#595959", "#c4bc96", "#8db3e2", "#b8cce4", "#e5b8b7", "#d6e3bc", "#ccc0d9", "#b6dde8", "#fbd4b4"],
						["#bfbfbf", "#404040", "#938953", "#548dd4", "#95b3d7", "#d99594", "#c2d69b", "#b2a1c7", "#92cddc", "#fabf8f"],
						["#a6a6a6", "#262626", "#4a442a", "#17365d", "#365f91", "#943634", "#76923c", "#5f497a", "#31849b", "#e36c0a"],
						["#7f7f7f", "#0d0d0d", "#1c1a10", "#0f243e", "#243f60", "#622423", "#4e6128", "#3f3151", "#205867", "#974706"]
					],
					standardText: "标准颜色",
					standardColor: ["#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0"],
					moreText: "更多颜色.."
				},
				S = (1e6 * +new Date + Math.floor(1e6 * Math.random())).toString(36),
				b = '<div class="colorpicker-container" tabindex="-1" ng-click="keepPickerOpen($event)"><div class="colorpicker-toolbar"><div class="colorpicker-preview" ng-style="{ \'background-color\': hoveredColor }"></div><div class="colorpicker-clear" ng-bind="defaultOptions.clearText" ng-click="selectColorAndClose(setColor() || defaultOptions.defaultColor)"></div></div><div class="colorpicker-title" ng-bind="defaultOptions.latestText" ng-if="latestColor.length > 0"></div><div class="colorpicker-latestcolor colorpicker-colors"><span class="colorpicker-colors-item" ng-repeat="color in latestColor" ng-style="{\'background-color\': color, \'border-color\': color}" ng-click="selectColorAndClose(color)" ng-mouseover="previewColor(color)" ng-mouseleave="previewColor(setColor() || defaultOptions.defaultColor)"></span></div><div class="colorpicker-title" ng-bind="defaultOptions.commonText"></div><div class="colorpicker-commoncolor"><div class="colorpicker-colors colorpicker-colors-line{{$index}}" ng-repeat="line in defaultOptions.commonColor"><span class="colorpicker-colors-item" ng-repeat="color in line" ng-style="{\'background-color\': color, \'border-color\': color}" ng-click="selectColorAndClose(color)" ng-mouseover="previewColor(color)" ng-mouseleave="previewColor(setColor() || defaultOptions.defaultColor)"></span></div></div><div class="colorpicker-title" ng-bind="defaultOptions.standardText"></div><div class="colorpicker-standardcolor colorpicker-colors"><span class="colorpicker-colors-item" ng-repeat="color in defaultOptions.standardColor" ng-style="{\'background-color\': color, \'border-color\': color}" ng-click="selectColorAndClose(color)" ng-mouseover="previewColor(color)" ng-mouseleave="previewColor(setColor() || defaultOptions.defaultColor)"></span></div><div class="colorpicker-title colorpicker-morecolor" ng-if="isSupportNativeColorPicker"><label for="native-color-picker' + S + '" ng-bind="defaultOptions.moreText"></label><input id="native-color-picker' + S + '" class="native-color-picker" type="color" ng-model="nativeColor" ng-change="selectColor(nativeColor);" /></div></div>',
				D = angular.element,
				I = D(b),
				w = angular.isDefined(o.colorpickerPosition) ? o.colorpickerPosition : "bottom";
			t.defaultOptions = y, t.isSupportNativeColorPicker = d(), t.latestColor = m(), t.selectColor = r, t.previewColor = s, t.selectColorAndClose = i, t.keepPickerOpen = u, t.hoveredColor = y.defaultColor, e(I)(t), D("#channelPc-cont-box").append(I), a.on("click", l), D(document).on("click", c), t.$on("openColorPicker", l), t.$on("closeColorPicker", c)
		}
	}
}]).directive("zcContext", ["StatisticsServ", "zcGlobal", "DialogServ", "$timeout", function(e, t, a, o) {
	return {
		restrict: "EA",
		replace: !1,
		transclude: !1,
		scope: !0,
		link: function(t, n, r) {
			var i = ["PC", "微信", "APP", "微博", "WAP"];
			t.itemCid = r.zcContext || null, t.itemCid || n.parent().html("-"), t.tabsActiveCallback = function(e) {
				t.tab[e].init()
			}, t.tab = [], t.tab[0] = function() {
				var n = {};
				return n.index = 0, n.cidBodyData = {
					totalItems: 0,
					list: []
				}, n.noMoreData = !1, n.userNickName = "", n.getServletContext = function(t) {
					return t = t ? t : {}, e.cidsatisfactionServiceContent({
						cid: t.cid,
						page: t.page || 1,
						size: t.size || 15
					}).then(function(e) {
						return "0" !== e.retCode ? !1 : (n.noMoreData = !e.items.length, e)
					})
				}, n.getSysteamText = function(e) {
					var e = angular.isArray(e) ? e : [],
						t = e.length,
						a = [];
					if (e && t)
						for (var o, r = 0; t > r; r++) {
							o = e[r];
							var i = 3,
								s = "",
								c = o.hasOwnProperty("ts") ? o.ts : "",
								l = o.hasOwnProperty("senderType") ? o.senderType : "",
								u = o.hasOwnProperty("receiverName") ? o.receiverName : "",
								d = o.hasOwnProperty("senderName") ? o.senderName : "",
								p = o.hasOwnProperty("offlineType") ? o.offlineType : "",
								m = o.hasOwnProperty("t") ? o.t : "";
							switch (o.type) {
								case "5":
									s = o.msg, i = l, n.userNickName || 0 != i || (n.userNickName = d);
									break;
								case "4":
									s = "用户和机器人建立会话";
									break;
								case "6":
									s = "用户转人工服务";
									break;
								case "7":
									s = "用户排队";
									break;
								case "8":
									s = "用户和客服" + u + "建立会话";
									break;
								case "9":
									s = "用户与客服" + d + "的会话,被转接到客服" + u;
									break;
								case "10":
									switch (p) {
										case "4":
											s = "用户会话超时，本次会话已经结束";
											break;
										case "5":
											s = "用户关闭了聊天页面，本次会话已经结束";
											break;
										case "3":
											s = "用户被客服" + u + "加入黑名单,本次会话结束";
											break;
										case "2":
											s = "用户被客服" + u + "移除,本次会话结束";
											break;
										case "1":
											s = "客服" + u + "离线,本次会话结束";
											break;
										case "6":
											s = "用户打开新的聊天页面，本次会话已经结束"
									}
									break;
								case "11":
									s = "客服" + d + "把" + u + "拉黑了";
									break;
								case "12":
									s = "用户已被客服" + d + "取消拉黑";
									break;
								case "16":
									s = "用户已被客服" + d + "添加星标";
									break;
								case "17":
									s = "用户已被客服" + d + "取消星标";
									break;
								case "18":
									s = "用户向客服" + u + "申请语音通话";
									break;
								case "19":
									s = "客服" + d + "给用户回拨语音通话";
									break;
								case "20":
									var g = o.msg.indexOf(";"),
										f = o.msg.substring(0, g),
										v = o.msg.substring(g + 1, o.msg.length);
									s = '用户访问了页面 <a href="' + f + '" target="_blank">' + v + "</a>";
									break;
								case "21":
									s = "客服" + d + "主动邀请会话"
							}
							a.push({
								msgType: i,
								msgText: s,
								senderName: d,
								sendTime: c,
								tempTime: m
							})
						}
					return a
				}, n.init = function() {
					n.currentPage = 1, n.strapModal || (n.strapModal = a.modal({
						scope: t,
						templateUrl: "views/public/strap-modal-servletContext.html"
					})), t.tab[n.index].moreMsgListBtnText = "正在加载中...", n.getServletContext({
						cid: t.itemCid,
						page: n.currentPage,
						size: 15
					}).then(function(e) {
						e && (t.tab[n.index].moreMsgListBtnText = "点击加载更多",
							n.cidBodyData.totalItems = e.item && e.item.total ? e.item.total > 999 ? "999+" : e.item.total : 0, n.cidBodyData.list = [], t.tabs = [{
								title: "全部(" + n.cidBodyData.totalItems + ")"
							}], t.tabsActiveIndex = n.index, n.strapModal.$isShown || n.strapModal.$promise.then(n.strapModal.show), o(function() {
								n.cidBodyData.list = n.getSysteamText(e.items && e.items.length ? e.items : []), n.cidBodyData.userNickName = n.userNickName
							}, 800))
					})
				}, n.getMoreServletContext = function() {
					return n.noMoreData ? void(t.tab[n.index].moreMsgListBtnText = "没有更多记录了！") : (n.currentPage++, t.tab[n.index].moreMsgListBtnText = "正在加载中...", void n.getServletContext({
						cid: t.itemCid,
						page: n.currentPage,
						size: 15
					}).then(function(e) {
						if (e) {
							t.tab[n.index].moreMsgListBtnText = "点击加载更多", n.cidBodyData.totalItems = e.item && e.item.total ? e.item.total : 0;
							var a = n.getSysteamText(e.items && e.items.length ? e.items : []),
								o = a.length;
							a && o ? n.cidBodyData.list = n.cidBodyData.list.concat(a) : "", n.cidBodyData.userNickName = n.userNickName
						}
					}))
				}, {
					init: n.init,
					index: n.index,
					cidBodyData: n.cidBodyData,
					getMoreServletContext: n.getMoreServletContext,
					moreMsgListBtnText: n.moreMsgListBtnText
				}
			}(), t.isUserInfoShown = !1, t.showUserInfo = function() {
				t.isUserInfoShown = !t.isUserInfoShown, t.isUserInfoShown && e.infosatisfactionServiceContent({
					cid: t.itemCid
				}).then(function(a) {
					return "0" !== a.retCode ? !1 : (t.userInfoBodyData = a.item, t.userInfoBodyData.sourceText = i[t.userInfoBodyData.source], void(t.userInfoBodyData.id && e.QueryUserHistoryInfo({
						userId: t.userInfoBodyData.id
					}).then(function(e) {
						return "0" !== e.retCode ? !1 : void(t.userInfoBodyData.visitedNums = e.item && e.item.total ? e.item.total : 0)
					})))
				})
			}, t.hideUserInfo = function() {
				t.isUserInfoShown = !t.isUserInfoShown
			}, n.on("click", function() {
				return t.itemCid ? (t.modalDomData = {
					title: "会话详情"
				}, void t.tab[0].init()) : !1
			})
		}
	}
}]).directive("zcListContext", ["StatisticsServ", "zcGlobal", "DialogServ", "$timeout", function(e, t, a, o) {
	return {
		restrict: "EA",
		replace: !1,
		transclude: !1,
		scope: !0,
		link: function(t, n, r) {
			var i = ["PC", "微信", "APP", "微博", "WAP"];
			t.itemCid = r.zcListContext || null, t.itemCid || n.parent().html("-"), t.tabsActiveCallback = function(e) {
				switch (e) {
					case 0:
						t.tab[e].init();
						break;
					case 1:
						t.tab[e].init()
				}
			}, t.tab = [], t.tab[0] = function() {
				var n = {};
				return n.index = 0, n.cidBodyData = {
					totalItems: 0,
					totalHuman: 0,
					list: []
				}, n.noMoreList = !1, n.userNickName = "", n.getServletContext = function(t) {
					return t = t ? t : {}, e.cidsatisfactionServiceContent({
						cid: t.cid,
						page: t.page || 1,
						size: t.size || 15
					}).then(function(e) {
						return "0" !== e.retCode ? !1 : (n.noMoreData = !e.items.length, e)
					})
				}, n.getSysteamText = function(e) {
					var e = angular.isArray(e) ? e : [],
						t = e.length,
						a = [];
					if (e && t)
						for (var o, r = 0; t > r; r++) {
							o = e[r];
							var i = 3,
								s = "",
								c = o.hasOwnProperty("ts") ? o.ts : "",
								l = o.hasOwnProperty("senderType") ? o.senderType : "",
								u = o.hasOwnProperty("receiverName") ? o.receiverName : "",
								d = o.hasOwnProperty("senderName") ? o.senderName : "",
								p = o.hasOwnProperty("offlineType") ? o.offlineType : "",
								m = o.hasOwnProperty("t") ? o.t : "";
							switch (o.type) {
								case "5":
									s = o.msg, i = l, n.userNickName || 0 != i || (n.userNickName = d);
									break;
								case "4":
									s = "用户和机器人建立会话";
									break;
								case "6":
									s = "用户转人工服务";
									break;
								case "7":
									s = "用户排队";
									break;
								case "8":
									s = "用户和客服" + u + "建立会话";
									break;
								case "9":
									s = "用户与客服" + d + "的会话,被转接到客服" + u;
									break;
								case "10":
									switch (p) {
										case "4":
											s = "用户会话超时，本次会话已经结束";
											break;
										case "5":
											s = "用户关闭了聊天页面，本次会话已经结束";
											break;
										case "3":
											s = "用户被客服" + u + "加入黑名单,本次会话结束";
											break;
										case "2":
											s = "用户被客服" + u + "移除,本次会话结束";
											break;
										case "1":
											s = "客服" + u + "离线,本次会话结束";
											break;
										case "6":
											s = "用户打开新的聊天页面，本次会话已经结束"
									}
									break;
								case "11":
									s = "客服" + d + "把" + u + "拉黑了";
									break;
								case "12":
									s = "用户已被客服" + d + "取消拉黑";
									break;
								case "16":
									s = "用户已被客服" + d + "添加星标";
									break;
								case "17":
									s = "用户已被客服" + d + "取消星标";
									break;
								case "18":
									s = "用户向客服" + u + "申请语音通话";
									break;
								case "19":
									s = "客服" + d + "给用户回拨语音通话";
									break;
								case "20":
									var g = o.msg.indexOf(";"),
										f = o.msg.substring(0, g),
										v = o.msg.substring(g + 1, o.msg.length);
									s = '用户访问了页面 <a href="' + f + '" target="_blank">' + v + "</a>";
									break;
								case "21":
									s = "客服" + d + "主动邀请会话"
							}
							a.push({
								msgType: i,
								msgText: s,
								senderName: d,
								sendTime: c,
								tempTime: m
							})
						}
					return a
				}, n.init = function() {
					n.currentPage = 1, n.strapModal || (n.strapModal = a.modal({
						scope: t,
						templateUrl: "views/public/strap-modal-leftListContext.html"
					})), t.tab[n.index].moreMsgListBtnText = "正在加载中...", n.getServletContext({
						cid: t.itemCid,
						page: n.currentPage,
						size: 15
					}).then(function(e) {
						e && (t.tab[n.index].moreMsgListBtnText = "点击加载更多", n.cidBodyData.totalItems = e.item && e.item.total ? e.item.total > 999 ? "999+" : e.item.total : 0, n.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman > 999 ? "999+" : e.item.totalHuman : 0, n.cidBodyData.list = [], t.tabs = [{
							title: "全部(" + n.cidBodyData.totalItems + ")"
						}, {
							title: "人工会话(" + n.cidBodyData.totalHuman + ")"
						}], t.tabsActiveIndex = n.index, n.strapModal.$isShown || n.strapModal.$promise.then(n.strapModal.show), o(function() {
							n.cidBodyData.list = n.getSysteamText(e.items && e.items.length ? e.items : []), n.cidBodyData.userNickName = n.userNickName
						}, 800))
					})
				}, n.getMoreServletContext = function() {
					return n.noMoreData ? void(t.tab[n.index].moreMsgListBtnText = "没有更多记录了！") : (n.currentPage++, t.tab[n.index].moreMsgListBtnText = "正在加载中...", void n.getServletContext({
						cid: t.itemCid,
						page: n.currentPage,
						size: 15
					}).then(function(e) {
						if (e) {
							t.tab[n.index].moreMsgListBtnText = "点击加载更多", n.cidBodyData.totalItems = e.item && e.item.total ? e.item.total : 0, n.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman : 0;
							var a = n.getSysteamText(e.items && e.items.length ? e.items : []),
								o = a.length;
							a && o ? n.cidBodyData.list = n.cidBodyData.list.concat(a) : "", n.cidBodyData.userNickName = n.userNickName
						}
					}))
				}, {
					init: n.init,
					index: n.index,
					cidBodyData: n.cidBodyData,
					getMoreServletContext: n.getMoreServletContext,
					moreMsgListBtnText: n.moreMsgListBtnText
				}
			}(), t.tab[1] = function() {
				var a = {};
				return a.index = 1, a.cidBodyData = {
					totalItems: 0,
					totalHuman: 0,
					list: []
				}, a.noMoreList = !1, a.userNickName = "", a.getServletContext = function(t) {
					return t = t ? t : {}, e.cidsatisfactionServiceContent({
						cid: t.cid,
						page: t.page || 1,
						size: t.size || 15
					}).then(function(e) {
						if ("0" !== e.retCode) return !1;
						a.noMoreData = !e.items.length;
						for (var t in e.items) "1" == e.items[t].senderType && e.items.shift(e.items[t]), "1" == e.items[t].receiverType && e.items.shift(e.items[t]);
						return e
					})
				}, a.getSysteamText = function(e) {
					var e = angular.isArray(e) ? e : [],
						t = e.length,
						o = [];
					if (e && t)
						for (var n, r = 0; t > r; r++) {
							n = e[r];
							var i = 3,
								s = "",
								c = n.hasOwnProperty("ts") ? n.ts : "",
								l = n.hasOwnProperty("senderType") ? n.senderType : "",
								u = n.hasOwnProperty("receiverName") ? n.receiverName : "",
								d = n.hasOwnProperty("senderName") ? n.senderName : "",
								p = n.hasOwnProperty("offlineType") ? n.offlineType : "",
								m = n.hasOwnProperty("t") ? n.t : "";
							switch (n.type) {
								case "5":
									s = n.msg, i = l, a.userNickName || 0 != i || (a.userNickName = d);
									break;
								case "4":
									s = "用户和机器人建立会话";
									break;
								case "6":
									s = "用户转人工服务";
									break;
								case "7":
									s = "用户排队";
									break;
								case "8":
									s = "用户和客服" + u + "建立会话";
									break;
								case "9":
									s = "用户与客服" + d + "的会话,被转接到客服" + u;
									break;
								case "10":
									switch (p) {
										case "4":
											s = "用户会话超时，本次会话已经结束";
											break;
										case "5":
											s = "用户关闭了聊天页面，本次会话已经结束";
											break;
										case "3":
											s = "用户被客服" + u + "加入黑名单,本次会话结束";
											break;
										case "2":
											s = "用户被客服" + u + "移除,本次会话结束";
											break;
										case "1":
											s = "客服" + u + "离线,本次会话结束";
											break;
										case "6":
											s = "用户打开新的聊天页面，本次会话已经结束"
									}
									break;
								case "11":
									s = "客服" + d + "把" + u + "拉黑了";
									break;
								case "12":
									s = "用户已被客服" + d + "取消拉黑";
									break;
								case "16":
									s = "用户已被客服" + d + "添加星标";
									break;
								case "17":
									s = "用户已被客服" + d + "取消星标";
									break;
								case "18":
									s = "用户向客服" + u + "申请语音通话";
									break;
								case "19":
									s = "客服" + d + "给用户回拨语音通话";
									break;
								case "20":
									var g = n.msg.indexOf(";"),
										f = n.msg.substring(0, g),
										v = n.msg.substring(g + 1, n.msg.length);
									s = '用户访问了页面 <a href="' + f + '" target="_blank">' + v + "</a>";
									break;
								case "21":
									s = "客服" + d + "主动邀请会话"
							}
							o.push({
								msgType: i,
								msgText: s,
								senderName: d,
								sendTime: c,
								tempTime: m
							})
						}
					return o
				}, a.init = function() {
					a.currentPage = 1, t.tab[a.index].moreMsgListBtnText = "正在加载中...", a.getServletContext({
						cid: t.itemCid,
						page: a.currentPage,
						size: 15
					}).then(function(e) {
						if (e) {
							t.tab[a.index].moreMsgListBtnText = "点击加载更多", a.cidBodyData.totalItems = e.item && e.item.total ? e.item.total > 999 ? "999+" : e.item.total : 0, a.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman > 999 ? "999+" : e.item.totalHuman : 0, a.cidBodyData.list = [], t.tabs = [{
								title: "全部(" + a.cidBodyData.totalItems + ")"
							}, {
								title: "人工会话(" + a.cidBodyData.totalHuman + ")"
							}], t.tabsActiveIndex = a.index;
							for (var n in e.items) "1" == e.items[n].senderType && e.items.shift(e.items[n]), "1" == e.items[n].receiverType && e.items.shift(e.items[n]);
							o(function() {
								a.cidBodyData.list = a.getSysteamText(e.items && e.items.length ? e.items : []), a.cidBodyData.userNickName = a.userNickName
							}, 800)
						}
					})
				}, a.getMoreServletContext = function() {
					return a.noMoreData ? void(t.tab[a.index].moreMsgListBtnText = "没有更多记录了！") : (a.currentPage++, t.tab[a.index].moreMsgListBtnText = "正在加载中...", void a.getServletContext({
						cid: t.itemCid,
						page: a.currentPage,
						size: 15
					}).then(function(e) {
						if (e) {
							t.tab[a.index].moreMsgListBtnText = "点击加载更多", a.cidBodyData.totalItems = e.item && e.item.total ? e.item.total : 0, a.cidBodyData.totalHuman = e.item && e.item.totalHuman ? e.item.totalHuman : 0;
							var o = a.getSysteamText(e.items && e.items.length ? e.items : []),
								n = o.length;
							o && n ? a.cidBodyData.list = a.cidBodyData.list.concat(o) : "", a.cidBodyData.userNickName = a.userNickName
						}
					}))
				}, {
					init: a.init,
					index: a.index,
					cidBodyData: a.cidBodyData,
					getMoreServletContext: a.getMoreServletContext,
					moreMsgListBtnText: a.moreMsgListBtnText
				}
			}(), t.isUserInfoShown = !1, t.showUserInfo = function() {
				t.isUserInfoShown = !t.isUserInfoShown, t.isUserInfoShown && e.infosatisfactionServiceContent({
					cid: t.itemCid
				}).then(function(a) {
					return "0" !== a.retCode ? !1 : (t.userInfoBodyData = a.item, t.userInfoBodyData.sourceText = i[t.userInfoBodyData.source], void(t.userInfoBodyData.id && e.QueryUserHistoryInfo({
						userId: t.userInfoBodyData.id
					}).then(function(e) {
						return "0" !== e.retCode ? !1 : void(t.userInfoBodyData.visitedNums = e.item && e.item.total ? e.item.total : 0)
					})))
				})
			}, t.hideUserInfo = function() {
				t.isUserInfoShown = !t.isUserInfoShown
			}, n.on("click", function() {
				return t.itemCid ? (t.modalDomData = {
					title: "会话详细"
				}, void t.tab[0].init()) : !1
			})
		}
	}
}]).directive("zcValidate", ["$rootScope", "ValidateServ", function(e, t) {
	return {
		restrict: "EA",
		replace: !1,
		scope: !0,
		link: function(e, a, o) {
			t.init().then(function() {
				t.bindValidate(a)
			})
		}
	}
}]), angular.module("Sobot4.F").filter("filterUser", function() {
	return function(e) {
		console.log(e);
		var t = e.name.match("x");
		return t ? e : []
	}
}).filter("filterNumber", function() {
	return function(e) {
		var e = parseInt(e) + 1;
		return 10 > e ? "0" + e : e
	}
}).filter("formatTime", function() {
	return function(e) {
		if ("" == e) e = "";
		else {
			var t = e,
				a = (new Date).getTime() / 1e3,
				o = Math.floor(a),
				n = o - t,
				r = 60,
				i = 60 * r,
				s = 24 * i,
				c = 30 * s,
				l = 365 * s;
			"60" >= n ? e = "1分钟前" : n > "60" && "3600" > n ? e = Math.floor(n / r) + "分钟前" : n >= "3600" && "86400" > n ? e = Math.floor(n / i) + "小时前" : n >= "86400" && "2592000" > n ? e = Math.floor(n / s) + "天前" : n >= "2592000" && "31536000" > n ? e = Math.floor(n / c) + "月前" : n >= "31536000" && (e = Math.floor(n / l) + "年前")
		}
		return e
	}
}).filter("formatHms", function() {
	return function(e) {
		if (e /= 1e3, null != e && "" != e) {
			var t = parseInt(e / 3600);
			10 > t && (t = "0" + t);
			var a = parseInt((e - 3600 * t) / 60);
			10 > a && (a = "0" + a);
			var o = parseInt(e - (3600 * t + 60 * a));
			10 > o && (o = "0" + o), e = "00" == t ? "00" == a ? "00" != o ? o + "秒" : "-" : a + "分" + o + "秒" : t + "时" + a + "分" + o + "秒"
		} else e = "-";
		return e
	}
}).filter("to_trusted", ["$sce", function(e) {
	return function(t) {
		return e.trustAsHtml(t)
	}
}]), angular.module("Sobot4.P").provider("zcScrollBar", [function() {
	this.defaults = {
		scrollButtons: {
			scrollAmount: "auto",
			enable: !0
		},
		setWidth: 300,
		scrollInertia: 400,
		axis: "yx"
	}, $.mCustomScrollbar.defaults.scrollButtons = this.defaults.scrollButtons, $.mCustomScrollbar.defaults.axis = this.defaults.axis, this.$get = function() {
		return {
			defaults: this.defaults
		}
	}
}]).service("aaaaaa", [function() {
	this.aaa = "aaaa"
}]), 
angular.module("Sobot4.S").factory("ActivateEmailServ", ["BaseServ", function(e) {
	return {
		getCheckActivateEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/checkServiceStatusAndTime",
				params: t
			});
			return a
		},
		getActivateSendSms: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/sendMessage",
				params: t
			});
			return a
		},
		getActivationConfirm: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/activationConfirm",
				params: t
			});
			return a
		},
		getContactManagerEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/contactManager",
				params: t
			});
			return a
		},
		login: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/serviceLogin",
				params: t,
				noToken: !0
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("BaseServ", ["$rootScope", "$http", "$q", "CookieServ", "zcGlobal", function(e, t, a, o, n) {
	return {
		query: function(r) {
			e.userInfo ? "" : e.userInfo = o.get();
			var i = a.defer(),
				s = function() {
					return r.Serv ? n.BaseUrl + r.urlServ + "/" + n.ServVersion : r.ChatServ ? n.BaseUrl + r.urlServ : n.BaseUrl + "console/" + r.url
				},
				c = {
					method: r.method.toUpperCase() || "GET",
					url: s(),
					headers: {}
				};
			if ("GET" === c.method) return c.params = r.params || {}, !r.noToken && e.userInfo ? c.headers[n.TempID] = e.userInfo[n.TempID] : "", t(c).success(function(e) {
				i.resolve(e)
			}).error(function(e) {
				i.reject(e)
			}), i.promise;
			if ("ZCPOST" === c.method) return c.method = "POST", c.data = r.params || {}, t(c).success(function(e) {
				i.resolve(e)
			}).error(function(e) {
				i.reject(e)
			}), i.promise;
			if ("POST" === c.method) {
				var l = "";
				return !r.noToken && e.userInfo ? l = e.userInfo[n.TempID] : "", $.ajax({
					type: "POST",
					url: s(),
					headers: {
						"temp-id": l
					},
					data: r.params,
					dataType: "json",
					success: function(e) {
						i.resolve(e)
					}
				}), i.promise
			}
		}
	}
}]).factory("CookieServ", ["$cookieStore", "$cookies", function(e, t) {
	var a = {};
	return {
		user: a,
		set: function(t) {
			var a = e.get("__zcu");
			t = t || a, e.put("__zcu", t)
		},
		get: function() {
			var e = t.get("__zcu");
			return e ? JSON.parse(e) : !1
		},
		del: function() {
			e.remove("__zcu")
		}
	}
}]).factory("AuthServ", ["BaseServ", function(e) {
	var t = {
		isLogined: !1,
		getUserAuthInfo: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "basic/getServiceInfoByToken",
				params: t
			});
			return a
		},
		getUserInfo: function(t) {
			var a = e.query({
				method: "GET",
				params: t,
				Serv: !0,
				urlServ: "basic/getServiceDataInfo"
			});
			return a
		}
	};
	return t
}]).service("MessageServ", ["$rootScope", function(e) {
	return {
		publish: function(t, a) {
			e.$emit(t, a)
		},
		subscribe: function(t, a) {
			e.$on(t, a)
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
}]).factory("checkServ", [function() {
	return function() {
		var e = this;
		e.checkList = [], e.isActionBarShow = !1, e.isAllChecked = !1, e.checkedList = [], e.init = function(t, a, o) {
			e.isActionBarShow = !1, e.isAllChecked = !1, e.checkedList = [], e.checkList = [], t && a && o && t.$watch("isActionBarShow", function() {
				e.isActionBarShow ? a() : o()
			})
		}, e.getCheckList = function(t, a, o) {
			var n = null;
			t && (n = t, n.isSingleChecked = !1, e.checkList[a] = n)
		}, e.singCheckFunc = function(t) {
			var a = null,
				o = [];
			if (e.checkList[t].isSingleChecked = !e.checkList[t].isSingleChecked, e.checkList[t].isSingleChecked) e.checkedList.push(t);
			else {
				for (var n = 0, r = e.checkedList.length; r > n; n++) a = e.checkedList[n], a !== t && o.push(a);
				e.checkedList = o
			}
			e.checkedList.length === e.checkList.length ? e.isAllChecked = !0 : e.isAllChecked = !1, e.checkedList.length ? e.isActionBarShow = !0 : e.isActionBarShow = !1
		}, e.allCheckFunc = function() {
			if (e.isAllChecked = !e.isAllChecked, e.checkedList = [], e.isAllChecked)
				for (var t = 0, a = e.checkList.length; a > t; t++) angular.isObject(e.checkList[t]) && e.checkList[t].hasOwnProperty("isSingleChecked") && (e.checkList[t].isSingleChecked = e.isAllChecked), angular.isObject(e.checkList[t]) && e.checkedList.push(t);
			else
				for (var t = 0, a = e.checkList.length; a > t; t++) angular.isObject(e.checkList[t]) && e.checkList[t].hasOwnProperty("isSingleChecked") && (e.checkList[t].isSingleChecked = e.isAllChecked);
			e.checkedList.length ? e.isActionBarShow = !0 : e.isActionBarShow = !1
		}, e.getIdStr = function(t, a, o, n, r) {
			var i, s, c = e.checkedList,
				l = c.length,
				a = angular.isArray(a) ? a : [],
				u = "",
				d = function(e) {
					return r ? r(e) : !1
				};
			if (angular.isArray(t) ? 1 == t.length ? (t = t[0], i = o ? o : ",") : 2 == t.length && (i = o ? o : "-", s = n ? n : ",") : i = o ? o : ",", angular.isFunction(r) || (r = null), l && a.length) {
				if (angular.isArray(t))
					for (var p, m = 0, g = null; l > m; m++) g = c[m], p = a[g], d(p) || (u += s + p[t[0]] + i + p[t[1]]);
				else
					for (var p, m = 0, g = null; l > m; m++) g = c[m], p = a[g], d(p) || (u += i + p[t]);
				u = u.substring(1)
			}
			return u
		}, e.init()
	}
}]).factory("TabServ", ["$rootScope", "$state", "$window", "$timeout", function(e, t, a, o) {
	var n = function(e, t) {
			var a = Object.getOwnPropertyNames(e),
				o = Object.getOwnPropertyNames(t);
			if (a.length != o.length) return !1;
			for (var n = 0; n < a.length; n++) {
				var r = a[n];
				if (e[r] !== t[r]) return !1
			}
			return !0
		},
		r = JSON.parse(a.sessionStorage.getItem("tabListObj"));
	return r ? e.tabListObj = r : e.tabListObj = {
		tabList: [],
		activeIndex: 0,
		defID: 1
	}, {
		defID: e.tabListObj.defID || 1,
		maxLength: 6,
		open: function(t) {
			var a = e.tabListObj.tabList,
				o = a.length,
				r = null,
				i = !1,
				s = null,
				c = null;
			if (o)
				for (var l = 0; o > l; l++)
					if (r = a[l], r.toState.name === t.toState.name && (i = n(r.toParams, t.toParams))) {
						s = l;
						break
					}
			i ? c = s : (e.tabListObj.tabList.length >= this.maxLength && e.tabListObj.tabList.shift(), e.tabListObj.tabList.push({
				id: this.defID++,
				title: t.title,
				ticketCode: t.ticketCode,
				toState: {
					name: t.toState.name || e.defaultPage
				},
				toParams: t.toParams || {},
				fromState: t.fromState || e.defaultPage,
				fromParams: t.fromParams,
				isActive: void 0 !== t.isActive ? t.isActive : !0,
				data: null,
				autoSaveTask: null
			}), c = e.tabListObj.tabList.length - 1), this.trigger(c)
		},
		close: function(o) {
			for (var n = e.tabListObj.tabList, r = n.length, o = angular.isUndefined(o) ? e.tabListObj.activeIndex : o, i = n[o], s = i.id, c = null, l = null, u = [], d = 0; r > d; d++) l = n[d], l.id !== s && u.push(l);
			this.clearAutoSaveTask(o), e.tabListObj.tabList = u, e.tabListObj.tabList.length ? (c = 0 === o ? 0 : o - 1, this.trigger(c)) : (a.sessionStorage.setItem("tabListObj", JSON.stringify(e.tabListObj)), t.go(i.fromState.name, i.fromParams))
		},
		trigger: function(o) {
			o = angular.isUndefined(o) ? e.tabListObj.activeIndex : o;
			var n = e.tabListObj.tabList[o];
			e.tabListObj.activeIndex = o, e.tabListObj.defID = this.defID, a.sessionStorage.setItem("tabListObj", JSON.stringify(e.tabListObj)), this.clearAutoSaveTask(), t.go(n.toState.name, n.toParams, {
				reload: !0
			})
		},
		unTrigger: function(t, a) {
			var o = e.tabListObj.tabList,
				r = o.length,
				i = null,
				s = !1;
			if (r) {
				for (var c = 0; r > c && (i = o[c], i.toState.name !== t.name || !(s = n(i.toParams, a))); c++);
				s || (e.tabListObj.activeIndex = null)
			}
			this.clearAutoSaveTask()
		},
		clear: function() {
			this.clearAutoSaveTask(), a.sessionStorage.removeItem("tabListObj"), e.tabListObj = {
				tabList: [],
				activeIndex: 0,
				defID: 1
			}
		},
		autoSave: function(t, n) {
			if (angular.isObject(t) && angular.isObject(t.data)) {
				t && t.hasOwnProperty("period") && t.period > 0 || (t.period = 500);
				var r = e.tabListObj.activeIndex,
					i = e.tabListObj.tabList[r];
				i.autoSaveTask = setInterval(function() {
					i.data || (i.data = t.data), a.sessionStorage.setItem("tabListObj", JSON.stringify(e.tabListObj))
				}, t.period), o(function() {
					n && n(i.data)
				}, t.period + 100)
			}
		},
		clearAutoSaveTask: function(t) {
			var a = e.tabListObj.tabList,
				o = a.length,
				n = null;
			if (o) {
				if (!angular.isUndefined(t)) return clearInterval(a[t].autoSaveTask), void(a[t].autoSaveTask = null);
				for (var r = 0; o > r; r++) n = a[r], n.autoSaveTask && (clearInterval(n.autoSaveTask), n.autoSaveTask = null)
			}
		}
	}
}]).factory("HttpInter", ["$q", "$window", "zcGlobal", "StorageServ", "$rootScope", function(e, t, a, o, n) {
	return {
		request: function(e) {
			return e.headers = e.headers || {}, t.sessionStorage[a.TempID] && (e.headers[a.TempID] = t.sessionStorage[a.TempID]), e
		},
		response: function(t) {
			var a = t && t.hasOwnProperty("data") ? t.data : {};
			return a.hasOwnProperty("retCode") && "999998" == a.retCode && (o.clear(), n.$emit("userIntercepted", "notLogin", a)), t || e.when(t)
		}
	}
}]).factory("StorageServ", ["$window", "zcGlobal", function(e, t) {
	var a = {},
		o = function(e) {
			return angular.isUndefined(e) ? "zc" : "TempID" === e ? t.TempID : e
		};
	return e.sessionStorage && (a = {
		get: function(t) {
			return t = o(t), e.sessionStorage.getItem(t) ? JSON.parse(e.sessionStorage.getItem(t)) : null
		},
		set: function(t, a) {
			t = o(t), a = angular.isObject(a) || angular.isArray(a) ? JSON.stringify(a) : a, e.sessionStorage.setItem(t, JSON.stringify(a))
		},
		remove: function(t) {
			t = o(t), e.sessionStorage.removeItem(t)
		},
		clear: function() {
			e.sessionStorage.clear()
		}
	}), a
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
}]).factory("ValidateServ", ["$rootScope", "$q", "BaseServ", "DialogServ", function(e, t, a, o) {
	var n = {
			isGotValidateRules: !1,
			rules: {}
		},
		r = function() {
			var e = a.query({
				method: "GET",
				url: "scripts/json/ValidateRules.json"
			});
			return e
		},
		i = function() {
			if (n.isGotValidateRules) {
				var e = t.defer();
				return e.resolve(n), e.promise
			}
			return r().then(function(e) {
				e && (n.rules = e, n.isGotValidateRules = !0)
			})
		},
		s = {
			typeE: "blur",
			typeS: "alert",
			duration: 3,
			templateUrl: "views/public/strap-alert.html",
			animation: "am-fade-and-slide-top",
			trim: !0,
			failClassName: "zcValidate-fail",
			successClassName: "",
			attrs: ["maxlength"]
		},
		c = /^[\w-]+$/,
		l = /^R\d{4}$/,
		u = function(e) {
			var t, a, o, r, i, c = e.attr("zc-validate"),
				u = {},
				d = !1,
				p = n.rules;
			if (c && l.test(c)) {
				if (t = p[c], !angular.isObject(t)) return !1;
				a = t.rules, o = t.tips, r = t.config ? angular.extend(s, t.config) : s;
				for (var m in s.attrs) a[s.attrs[m]] && (d = !0, u[s.attrs[m]] = a[s.attrs[m]]);
				d && e.attr(u), i = {
					element: e,
					targetRules: a,
					targetTips: o,
					targetConfig: r
				}
			} else i = null;
			return i
		},
		d = function(e) {
			var t = u(e);
			if (t && angular.isObject(t.targetConfig)) {
				if (!t.targetConfig.typeE) return;
				e.on(t.targetConfig.typeE, function() {
					p(t)
				})
			}
		},
		p = function(e) {
			if (angular.isObject(e) && e.element && angular.isObject(e.targetRules) && angular.isObject(e.targetTips) && angular.isObject(e.targetConfig)) {
				var t, a = !0,
					n = null,
					r = e.element,
					i = e.targetRules,
					c = e.targetTips,
					l = e.targetConfig;
				for (var u in i) {
					var d, p = i[u];
					if (a && n) break;
					switch (l.trim && r.val(r.val().trim()), d = r.val(), u) {
						case "require":
							var m = function() {
								d.length > 0 ? (a = !1, n = null) : (a = !0, n = c[u] || "必填项")
							};
							angular.isString(p) ? "true" === p && m() : p && m();
							break;
						case "minlength":
							p && (d.length >= parseInt(p) ? (a = !1, n = null) : (a = !0, n = c[u] || "校验失败"));
							break;
						case "maxlength":
							p && (d.length <= parseInt(p) ? (a = !1, n = null) : (a = !0, n = c[u] || "校验失败"));
							break;
						case "reg":
							if (p)
								if (angular.isArray(p))
									for (var g = 0, f = p.length; f > g; g++) {
										if (!RegExp(p[g]).test(d)) {
											a = !0, n = c[u][g] || "校验失败";
											break
										}
										a = !1, n = null
									} else RegExp(p).test(d) ? (a = !1, n = null) : (a = !0, n = c[u] || "校验失败")
					}
				}
				if (a && n) {
					switch (l.typeS) {
						case "alert":
							o.alert({
								content: n,
								type: "danger",
								duration: s.duration,
								show: !0
							});
							break;
						case "inline":
							r.val(n);
							break;
						case "top":
						case "right":
						case "bottom":
						case "left":
							t = '<div class="zcValidate ' + s.failClassName + " zcValidate-" + l.typeS + '">' + n + "</div>", r.siblings("." + s.failClassName) && r.siblings("." + s.failClassName).remove(), r.before(t)
					}
					return r.addClass(s.failClassName), !1
				}
				return r.removeClass(s.failClassName), !0
			}
			return !1
		},
		m = function(e, t, a) {
			if (!c.test(e)) return !1;
			var o = $("#" + e),
				n = o.find("[zc-validate]"),
				r = n.length,
				i = !1;
			if (n && r)
				for (var s, l, d = 0; r > d && (s = $(n[d]), l = u(s), !l || (i = p(l), i)); d++);
			i && t && (a ? t(a) : t())
		};
	return n.init = i, n.bindValidate = d, e.formValidate = m, n
}]).factory("GetPageListServ", ["$rootScope", function(e) {
	return {
		init: function(e, t) {
			var a = [];
			if (7 >= t)
				for (var o = 0; t > o; o++) a.push(o + 1);
			else a = 4 >= e ? [1, 2, 3, 4, 5, "...", t] : 3 >= t - e ? [1, "...", t - 4, t - 3, t - 2, t - 1, t] : [1, "...", e - 1, e, e + 1, "...", t];
			return 0 === a.length && (a = [1]), a
		},
		prevPage: function() {},
		nextPage: function() {}
	}
}]).factory("GetEditorServ", ["$rootScope", function(e) {
	return {
		init: function(e) {
			e ? e : e = 0;
			var t = UE.getEditor("editor_" + e).getContent();
			return t
		}
	}
}]).factory("GetDateRangeServ", ["$rootScope", function(e) {
	return {
		init: function() {
			function e(e) {
				var t = e > 9 ? e : "0" + e;
				return t
			}
			var t = {},
				a = new Date,
				o = a.getFullYear(),
				n = a.getMonth() + 1,
				r = a.getDate(),
				i = o + e(n) + e(r),
				s = e(r) + "/" + e(n) + "/" + o;
			t.today = i, t.todayPlugs = s;
			var a = new Date;
			a.setDate(a.getDate() - 1);
			var o = a.getFullYear(),
				n = a.getMonth() + 1,
				r = a.getDate(),
				c = o + e(n) + e(r),
				l = e(r) + "/" + e(n) + "/" + o;
			t.yesterday = c, t.yesterdayPlugs = l;
			var a = new Date;
			a.setDate(a.getDate() - 7);
			var o = a.getFullYear(),
				n = a.getMonth() + 1,
				r = a.getDate(),
				u = o + e(n) + e(r);
			t.past7 = u;
			var a = new Date;
			a.setDate(a.getDate() - 30);
			var o = a.getFullYear(),
				n = a.getMonth() + 1,
				r = a.getDate(),
				d = o + e(n) + e(r);
			return t.past30 = d, t
		},
		format: function(e) {
			var t = e.substring(0, 4),
				a = e.substring(4, 6),
				o = e.substring(6),
				n = a + "/" + o + "/" + t;
			return n
		},
		commit: function(e) {
			var t = e.substring(6),
				a = e.substring(0, 2),
				o = e.substring(3, 5),
				n = t + a + o;
			return n
		}
	}
}]), angular.module("Sobot4.S").factory("ComponentsServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function(t, a) {
			var o = e.query({
				method: "GET",
				url: "scripts/json/ComponentsMenuBar.json"
			});
			return o
		},
		getList: function(t, a) {
			var o = e.query({
				method: "GET",
				url: "scripts/json/ComponentsList.json"
			});
			return o
		}
	}
}]), angular.module("Sobot4.S").factory("CreateWorkOrderServ", ["BaseServ", "WorkOrderCenterServ", function(e, t) {
	return {
		sendCreateInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/addServiceTicket",
				params: t
			});
			return a
		},
		queryDictDataList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryDictDataList",
				params: t
			});
			return a
		},
		queryServiceGroupList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryServiceGroupList",
				params: t
			});
			return a
		},
		queryServiceList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryServiceList",
				params: t
			});
			return a
		},
		addTicketReplyInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/addTicketReplyInfo",
				params: t
			});
			return a
		},
		queryTicketReplyList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketReplyList",
				params: t
			});
			return a
		},
		queryTicketReplyData: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketReplyData",
				params: t
			});
			return a
		},
		deleteTicketReply: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/deleteTicketReply",
				params: t
			});
			return a
		},
		queryTicketAllEventList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketAllEventList",
				params: t
			});
			return a
		},
		uploadFile: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/uploadFile",
				params: t
			});
			return a
		},
		deleteFile: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/deleteFile",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("FindPwdServ", ["BaseServ", function(e) {
	return {
		getCheckEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/getServicePwdCheckEMail",
				params: t
			});
			return a
		},
		getFindPwdFirst: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/getServicePwdNextStep1",
				params: t
			});
			return a
		},
		getSmsRandomCode: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/sendSmsRandomCode",
				params: t
			});
			return a
		},
		getCheckSmsRandomCode: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/checkSmsRandomCode",
				params: t
			});
			return a
		},
		getSetServiceNewPwd: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/setServiceNewPwd",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("HelpCenterServ", ["BaseServ", function(e) {
	return {
		helpLogin: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/customerLogin",
				params: t
			});
			return a
		},
		getCustomerPwdBack: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/getcustomerPwdBack",
				params: t
			});
			return a
		},
		UserCheckEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/customerLoginCheckEMail",
				params: t
			});
			return a
		},
		helpWorkList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryCustomerStartTicketListByCustomer",
				params: t
			});
			return a
		},
		queryTicketReplyByCustomerList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketReplyByCustomerList",
				params: t
			});
			return a
		},
		userWorkDetail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryCustomerTicketById",
				params: t
			});
			return a
		},
		addCustomerReplyInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/addCustomerReplyInfo",
				params: t
			});
			return a
		},
		DeleteFile: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/deleteFile",
				params: t
			});
			return a
		},
		getCustomerDataInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/getCustomerDataInfo",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("HomeServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function(t, a) {
			var o = e.query({
				method: "GET",
				url: "scripts/json/HomeMenuBar.json"
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
				Serv: !0,
				urlServ: "data/rptSessionStatsList",
				params: t
			});
			return a
		},
		getHomeSGCustomerData: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptStaffjobStatsList",
				params: t
			});
			return a
		},
		getHomeCustomerServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/getRptStaffjobStatsByStaffId",
				params: t
			});
			return a
		},
		getRptStaffjobStatsDetailByStaffId: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/getRptStaffjobStatsDetailByStaffId",
				params: t
			});
			return a
		},
		QueryTicketSummary: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketSummary",
				params: t
			});
			return a
		},
		QueryTicketByServiceList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByServiceList",
				params: t
			});
			return a
		},
		QueryTicketByGroupList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByGroupList",
				params: t
			});
			return a
		},
		QueryTicketByGroupInitList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByGroupInitList",
				params: t
			});
			return a
		},
		QueryTicketByInitList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByInitList",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("LoginServ", ["BaseServ", function(e) {
	return {
		login: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/serviceLogin",
				params: t,
				noToken: !0
			});
			return a
		},
		getUserInfo: function(t, a, o) {
			var n = e.query({
				method: "GET",
				params: t,
				Serv: !0,
				urlServ: "basic/getServiceDataInfo"
			});
			return n
		},
		logOut: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/serviceLogOut",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("MainServ", ["BaseServ", function(e) {
	return {
		getIssuesCategory: function(t, a) {
			var o = e.query({
				Serv: !0,
				method: "GET",
				urlServ: a ? a : "kb/queryGroupList",
				params: t
			});
			return o
		}
	}
}]), angular.module("Sobot4.S").factory("MsgServ", ["BaseServ", function(e) {
	return {
		sendMsg: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/emailActivePayAccount",
				params: t,
				noToken: !0
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("RegisterServ", ["BaseServ", function(e) {
	return {
		getRegisterSendSms: function(t) {
			var a = e.query({
				method: "GET",
				urlServ: "basic/registerSendSms",
				Serv: !0,
				params: t
			});
			return a
		},
		getRegisterEmailCheck: function(t) {
			var a = e.query({
				method: "GET",
				urlServ: "basic/registerEmailCheck",
				Serv: !0,
				params: t
			});
			return a
		},
		getRegisterDomainCheck: function(t) {
			var a = e.query({
				method: "GET",
				urlServ: "basic/registerDomainCheck",
				Serv: !0,
				params: t
			});
			return a
		},
		getRegisterInfoCheck: function(t) {
			var a = e.query({
				method: "GET",
				urlServ: "basic/registerInfoCheck",
				params: t,
				Serv: !0
			});
			return a
		},
		getRegComplete: function(t) {
			var a = e.query({
				method: "POST",
				urlServ: "basic/registerComplete",
				Serv: !0,
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("RepositoryServ", ["BaseServ", function(e) {
	return {
		ServUrl: "kb",
		getMenuBar: function() {
			var t = e.query({
				method: "GET",
				url: "scripts/json/RepositoryMenuBar.json"
			});
			return t
		},
		getIssuesCategory: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/queryGroupList",
				params: t
			});
			return a
		},
		removeGroup: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/removeGroup",
				params: t
			});
			return a
		},
		updateGroup: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateGroup",
				params: t
			});
			return a
		},
		saveGroup: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/saveGroup",
				params: t
			});
			return a
		},
		getIssuesListByCategory: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				url: "scripts/json/IssuesListByCategory" + t.parentID + ".json",
				urlServ: "kb/pagerDocList",
				params: t
			});
			return a
		},
		deleteDoc: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/deleteDoc",
				params: t
			});
			return a
		},
		updateDocStatus: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateDocStatus",
				params: t
			});
			return a
		},
		moveDoc: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/moveDoc",
				params: t
			});
			return a
		},
		getIssuesLearningTabs: function(t) {
			var a = e.query({
				method: "GET",
				url: "scripts/json/IssuesLearningTabs.json",
				params: t
			});
			return a
		},
		getPagerKnownDocList: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerKnownDocList",
				params: t
			});
			return a
		},
		getPagerDocKnownListByDocId: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerDocKnownListByDocId",
				params: t
			});
			return a
		},
		getPagerDocUnknownList: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerDocUnknownList",
				params: t
			});
			return a
		},
		updateDocUnKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateDocUnKnown",
				params: t
			});
			return a
		},
		deleteDocUnKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/deleteDocUnKnown",
				params: t
			});
			return a;
		},
		saveDoc: function(t) {
			var a = e.query({
				Serv: !0,
				method: "ZCPOST",
				urlServ: "kb/saveDoc",
				url: "kb-service/saveDoc/4",
				params: t
			});
			return a
		},
		updateDocUnKnownStatus: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateDocUnKnownStatus",
				params: t
			});
			return a
		},
		dolinkDocUnKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/dolinkDocUnKnown",
				params: t
			});
			return a
		},
		updateDocKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateDocKnown",
				params: t
			});
			return a
		},
		deleteDocKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/deleteDocKnown",
				params: t
			});
			return a
		},
		doPassDocKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/doPassDocKnown",
				params: t
			});
			return a
		},
		doKnownToUnKnown: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/doKnownToUnKnown",
				params: t
			});
			return a
		},
		getAddIssuesTabs: function(t) {
			var a = e.query({
				method: "GET",
				url: "scripts/json/AddIssuesTabs.json",
				params: t
			});
			return a
		},
		showDoc: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/showDoc",
				params: t
			});
			return a
		},
		pagerSimilarQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerSimilarQuestion",
				params: t
			});
			return a
		},
		updateQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateQuestion",
				params: t
			});
			return a
		},
		deleteQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/deleteQuestion",
				params: t
			});
			return a
		},
		moveSmailQuestions: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/moveSmailQuestions",
				params: t
			});
			return a
		},
		saveSimilarQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "ZCPOST",
				urlServ: "kb/saveSimilarQuestion",
				params: t
			});
			return a
		},
		pagerLinkQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerLinkQuestion",
				params: t
			});
			return a
		},
		updateLinkQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateLinkQuestion",
				params: t
			});
			return a
		},
		saveLinkQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/saveLinkQuestion",
				params: t
			});
			return a
		},
		deleteLinkQuestion: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/deleteLinkQuestion",
				params: t
			});
			return a
		},
		updateDoc: function(t) {
			var a = e.query({
				Serv: !0,
				method: "ZCPOST",
				urlServ: "kb/updateDoc",
				params: t
			});
			return a
		},
		getStatisticsData: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "data/rptRobotDocidHitStatsList",
				params: t
			});
			return a
		},
		getPagerDocListForRobot: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/pagerDocListForRobot",
				params: t
			});
			return a
		},
		exportDocListForRobot: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/exportDocListForRobot",
				params: t
			});
			return a
		},
		exportDocList: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "kb/exportDocList",
				params: t
			});
			return a
		},
		updateDocKnownStatus: function(t) {
			var a = e.query({
				Serv: !0,
				method: "POST",
				urlServ: "kb/updateDocKnownStatus",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("SettingsServ", ["BaseServ", function(e) {
	return {
		getQueryCusRobotConfig: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryCusRobotConfig",
				params: t
			});
			return a
		},
		getDefaultCusRobotConfigLog: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/defaultCusRobotConfigLog",
				params: t
			});
			return a
		},
		getSelectConfigInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectConfigInfo",
				params: t
			});
			return a
		},
		saveUpdateCusRobotConfigSet: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateCusRobotConfigSet",
				params: t
			});
			return a
		},
		saveUpdateRobotConfigReply: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateRobotConfigReply",
				params: t
			});
			return a
		},
		saveEditCusRobotConfig: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateRobotConfigReply",
				params: t
			});
			return a
		},
		saveUpdateConfigInfoForSet: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateConfigInfoForSet",
				params: t
			});
			return a
		},
		saveUpdateConfigInSettings: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateConfigInSettings",
				params: t
			});
			return a
		},
		initPayAccount: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/initPayAccount",
				params: t
			});
			return a
		},
		sendAddRechargerOrder: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/addRechargerOrder",
				params: t
			});
			return a
		},
		getCurrentCompanyPayInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/getCurrentCompanyPayInfo",
				params: t
			});
			return a
		},
		getSelectPlatformConfigInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectPlatformConfigInfo",
				params: t
			});
			return a
		},
		getToRongyun: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/toRongyun",
				params: t
			});
			return a
		},
		getToWeixin: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/toWeiXin",
				params: t
			});
			return a
		},
		getSelectCusCompanyInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectCusCompanyInfo",
				params: t
			});
			return a
		},
		saveUpdateCusCompanyInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateCusCompanyInfo",
				params: t
			});
			return a
		},
		getSelectCity: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectCity",
				params: t
			});
			return a
		},
		getSelectArea: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectArea",
				params: t
			});
			return a
		},
		getSelectCallLog: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectCallLog",
				params: t
			});
			return a
		},
		getSelectMenuInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectMenuInfo",
				params: t
			});
			return a
		},
		addInsertPlatformWeixin: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/insertPlatformWeixin",
				params: t
			});
			return a
		},
		deleteWeixinMenu: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/deleteWeixinMenu",
				params: t
			});
			return a
		},
		insertConfigForWeixin: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/insertConfigForWeixin",
				params: t
			});
			return a
		},
		updateMenuInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateMenuInfo",
				params: t
			});
			return a
		},
		selectMenuWordOrPicture: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/selectMenuWordOrPicture",
				params: t
			});
			return a
		},
		updateMenuInfoName: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateMenuInfoName",
				params: t
			});
			return a
		},
		updateMenuSort: function(t) {
			var a = e.query({
				method: "ZCPOST",
				Serv: !0,
				urlServ: "basic/updateMenuSort",
				params: t
			});
			return a
		},
		pushInfoToWeixin: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/pushInfoToWeixin",
				params: t
			});
			return a
		},
		insertPlatformConfigInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/insertPlatformConfigInfo",
				params: t
			});
			return a
		},
		saveUpdatePlatformConfig: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updatePlatformConfig",
				params: t
			});
			return a
		},
		selectCusReceiveGroupInfoIsExist: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/selectCusReceiveGroupInfoIsExist",
				params: t
			});
			return a
		},
		insertCusReceiveGroupInfo: function(t) {
			var a = e.query({
				method: "ZCPOST",
				Serv: !0,
				urlServ: "basic/insertCusReceiveGroupInfo",
				params: t
			});
			return a
		},
		getPayTransList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/getPayTransList",
				params: t
			});
			return a
		},
		getProductInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/getProductInfo",
				params: t
			});
			return a
		},
		shopOrder: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/shopOrder",
				params: t
			});
			return a
		},
		editCusRobotConfig: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/editCusRobotConfig",
				params: t
			});
			return a
		},
		getPayBillList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/getPayBillList",
				params: t
			});
			return a
		},
		getPayBillTemplate: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/getPayBillTemplate",
				params: t
			});
			return a
		},
		addBill: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/addBill",
				params: t
			});
			return a
		},
		deleteBillFromService: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "boss/deleteBillFromService",
				params: t
			});
			return a
		},
		getPayRenewInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "boss/getPayRenewInfo",
				params: t
			});
			return a
		}
	}
}]).factory("GetAccountListServ", ["SettingsServ", "WorkOrderCenterServ", "BaseServ", "GetPageListServ", function(e, t, a, o) {
	return {
		getList: function(t) {
			var a = e.getPayTransList(t).then(function(e) {
				if ("000000" == e.retCode) {
					var t = e.pageNo;
					if (e.pageCount) var a = e.pageCount;
					else var a = Math.ceil(e.totalCount / e.pageSize);
					return e.pageList = o.init(t, a), e
				}
				return e
			});
			return a
		},
		getInvoiceList: function(t) {
			var a = e.getPayBillList(t).then(function(e) {
				if ("000000" == e.retCode) {
					var t = e.pageNo;
					if (e.pageCount) var a = e.pageCount;
					else var a = Math.ceil(e.totalCount / e.pageSize);
					return e.pageList = o.init(t, a), e
				}
				return e
			});
			return a
		},
		getVoiceList: function(t) {
			var a = e.getSelectCallLog(t).then(function(e) {
				if ("000000" == e.retCode) {
					var t = e.pageNo;
					if (e.pageCount) var a = e.pageCount;
					else var a = Math.ceil(e.totalCount / e.pageSize);
					return e.pageList = o.init(t, a), e
				}
				return e
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("SidebarServ", ["BaseServ", function(e) {
	return {
		getSidebarInfo: function() {
			var t = e.query({
				method: "GET",
				url: "scripts/json/SidebarInfo.json"
			});
			return t
		}
	}
}]), angular.module("Sobot4.S").factory("StatisticsServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function() {
			var t = e.query({
				method: "GET",
				url: "scripts/json/StatisticsMenuBar.json"
			});
			return t
		},
		geTrptSessionStatsList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptSessionStatsList",
				params: t
			});
			return a
		},
		getStatisticeServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptVisitStatsList",
				params: t
			});
			return a
		},
		getMapUsers: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptVisitorAreaStatsList",
				params: t
			});
			return a
		},
		QueryOnlineGroupListByCompanyId: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/queryOnlineGroupListByCompanyId",
				params: t
			});
			return a
		},
		getRptStaffjobStatsList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptStaffjobStatsList",
				params: t
			});
			return a
		},
		getRptStaffjobStatsByStaffId: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/getRptStaffjobStatsByStaffId",
				params: t
			});
			return a
		},
		askrobotServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptRobotAnswerStatsList",
				params: t
			});
			return a
		},
		chatRecordtServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptHumanSatisfactionStatsList",
				params: t
			});
			return a
		},
		endchatRecordtServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptRobotSatisfactionStatsList",
				params: t
			});
			return a
		},
		workOrderServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptWorklistStatsList",
				params: t
			});
			return a
		},
		getQueryEvaluation: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/queryEvaluation",
				params: t
			});
			return a
		},
		cidsatisfactionServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/queryMsg",
				params: t
			});
			return a
		},
		infosatisfactionServiceContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/queryUserInfo",
				params: t
			});
			return a
		},
		QueryUserHistoryInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/queryUserHistoryInfo",
				params: t
			});
			return a
		},
		QueryConversation: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/queryConversation",
				params: t
			});
			return a
		},
		getStaffInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/getStaffInfo",
				params: t
			});
			return a
		},
		getRptVisitStatsListExport: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptVisitStatsListExport",
				params: t
			});
			return a
		},
		RptSatisfactionStatsExport: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/rptSatisfactionStatsExport",
				params: t
			});
			return a
		},
		CustomDateTime: function() {
			var t = e.query({
				method: "GET",
				url: "scripts/json/CustomDateTime.json"
			});
			return t
		},
		fileStatusQuery: function(t, a) {
			var o = e.query({
				method: "GET",
				params: a,
				Serv: !0,
				urlServ: t
			});
			return o
		},
		QueryFileStatus: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "data/getStatus",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("UserAndGroupServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function() {
			var t = e.query({
				method: "GET",
				url: "scripts/json/UserAndGroupMenuBar.json"
			});
			return t
		},
		getUserGroupContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryCustomerInfoList",
				params: t
			});
			return a
		},
		UpdateServiceStatus: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateServiceStatus",
				params: t
			});
			return a
		},
		getWorkCustomerContent: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryDiffRoleCusServiceInfoList",
				params: t
			});
			return a
		},
		getQueryGroupService: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryGroupService",
				params: t
			});
			return a
		},
		setCheckEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/checkMail",
				params: t
			});
			return a
		},
		setAddServiceInfoConfirm: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/addserviceInfoConfim",
				params: t
			});
			return a
		},
		getUserList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryAddGroupCusServiceInfo",
				params: t
			});
			return a
		},
		getQueryGroupCusServiceInfoConfirm: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/queryGroupCusServiceInfoConfirm",
				params: t
			});
			return a
		},
		getQueryGroupEditServiceInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryGroupEditServiceInfo",
				params: t
			});
			return a
		},
		UpdateGroupEditInfoConfirm: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateGroupEditInfoConfirm",
				params: t
			});
			return a
		},
		getUserDetail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryCusServiceInfo",
				params: t
			});
			return a
		},
		QueryCustomerInfoPidEmail: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryCustomerInfoId",
				params: t
			});
			return a
		},
		getQueryDictDataList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryDictDataList",
				params: t
			});
			return a
		},
		getUserWorkList: function(t) {
			var a = e.query({
				method: "GET",
				url: "scripts/json/UserWorkList.json",
				params: t
			});
			return a
		},
		getTriggerSilderActive: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryCusGroup",
				params: t
			});
			return a
		},
		DeleteGroupInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/deleteGroupInfo",
				params: t
			});
			return a
		},
		DeleteUserInGroup: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/deleteUserInGroup",
				params: t
			});
			return a
		},
		QueryTicketByServicerDealNum: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByServicerDealNum",
				params: t
			});
			return a
		},
		QueryTicketByServicerDealList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketByServicerDealList",
				params: t
			});
			return a
		},
		UpdateServiceInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateServiceInfo",
				params: t
			});
			return a
		},
		UpdateCustomerInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateCustomerInfo",
				params: t
			});
			return a
		},
		UpdateCusRole: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateCusRole",
				params: t
			});
			return a
		},
		QueryGroupListByGroupType: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "basic/queryGroupListByGroupType",
				params: t
			});
			return a
		},
		UpdateServiceGroupRelInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/updateServiceGroupRelInfo",
				params: t
			});
			return a
		},
		DeleteCusServiceInfo: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/deleteCusServiceInfo",
				params: t
			});
			return a
		},
		ResetPassword: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/resetPassword",
				params: t
			});
			return a
		},
		batchOperation: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/batchOperation",
				params: t
			});
			return a
		},
		UploadPicture: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/uploadPicture",
				params: t
			});
			return a
		},
		ExchangeServiceRole: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "basic/exchangeServiceRole",
				params: t
			});
			return a
		},
		QueryCustomerStartTicketNumByServicer: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryCustomerStartTicketNumByServicer",
				params: t
			});
			return a
		},
		QueryCustomerStartTicketListByServicer: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryCustomerStartTicketListByServicer",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("Uuid", function() {
	return function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
			var t = 16 * Math.random() | 0,
				a = "x" == e ? t : 3 & t | 8;
			return a.toString(16)
		})
	}
}), angular.module("Sobot4.S").factory("GetWorkOrderListServ", ["WorkOrderCenterServ", "BaseServ", "GetPageListServ", function(e, t, a) {
	return {
		getList: function(t) {
			var o = e.workOrderServiceContent(t).then(function(e) {
				if ("000000" == e.retCode) {
					var t = e.pageNo;
					if (e.pageCount) var o = e.pageCount;
					else var o = Math.ceil(e.totalCount / e.pageSize);
					return e.pageList = a.init(t, o), e
				}
				return e
			});
			return o
		},
		getSearchList: function(t) {
			var o = e.searchTicketList(t).then(function(e) {
				if ("000000" == e.retCode) {
					var t = e.pageNo;
					if (e.pageCount) var o = e.pageCount;
					else var o = Math.ceil(e.totalCount / e.pageSize);
					return e.pageList = a.init(t, o), e
				}
				return e
			});
			return o
		}
	}
}]).factory("WorkOrderCenterServ", ["BaseServ", function(e) {
	return {
		getMenuBar: function(t) {
			var a = t.url,
				o = e.query({
					method: "GET",
					url: a,
					Serv: !0,
					urlServ: "ws/queryTaskList",
					params: t
				});
			return o
		},
		getQueryTicketTotalNumList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
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
					Serv: !0,
					urlServ: "ws/queryTicketListByTaskId",
					params: t
				});
			return o
		},
		deleteWorkOrderContent: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/updateTicketStatus",
				params: t
			});
			return a
		},
		exportWorkOrder: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryExportTicketList",
				params: t
			});
			return a
		},
		updateBatchTicket: function(t) {
			var a = e.query({
				method: "POST",
				Serv: !0,
				urlServ: "ws/updateBatchTicket",
				params: t
			});
			return a
		},
		queryTicketById: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/queryTicketById",
				params: t
			});
			return a
		},
		querySimpleTicketInfo: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/querySimpleTicketInfo",
				params: t
			});
			return a
		},
		searchTicketList: function(t) {
			var a = e.query({
				method: "GET",
				Serv: !0,
				urlServ: "ws/searchTicketList",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("OpenAPIServ", ["BaseServ", function(e) {
	return {
		checkToken: function(t) {
			var a = e.query({
				Serv: !0,
				method: "GET",
				urlServ: "open/union/checkToken",
				params: t
			});
			return a
		}
	}
}]), angular.module("Sobot4.S").factory("dateUtil", function() {
	var e = {},
		t = 864e5,
		a = function(e, a) {
			console.log(e, a);
			var o = parseInt((a.getTime() - e.getTime()) / t, 10);
			return o >= 0 ? o + 1 : o - 1
		},
		o = function(e) {
			var t = e.split(" ");
			if (t.length < 0) throw "invalid date format";
			var a = r(t[0]);
			return t[1] && n(t[1], a), a
		},
		n = function(e, t) {
			var a = e.split(":");
			if (3 != a.length) throw "invalid date format";
			for (var o = [], n = 0; n < a.length; n++) o.push(+a[n]);
			t.setHours(o[0]), t.setMinutes(o[1]), t.setSeconds(o[2])
		},
		r = function(e) {
			var t = e.split("-");
			if (3 != t.length) throw "invalid date format";
			for (var a = [], o = 0, n = t.length; n > o; o++) {
				var r = +t[o];
				1 == o && r--, a.push(+r)
			}
			return new Date(a[0], a[1], a[2])
		};
	return e.daysDistance = a, e.parse = o, e
}), angular.module("Sobot4.S").factory("DownloadFileServ", ["$http", "DialogServ", "StatisticsServ", function(e, t, a) {
	return function(e, o) {
		var n, r, i, s, c = {},
			l = 12e4,
			u = function(e) {
				for (var t = e.substring(e.lastIndexOf("?") + 1), a = t.split("&"), o = {}, n = 0; n < a.length; n++) {
					var r = a[n].split("=");
					o[r[0]] = r[1]
				}
				return o
			},
			d = function() {
				e.$dia_cancel = function() {
					n && clearTimeout(n), i.hide()
				}, e.$retry = function() {
					0 == s.retCode && (r = new Date, m(s.item))
				}, e.$on("modal.hide", function() {
					n && clearTimeout(n)
				})
			},
			p = function(e) {
				return +e - +r > l
			},
			m = function(t) {
				a.QueryFileStatus({
					key: t
				}).then(function(a) {
					if (0 == a.retCode)
						if ("running" === a.item) {
							var o = new Date;
							p(o) ? (e.uploadFun.success = !1, e.uploadFun.text = "数据导出超时，请稍后重新尝试！", e.uploadFun.fileUrl = t, e.uploadFun.needRetry = !0, clearTimeout(n)) : (e.uploadFun.needRetry = !1, e.uploadFun.success = !0, e.uploadFun.text = "正在准备数据", n = setTimeout(function() {
								m(t)
							}, 2e3))
						} else "ok" === a.item && (e.uploadFun.success = !1, e.uploadFun.available = !0, e.uploadFun.text = "数据导出成功，请下载！", e.uploadFun.fileUrl = t, e.uploadFun.needRetry = !1)
				})
			},
			g = function(a) {
				s = a;
				var o = 0 == a.retCode ? "正在准备数据" : a.retMsg;
				e.uploadFun.available = !1, e.uploadFun.success = 0 == a.retCode, e.uploadFun.text = o, r = new Date, 0 == a.retCode ? m(a.item) : (e.uploadFun.needRetry = !1, e.uploadFun.text = a.retMsg, e.uploadFun.success = !1), i = t.modal({
					scope: e,
					templateUrl: "views/public/dialog-modal-load-file.html"
				}), i.$promise.then(i.show)
			},
			f = function() {
				d(), e.uploadFun || (e.uploadFun = {})
			};
		return f(), c.getQueryParam = u, c.show = g, c
	}
}]);