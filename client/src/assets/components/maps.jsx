import { React, useState, useEffect } from "react";
import {
    Box,
    Autocomplete,
    TextField,
    Card,
    Grid,
    Typography,
    Divider,
    Link,
} from "@mui/material";
import {
    GoogleMap,
    useJsApiLoader,
    OverlayView,
    Marker,
    InfoWindow,
    HeatmapLayer,
    MarkerClusterer,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

// Define the styles outside the component
const mapStyles = [
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "transit",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
];

const mapGlobe = [
    {
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.neighborhood",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.arterial",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.local",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "transit",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
];

function Map(props) {
    const [map, setMap] = useState(null);

    const onLoad = (map) => {
        setMap(map);
    };

    useEffect(() => {
        if (map && props.selected) {
            const { lat, lng } = props.selected;
            map.panTo({ lat, lng });
        }
    }, [map, props.selected]);

    const [center] = useState({ lat: 10.5929, lng: 122.6325 });

    return (
        <Box sx={{ height: 1, width: 1 }}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                onLoad={onLoad}
                zoom={12}
                version={"3.55"}
                options={{
                    styles: mapStyles, // Use the defined styles here
                }}
            >
                {props.selected && <Marker position={props.selected} />}
            </GoogleMap>
        </Box>
    );
}

const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        if (!address) {
            return;
        }
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    };

    return (
        <Autocomplete
            id="places-autocomplete"
            freeSolo
            options={
                status === "OK" ? data.map((place) => place.description) : []
            }
            getOptionLabel={(option) => option}
            onInputChange={(e, newInputValue) => setValue(newInputValue)}
            onChange={(e, newValue) => handleSelect(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search an address"
                    variant="outlined"
                    fullWidth
                    disabled={!ready}
                    className="combobox-input"
                />
            )}
            sx={{ width: 1 }}
        />
    );
};

function Heatmap({ points }) {
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    const [map, setMap] = useState(null);
    const [center] = useState({ lat: 10.5929, lng: 122.6325 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay with setTimeout
        const delay = setTimeout(() => {
            setLoading(false);
        }, 200); // Adjust the delay time as needed

        return () => clearTimeout(delay); // Clear the timeout on component unmount
    }, []);

    const onLoad = (map) => {
        setMap(map);
    };

    let heatmapData = [];

    if (isLoaded && Array.isArray(points)) {
        // Your code that uses window.google.maps.LatLng
        heatmapData = points.map((point) => ({
            location: new window.google.maps.LatLng(
                parseFloat(point.coorLat),
                parseFloat(point.coorLng)
            ),
            weight: parseFloat(point.TOTAL),
        }));
    }
    console.log(points);
    console.log(heatmapData);

    return isLoaded ? (
        heatmapData ? (
            <div
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={center}
                    onLoad={onLoad}
                    zoom={12}
                    options={{ minZoom: 11, maxZoom: 14, styles: mapStyles }}
                >
                    {!loading ? (
                        <HeatmapLayer
                            data={heatmapData}
                            options={{ radius: 20 }}
                        />
                    ) : null}
                </GoogleMap>
                {/* <Card
                    sx={{
                        position: "absolute",
                        zIndex: 12,
                        top: 10,
                        right: 10,
                        minWidth: "30%",
                        height: "40%",
                        maxWidth: "calc(100% - 40px)",
                        maxHeight: "calc(100% - 40px)",
                        paddingX: 2,
                        bgcolor: "white",
                        display: "flex",
                        flexDirection: "column", // Ensures the Box fills up the Card
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        height={1}
                        sx={{ display: "flex" }}
                    >
                        <Grid
                            item
                            sx={{
                                height: "20%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="overline" fontWeight={"bold"}>
                                Establishment
                            </Typography>
                        </Grid>
                        <Divider />
                        <Grid
                            item
                            sx={{
                                height: "60%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: {
                                        xs: 48,
                                        sm: 80,
                                        md: 45,
                                        lg: 40,
                                        xl: 50,
                                    },
                                    fontWeight: 600,
                                }}
                            >
                                {heatmapData[0].weight}
                            </Typography>
                        </Grid>
                        <Divider />
                        <Grid
                            item
                            sx={{
                                flexGrow: 1,
                                // bgcolor: "red",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="caption">
                                {points[0].coorLat}, {points[0].coorLng}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card> */}
            </div>
        ) : null
    ) : null;
}

