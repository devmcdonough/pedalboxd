import React from "react";
import Header from "../../shared/header/header";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../shared/searchbar/searchbar";
import Carousel from "../../shared/carousel/carousel";
import './home-page.scss';

const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const registrationSuccess = location.state?.registrationSuccess;

    const brands = [
        {name: 'MXR', image: '/images/MXR.png'},
        {name: 'Walrus', image: '/images/walrus.png'},
        {name: 'Boss', image: '/images/boss.png'},
        {name: 'Wampler', image: '/images/wampler.png'},
        {name: 'Strymon', image: '/images/strymon.png'},
    ]

    const types = [
        { name: 'Fuzz', image: '/images/fuzz.png' },
        { name: 'Delay', image: '/images/delay.png' },
        { name: 'Reverb', image: '/images/reverb.png' },
        { name: 'Overdrive', image: '/images/overdrive.png' },
        { name: 'EQ', image: '/images/eq.png' },
        { name: 'Distortion', image: '/images/distortion.png' }
      ];

    const handleSearch = (query, sortOption) => {
        navigate("/search", {state: {query, sort: sortOption}});
        console.log('Search for', query);
    };

    const handleSuggestionSelect = (suggestion) => {
        navigate("/search", {state: {query: suggestion} });
    };

    return (
        <div className="homepage">
            {registrationSuccess && (
                <p className="success-message">Registration Successful!</p>
            )}

            {/* Hero Section */}
            <div 
                className="homepage-hero"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/pedalboard.jpg)` }}
            >
                <div className="homepage-hero__content">
                    <h1 className="homepage-hero__title">Find your Pedal</h1>
                    <SearchBar 
                        onSearch={handleSearch} 
                        onSuggestionSelect={handleSuggestionSelect} 
                    />
                </div>
            </div>
            <Carousel title="Brands" items={brands} filterKey="brand"/>
            <Carousel title="Types" items={types} filterKey="type"/>
        </div>
    );
};

export default HomePage;