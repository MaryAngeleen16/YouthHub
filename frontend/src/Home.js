// Home.js
import React from 'react';
import Navbar from './Components/Layouts/navBar'; // Import the Navbar component
import './Home.css';
// import BannerImage from "./Public/images/home.png"

const Home = () => {
    return (
        <div>
            <Navbar /> {/* Render the Navbar component */}
            <div class="container-banner">
                <div class="row-banner">
                    <div class="col-banner">
                        <div class="WomanReadingWithBaby">
                            <img class="WomanReadingWithBaby" src="/images/girlbanner.png" alt="Banner" />
                        </div>
                    </div>
                    <div class="col-banner">
                        <div class="Frame21">
                            <div class="Frame9">
                                <div class="YouthEmpowerment">Youth Empowerment Hub</div>
                                <div class="LoremIpsumDolorSitAmetSitTeFerriHabemusConstitutoSimulFuissetProAdUtPerpetuaModeratiusSitMeaNeDictaLaoreetOporteatVerteremOcurreretLiberavisseNeUsuOmnisAtomorumNamInAliquamSalutatusPro">Lorem ipsum dolor sit amet, sit te ferri habemus constituto, <br />simul fuisset pro ad. Ut perpetua moderatius sit. Mea ne dicta <br />laoreet oporteat. Verterem ocurreret liberavisse ne usu, omnis<br />atomorum nam in. Aliquam salutatus pro</div>
                                <div class="Frame8">
                                    <div className="Frame1">
                                        <div className="Button-banner" onClick={() => { window.location.href = '/login'; }}>CREATE ACCOUNT</div>
                                    </div>
                                    <div className="Frame6">
                                        <div className="Button-banner" onClick={() => { window.location.href = '/VideosPage'; }}>WATCH VIDEO</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-banner-container">
                <div className="home-bannerImage-container">
                    {/* 
                    <img src="/images/home.png" alt="Banner" /> 
                    Uncomment this line if you want to render a different banner image
                    */}
                </div>
            </div>
        </div>
    );
};

export default Home;