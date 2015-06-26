angular.module('ui-router-history-test', [])
.config(function ($stateProvider) {
	$stateProvider
	.state('a', {
		url: '/a',
		template: 'My state one <div ui-view></div>',
	})
	.state('a.b', {
		url: '/b',
		template: 'My substate one'
	})
	.state('b', {
		url: '/c',
		template: 'My state two'
	})
});
describe('ui-router-history', function () {
	var $stateHistory, $compile, $rootScope, $state;

	beforeEach(module('ui-router-history'));
	beforeEach(module('ui-router-history-test'));
	beforeEach(inject(function (_$stateHistory_, _$compile_, _$rootScope_, _$state_) {
		$stateHistory = _$stateHistory_
		$compile = _$compile_
		$rootScope = _$rootScope_
		$state = _$state_
	}));

	describe('$stateHistoryProvider', function () {
		it('should store the start state', function () {
			$stateHistory.clear();

			var bodyEl;
			var scope = $rootScope.$new();

			bodyEl = $compile(angular.element('<body><div><div ui-view></div></div></body>'))(scope);

			$state.go('a');
			$rootScope.$digest()

			assert.equal('', $stateHistory.getLastState().state.name);

			$state.go('a.b');
			$rootScope.$digest()

			assert.equal('a', $stateHistory.getLastState().state.name)

			$state.go('b')
			$rootScope.$digest()
			
			assert.equal('a.b', $stateHistory.getLastState().state.name);

			$state.go('a.b')
			$rootScope.$digest()

			assert.equal('b', $stateHistory.getLastState().state.name)
		});

		it('should clear the history', function () {
			$stateHistory.clear();

			var bodyEl;
			var scope = $rootScope.$new();

			bodyEl = $compile(angular.element('<body><div><div ui-view></div></div></body>'))(scope);

			$state.go('a');
			$rootScope.$digest()

			assert.equal('', $stateHistory.getLastState().state.name);

			$state.go('a.b');
			$rootScope.$digest()

			assert.equal('a', $stateHistory.getLastState().state.name)

			$state.go('b')
			$rootScope.$digest()
			
			assert.equal('a.b', $stateHistory.getLastState().state.name);

			$state.go('a.b')
			$rootScope.$digest()

			assert.equal('b', $stateHistory.getLastState().state.name);

			$stateHistory.clear()

			assert.equal(0, $stateHistory.getHistory().length)
		})

		it('should back to the previous state', function () {
			$stateHistory.clear()

			$state.go('a.b');
			$rootScope.$digest()

			$state.go('b');
			$rootScope.$digest();

			$state.go('a');
			$rootScope.$digest()

			var history = $stateHistory.getHistory();

			assert.equal('a', $state.current.name);
			assert.equal('b', history[0].state.name);
			assert.equal('a.b', history[1].state.name);
			assert.equal('', history[2].state.name);

			$stateHistory.back();

			assert.ok($stateHistory.isHistoryLocked());

			$rootScope.$digest();

			assert.equal(false, $stateHistory.isHistoryLocked());

			assert.equal('b', $state.current.name)
			
			assert.equal(false, $stateHistory.isHistoryLocked());

			$stateHistory.back().then(function () {
				assert.equal(false, $stateHistory.isHistoryLocked());
			});

			assert.ok($stateHistory.isHistoryLocked());

			$rootScope.$digest();

			assert.equal(false, $stateHistory.isHistoryLocked());

			var currentSt = $state.current;

			$state.go('a');
			$rootScope.$digest();

			assert.equal(2, $stateHistory.getHistory().length);

			$state.go('b');
			$rootScope.$digest();
			
			assert.equal(3, $stateHistory.getHistory().length);

			$stateHistory.back();
			assert.ok($stateHistory.isHistoryLocked());
			$rootScope.$digest();

			assert.equal(false, $stateHistory.isHistoryLocked());
			
			assert.equal(2, $stateHistory.getHistory().length);
			assert.equal('a', $state.current.name);

			$stateHistory.back();
			$rootScope.$digest();

			assert.equal(currentSt.name, $state.current.name);
		});

		it('should retrieve a state', function () {
			$stateHistory.clear();

			assert.equal(undefined, $stateHistory.getItem('a.b'));

			$state.go('a.b');
			$rootScope.$digest()

			$state.go('b');
			$rootScope.$digest();

			assert.ok($stateHistory.getItem('a.b'));

			$state.go('a');
			$rootScope.$digest()
		});

		it('should delete an item by state name', function () {
			$stateHistory.clear();

			assert.equal(undefined, $stateHistory.getItem('a.b'));

			$state.go('a.b');
			$rootScope.$digest()

			$state.go('b');
			$rootScope.$digest();

			assert.ok($stateHistory.getItem('a.b'));
			assert.ok($stateHistory.removeItem('a.b'));

			assert.throws(function () {
				assert.ok($stateHistory.removeItem('a.b'));
			});

			$state.go('a');
			$rootScope.$digest()
		});

		it('should delete last state in history', function () {
			$stateHistory.clear();

			$state.go('a.b');
			$rootScope.$digest()

			$state.go('b');
			$rootScope.$digest();

			$state.go('a');
			$rootScope.$digest()

			var history = $stateHistory.getHistory();

			assert.equal('a', $state.current.name);
			assert.equal('b', history[0].state.name);
			assert.equal('a.b', history[1].state.name);
			assert.equal('', history[2].state.name);

			assert.equal('b', $stateHistory.getLastState().state.name);

			assert.ok($stateHistory.removeLastItem());
			$rootScope.$digest();

			assert.equal('a.b', $stateHistory.getLastState().state.name);
		});
	});
});