function MapWithMarkers({ points, selected }) {
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    const [center] = useState({ lat: 10.5929, lng: 122.6325 });

    const [map, setMap] = useState(null);

    const onLoad = (map) => {
        setMap(map);
    };

    const [selectedMarker, setSelectedMarker] = useState(null);
    const [placeCode, setPlaceCode] = useState(null);
    const [placeMunicipality, setPlaceMunicipality] = useState(null);
    const [placeProvince, setPlaceProvince] = useState(null);
    const [placeId, setPlaceId] = useState(null);
    const [placeName, setPlaceName] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const delay = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (map) {
            const clickListener = map.addListener("click", () => {
                handleInfoWindowClose();
                setSelectedMarker(null);
            });
            return () => {
                window.google.maps.event.removeListener(clickListener);
            };
        }
    }, [map]);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        getPlaceId(marker.coorLat, marker.coorLng);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker("");
        setPlaceId("");
        setPlaceName("");
        setPlaceCode("");
        setPlaceMunicipality("");
        setPlaceProvince("");
    };

    const getPlaceId = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setPlaceCode(results[0].address_components[0].long_name);
                    setPlaceMunicipality(
                        results[0].address_components[1].long_name
                    );
                    setPlaceProvince(
                        results[0].address_components[2].long_name
                    );
                    setPlaceId(results[0].place_id);
                    getPlaceDetails(results[0].place_id);
                    console.log(results[0]);
                }
            }
        });
    };

    const getPlaceDetails = (placeId) => {
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails({ placeId: placeId }, (result, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaceName(result.name);
            }
        });
    };

    const generateGoogleMapsLinkByPlaceName = (placeName) => {
        return `https://www.google.com/maps/place/?q=displayname:${placeName}`;
    };

    useEffect(() => {
        if (map && selected) {
            const { lat, lng } = selected;
            map.panTo({ lat, lng });
            map.setZoom(17);
        }
    }, [map, selected]);

    console.log("nanana", selected);

    return isLoaded ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                center={center}
                onLoad={onLoad}
                zoom={12}
                options={{ minZoom: 11, maxZoom: 21, styles: mapStyles }}
            >
                <Marker visible={false} position={selected} />
                {!loading ? (
                    <MarkerClusterer
                        gridSize={40}
                        maxZoom={15}
                        zoomOnClick={true}
                        averageCenter={true}
                        enableRetinaIcons={true}
                    >
                        {(clusterer) =>
                            points.map((point, index) => (
                                <Marker
                                    key={index}
                                    position={{
                                        lat: parseFloat(point.coorLat),
                                        lng: parseFloat(point.coorLng),
                                    }}
                                    onClick={() => handleMarkerClick(point)}
                                    clusterer={clusterer}
                                />
                            ))
                        }
                    </MarkerClusterer>
                ) : null}
                {/* {!loading
                ? points.map((point, index) => (
                      <Marker
                          key={index}
                          position={{
                              lat: parseFloat(point.coorLat),
                              lng: parseFloat(point.coorLng),
                          }}
                          onClick={() => handleMarkerClick(point)}
                      />
                  ))
                : null} */}
                {selectedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedMarker.coorLat),
                            lng: parseFloat(selectedMarker.coorLng),
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <Box>
                            <div>
                                <b>{selectedMarker.establishmentName}</b>
                            </div>
                            <div>
                                <b>{selectedMarker.aeName}</b>
                            </div>
                            <div>{placeCode}</div>
                            <div>{placeMunicipality}</div>
                            <div>{placeProvince}</div>
                            <a
                                href={generateGoogleMapsLinkByPlaceName(
                                    selectedMarker.establishmentName
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on Google Maps
                            </a>
                        </Box>
                    </InfoWindow>
                )}
            </GoogleMap>
            {/* <Card
                sx={{
                    position: "absolute",
                    zIndex: 12,
                    top: 10,
                    right: 10,
                    minWidth: "30%",
                    height: "40%",
                    maxWidth: "calc(100% - 40px)",
                    maxHeight: "calc(100% - 40px)",
                    paddingX: 2,
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column", // Ensures the Box fills up the Card
                }}
            >
                <Grid
                    container
                    direction="column"
                    height={1} // Ensure the container takes up all available space
                    sx={{ display: "flex" }}
                >
                    <Grid
                        item
                        sx={{
                            height: "25%",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="overline" fontWeight={"bold"}>
                            {selectedMarker
                                ? selectedMarker.establishmentName
                                : "Establishment Name"}
                        </Typography>
                    </Grid>
                    <Divider />
                    <Grid
                        item
                        sx={{
                            height: "15%",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2">
                            {selectedMarker
                                ? selectedMarker.aeName
                                : "Establishment Type"}
                        </Typography>
                    </Grid>
                    <Divider />
                    <Grid
                        item
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                            width: 1,
                        }}
                    >
                        <Typography variant="body2">
                            {selectedMarker
                                ? placeCode + ", " + placeMunicipality
                                : "Address"}
                        </Typography>
                    </Grid>
                    <Divider />
                    <Grid
                        item
                        sx={{
                            height: "20%",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {placeId ? (
                            <Link
                                href={generateGoogleMapsLinkByPlaceName(
                                    selectedMarker.establishmentName
                                )}
                                variant="caption"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on Google Maps
                            </Link>
                        ) : (
                            <Typography variant="caption">
                                View on Google Maps
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Card> */}
        </div>
    ) : null;
}

