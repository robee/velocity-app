import React, { Component } from 'react';
import { useState } from "react";
import './App.css';
import Map from './components/Map';
import Sidebar from './components/Sidebar';


function App() {
  
  return (
    <>
    <h1>University of Waterloo Concept Web App</h1>
       <Map />
    </>
  );
}

export default App;