import React, { Component } from 'react';	
import {	
  View,	
  StyleSheet,	
  Text,	
  TextInput,	
  TouchableOpacity,	
  Animated,	
  ScrollView,	
  Dimensions,	
  Image,	
  TouchableWithoutFeedback,	
  Platform,	
  StatusBar,	
  PixelRatio,	
  BackHandler,	
  FlatList,
  SafeAreaView	
} from 'react-native';	
import MapView, { Marker } from 'react-native-maps';	
import { Header } from 'react-navigation-stack';	
import Icon from 'react-native-vector-icons/MaterialIcons';	
import { connect } from 'react-redux';	
import * as firebase from 'firebase';	
// import resolveAssetSource from 'resolveAssetSource';	
import OptionsMenu from 'react-native-options-menu';	
import { Linking } from 'expo';	
import uuidv4 from 'uuid/v4';	

import Button from '../components/Buttons.js';	
import { GREY, DARKER_GREY, PRIMARY, ACCENT, WARM_BLACK } from '../config/styles.js';	
import {	
  MAPS_API_KEY,	
  TEST_SERVER_ADDR,	
  PLACEHOLDER_IMG,	
  PLACES_AUTOCOMPLETE_URL	
} from '../config/settings.js';	

 // dimensions of the screen	
const {width, height} = Dimensions.get('window');	

const CARD_HEIGHT = height / 4;	
const CARD_WIDTH = Math.floor(width / 1.5);	

const FOCUSED_CARD_HEIGHT = CARD_HEIGHT * 1.4;	
const FOCUSED_CARD_WIDTH = width * 0.9;	
const FOCUSED_IMG_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(FOCUSED_CARD_HEIGHT);	
const FOCUSED_IMG_WIDTH = PixelRatio.getPixelSizeForLayoutSize(FOCUSED_CARD_WIDTH);	

const OFFSET_DIV = CARD_WIDTH * (5/4);	

const IMG_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(CARD_HEIGHT);	
const IMG_WIDTH = PixelRatio.getPixelSizeForLayoutSize(CARD_WIDTH);	

const DRAWER_OPEN = Platform.OS === 'ios' ? height - (Header.HEIGHT) - (CARD_HEIGHT + 80) : height - (Header.HEIGHT + StatusBar.currentHeight) - (CARD_HEIGHT + 35) + 45 + StatusBar.currentHeight;	
const DRAWER_CLOSED = Platform.OS === 'ios' ? height - Header.HEIGHT - 80 : height - Header.HEIGHT - 35 + 45 + StatusBar.currentHeight;	
const DRAWER_EXPANDED = 0;	

const pinImage =  require('../assets/pin.png');	

const PIN_WIDTH = 92; //resolveAssetSource(pin).width;	
const PIN_HEIGHT = 110; //resolveAssetSource(pin).width;	
const PIXEL_RATIO = PixelRatio.get();	

const METERS_TO_MILES = 1609.34;	
const SECONDS_TO_MINUTES = 60;	

