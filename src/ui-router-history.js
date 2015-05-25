/* global angular */

(function () {
'use strict';

angular.module('ui-router-history', ['ui.router'])
.factory('$stateHistory', ['$rootScope', '$state', '$q', function ($rootScope, $state, $q) {
	
	var _history_ = [];
	var _isHistoryLocked_ = false;
	
	function setLastState (st) {
		_history_.unshift(st);
	}

	function hasNextLastState () {
		return angular.isObject(_nextLastState_);
	}

	function getLastState () {
		return _history_[0];
	}

	function lockHistory () {
		_isHistoryLocked_ = true;
	}

	function unlockHistory () {
		_isHistoryLocked_ = false;
	}

	function isHistoryLocked () {
		return _isHistoryLocked_;
	}

	$stateHistory.back = function () {
		if(!isHistoryLocked()) {
			lockHistory();
		}

		var lastState = getLastState();
		return $state.go(lastState.state.name, lastState.params).then(function () {
			_history_.splice(_history_.indexOf(lastState), 1);
			unlockHistory();
		});
	};

	$stateHistory.getHistory = function () {
		return _history_;
	}

	$stateHistory.clear = function () {
		_history_ = [];
	};
	
	return {
		setLastState:    setLastState,
		getLastState:    getLastState,
		lockHistory:     lockHistory,
		unlockHistory:   unlockHistory,
		isHistoryLocked: isHistoryLocked
	};
})
.run(['$rootScope', '$stateHistory', function ($rootScope, $stateHistory) {
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		if($stateHistory.isHistoryLocked()) {
			return $stateHistory.unlockHistory();
		}

		$stateHistory.setLastState({
			state: fromState,
			params: fromParams
		});
	});
}]);

})();
