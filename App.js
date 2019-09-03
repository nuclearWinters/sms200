import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Picker,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import requestCameraPermission from "./functionsGranted"
import CountDown from 'react-native-countdown-component';

import { NativeModules } from 'react-native';
var DirectSms = NativeModules.DirectSms;

import axios from "axios"
import uuid from "uuid/v4"

export default class App extends Component {
  state = {
    numeroParaNotificar: "",
    counter: 0,
    cuantosMensajes: "0",
    isLoading: false,
    len: -1,
    resCopy: [],
    text: "",
    lada: "983",
    etiqueta: "sm2",
    state: "",
    etiquetas: [],
    isEtiqueta: false,
    isLada: false,
    time: "2",
    timeSize: "1000",
    uuid: ""
  }

  timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  jsHello = async () => {
    this.setState({uuid: uuid()}, async () => {
      let hour = new Date()
      hour = hour.getHours()
      if (hour > 8 && hour < 22 ) {
        let {len, counter, cuantosMensajes} = this.state
        if(counter !== 0) {
          if (Number.isInteger(counter/Number(cuantosMensajes))) {
            console.log("enviando notificacion")
            let sent1000 = await DirectSms.sendDirectSms(
              this.state.numeroParaNotificar, 
              `Se enviaron otros ${this.state.cuantosMensajes}`
            )
          }
        }
        let number = String(this.state.resCopy[len])
        let text = String(this.state.text)
        //let sent = "sent"
        let sent = await DirectSms.sendDirectSms(
          number,
          text
        )
        this.setState({len: this.state.len - 1, state: sent, counter: this.state.counter + 1}, async () => {
          if (--len > -1) {
            await this.timeout(this.state.time*Number(this.state.timeSize));
            this.jsHello()
          } else {
            await this.timeout(this.state.time*Number(this.state.timeSize));
            this.setState({len: this.state.resCopy.length - 1, isEnviando: false})
          }
        })
      } else {
        await this.timeout(this.state.time*Number(this.state.timeSize));
        this.jsHello()
      }
    })
  }

  someFunction = () => {
    if (this.state.text !== "" && this.state.cuantosMensajes !== "0" && this.state.len !== -1 && this.state.numeroParaNotificar.length === 10) {
      this.setState({isEnviando: true}, () => {
        this.jsHello();
      })
    } else {
      Alert.alert("Advertencia:", "No puedes dejar el mensaje vacío, no tener números o tener el número de mensajes en cero (0).")
    }
  }

