import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "145668956753819";

export default function App() {
  const [user, setUser] = React.useState(null);
  // Request
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FB_APP_ID,
    
    responseType: ResponseType.Token,
  });

  if (request) {
    console.log(
      "You need to add this url to your authorized redirect urls on your Facebook app: " +
        request.redirectUri
    );
  }

  React.useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      })();
    }
  }, [response]);

  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== "success") {
      alert("Uh oh, something went wrong");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style= {styles.namee}> FLOCK </Text>
      {user ? (
        <Profile user={user} />
      ) : (
        <Button
          disabled={!request}
          title="Click Ok To continue"
          onPress={handlePressAsync}
        />
      )}
    </View>
  );
}

function Profile({ user }) {
  return (
    <View style={styles.profile}>
      <Image source={{ uri: user.picture.data.url }} style={styles.image} />
      <Text style={styles.name}>{user.name}</Text>
      <Text>ID: {user.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#1C212E',
  },
  profile: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  namee:{
    fontSize: '30px',
    width:'160px',
    height:'18px',
    lineHeight:'18px',
    position: 'absolute',
    left: '48.25%',
    right:'21.75%',
    bottom:'85.09%',
    paddingTop: '10px',
    fontFamily: 'Roboto-Regular',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.02em',
    color: '#FFFFFF',
    width: '90%',
    fontWeight:'500'
    
      },
});
