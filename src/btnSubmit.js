function resetGlobe() {
    console.log(document.getElementById('fICAO').value)
    getData(callback = setRoutes, ICAO=document.getElementById('fICAO').value);
}