function ScatterPlotLocal({ points }) {
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    const [map, setMap] = useState(null);
    const [center] = useState({ lat: 13.41, lng: 122.56 });

    const onLoad = (map) => {
        setMap(map);
    };

    const [selectedMarker, setSelectedMarker] = useState(null);

    const [loading, setLoading] = useState(true);

    const calculateMarkerScale = (totalValue) => {
        const scaleFactor = 3;
        const scale = Math.sqrt(totalValue) * scaleFactor;
        return Math.max(15, Math.min(scale, 50));
    };

    const calculateTextSize = (totalValue) => {
        const textSizeFactor = 0.1;
        const textSize = Math.sqrt(totalValue) * textSizeFactor;
        return Math.max(10, Math.min(textSize, 30));
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (map) {
            const clickListener = map.addListener("click", () => {
                handleInfoWindowClose();
                setSelectedMarker(null);
            });
            return () => {
                window.google.maps.event.removeListener(clickListener);
            };
        }
    }, [map]);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker("");
    };

    return isLoaded ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                center={center}
                onLoad={onLoad}
                zoom={7}
                options={{ minZoom: 6, maxZoom: 8, styles: mapGlobe }}
            >
                {!loading
                    ? points.map(
                          (point, index) =>
                              point.TOTAL > 0 && (
                                  <Marker
                                      key={index}
                                      position={{
                                          lat: parseFloat(point.coorLat),
                                          lng: parseFloat(point.coorLng),
                                      }}
                                      onClick={() => handleMarkerClick(point)}
                                      style={{
                                          position: "relative",
                                      }}
                                      icon={{
                                          path: window.google.maps.SymbolPath
                                              .CIRCLE,
                                          fillColor: "blue", // Set the fill color of the circle
                                          fillOpacity: 0.25, // Set the fill opacity
                                          strokeColor: "blue",
                                          strokeWeight: 1, // Set the border thickness
                                          strokeOpacity: 0.5,
                                          scale: calculateMarkerScale(
                                              point.TOTAL
                                          ),
                                      }}
                                  >
                                      {/* <OverlayView
                                          onClick={() =>
                                              handleMarkerClick(point)
                                          }
                                          position={{
                                              lat: parseFloat(point.coorLat),
                                              lng: parseFloat(point.coorLng),
                                          }}
                                          mapPaneName={OverlayView.FLOAT_PANE}
                                      >
                                          <div
                                              style={{
                                                  width: "60px",
                                                  position: "absolute",
                                                  transform:
                                                      "translate(-50%, -50%)",
                                                  textAlign: "center",
                                                  padding: 0,
                                                  margin: 0,
                                                  overflow: "hidden", // Prevent text overflow
                                                  maxWidth: "100px", // Set a maximum width for the container
                                              }}
                                          >
                                              <p
                                                  style={{
                                                      fontSize: `${calculateTextSize(
                                                          point.TOTAL
                                                      )}px`,
                                                      color: "white",
                                                      padding: 0,
                                                      margin: 0,
                                                      fontWeight: 800,
                                                      overflow: "hidden", // Prevent text overflow
                                                      textOverflow: "ellipsis", // Add ellipsis (...) for hidden text
                                                      whiteSpace: "nowrap", // Keep text in a single line
                                                  }}
                                              >
                                                  {point.region}
                                              </p>
                                              <p
                                                  style={{
                                                      fontSize: `${calculateTextSize(
                                                          point.TOTAL
                                                      )}px`,
                                                      color: "white",
                                                      padding: 0,
                                                      margin: 0,
                                                      overflow: "hidden", // Prevent text overflow
                                                      textOverflow: "ellipsis", // Add ellipsis (...) for hidden text
                                                  }}
                                              >
                                                  {point.TOTAL} Tourist Arrivals
                                              </p>
                                          </div>
                                      </OverlayView> */}
                                  </Marker>
                              )
                      )
                    : null}
                {selectedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedMarker.coorLat),
                            lng: parseFloat(selectedMarker.coorLng),
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <Box>
                            <div>
                                <b>{selectedMarker.region}</b>
                            </div>
                            <div>{selectedMarker.TOTAL.toLocaleString()}</div>
                        </Box>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : null;
}

