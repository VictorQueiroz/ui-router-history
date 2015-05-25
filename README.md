# ui-router-history

### Installation
```
bower install --save ui-router-history
```

### Usage
```js
angular.module('app', ['ui-router-history','ui.router'])
.controller('AppCtrl', function ($stateHistory, $scope) {
	$scope.myHistory = [];
	$scope.clearHistory = function () {
		$stateHistory.clear();
	};
	$scope.comeBack = function () {
		$stateHistory.back();
	};
	$scope.getMyHistory = function () {
		$scope.myHistory = $stateHistory.getHistory();
	};
})
```