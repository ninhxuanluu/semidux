import configureStore from 'redux-mock-store';
import chai from 'chai';
import { createSideEffect, combineSideEffect } from './semidux';

const expect = chai.expect;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Semidux test', () => {
  describe('Do nothing with invalid action(not include type and payload)', () => {
    it('No payload', (done) => {
      const expectedActions = [
        {
          type: 'INIT',
        }
      ];

      const testEffect = [
        {
          type: 'INIT',
          effect: () => (expectedActions[1])
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);
      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal(expectedActions);
        done();
      });
    });
  });
  describe('Work with type', () => {
    it('create B when A', (done) => {
      const expectedActions = [
        {
          type: 'A',
          payload: {
            a: 'a'
          }
        },
        {
          type: 'B',
          payload: {
            a: 'Effect form A'
          }
        }
      ];

      const testEffect = [
        {
          type: 'A',
          effect: () => (expectedActions[1])
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);
      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal(expectedActions);
        done();
      });
    });
  });
  describe('Work with filter', () => {
    it('create B when A', (done) => {
      const expectedActions = [
        {
          type: 'work with filter',
          payload: {}
        },
        {
          type: 'B',
          payload: {}
        }
      ];

      const testEffect = [
        {
          filter: action => (action.type === 'work with filter'),
          effect: () => expectedActions[1]
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);

      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal(expectedActions);
        done();
      });
    });
  });
  describe('Work with filter and type', () => {
    it('create B when A', (done) => {
      const expectedActions = [
        {
          type: 'work with type',
          payload: {
            filter: 'work with filter',
          }
        },
        {
          type: 'B',
          payload: {}
        }
      ];

      const testEffect = [
        {
          type: 'work with type',
          filter: action => (action.payload.filter === 'work with filter'),
          effect: () => expectedActions[1]
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);

      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal(expectedActions);
        done();
      });
    });
    it('Don\'t create B when A incorrect type', (done) => {
      const expectedActions = [
        {
          type: 'work with type wrong',
          payload: {
            filter: 'work with filter',
          }
        },
        {
          type: 'B',
          payload: {}
        }
      ];

      const testEffect = [
        {
          type: 'work with type',
          filter: action => (action.payload.filter === 'work with filter'),
          effect: () => expectedActions[1]
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);

      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal([expectedActions[0]]);
        done();
      });
    });
    it('Don\'t create B when A incorrect filter', (done) => {
      const expectedActions = [
        {
          type: 'work with type',
          payload: {
            filter: 'work with filter wrong',
          }
        },
        {
          type: 'B',
          payload: {}
        }
      ];

      const testEffect = [
        {
          type: 'work with type',
          filter: action => (action.payload.filter === 'work with filter'),
          effect: () => expectedActions[1]
        }
      ];
      const mockStore = configureStore([createSideEffect(testEffect)]);

      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal([expectedActions[0]]);
        done();
      });
    });
  });

  describe('Work with combineSideEffect', () => {
    it('create B, C when A', (done) => {
      const expectedActions = [
        {
          type: 'work with combineSideEffect',
          payload: {}
        },
        {
          type: 'B',
          payload: {}
        },
        {
          type: 'C',
          payload: {}
        }
      ];

      const testEffect1 = [
        {
          filter: action => (action.type === 'work with combineSideEffect'),
          effect: () => expectedActions[1]
        }
      ];
      const testEffect2 = [
        {
          filter: action => (action.type === 'work with combineSideEffect'),
          effect: () => expectedActions[2]
        }
      ];
      const mockStore = configureStore([combineSideEffect(testEffect1, testEffect2)]);

      const store = mockStore({});
      store.dispatch(expectedActions[0]);
      delay(1).then(() => {
        const realActions = store.getActions();
        expect(realActions).to.deep.equal(expectedActions);
        done();
      });
    });
  });
});
