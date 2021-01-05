# semidux
Simple side effect middleware for Redux

Example:

`exampleEffect.js` 

````
import { createSideEffect } from 'semidux';
const exampleEffect = [
   {
      type: 'A',
      effect: () => {
        // Do something
        return ({
          type: 'B',
          payload: {
            b: 'Effect form A'
          }
        })
      }
  }
];
export default createSideEffect(exampleEffect);
````

`store.js`

```
import exampleEffect from './exampleEffect.js';

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      exampleEffect
    ),
  )
);
```

Done !,
It's working like a Redux middleware, just easier to declare effects in your react redux application.

And a more complicated example:

````
import { combineSideEffect } from 'semidux';
const exampleEpic1 = [
  {
    type: 'A',
    effect: () => {
      // Do something
      return ({
        type: 'B',
        payload: {
          b: 'Effect form A'
        }
      })
    }
  },
  {
    type: (action, currentState) => action.type === 'A' && action.payload.data === currentState.data.value,
    effect: () => {
      // Do something
      return ({
        type: 'C',
        payload: {
          c: 'Effect form A'
        }
      })
    }
  }
];
const exampleEpic2 = [
   {
      type: 'A',
      effect: (action, currentState) => {
        // Get data of action
        // Get data from currentState
        // Do something
        // return an action
        return ({
          type: 'B',
          payload: {
            a: 'Effect form A'
          }
        });
        // or return a function
         return () => ({
          type: 'B',
          payload: {
            a: 'Effect form A'
          }
        });
        // or return an array of actions/functions
        return [
          {
            type: 'B',
            payload: {
              b: 'Effect form A'
            }
          },
          {
            type: 'C',
            payload: {
              c: 'Another effect form A'
            }
          }
        ];
        // or return a Promise
        return Promise.resolve({
            type: 'D',
            payload: {
              d: 'Another effect form A'
            }
        });
        // or just do something without return value;
        console.log('This is an effect from A');
      }
  }
];
export default combineSideEffect(
  exampleEpic1,
  exampleEpic2,
);
````