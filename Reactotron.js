import Reactotron from 'reactotron-react-native';
// DEV
// config with redux
if (__DEV__) {
    // device
    Reactotron.configure({ 
      name: 'App',
      host: '192.168.1.84',
    })
    .connect();
}