import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Timeline from "./components/Timeline";
import VerticalMenu from "./components/VerticalMenu"
import DescriptionMap from "./components/DescriptionMap"

// importing Google Maps API
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

// importing Buildings.json file as parks data to enter into Google Maps API
import * as parksData from "./data/Buildings.json";

// this is the main google maps function
// it is written inline in the App.js file unfortunately,
// however it should be able to be put in a seperate file and import it
function Map(props, level) {
  const [selectedPark, setSelectedPark] = useState(null);
  console.log(props.currentKeyword);
  console.log(props.currentKeynum);
  return (
    <GoogleMap
      // this is where the maps starting location and zoom is set when
      // opening the website
      defaultZoom={16}
      defaultCenter={{ lat: 43.47110427132252, lng: -80.5448679188489 }}
    >
      {/* this is part of the marker filtering by setting the props 
      to null  to filter trhough the data files and matching with 
      the expected markers. */}
      {parksData.buildings
        .filter(
          (building) => {
            for (let i = 0; i < building.keyword.length; i++) {
              if (props.currentKeyword === null ||
              building.keyword[i] === props.currentKeyword) {
                return building;
              }
            }
          }
        )
        .filter(
          (resource) => {
            if ((props.currentKeynum === null) ||
            resource.timeline === props.currentKeynum) {
              return resource;
            }
          }
        )
        // setting the markers on the map with the data
        // provided in buildings.json file
        .map((park) => (
          <Marker
            key={park.buildingId}
            position={{ lat: park.latitude, lng: park.longitude }}
            onClick={() => {
              setSelectedPark(park);
            }}
          />
        ))}
        
      
      {selectedPark && (
        <InfoWindow
          position={{ lat: selectedPark.latitude, lng: selectedPark.longitude }}
          onCloseClick={() => {
            setSelectedPark(null);
          }}
        >
          {/* this is the pop-up window that appears when you 
          select a marker */}
          <div>
            <h6>Currently Viewing: {props.currentKeyword}</h6>
            <h6>At Stage: {props.currentKeynum} </h6>
            <h2>{selectedPark.resourceName}</h2>
            <h5>Organizer: {selectedPark.organizer}</h5>
            <h5>Location: {selectedPark.buildingName}</h5>
            <p>{selectedPark.Description}</p>
            <a className = "link-F" href="https://www.linkedin.com/in/lcabreraortiz/">Leonardo Cabrera Ortiz</a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

// this is the function that displays the google maps window
function App() {

const [width, setWidth] = React.useState(window.innerWidth);
const [height, setHeight] = React.useState(window.innerHeight);

  const [currentKeyword, setKeyword] = useState(null);
  const [currentKeynum, setKeynum] = useState(null);

  const WrappedMap = withScriptjs(withGoogleMap(Map));
  
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    
    setHeight(window.innerHeight);
  };

  // this feature helps properly resize the objects on the map with zooming
  // and dragging
  React.useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);

    return () => window.removeEventListener("resize", updateWidthAndHeight);
});

// zoom of the web application when you open it
document.body.style.zoom = "80%"


// this is the main return fuction of App.js (the structure of the app)
  return (
    
    <div className="page-container">
      <div className="content-wrap">
      
        <Header />
        <DescriptionMap />
        <VerticalMenu setKeynum={setKeynum} currentKeynum={currentKeynum} 
        setKeyword={setKeyword} currentKeyword={currentKeyword} />
          {/* this is where the map is located in the website */}
          <div style={{ marginBottom: "50px", marginTop: "-800px", marginLeft: "300px", width: "100vw", height: "106vh" }}>            
            <WrappedMap className="googlemap"
              currentKeyword={currentKeyword}
              currentKeynum={currentKeynum}
              // THIS IS WHERE YOU HAVE TO ADD THE GOOGLE MAPS API KEY
              // THE KEY IS A URL THAT YOU PASTE IN THE BRACKETS BELOW
              // (UNCOMMENT LINE BELOW AND ENTER GOOGLE MAPS API KEY)

              googleMapURL={
                "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_MAPS_API_KEY + "&v=3.exp&libraries=geometry,drawing,places"
              }
              
              // some zoom parameters for the map
              loadingElement={<div style={{ height: "100%" }} />}
              containerElement={<div style={{ height: "100%" }} />}
              mapElement={<div style={{ height: "100%" }} />}
            />
          </div>
        <Timeline setKeynum={setKeynum} currentKeynum={currentKeynum}
        setKeyword={setKeyword} currentKeyword={currentKeyword} />
      </div>

      <Footer />
    </div>
   
  );
}

export default App;
