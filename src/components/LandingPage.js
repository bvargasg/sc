import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { BrowserRouter as Router, Route } from "react-router-dom"
import Navbar from './Navbar'
import Topbar from './Topbar'
import Interacciones from './Interacciones'
import Dashboard from './Dashboard'
import Campaña from './Campaign'
import NuevaCampaña from './NewCampaign'
import Servicios from './Servicios'
import ConfigCampaign from './ConfigCampaign'
import Usuarios from './Usuarios'
import Inbound from './Inbound'

import { UserContext } from '../UserContext'


function LandingPage() {

        //const {user} = useContext(UserContext);
        const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM'));

        return (
            <div>                
                <Router>
                    <React.Fragment>
                    <Navbar/>
                    <Topbar/>
                        <Route exact path="/INTERACCIONES" render={props => <Interacciones usr_id={Usuario_SM.user_id} />} />
                        <Route exact path="/DASHBOARD" render={props => <Dashboard {...props} />} />
                        <Route exact path="/CAMPAÑAS" render={props => <Campaña usr_id={Usuario_SM.user_id} />} />
                        <Route exact path="/NUEVACAMPAÑA" render={props => <NuevaCampaña {...props} />} />
                        <Route exact path="/SERVICIOS" render={props => <Servicios usr_id={Usuario_SM.user_id} />} />
                        <Route exact path="/CONFIGCAMPAÑA" render={props => <ConfigCampaign usr_id={Usuario_SM.user_id} />} />
                        <Route exact path="/USUARIOS" render={props => <Usuarios usr_id={Usuario_SM.user_id} />} />
                        <Route exact path="/INBOUND" render={props => <Inbound usr_id={Usuario_SM.user_id} />} />
                    </React.Fragment>
                </Router>
            </div>
        );
}

export default LandingPage;