function ScatterPlotForeign({ points }) {
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    const [map, setMap] = useState(null);
    const [center] = useState({ lat: 0, lng: 0 });
    const onLoad = (map) => {
        setMap(map);
    };

    const [selectedMarker, setSelectedMarker] = useState(null);

    const [loading, setLoading] = useState(true);

    const calculateMarkerScale = (totalValue) => {
        const scaleFactor = 6;
        const scale = Math.sqrt(totalValue) * scaleFactor;
        return Math.max(30, Math.min(scale, 100));
    };

    const calculateTextSize = (totalValue) => {
        const textSizeFactor = 0.2;
        const textSize = Math.sqrt(totalValue) * textSizeFactor;
        return Math.max(10, Math.min(textSize, 30));
    };
    useEffect(() => {
        const delay = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (map) {
            const clickListener = map.addListener("click", () => {
                handleInfoWindowClose();
                setSelectedMarker(null);
            });
            return () => {
                window.google.maps.event.removeListener(clickListener);
            };
        }
    }, [map]);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker("");
    };

    return isLoaded ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                center={center}
                onLoad={onLoad}
                zoom={2}
                options={{ minZoom: 2, maxZoom: 5, styles: mapGlobe }}
            >
                {!loading
                    ? points.map(
                          (point, index) =>
                              point.TOTAL > 0 && (
                                  <Marker
                                      key={index}
                                      position={{
                                          lat: parseFloat(point.coorLat),
                                          lng: parseFloat(point.coorLng),
                                      }}
                                      style={{
                                          position: "relative",
                                      }}
                                      onClick={() => handleMarkerClick(point)}
                                      icon={{
                                          path: window.google.maps.SymbolPath
                                              .CIRCLE,
                                          fillColor: "blue", // Set the fill color of the circle
                                          fillOpacity: 0.25, // Set the fill opacity
                                          strokeColor: "blue",
                                          strokeWeight: 1, // Set the border thickness
                                          strokeOpacity: 0.5,
                                          scale: calculateMarkerScale(
                                              point.TOTAL
                                          ),
                                      }}
                                  >
                                      {/* <OverlayView
                                          position={{
                                              lat: parseFloat(point.coorLat),
                                              lng: parseFloat(point.coorLng),
                                          }}
                                          mapPaneName={OverlayView.FLOAT_PANE}
                                      >
                                          <div
                                              style={{
                                                  width: "60px",
                                                  position: "absolute",
                                                  transform:
                                                      "translate(-50%, -50%)",
                                                  textAlign: "center",
                                                  padding: 0,
                                                  margin: 0,
                                                  overflow: "hidden", // Prevent text overflow
                                                  maxWidth: "100px", // Set a maximum width for the container
                                              }}
                                          >
                                              <p
                                                  style={{
                                                      fontSize: `${calculateTextSize(
                                                          point.TOTAL
                                                      )}px`,
                                                      color: "white",
                                                      padding: 0,
                                                      margin: 0,
                                                      fontWeight: 800,
                                                      overflow: "hidden", // Prevent text overflow
                                                      textOverflow: "ellipsis", // Add ellipsis (...) for hidden text
                                                      whiteSpace: "nowrap", // Keep text in a single line
                                                  }}
                                              >
                                                  {point.region}
                                              </p>
                                              <p
                                                  style={{
                                                      fontSize: `${calculateTextSize(
                                                          point.TOTAL
                                                      )}px`,
                                                      color: "white",
                                                      padding: 0,
                                                      margin: 0,
                                                      overflow: "hidden", // Prevent text overflow
                                                      textOverflow: "ellipsis", // Add ellipsis (...) for hidden text
                                                  }}
                                              >
                                                  {point.TOTAL} Tourist Arrivals
                                              </p>
                                          </div>
                                      </OverlayView> */}
                                  </Marker>
                              )
                      )
                    : null}
                {selectedMarker && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedMarker.coorLat),
                            lng: parseFloat(selectedMarker.coorLng),
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <Box>
                            <div>
                                <b>{selectedMarker.region}</b>
                            </div>
                            <div>{selectedMarker.TOTAL.toLocaleString()}</div>
                        </Box>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : null;
}

export {
    Map,
    Heatmap,
    MapWithMarkers,
    ScatterPlotForeign,
    ScatterPlotLocal,
    PlacesAutocomplete,
};
