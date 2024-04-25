<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeatherController extends Controller
{

    private function _getWeather($lat, $lon)
    {
        $url = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability&hourly=temperature_2m,relative_humidity_2m,precipitation_probability";

        $response = file_get_contents($url);
        if (!$response) {
            return response()->json(['message' => 'Could not get weather'], 500);
        }

        // Parse response and return
        $weather = json_decode($response);

        $current = [
            'temperature' => $weather->current->temperature_2m,
            'humidity' => $weather->current->relative_humidity_2m,
            'precipitation' => $weather->current->precipitation_probability
        ];

        $forecast = collect();
        for ($i = 0; $i < count($weather->hourly->time); $i++) {
            $forecast->push([
                'time' => Carbon::parse($weather->hourly->time[$i]),
                'temperature' => $weather->hourly->temperature_2m[$i],
                'humidity' => $weather->hourly->relative_humidity_2m[$i],
                'precipitation' => $weather->hourly->precipitation_probability[$i]
            ]);
        }


        return [
            'current' => $current,
            'forecast' => $forecast
        ];
    }

    // Get weather by lat and lon
    public function getWeatherByLatLon(Request $request)
    {

        // Validat latitude and longitude is required and numeric
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        // Get lat and lon by query string
        $latitude = $request->query('latitude');
        $longitude = $request->query('longitude');

        // validate latitude and longitude
        if (!$latitude || !$longitude) {
            return response()->json(['message' => 'Latitude and longitude are required'], 400);
        }

        return Inertia::render('Weather', [
            'position' => [
                'latitude' => $latitude,
                'longitude' => $longitude,
            ],
            'weather' => $this->_getWeather($latitude, $longitude)
        ]);
    }

    // Get weather for current location
    public function getWeather(Request $request)
    {
        // Get lat and lon from IP address
        $ip = $request->ip();

        // try to get the location from the IP address
        try {
            $locationUrl = "http://ip-api.com/json/{$ip}";
            $locationResponse = file_get_contents($locationUrl);
            $locationData = json_decode($locationResponse);
            $lat = $locationData->lat;
            $lon = $locationData->lon;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Could not get location'], 500);
        }

        return $this->_getWeather($lat, $lon);
    }
}
