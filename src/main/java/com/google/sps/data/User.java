package com.google.sps.data;

/** User representing a location **/
public class User {

  private MapLocation geolocation;
  private int zipCode;

  /** Creates a user with a geolocation
  * @param geolocation lat/lng coordinate
  * @return User with geolocation
  **/
  public User(MapLocation geolocation) {
    this.geolocation = geolocation;
  }
  
  /** Creates a user with a zipcode
  * @param zipcode
  * @return User with zipCode
  **/
  public User(int zipCode) {
    this.zipCode = zipCode;
  }

  public MapLocation getGeolocation() {
    return geolocation;
  }

  public int getZipCode() {
    return zipCode;
  }
}