  componentDidMount () {
    requestCameraPermission()
    axios.get("http://192.168.1.110:3000/etiquetas").then(
      etiquetas => this.setState({etiquetas: etiquetas.data})
    )
    .catch(err => console.log(err))
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"}>
          <TextInput placeholder="Ingrese texto" value={this.state.text} onChangeText={text => this.setState({text})} multiline={true} blurOnSubmit={true} style={{height: 100, width: 200, borderBottomColor: "rgb(224,224,224)", borderBottomWidth: 1, textAlignVertical: "top", marginTop: 10}}/>
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"} style={{flexDirection: "row", alignItems: "center"}}>
          <Picker
            selectedValue={this.state.lada}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({lada: itemValue, isLoading: true}, () => {
                let httpURL = ""
                const {etiqueta, lada, isEtiqueta, isLada} = this.state
                if ((etiqueta && isEtiqueta) && (lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}&lada=${this.state.lada}`
                } else if (!(etiqueta && isEtiqueta) && (lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?lada=${this.state.lada}`
                } else if ((etiqueta && isEtiqueta) && !(lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}`
                } else {
                  this.setState({isLoading: false}, () => {
                    return
                  })
                }
                axios.get(httpURL)
                .then((data) => {
                  data = data.data
                  this.setState({len: data.length - 1, resCopy: data, isLoading: false}, () => console.log("Ya esta!"))
                })
                .catch(err => {
                  this.setState({isLoading: false})
                })
              })
            }>
            <Picker.Item label="FELIPE CARRILLO PUERTO, OTHON P. BLANCO" value="983" />
            <Picker.Item label="LAZARO CARDENAS, SOLIDARIDAD" value="984" />
            <Picker.Item label="COZUMEL" value="987" />
            <Picker.Item label="JOSE MARIA MORELOS" value="997" />
            <Picker.Item label="BENITO JUAREZ, ISLA MUJERES" value="998" />
          </Picker>
          
          <TouchableOpacity onPress={() => {
            this.setState({isLoading: true, isLada: !this.state.isLada}, () => {
              let httpURL = ""
              const {etiqueta, lada, isEtiqueta, isLada} = this.state
              if ((etiqueta && isEtiqueta) && (lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}&lada=${this.state.lada}`
              } else if (!(etiqueta && isEtiqueta) && (lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?lada=${this.state.lada}`
              } else if ((etiqueta && isEtiqueta) && !(lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}`
              } else {
                this.setState({isLoading: false}, () => {
                  return
                })
              }
              axios.get(httpURL)
              .then((data) => {
                data = data.data
                this.setState({len: data.length - 1, resCopy: data, isLoading: false}, () => console.log("Ya esta!"))
              })
              .catch(err => {
                this.setState({isLoading: false})
              })
            })
          }} style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 26, width: 26, borderRadius: 52, alignItems: "center", justifyContent: "center"}}>{this.state.isLada && <View style={{height: 18, width: 18, backgroundColor: "forestgreen", borderRadius: 24}}></View>}</TouchableOpacity>
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"} style={{flexDirection: "row", alignItems: "center"}}>
          <Picker
            selectedValue={this.state.etiqueta}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({etiqueta: itemValue, isLoading: true}, () => {
                let httpURL = ""
                const {etiqueta, lada, isEtiqueta, isLada} = this.state
                if ((etiqueta && isEtiqueta) && (lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}&lada=${this.state.lada}`
                } else if (!(etiqueta && isEtiqueta) && (lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?lada=${this.state.lada}`
                } else if ((etiqueta && isEtiqueta) && !(lada && isLada)) {
                  httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}`
                } else {
                  this.setState({isLoading: false}, () => {
                    return
                  })
                }
                axios.get(httpURL)
                .then((data) => {
                  data = data.data
                  this.setState({len: data.length - 1, resCopy: data, isLoading: false}, () => console.log("Ya esta!"))
                })
                .catch(err => {
                  this.setState({isLoading: false})
                })
              })
            }>
            {this.state.etiquetas.map((et, i) => <Picker.Item label={et} value={et} key={i} />)}
          </Picker>
          <TouchableOpacity onPress={() => {
            this.setState({isLoading: true, isEtiqueta: !this.state.isEtiqueta}, () => {
              let httpURL = ""
              const {etiqueta, lada, isEtiqueta, isLada} = this.state
              if ((etiqueta && isEtiqueta) && (lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}&lada=${this.state.lada}`
              } else if (!(etiqueta && isEtiqueta) && (lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?lada=${this.state.lada}`
              } else if ((etiqueta && isEtiqueta) && !(lada && isLada)) {
                httpURL = `http://192.168.1.110:3000/filter?etiqueta=${this.state.etiqueta}`
              } else {
                this.setState({isLoading: false}, () => {
                  return
                })
              }
              axios.get(httpURL)
              .then((data) => {
                data = data.data
                this.setState({len: data.length - 1, resCopy: data, isLoading: false}, () => console.log("Ya esta!"))
              })
              .catch(err => {
                this.setState({isLoading: false})
              })
            })}} style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 26, width: 26, borderRadius: 52, alignItems: "center", justifyContent: "center"}}>{this.state.isEtiqueta && <View style={{height: 18, width: 18, backgroundColor: "forestgreen", borderRadius: 24}}></View>}</TouchableOpacity>
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"} style={{flexDirection: "row", alignContent: "center", alignItems: "center"}}>
          <Picker
            style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 26, width: 26, borderRadius: 52, alignItems: "center", justifyContent: "center"}}
            selectedValue={this.state.timeSize}
            style={{height: 50, width: 160}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({timeSize: itemValue})
            }>
            <Picker.Item label="Segundos" value="1000" />
            <Picker.Item label="Minutos" value="60000" />
            <Picker.Item label="Horas" value="3600000" />
          </Picker>
          <TextInput 
            style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 36, width: 66}} 
            keyboardType={'numeric'} 
            value={this.state.time} 
            onChangeText={e => {
              if (!isNaN(e)) {
                this.setState({time: e})
              }
            }}/>
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"} style={{flexDirection: "row"}}>
          <Text style={{width: 160, textAlign: "center"}}>¿A los cuantos mensajes enviados te alertamos?</Text>
          <TextInput 
          style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 36, width: 66}} 
          keyboardType={'numeric'} 
          value={this.state.cuantosMensajes} 
          onChangeText={e => {
            if (!isNaN(e)) {
              this.setState({cuantosMensajes: e})
            }
          }}/>
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"} style={{flexDirection: "row"}}>
          <TextInput 
          placeholder="Número para notificar"
          style={{marginLeft: 20, borderColor: "gray", borderWidth: 1, height: 36, width: 200, marginVertical: 8}} 
          keyboardType={'numeric'} 
          value={this.state.numeroParaNotificar} 
          onChangeText={e => {
            if (!isNaN(e)) {
              this.setState({numeroParaNotificar: e})
            }
          }}/>
        </View>
        <Text style={{textAlign: "center"}}>Enviados: {this.state.resCopy.length - (this.state.len + 1)} de {this.state.resCopy.length}</Text>
        <Text style={{textAlign: "center"}}>Status del ultimo mensaje: {this.state.state}</Text>
        <View>
        <CountDown
            id={this.state.uuid}
            size={20}
            until={this.state.time*Number(this.state.timeSize/1000)}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
            digitTxtStyle={{color: '#1CC625'}}
            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
            separatorStyle={{color: '#1CC625'}}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{m: null, s: null}}
            showSeparator
          />
        </View>
        <View pointerEvents={this.state.isEnviando ? "none": "auto"}>
          <TouchableOpacity style={styles.button} onPress={this.someFunction.bind(this)}>
            <Text>Enviar SMS</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.isLoading}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{backgroundColor: "rgba(0,0,0,0.1)", position: "absolute", top: 0, bottom: 0, right: 0, left: 0, alignItems: "center" ,justifyContent: "center"}}>
            <ActivityIndicator size="large"></ActivityIndicator>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },  
  button: {
    padding: 10,
    borderWidth: .5,
    borderColor: '#bbb',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});