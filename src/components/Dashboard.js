import React, { Component } from 'react'
import InteraccionesPorDia from './Charts/InteraccionesPorDia'
import QDocumentos from './Charts/QDocumentos'
import QTurnos from './Charts/QTurnos'
import DuracionLlamadas from './Charts/DuracionLlamadas'
import Contactabilidad from './Charts/Contactabilidad'
import ContactabilidadMesActual from './Charts/ContactabilidadMesActual'

import './Dashboard.css'

export default class Dashboard extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    state = {
        loading_dashboard: false,
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <div className="parent">
                    <div className="div1"> <InteraccionesPorDia/> </div>
                    <div className="div2"> <QDocumentos/> </div>
                </div>          

                <div className="parent">
                    <div className="div1"> <Contactabilidad/> </div>
                    <div className="div2"> <ContactabilidadMesActual/> </div>
                </div>    

                <div className="parent">
                    <div className="div1"> <QTurnos/> </div>
                    <div className="div2"> <DuracionLlamadas/> </div>
                </div>          
            </div>
        )
    }
}
