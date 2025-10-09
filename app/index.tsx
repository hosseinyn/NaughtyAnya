import { ImageBackground, Pressable, StyleSheet, Text, View , Linking, BackHandler, Alert, TouchableOpacity } from "react-native";
import {useNavigation} from '@react-navigation/native';

export default function IndexScreen() {

  const navigation = useNavigation();


  const handleShowCredits = () => {
    
    Alert.alert("Credits" , "Pictures : Internet \n Quit icon : https://www.flaticon.com/free-icons/quitQuit icons created by VectorPortal Flaticon \n Pause icon : https://www.flaticon.com/free-icons/pause-button Pause button icons created by SumberRejeki - Flaticon \n Waku Waku sound effect : https://www.voicy.network/sounds/YImc8yAGN0qv6GO7aejc3Q-anya-forger-waku-waku")

  }

  

  const openGithub = () => Linking.canOpenURL("https://github.com/hosseinyn/NaughtyAnya").then(() => {
        Linking.openURL("https://github.com/hosseinyn/NaughtyAnya");
  });


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageBackground source={require('../assets/images/background.jpeg')} resizeMode="cover" style={styles.background}>
        

        <View style={styles.menu}>

          <Text style={{fontSize: 60 , color : "yellow" , marginTop: -50 , fontWeight: "bold"}}>Naughty Anya</Text>
        
            <Pressable onPress={() => navigation.navigate("Game")} style={styles.menuButton}>
              <Text style={{color: "#fff"}}>PLAY</Text>
            </Pressable>

            <Pressable onPress={handleShowCredits} style={styles.menuButton}>
              <Text style={{color: "#fff"}}>Credits</Text>
            </Pressable>

            <Pressable onPress={BackHandler.exitApp} style={styles.menuButton}>
              <Text style={{color: "#fff"}}>Exit</Text>
            </Pressable>

            <View style={styles.InfoArea}>

              <Text style={{color: "#000" , fontSize: 17 , fontWeight: "bold"}}>
                Version 1.0.0 - 
              </Text>

              <Text style={{color: "#000" , fontSize: 17 , fontWeight: "bold"}}>
                Hosseinyn
              </Text>

              <TouchableOpacity onPress={openGithub}>
                <Text style={{color: "#1431eaff" , fontSize: 17 , fontWeight: "bold"}}>
                Github
              </Text>
              </TouchableOpacity>

        </View>

        </View>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  menu : {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    margin : 100
  },
  menuButton : {
    marginTop: 13,
    width: 170,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#b70ae7ff",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center"
  },
  InfoArea : {
    display: "flex",
    flexDirection: "row",
    marginTop: 36,
    gap: 15,
    justifyContent: "center",
    alignItems: "center"
  }
})
