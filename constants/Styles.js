import { StyleSheet } from 'react-native';
import Colors from './Colors.js';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  verticalContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  centered: {
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  bigText: {
    fontSize: 20,
    fontWeight: "800"
  },
  contentText: {
    fontSize: 18,
  },
  smallText: {
    fontSize: 10,
  },
  secondaryText: {
    color: Colors.tabIconDefault,
    fontWeight: "200"
  },
  textInput: {
    fontSize: 20,
    height: 40
  },
  '2tite4me': {
    marginBottom: 20
  },
  textInputStyle: {
    fontSize: 25,
    height: 50,
    marginLeft: 20,
  }
});