const mapStyles = StyleSheet.create({	
  container: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,	
    flex: 1	
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    zIndex: 5,
    width: '100%',
    height: 45
  },
  searchBoxContainer: {	
    backgroundColor: 'rgba(255, 255, 255, 0.9)',	
    flexDirection: 'row',	
    height: 46,	
    borderRadius: 20,	
    width: '90%',	
    top: 55,	
    marginHorizontal: '5%',	
    position: 'absolute',	
    alignItems: 'center',	
  },	
  searchBox: {	
    backgroundColor: 'transparent',	
    height: 46,	
    paddingHorizontal: 10,	
    width: '90%',	
    color: 'grey'	
  },	
  animated: {	
    position: 'absolute',	
    bottom: 0,	
    left: 0,	
    right: 0,	
    justifyContent: 'flex-end',	
    alignItems: 'center'	
  },	
  drawer: {	
    alignItems: 'center',	
    justifyContent: 'flex-start',	
    paddingTop: 10,	
    backgroundColor: 'rgba(255, 255, 255, 0.9)'	
  },	
  endPadding: {	
    flexGrow: 1	
  },	
  focusedCard: {	
    backgroundColor: 'white',	
    marginHorizontal: 10,	
    marginBottom: 5,	
    height: FOCUSED_CARD_HEIGHT,	
    width: '90%',	
    overflow: 'hidden',	
    borderRadius: 10,	
    marginBottom: 7	
  },	
  cardButtonBar: {	
    flexDirection: 'row',	
    justifyContent: 'flex-end',	
    marginTop: 10,	
    padding: 10	
  },	
  card: {	
    backgroundColor: 'white',	
    marginHorizontal: 10,	
    marginBottom: 5,	
    height: CARD_HEIGHT,	
    width: CARD_WIDTH,	
    overflow: 'hidden',	
    borderRadius: 10,	
    elevation: 0.2	
  },	
  cardImage: {	
    flex: 3,	
    width: '100%',	
    height: '100%',	
    alignSelf: 'center'	
  },	
  textContent: {	
    paddingLeft: 10,	
    paddingRight: 10,	
    paddingBottom: 5,	
    flex: 1,	
  },	
  cardtitle: {	
    fontSize: 12,	
    marginTop: 5,	
    fontWeight: 'bold'	
  },	
  cardDescription: {	
    fontSize: 12,	
    color: '#444'	
  },	
  cardNumber: {	
    position: 'absolute',	
    top: 10,	
    left: 10,	
    width: 25,	
    height: 25,	
    borderRadius: 25 / 2,	
    backgroundColor: WARM_BLACK,	
    justifyContent: 'center',	
    alignItems: 'center'	
  },	
  filler: {	
    backgroundColor: 'transparent',	
    marginBottom: 5,	
    height: CARD_HEIGHT,	
    width: CARD_WIDTH / 4 - 10,	
    overflow: 'hidden'	
  },	
  actionCardContent: {	
    paddingLeft: 10,	
    paddingRight: 10,	
    paddingBottom: 5,	
    paddingTop: 50,	
    flex: 1,	
    justifyContent: 'flex-start',	
    alignItems: 'center'	
  },	
  drawerButton: {	
    width: 50,	
    height: 15,	
    backgroundColor: '#e3e3e3',	
    borderRadius: 15,	
    marginBottom: 10	
  },	
  infoContainer: {	
    flex: 2.4,	
    width: width,	
    paddingHorizontal: 15	
  },	
  nameBox: {	
    // borderWidth: 1,	
    // borderColor: GREY,	
    height: 46,	
    paddingHorizontal: 10,	
    width: '90%',	
    borderRadius: 20,	
    elevation: 0.5,	
    backgroundColor: 'white'	
  },	
  name: {	
    alignSelf: 'flex-start',	
    fontSize: 32	
  },	
  sectionHeader: {	
    fontSize: 20,	
    marginBottom: 10,	
    marginTop: 15,	
    color: DARKER_GREY,	
    textAlignVertical: 'center'	
  },	
  pin: {	
    position: 'absolute',	
    width: Math.floor(PIN_WIDTH / PIXEL_RATIO),	
    height: Math.floor(PIN_HEIGHT / PIXEL_RATIO),	
    justifyContent: 'center',	
    alignItems: 'center',	
  },	
  profilePic: {	
    width: 50,	
    height: 50,	
    borderRadius: 50 / 2,	
    borderColor: ACCENT	,
    marginRight: 7,
  },	
  profilePicOwner: {	
    width: 50,	
    height: 50,	
    borderRadius: 50 / 2,	
    borderColor: ACCENT,	
    borderWidth: 2,
    marginRight: 7
  }	
});	

const searchStyles = StyleSheet.create({	
  container: {	
    flex: 1,	
    alignItems: 'center'	
  },	
  textBoxContainer: {	
    flexDirection: 'row',	
    alignItems: 'center',	
    width: '100%',	
    paddingHorizontal: '2.5%',	
    paddingTop: 10	
  },	
  textBox: {	
    height: 46,	
    width: '90%',	
    paddingLeft: 10,	
  },	
  list: {	
    height: '50%',	
    width: '100%',	
    borderTopWidth: 5,	
    borderColor: GREY,	
    paddingHorizontal: '2.5%',	
  },	
  autoCompleteItem: {	
    borderColor: GREY,	
    borderBottomWidth: 1,	
    paddingHorizontal: 10,	
    paddingVertical: 15	
  },	
  mainText: {	
    fontSize: 16,	
  },	
  secondaryText: {	
    fontSize: 12,	
    color: 'grey'	
  }	
});	

class MapSearch extends Component {	
  state = {	
    textInput: this.props.searchInput,	
    results: null	
  };	

  componentDidMount() {	
    // session token to group queries	
    this.sessionToken = uuidv4();	
    // renew token every 3 minutes	
    this.renewToken = setInterval(() => this.sessionToken = uuidv4(), 1000 * 180);	

    fetch(`${PLACES_AUTOCOMPLETE_URL}?input=${this.state.textInput}&key=${MAPS_API_KEY}&location=${this.props.location.coordinates[0]},${this.props.location.coordinates[1]}&radius=10000&sessiontoken=${this.sessionToken}`)	
      .then(response => response.json())	
      .then(responseJson => this.setState({results: responseJson.predictions}));	
  }	

  componentWillUnmount() {	
    clearInterval(this.renewToken);	
  }	

  onChangeText = text => {	
    this.setState({textInput: text}, () => 	
      fetch(`${PLACES_AUTOCOMPLETE_URL}?input=${this.state.textInput}&key=${MAPS_API_KEY}&location=${this.props.location.coordinates[0]},${this.props.location.coordinates[1]}&radius=10000&sessiontoken=${this.sessionToken}`)	
        .then(response => response.json())	
        .then(responseJson => this.setState({results: responseJson.predictions}))	
    );	
  }	

