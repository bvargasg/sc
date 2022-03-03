import React, { Component } from 'react'
import { Card, Spin } from 'antd';
import { Gauge } from '@ant-design/charts';
import Cookies from 'js-cookie'
const domain = process.env.REACT_APP_DOMAIN;

export default class ContactabilidadMesActual extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    state = {
        turnos: {},
        config: {},
        loading: false,
        visible: "hidden"
    }

    async componentDidMount() {
        this.setState({ loading: true});

        const url = "https://"+domain+"/smartcenter/contmes";
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        var conf = {
            percent: data.perc,
            range: { color: 'l(0) 0:#bde8ff 1:#9ec9ff' },
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
            indicator: null,
            statistic: {
              title: {
                offsetY: -36,
                style: {
                  fontSize: '36px',
                  color: '#4B535E',
                },
                formatter: function formatter() {
                  return data.contactados;
                },
              },
              content: {
                style: {
                  fontSize: '24px',
                  lineHeight: '44px',
                  color: '#4B535E',
                },
                formatter: function formatter() {
                  return 'Contactados';
                },
              },
            },
        };

        this.setState({ config: conf});
        this.setState({ loading: false});
        this.setState({ visible: "visible"});
    }

    render() {
        return (
        <React.Fragment>
            <Spin spinning={this.state.loading} delay={100}>
                <br/>
                <Card title="Contactabilidad - Mes actual">
                    <Gauge style={{visibility: this.state.visible}} {...this.state.config} />
                </Card>
            </Spin>
        </React.Fragment>
        )
    }
}
