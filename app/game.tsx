import {
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Pressable,
  BackHandler,
  Alert,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";

export default function GameScreen() {
  const [position, setPosition] = useState<any>({ top: 50, left: 50 });
  const [score, setScore] = useState<number>(0);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [best, setBest] = useState<number | string>(0);
  const [newBest, setNewBest] = useState<boolean>(false);
  const [anyaMode, setAnyaMode] = useState<string>("good");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }
  }

  const handleShowNotification = async (title: string, message: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
        sound: "default",
      },
      trigger: null,
    });
  };

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  const gotScore = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/voice/win.wav")
    );
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleAnyaMove = () => {
    const { width, height } = Dimensions.get("window");

    const AnyaSize = 60;

    const maxY = height - AnyaSize - 60;
    const maxX = width - AnyaSize - 60;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    setPosition({ top: randomY, left: randomX });

    if (anyaMode == "good") {
      setScore(score + 1);

      gotScore();
    } else {

      Alert.alert("OOOOOh!" , "You lost.");
      setScore(0);

    }

    let randomChoose = Math.floor(Math.random() * 20);

    if (randomChoose == 6 || randomChoose == 9) {
      setAnyaMode("bad");
    }
  };

  const stopGame = () => {
    setIsPause(!isPause);
  };

  const handleExit = async () => {
    if (score > Number(best)) {
      await SecureStore.setItemAsync("bestScore", `${score}`);
    }

    BackHandler.exitApp();
  };

  useEffect(() => {
    const handleGetBest = async () => {
      let bestScore = await SecureStore.getItemAsync("bestScore");

      if (bestScore) {
        setBest(bestScore);
      }
    };

    handleGetBest();
    registerForPushNotificationsAsync();

  }, []);

  useEffect(() => {
    if (best != 0 && !newBest) {
      if (score > Number(best)) {
        Alert.alert(
          "New Power !",
          "You successfully hit your previous best score!"
        );
        setNewBest(true);
      }
    }

    switch (score) {
      case 30: {
        handleShowNotification("Keep Going!", "You are playing hard!");
        break;
      }

      case 50: {
        handleShowNotification("Yeaaah!", "Did you think you can hit me?");
        break;
      }

      case 100: {
        handleShowNotification("Wooow!", "WOOOOOOOOOOOOOOOOOOOOOOOOOOW!");
        break;
      }
    }
  }, [score]);

  useEffect(() => {
    const handleCheckMode = async () => {
      if (anyaMode == "bad") {
        await sleep(2000);

        setAnyaMode("good");
      }
    };

    handleCheckMode();
  }, [anyaMode]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageBackground
        source={require("../assets/images/room.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.pauseButton}>
          <Text style={styles.scoreText}>Score : {score}</Text>

          <Text style={styles.scoreText}>Best : {best}</Text>

          <Pressable
            onPress={stopGame}
            style={{ height: 30, width: 30, marginTop: 19 }}
          >
            <Image
              source={require("../assets/images/pause.png")}
              style={{ height: 30, width: 30 }}
            />
          </Pressable>

          {isPause && (
            <Pressable
              onPress={handleExit}
              style={{ height: 30, width: 30, marginTop: 19 }}
            >
              <Image
                source={require("../assets/images/quit.png")}
                style={{ height: 30, width: 30 }}
              />
            </Pressable>
          )}
        </View>

        {isPause && (
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 36,
              marginTop: 40,
            }}
          >
            Game Paused
          </Text>
        )}

        {!isPause && (
          <Pressable
            onPress={handleAnyaMove}
            style={[
              styles.anyaButton,
              { top: position.top, left: position.left },
            ]}
          >
            <Image
              source={
                anyaMode == "good"
                  ? require("../assets/images/anya.png")
                  : require("../assets/images/badAnya.png")
              }
              style={styles.anya}
            />
          </Pressable>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  anyaButton: {
    margin: 70,
    justifyContent: "center",
  },
  anya: {
    height: 60,
    width: 60,
    borderRadius: 10,
    position: "absolute",
  },
  scoreText: {
    marginTop: 20,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  pauseButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
