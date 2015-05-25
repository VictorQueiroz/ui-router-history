var _history_ = [];

function $StateHistoryProvider () {
	this.$get = $StateHistoryFactory;

	function $StateHistoryFactory ($rootScope, $state, $q) {
		var $stateHistory = {};

		function setLastState (st) {
			_history_.unshift(st);
		}

		function hasNextLastState () {
			return angular.isObject(_nextLastState_);
		}

		function getLastState () {
			return _history_[0];
		}

		var _isHistoryLocked_ = false;
		function lockHistory () {
			_isHistoryLocked_ = true;
		}

		function unlockHistory () {
			_isHistoryLocked_ = false;
		}

		function isHistoryLocked () {
			return _isHistoryLocked_;
		}

		$stateHistory.isHistoryLocked = isHistoryLocked;

		$stateHistory.back = function () {
			if(!isHistoryLocked()) {
				lockHistory();
			}

			var lastState = $stateHistory.getLastState();
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

		$stateHistory.lockHistory = lockHistory;
		$stateHistory.unlockHistory = unlockHistory;
		$stateHistory.getLastState = getLastState;
		$stateHistory.setLastState = setLastState;

		return $stateHistory;
	}
}

angular.module('ui-router-history', ['ui.router'])
.provider('$stateHistory', $StateHistoryProvider)
.run(function ($rootScope, $stateHistory) {
	$rootScope.$on('$stateChangeStart', function () {
		$stateHistory.transitionState = true;
	});
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		$stateHistory.transitionState = false;

		if($stateHistory.isHistoryLocked()) {
			return $stateHistory.unlockHistory();
		}

		$stateHistory.setLastState({
			state: fromState,
			params: fromParams
		});
	});
});