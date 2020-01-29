const INITIAL_STATE = {
  user: null,
  friends: null,
  friendReqs: null,
  people: {},
  // route flattened for easy updating
  name: null,
  creator: null,
  city: null,
  pins: null,
  tags: null,
  _id: null,
  collaborators: null,
  collaboratorsSet: null,
  // for selecting & editing place
  selected: null,
  selectedBuf: null, // buffer to save intermediate changes
  refresh: false
};

const peopleReducer = (accumulator, cur) => {
  accumulator[cur._id] = cur.status;
  return accumulator;
}

const routeReducer = (state = INITIAL_STATE, action) => {
  let updatedPins;
  let newPeople;
  let collaborators;
  let collaboratorsSet;

  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        people: {[action.payload.user._id]: 'SELF'}
      };
    case 'SET_FRIENDS':
      newPeople = {...state.people};

      return {
        ...state,
        friends: action.payload.friends,
        people: action.payload.friends
          .map(elem => ({...elem, status: 'ADDED'}))
          .reduce(peopleReducer, newPeople)
      };
    case 'SET_FRIEND_REQS':
      newPeople = {...state.people};

      action.payload.reqs.received
        .map(elem => ({...elem, status: 'RECEIVED'}))
        .reduce(peopleReducer, newPeople);

      action.payload.reqs.sent
        .map(elem => ({...elem, status: 'SENT'}))
        .reduce(peopleReducer, newPeople);

      return {
        ...state,
        friendReqs: action.payload.reqs,
        people: newPeople
      };
    case 'LOAD_ROUTE':
      return {
        ...state,
        ...action.payload.route,
        collaboratorsSet: new Set(action.payload.route.collaborators.map(elem => elem._id))
      };
    case 'ADD_PIN':
      return {
        ...state,
        pins: state.pins ? [...state.pins, action.payload.pin] : [action.payload.pin]
      };
    case 'REMOVE_PIN':
      return {
        ...state,
        pins: state.pins.filter((pin, index) => index != action.payload.indexToRemove)
      };
    case 'UPDATE_PIN':
      updatedPin = {...state.pins[action.payload.index]};

      // update with given data
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data
      };

      updatedPins = [...state.pins];
      updatedPins[action.payload.index] = updatedPin;

      return {
        ...state,
        pins: updatedPins 
      };
    case 'SWAP_PINS':
      updatedPins = [...state.pins];
      
      let updated;
      let swapTo;
      for (let i of [0, 1]) {
        updated = {...action.payload.pins[i]};
        swapTo = (i + 1) % 2;
        updatedPins[action.payload.indices[swapTo]] = updated;
      }

      return {
        ...state,
        pins: updatedPins
      };
    case 'EDIT_ROUTE_NAME':
      return {
        ...state,
        name: action.payload.name
      };
    case 'ADD_COLLABORATOR':
      collaborators = [...state.collaborators];
      collaboratorsSet = new Set(state.collaborators);

      collaborators.push(action.payload.collaborator);
      collaboratorsSet.add(action.payload.collaborator._id);

      return {
        ...state,
        collaborators: collaborators,
        collaboratorsSet: collaboratorsSet
      };
    case 'REMOVE_COLLABORATOR':
      collaborators = state.collaborators.filter(elem => elem._id != action.payload.id);
      collaboratorsSet = new Set(collaborators);

      return {
        ...state,
        collaborators: collaborators,
        collaboratorsSet: collaboratorsSet
      };
    case 'VIEW_PLACE_DETAIL':
      let selectedBuf = {...state.pins[action.payload.selectedIndex]};
      selectedBuf.properties = {...selectedBuf.properties};
      selectedBuf.properties.photoRefs = [...selectedBuf.properties.photoRefs];

      return {
        ...state,
        selected: action.payload.selectedIndex,
        selectedBuf: selectedBuf
      };
    case 'UPDATE_SELECTED':
      updatedPin = {...state.selectedBuf};

      // update with given data
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data
      };

      return {
        ...state,
        selectedBuf: updatedPin  
      };
    case 'COMMIT_PIN':
      updatedPins = [...state.pins];
      updatedPins[state.selected] = state.selectedBuf;

      return {
        ...state,
        pins: updatedPins
      };
    case 'CLEAR':
      return {
        ...state,
        selected: null,
        name: null,
        creator: null,
        city: null,
        pins: null,
        tags: null,
        _id: null,
        collaborators: null,
        collaboratorsSet: null
      };
    case 'TOGGLE_REFRESH':
      return {
        ...state,
        refresh: !state.refresh
      };
    default:
      return state;
  }
}

export default routeReducer;