  render() {	
    return (	
      <View style={searchStyles.container}>	
        <View style={searchStyles.textBoxContainer}>	
          <TextInput	
            autoFocus	
            style={searchStyles.textBox}	
            placeholder='Search'	
            value={this.state.textInput}	
            onChangeText={this.onChangeText}	
          />	
          <TouchableOpacity onPress={() => this.setState({textInput: ''})}>	
            <Icon name='clear' size={30} />	
          </TouchableOpacity>	
        </View>	
        <View style={searchStyles.list}>	
          <FlatList	
            data={this.state.results}	
            renderItem={({ item }) => <SearchItem	
              item={item}	
              // navigation passed in to pop from search page	
              onPress={() => this.props.onPressItem(item, this.props.navigation, this.sessionToken)}	
            />}	
            keyExtractor={item => item.place_id}	
          />	
        </View>	
        <Text>{`${this.props.location.coordinates[0]},${this.props.location.coordinates[1]}`}</Text>	
      </View>	
    );	
  }	
}	

function SearchItem(props) {	
  return (	
    <TouchableOpacity onPress={props.onPress}>	
      <View style={searchStyles.autoCompleteItem}>	
        <Text style={searchStyles.mainText}>{props.item.structured_formatting.main_text}</Text>	
        <Text style={searchStyles.secondaryText}>{props.item.structured_formatting.secondary_text}</Text>	
      </View>	
    </TouchableOpacity>	
  );	
}	

function Card(props) {	
  const source = props.pin.properties.photoRefs ?	
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.pin.properties.photoRefs[0]}&maxheight=${IMG_HEIGHT}&maxWidth=${IMG_WIDTH}`} :	
    {uri: PLACEHOLDER_IMG};	

  return (	
    <TouchableWithoutFeedback onPress={props.onPress}>	
      <View style={mapStyles.card}>	
        <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />	
        {props.showOptions ? <View style={{position: 'absolute', top: 5, right: 5}}>	
          <OptionsMenu	
            customButton={<Icon name='more-vert' size={30} color={WARM_BLACK} />}	
            options={props.options}	
            actions={props.actions}	
          />	
        </View> : null}	
        {/* Number label */}	
        <View style={mapStyles.cardNumber}>	
          <Text style={{color: 'white'}}>{props.index + 1}</Text>	
        </View>	
        <View style={mapStyles.textContent}>	
          <Text numberOfLines={1} style={mapStyles.cardtitle}>	
            {props.pin.properties.mainText}	
          </Text>	
          <Text numberOfLines={1} style={mapStyles.cardDescription}>	
            {props.pin.properties.secondaryText}	
          </Text>	
        </View>
      </View>	
    </TouchableWithoutFeedback>	
  );	
}	

function FocusedCard(props) {	
  const source = props.pin.properties.photoRefs ?	
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.pin.properties.photoRefs[0]}&maxheight=${FOCUSED_IMG_HEIGHT}&maxWidth=${FOCUSED_IMG_WIDTH}`} :	
    require('../assets/placeholder.jpg');

  return (	
    <View style={mapStyles.focusedCard}>	
      <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />	
      <View style={mapStyles.textContent}>	
        <Text numberOfLines={1} style={mapStyles.cardtitle}>	
          {props.pin.properties.mainText}	
        </Text>	
        <Text numberOfLines={1} style={mapStyles.cardDescription}>	
          {props.pin.properties.secondaryText}	
        </Text>	
      </View>	
      <View style={mapStyles.cardButtonBar}>	
        <Button title={'Add'} onPress={props.onAdd} />	
      </View>	
      <TouchableOpacity onPress={props.onClear} style={{position: 'absolute', top: 5, left: 5, backgroundColor: GREY, borderRadius: 20/2, zIndex: 10}}>
          <Icon name='clear' size={20} />
      </TouchableOpacity>	
    </View>	
  );	
}	

function ActionCard(props) {	
  let content;	
  let mins = Math.floor(props.duration / 60);	
  let hours = Math.floor(mins / SECONDS_TO_MINUTES);	
  mins = mins % 60;	
  let timeString;	
  if (hours == 0) {	
    timeString = `${mins} mins`;	
  } else if (hours == 1) {	
    timeString = `${hours} hour ${mins} mins`;	
  } else {	
    timeString = `${hours} hours ${mins} mins`;	
  }	
  let miles = (props.distance / METERS_TO_MILES).toFixed(2);	

   content = [	
    <Text style={{color: DARKER_GREY}} key='num_pins'>	
      {props.pins.length + (props.pins.length == 0 ? ' pin' : ' pins')}	
    </Text>,	
    // <Text style={{color: DARKER_GREY}} key='distance'>	
    //   {`${miles} mi`}	
    // </Text>,	
    // <Text style={{color: DARKER_GREY}} key='time'>	
    //   {`${timeString}`}	
    // </Text>,	
    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}} key='buttons'>	
      <TouchableOpacity onPress={props.view == 'info' ? props.toggleDrawer : props.showRouteInfo}>	
        <Icon
          name={props.view == 'info' ? 'expand-more' : 'expand-less'}
          size={30}
          color={WARM_BLACK}
        />	
      </TouchableOpacity>	
    </View>	
  ];	

  return (	
    <View style={mapStyles.card}>	
      <View style={mapStyles.actionCardContent}>	
        {content}	
      </View>	
    </View>	
  );	
}	

