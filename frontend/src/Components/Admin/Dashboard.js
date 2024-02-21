import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './adminHeader';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import '../Layouts/dashcontent.css';

const Dashboard = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    return (
        <div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <main className='main-container'>
                <div className='main-title'>
                    <h3>DASHBOARD</h3>
                </div>
        
                <div className='main-cards'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>USERS</h3>
                            <BsFillArchiveFill className='card_icon'/>
                        </div>
                        <h1>10</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>4</h3>
                            <BsFillGrid3X3GapFill className='card_icon'/>
                        </div>
                        <h1>12</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>10</h3>
                            <BsPeopleFill className='card_icon'/>
                        </div>
                        <h1>33</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>ALERTS</h3>
                            <BsFillBellFill className='card_icon'/>
                        </div>
                        <h1>0</h1>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
