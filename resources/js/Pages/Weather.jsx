import Authenticated from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { Head } from "@inertiajs/react";
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Weather({ auth, position, weather }) {

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        latitude: position.latitude,
        longitude: position.longitude,
    });

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Weather</h2>}
        >
            <Head title="Weather" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-5 p-4">
                        <form>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="latitude" value="Latitude" />
                                    <TextInput
                                        id="latitude"
                                        name="latitude"
                                        className="mt-1 block w-full"
                                        value={position.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="longitude" value="Longitude" />
                                    <TextInput
                                        id="longitude"
                                        name="longitude"
                                        className="mt-1 block w-full"
                                        value={position.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="off"
                                    />
                                </div>

                            </div>
                            <button type="submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                        </form>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-5">
                        <div className="text-large pl-6 pt-3 text-lg">Current</div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-6 text-gray-900">Temperature: {weather.current.temperature}°C</div>
                            <div className="p-6 text-gray-900">Humidity: {weather.current.humidity}%</div>
                            <div className="p-6 text-gray-900">Precipitation: {weather.current.precipitation}%</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="text-large pl-6 pt-3 text-lg">Forecast</div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precipitation</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {weather.forecast.map((day) => (
                                    <tr key={day.time}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(day.time).toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.temperature}°C</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.humidity}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.precipitation}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