function DrawerButton(props) {	
  return (	
    <TouchableOpacity onPress={props.onPress}>	
      <View style={mapStyles.drawerButton}/>	
    </TouchableOpacity>	
  );	
}	

function ShareButton(props) {	
  return (	
    <TouchableOpacity onPress={props.onPress}>	
      <Text style={{color: 'white', backgroundColor: ACCENT, width: 60, height: 25, textAlign: 'center', textAlignVertical: 'center', borderRadius: 5}}>Share</Text>	
    </TouchableOpacity>	
  );	
}	

function Collaborators(props) {	
  return (	
    <View style={{flexDirection: 'row'}}>	
      <FlatList	
        data={props.collaborators.slice(0, 4)}	
        horizontal	
        renderItem={({ item, index }) =>	
          <Image	
            style={index == 0 ? mapStyles.profilePicOwner : mapStyles.profilePic}	
            source={{uri: item.photoUrl}}	
          /> 	
        }	
      />	
      {props.collaborators.length > 4 && <Text>{`and ${props.collaborators.length - 4} others`}</Text>}	
    </View>	
  );	
}

function Tag(props) {	
  return (	
    <View style={{flexDirection: 'row', backgroundColor: ACCENT, height: 30, width: 'auto', padding: 3, alignItems: 'center', borderRadius: 5, marginRight: 10, marginBottom: 10}}>	
      <Text style={{color: 'white', paddingRight: 5}} numberOfLines={1} ellipsizeMode='tail'>{props.title}</Text>	
    </View>	
  );	
}	

class RouteDetailsScreen extends Component {	

  static navigationOptions = ({ navigation }) => {	
    return {	
      tabBarVisible: false,
      header: null,	
      // headerTitle: () => <Text style={{fontSize: 20}}>Trip Details</Text>,	
      // headerLeft: () => <Icon name='arrow-back' size={30} style={{marginLeft: 10}} onPress={navigation.getParam('onBack')} />,	
      // headerRight: () => (	
      //   navigation.getParam('editing') ? <TouchableOpacity onPress={navigation.getParam('view') == 'info' ? navigation.getParam('onPressSave') : navigation.getParam('showRouteInfo')}>	
      //     {navigation.getParam('view') == 'info'	
      //         ? <Icon name='save' size={30} color={ACCENT} style={{marginRight: 10}} />	
      //         : <Text style={{color: ACCENT, marginRight: 10, fontSize: 18}}>Next</Text>	
      //     }	
      //   </TouchableOpacity> :	
      //   <OptionsMenu	
      //     customButton={<Icon name='more-vert' size={30} color='black' style={{marginRight: 10}} />}	
      //     options={['Edit', 'Delete']}	
      //     actions={[navigation.getParam('onPressEdit'), () => console.log('Delete')]}	
      //   />	
      // )	
    };	
  }	

  state = {	
    view: 'map',	
    drawer: 'open',	
    // if new, default to editing	
    editing: true,
    loading: false,
    searchInput: '',	
    // search result	
    focused: null	
  };	

  constructor(props) {	
    super(props);	
    // capture hardware back button for Android	
    this.didFocus = props.navigation.addListener('didFocus', payload =>	
      BackHandler.addEventListener('hardwareBackPress', this.onBack)	
    );	

     if (this.props.pins.length != 0) {	
      this.initLocation = this.props.pins[0].geometry.coordinates;	
    } else {	
      this.initLocation = this.props.city.coordinates;	
    }	
  }	

  componentWillMount() {	
    this.mapRef = null;	
    // for animating bottom drawer collapse	
    this.collapseValue = new Animated.Value(DRAWER_OPEN);	

     this.props.navigation.setParams({	
      editing: this.state.editing,	
      onBack: this.onBack,	
      onPressEdit: () => {	
        this.setState({editing: true});	
        this.props.navigation.setParams({editing: true});	
      },	
      onPressSave: this.onComplete,	
      showRouteInfo: this.showRouteInfo,	
      view: this.state.view	
    });	
  }	

  componentDidMount() {	
    console.log('collaborators', this.props.collaborators);	
    this.willBlur = this.props.navigation.addListener('willBlur', payload =>	
      BackHandler.removeEventListener('hardwareBackPress', this.onBack)	
    );	
  }	

  componentWillUnmount() {	
    this.props.clear();	
    this.didFocus.remove();	
    this.willBlur.remove();	
  }	

  onBack = () => {	
    if (this.state.view == 'info') {	
      this.toggleDrawer();	
      return true;    	
    }	

     if (this.props.navigation.getParam('new')) {	
      this.props.navigation.goBack('Location');	
    } else {	
      this.props.navigation.goBack();	
    }	

     return true;	
  }	

