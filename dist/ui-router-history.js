!function(){"use strict";var t=angular.forEach;angular.isObject;angular.module("ui-router-history",["ui.router"]).factory("$stateHistory",["$rootScope","$state","$q",function(e,n,r){function a(t){return s.indexOf(t)}var s=[],o=!1,i={setLastState:function(t){s.unshift(t)},getLastState:function(){return s.length>0?s[0]:!1},hasLastState:function(){var t=this.getLastState();return t&&t.state&&""===t.state.name&&(this.clear(),t=this.getLastState()),t&&t.state&&""!==t.state.name},lockHistory:function(){o=!0},unlockHistory:function(){o=!1},isHistoryLocked:function(){return o},getItem:function(e){var n;return t(s,function(t){t.state.name===e&&(n=t)}),n},removeItem:function(t){var e=this.getItem(t);if(!e)return!1;var n=a(e);return s.splice(n,1),!0},removeLastItem:function(){var t=this.getLastState();return this.removeItem(t.state.name)},back:function(t,e){var r=this;this.isHistoryLocked()||this.lockHistory();var a=this.getLastState();return a?n.go(a.state.name,a.params).then(function(){s.splice(s.indexOf(a),1),r.unlockHistory()}):t?n.go(t,e).then(function(){s.splice(s.indexOf(a),1),r.unlockHistory()}):void 0},clear:function(){s=[]},getHistory:function(){return s}};return i}]).run(["$rootScope","$stateHistory",function(t,e){t.$on("$stateChangeSuccess",function(t,n,r,a,s){return e.isHistoryLocked()?e.unlockHistory():void(a["abstract"]||e.setLastState({state:a,params:s}))})}])}();