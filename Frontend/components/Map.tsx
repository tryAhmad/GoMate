import { View, Text } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1, width: "100%", height: "100%" }}
      tintColor="black"
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;