  toggleDrawer = () => {	
    let toValue;	
    let nextState;	

     // if drawer expanded...	
    if (this.state.view == 'info') {	
      this.didEnterRouteInfo && this.didEnterRouteInfo.remove();	
      // drawer must have been open	
      toValue = DRAWER_OPEN;	
      nextState = 'open';	
    } else {	
      if (this.state.drawer == 'open') {	
        toValue = DRAWER_CLOSED;	
        nextState = 'closed';	
      } else {	
        toValue = DRAWER_OPEN;	
        nextState = 'open';	
      }	
    }	

    // update state first, then animate	
    this.setState({drawer: nextState, view: 'map'}, Animated.timing(	
      this.collapseValue,	
      {	
        toValue: toValue,	
        duration: 200	
      }	
    ).start);	
    this.props.navigation.setParams({view: 'map'});	
  }	

  closeDrawer = () => {	
    this.setState({drawer: 'closed', view: 'map'}, Animated.timing(	
      this.collapseValue,	
      {	
        toValue: DRAWER_CLOSED,	
        duration: 200	
      }	
    ).start);	
    this.props.navigation.setParams({view: 'map'});	
  }	

  showRouteInfo = () => {	
    this.setState({view: 'info'}, () => {	
      this.didEnterRouteInfo = this.props.navigation.addListener(	
        'didFocus',	
        payload => BackHandler.addEventListener(	
          'hardwareBackPress',	
          this.toggleDrawer	
        )	
      );	
      Animated.timing(	
        this.collapseValue,	
        {	
          toValue: DRAWER_EXPANDED,	
          duration: 200	
        }	
      ).start();	
    });	
    this.props.navigation.setParams({view: 'info'});	
  }	

  onPressSearch = () => {	
    this.props.navigation.navigate('MapSearch', {	
      location: this.initLocation,	
      searchInput: this.state.searchInput,	
      onPressItem: this.onPressSearchItem,	
    });	
  }	

  onPressSearchItem = (item, navigation, sessionToken) => {	
    this.fetchPlaceDetails(item.place_id, () => {	
      navigation.goBack();	
      this.mapRef.animateCamera({	
        center: {	
          latitude: this.state.focused.geometry.coordinates[0],	
          longitude: this.state.focused.geometry.coordinates[1],	
        },	
        zoom: 17	
      }, 30);	
    }, sessionToken);	
  }	

  onClearSearch = () => {	
    this.setState({searchInput: '', focused: null});	
  }	

  onPoiClick = event => {	
    event.persist(); // necessary to persist event data for some reason	
    this.fetchPlaceDetails(event.nativeEvent.placeId, () => {	
      this.mapRef.animateCamera({	
        center: {	
          latitude: this.state.focused.geometry.coordinates[0],	
          longitude: this.state.focused.geometry.coordinates[1],	
        },	
        zoom: 17	
      }, 30);	
    });	
  }	

