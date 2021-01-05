function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const doSideEffect = (sideEffect, action, currentState, store) => {
  const { effect } = sideEffect;
  if (isFunction(effect)) {
    const result = effect(action, currentState, store);
    if (result && result.type) {
      store.dispatch(result);
    }
    return;
  }
  if (effect && effect.length) {
    effect.map((doAction) => {
      if (isFunction(doAction)) {
        const result = doAction(action, currentState, store);
        if (result && result.type) {
          store.dispatch(result);
        }
        if (result && result.length) {
          result.forEach(a => store.dispatch(a));
        }
      }
      return action;
    });
  }
};

const createSideEffect = (listEffects) => (store) => next => (action) => {
  next(action);
  const currentState = store.getState();
  if (!action.type) {
    return;
  }
  action.payload = action.payload || {};
  if (listEffects && listEffects.length) {
    listEffects.forEach((s) => {
      const { filter: filterFn, type } = s;
      if (
        (isFunction(filterFn) && type)
        && filterFn(action, currentState)
        && action.type === type) {
        return doSideEffect(s, action, currentState, store);
      }
      if (type && action.type === type
        && !isFunction(filterFn)) {
        return doSideEffect(s, action, currentState, store);
      }
      if (isFunction(filterFn) && filterFn(action, currentState)
        && !type) {
        return doSideEffect(s, action, currentState, store);
      }
      return s;
    });
  }
};
const combineSideEffect = (...props) => {
  if (props && props.length) {
    return createSideEffect(Array.prototype.concat.apply([], props));
  }
  return null;
};

export {
  createSideEffect,
  combineSideEffect
};
