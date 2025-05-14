import React from "react";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { StyleSheet } from "react-native";
import { IconSymbol } from "@/app-example/components/ui/IconSymbol.ios";
import { icons } from "@/constants";

type Coordinate = { latitude: number; longitude: number };

interface MapSectionProps {
  initialRegion: Region;
  pickupCoords: Coordinate | null;
  dropoffCoords: Coordinate | null;
  routeCoords: Coordinate[];
  mapRef: React.RefObject<MapView | null>;
}

const MapSection: React.FC<MapSectionProps> = ({
  initialRegion,
  pickupCoords,
  dropoffCoords,
  routeCoords,
  mapRef,
}) => (
  <MapView
    ref={mapRef}
    style={StyleSheet.absoluteFill}
    initialRegion={initialRegion}
    showsUserLocation
  >
    {pickupCoords && (
      <Marker
        coordinate={pickupCoords}
        title="Pickup Location"
        image={icons.pin}
      />
    )}
    {dropoffCoords && (
      <Marker
        coordinate={dropoffCoords}
        title="Dropoff Location"
        image={icons.pin}
      />
    )}
    {routeCoords.length > 0 && (
      <Polyline coordinates={routeCoords} strokeWidth={3} strokeColor="black" />
    )}
  </MapView>
);

export default MapSection;