  onLongPress = event => {	
    event.persist();	
    const latitude = event.nativeEvent.coordinate.latitude;	
    const longitude = event.nativeEvent.coordinate.longitude;	

     fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`)	
      .then(response => response.json())	
      .then(responseJson =>	
        this.fetchPlaceDetails(responseJson.results[0].place_id, () => {	
          this.mapRef.animateCamera({	
            center: {	
              latitude: this.state.focused.geometry.coordinates[0],	
              longitude: this.state.focused.geometry.coordinates[1],	
            },	
            zoom: 17	
          }, 30);	
        })	
      );	
  }	

  fetchPlaceDetails = (placeId, callback, sessionToken) => {	
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}${sessionToken ? '&sessiontoken=' + sessionToken : ''}`)	
    .then(response => response.json())	
    .then(responseJson => {	
      // limit showing photos to 4 to save ca$h	
      const photos = responseJson.result.photos ? responseJson.result.photos.map(elem => elem.photo_reference).slice(0, 4) : null;	
      const pin = {	
        type: 'Feature',	
        geometry: {	
          type: 'Point',	
          coordinates: [	
            responseJson.result.geometry.location.lat,	
            responseJson.result.geometry.location.lng	
          ]	
        },	
        properties: {	
          placeId: placeId,	
          mainText: responseJson.result.name,	
          secondaryText: responseJson.result.formatted_address,	
          photoRefs: photos,	
          note: '',	
          creator: this.props.user._id	
        }	
      };	

       this.closeDrawer();	
      this.setState({	
        searchInput: responseJson.result.name,	
        focused: pin,	
      }, callback);	
    });	
  }	

  onAddPin = async () => {	
    // first update last pin's distToNext
    this.setState({loading: true});
    if (this.props.pins.length > 0) {	
      let distance;	
      await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&origins=place_id:${this.props.pins[this.props.pins.length-1].properties.placeId}&destinations=place_id:${this.state.focused.properties.placeId}&mode=walking`)	
        .then(response => response.json())	
        .then(responseJson => {	
          distance = responseJson.rows[0].elements[0].distance;
          return firebase.auth().currentUser.getIdToken();
        })
        .then(token => fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}/pins/${this.props.pins[this.props.pins.length-1]._id}`, {	
          method: 'PUT',	
          headers: {	
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`	
          },	
          body: JSON.stringify({	
            distToNext: distance.value			
          })	
        }))
        .then(response => {
          // TODO: This is broken: updatedPin updates selected pin
          this.props.updatePin(this.props.pins.length-1, {distToNext: distance.value});
        })
        .catch(error => console.error(error));	
    }	

    // then update route itself
    await firebase.auth().currentUser.getIdToken().then(token =>	
      fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}/routes/saved?route_id=${this.props._id}`, {	
          method: 'PUT',	
          headers: {	
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`	
          },	
          body: JSON.stringify({	
            pins: [...this.props.pins, this.state.focused]			
          })	
      })	
    )
      .then(response => response.json())
      .then(responseJson => {
        // finally, update pins in redux store with returned pin id
        this.props.addPin({...this.state.focused, _id: responseJson.id});	
        this.setState({	
          focused: null,	
          searchInput: '',
          loading: false	
        }, this.toggleDrawer);
      })
      .catch(error => console.error(error));	
  }
  
  onRemovePin = async index => {
    // first, update last pin's distance
    this.setState({loading: true});
    let distance;
    if (index != this.props.pins.length - 1 && index != 0 && this.props.pins.length > 2) {
      await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&origins=place_id:${this.props.pins[index-1].properties.placeId}&destinations=place_id:${this.props.pins[index+1].properties.placeId}&mode=walking`)	
        .then(response => response.json())	
        .then(responseJson => {	
          distance = responseJson.rows[0].elements[0].distance;
        });
    } else if (index == this.props.pins.length - 1 && this.props.length > 1) {
      distance = 'NONE';
    }

    if (distance) {
      await firebase.auth().currentUser.getIdToken()
        .then(token => fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}/pins/${this.props.pins[index-1]._id}`, {	
          method: 'PUT',	
          headers: {	
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`	
          },	
          body: JSON.stringify({	
            distToNext: distance == 'NONE' ? distance : distance.value			
          })	
        }))
        .then(response => {
          // TODO: This is broken: updatedPin updates selected pin
          this.props.updatePin(index-1, {distToNext: distance == 'NONE' ? distance : distance.value});
        })
        .catch(error => console.error(error));
    }

    // then update route itself
    await firebase.auth().currentUser.getIdToken().then(token =>	
      fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}/routes/saved?route_id=${this.props._id}`, {	
          method: 'PUT',	
          headers: {	
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`	
          },	
          body: JSON.stringify({	
            pins: this.props.pins.filter((pin, i) => i != index)			
          })	
      })	
    )
      .then(response => {
        // finally, update pins in redux store with returned pin id
        this.props.removePin(index);	
        this.setState({	
          loading: false	
        }, this.toggleDrawer);
      })
      .catch(error => console.error(error));	
  }

   // assume a < b	
  onSwapPins = (a, b) => {	
    const fetchInfos = [	
      {origin: a, dest: b + 1, newIndex: b},	
      {origin: b, dest: a, newIndex: a}	
    ];	

    const fetches = [];	

     for (let info of fetchInfos) {	
      if (info.newIndex != this.props.pins.length - 1) {	
        fetches.push(	
          fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&origins=place_id:${this.props.pins[info.origin].properties.placeId}&destinations=place_id:${this.props.pins[info.dest].properties.placeId}&mode=walking`)	
            .then(response => response.json())	
            .then(responseJson => ({	
              info: info,	
              json: responseJson	
            }))	
        );	
      } else {	
        delete this.props.pins[info.origin].properties.distToNext;	
      }	
    }	

    Promise.all(fetches)	
      .then(responsesJson => {
        let updates = [];	
        for (let responseJson of responsesJson) {
          updates.push(firebase.auth().currentUser.getIdToken()
            .then(token => {
              return fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/pins/${this.props.pins[responseJson.info.origin]._id}`, {
                method: 'PUT',
                headers: {	
                  Accept: 'application/json',	
                  'Content-type': 'application/json',	
                  Authorization: `Bearer ${token}`	
                },	
                body: JSON.stringify({	
                  distToNext: responseJson.json.rows[0].elements[0].distance.value
                })	
              });
            })
            .then(response => {
              this.props.updatePin(responseJson.info.origin, {distToNext: responseJson.json.rows[0].elements[0].distance.value});
            })
          );
        }
        
        // swap
        let newPins = [...this.props.pins];
        newPins[a] = this.props.pins[b];
        newPins[b] = this.props.pins[a];

        updates.push(firebase.auth().currentUser.getIdToken()
          .then(token => {
            return fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/routes/saved??route_id=${this.props._id}`, {
              method: 'PUT',
              headers: {	
                Accept: 'application/json',	
                'Content-type': 'application/json',	
                Authorization: `Bearer ${token}`	
              },	
              body: JSON.stringify({	
                pins: newPins
              })	
            });
          })
        );
        return updates;
      })
      .then(responses => {
        this.props.swapPins([	
          this.props.pins[a],	
          this.props.pins[b]	
        ], [a, b]);	
      });
  }

  onComplete = () => {	
    firebase.auth().currentUser.getIdToken().then(token =>	
      fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/routes/saved`, {	
        method: 'POST',	
        headers: {	
          Accept: 'application/json',	
          'Content-type': 'application/json',	
          Authorization: `Bearer ${token}`	
        },	
        body: JSON.stringify({	
          name: this.props.name,	
          creator: this.props.user._id,	
          city: this.props.city._id,	
          pins: this.props.pins,	
          tags: this.state.tags	
        })	
      })	
    )	
      .then(response => {	
        this.props.toggleRefresh();	
        this.setState({editing: false});	
        this.props.navigation.setParams({editing: false});	
      })	
      .catch(error => console.error(error));	
  }	

  onScrollRoute = event => {	
    const i = Math.round(event.nativeEvent.contentOffset.x / OFFSET_DIV);	
    if (i == 0) {	
      // this.mapRef.fitToSuppliedMarkers(	
      //   this.props.pins.map(pin => pin.properties.placeId),	
      //   {	
      //     edgePadding: {	
      //       top: CARD_HEIGHT,	
      //       left: 150,	
      //       bottom: CARD_HEIGHT,	
      //       right: 150	
      //     },	
      //     animated: true	
      //   }	
      // );	
    } else {	
      this.mapRef.animateCamera({	
        center: {	
          latitude: this.props.pins[i - 1].geometry.coordinates[0],	
          longitude: this.props.pins[i - 1].geometry.coordinates[1],	
        },	
        zoom: 15	
      }, 30);	
    }	
  }	

  clearTag = value => {	
    this.setState({	
      tags: this.state.tags.filter(tag => tag != value)	
    });	
  }	

  render() {	
    // render place cards	
    const reducer = (res, pin, index) => {	
      const options = ['Remove'];	
      const actions = [() => this.props.removePin(index)];	

      if (index != 0) {	
        options.push('Shift Left');	
        actions.push(() => this.onSwapPins(index-1, index));	
      }	
      if (index != this.props.pins.length - 1) {	
        options.push('Shift Right');	
        actions.push(() => this.onSwapPins(index, index+1));	
      }	

      res.push(	
        <Card	
          key={pin.properties.placeId}	
          pin={pin}	
          onPress={() => {	
            this.props.viewDetail(index);	
            this.props.navigation.navigate('PlaceDetails');	
          }}	
          index={index}	
          showOptions={this.state.editing}	
          options={options}	
          actions={actions}	
        />	
      );	

      if (pin.properties.distToNext) {	
        res.push(	
          <TouchableOpacity	
            onPress={() => {	
              // TODO: Fix this	
              // Open Google Maps	
              Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${this.props.pins[index].properties.secondaryText}&destination=${this.props.pins[index + 1].properties.secondaryText}&travelmode=walking`);	
            }}	
          >	
            <View style={{...mapStyles.filler, alignItems: 'center', justifyContent: 'center'}}>	
              <Icon name='directions-walk' size={30} color={DARKER_GREY} />	
              <Text style={{color: DARKER_GREY}}>	
                {`${pin.properties.distToNext} m`}	
              </Text>	
            </View>	
          </TouchableOpacity>	
        );	
      }	

      return res;	
    }	

    const cards = this.props.pins.reduce(reducer, []);	

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={mapStyles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.onBack} style={{marginRight: 5}}>
              <Icon name='keyboard-arrow-left' size={45} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onBack} style={{marginRight: 5}}>
              <View style={{borderRadius: 20 / 2, backgroundColor: this.state.loading ? ACCENT : GREY, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='autorenew' size={15} color={this.state.loading ? 'white' : 'black'} />
              </View>
            </TouchableOpacity>
            <Text style={{backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', padding: 2, borderRadius: 2, fontSize: 12}}>{this.state.loading ? 'Saving...' : 'Saved'}</Text>
          </View>
          <TouchableOpacity style={{paddingRight: 10}} onPress={this.onPressSearch}>
            <View style={{borderRadius: 40 / 2, backgroundColor: GREY, width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name='search' size={30} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={mapStyles.container}>
          <MapView	
            provider={'google'}	
            style={{flex: 1}}
            onPoiClick={this.state.editing ? this.onPoiClick : undefined}	
            onLongPress={this.onLongPress}	
            initialRegion={{	
              latitude: this.initLocation[0],	
              longitude: this.initLocation[1],	
              // arbitary numbers 	
              latitudeDelta: 0.0922,	
              longitudeDelta: 0.0421	
            }}	
            showsUserLocation={true}	
            ref={ref => this.mapRef = ref}	
          >	
            {this.props.pins.map((pin, index) =>	
              <Marker	
                key={pin.properties.placeId}	
                identifier={pin.properties.placeId}	
                coordinate={{latitude: pin.geometry.coordinates[0], longitude: pin.geometry.coordinates[1]}}	
                title={pin.properties.mainText}	
                description={pin.properties.secondaryText}	
                image={pinImage}	
              >	
                <View style={mapStyles.pin}>	
                  <Text style={{color: 'white'}}>{index+1}</Text>	
                </View>	
              </Marker>	
            )}	
            {this.state.focused &&	
              <Marker	
                key={this.state.focused.properties.placeId}	
                identifier={this.state.focused.properties.placeId}	
                coordinate={{latitude: this.state.focused.geometry.coordinates[0], longitude: this.state.focused.geometry.coordinates[1]}}	
                title={this.state.focused.properties.mainText}	
                description={this.state.focused.properties.secondaryText}	
                icon={pinImage}	
              />	
            }	
          </MapView>	
          {/* {this.state.editing && <View style={mapStyles.searchBoxContainer}>	
            <TextInput	
              style={mapStyles.searchBox}	
              placeholder='Search'	
              value={this.state.searchInput}	
              onTouchEnd={this.onPressSearch}	
            />	
            <TouchableOpacity onPress={this.onClearSearch}>	
              <Icon name='clear' size={30} color='grey' />	
            </TouchableOpacity>
          </View>}	 */}
          <Animated.View style={{...mapStyles.animated, top: this.collapseValue}}>	
            {/* show focused card */}	
            {this.state.focused && <FocusedCard	
              pin={this.state.focused}	
              onAdd={this.onAddPin}
              onClear={this.onClearSearch}
            />}	
            <View style={mapStyles.drawer} >	
              <DrawerButton onPress={this.toggleDrawer} />	
              <ScrollView	
                style={{flex: 1}}	
                scrollEnabled={this.props.pins.length > 0}	
                contentContainerStyle={mapStyles.endPadding}	
                horizontal	
                scrollEventThrottle={1}	
                showsHorizontalScrollIndicator={false}	
                onMomentumScrollEnd={this.onScrollRoute}	
              >	
                <View style={mapStyles.filler} />	
                <ActionCard
                  pins={this.props.pins}
                  showRouteInfo={this.showRouteInfo}
                  toggleDrawer={this.toggleDrawer}
                  view={this.state.view}
                />	
                {cards}	
                <View style={mapStyles.filler} />	
              </ScrollView>	
              {this.state.view === 'info' &&	
                <View style={mapStyles.infoContainer}>	
                  {this.state.editing ?	
                    <TextInput	
                      style={{...mapStyles.nameBox, marginBottom: 10}}	
                      placeholder={'Name your trip'}	
                      onChangeText={text => this.props.editRouteName(text)}	
                      value={this.props.name}	
                    />	
                    : <Text style={mapStyles.name}>	
                      {this.props.name ? this.props.name : 'Untitled'}	
                    </Text>	
                  }	
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>	
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>	
                      <Icon name='people' size={20} style={{marginRight: 5, paddingTop: 5}} color={DARKER_GREY} />	
                      <Text style={mapStyles.sectionHeader}>People</Text>	
                    </View>	
                    <ShareButton onPress={() => this.props.navigation.navigate('FriendsShare')} />	
                  </View>	
                  <Collaborators collaborators={[this.props.creator, ...this.props.collaborators]} />	
                  {/* {this.props.navigation.getParam('route').tags != undefined &&	
                  <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, flexWrap: 'wrap'}}>	
                    {this.props.navigation.getParam('route').tags.map(tag => <Tag title={tag} key={tag} />)}	
                  </View> */}	
                </View>	
              }	
            </View>	
          </Animated.View>	
        </View>	
      </SafeAreaView>
    );	
  }	
}	

const mapStateToProps = state => {	
  return {	
    selected: state.selected,	
    user: state.user,	
    // flattened route	
    name: state.name,	
    creator: state.creator,	
    city: state.city,	
    pins: state.pins,	
    tags: state.tags,	
    _id: state._id,
    collaborators: state.collaborators	
  };	
}	

const mapDispatchToProps = dispatch => {	
  return {	
    addPin: pin => dispatch({type: 'ADD_PIN', payload: {	
      pin: pin	
    }}),	
    removePin: index => dispatch({type: 'REMOVE_PIN', payload: {	
      indexToRemove: index	
    }}),	
    swapPins: (pins, indices) => dispatch({type: 'SWAP_PINS', payload: {	
      pins: pins,	
      indices: indices	
    }}),	
    editRouteName: name => dispatch({type: 'EDIT_ROUTE_NAME', payload: {name: name}}),	
    viewDetail: index => dispatch({type: 'VIEW_PLACE_DETAIL', payload: {	
      selectedIndex: index	
    }}),	
    updatePin: (index, data) => dispatch({type: 'UPDATE_PIN', payload: {	
      index: index,	
      data: data	
    }}),	
    clear: () => dispatch({type: 'CLEAR'}),	
    toggleRefresh: () => dispatch({type: 'TOGGLE_REFRESH'})	
  };	
}	

export const MapSearchScreen = connect(mapStateToProps)(MapSearch);	

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetailsScreen);
