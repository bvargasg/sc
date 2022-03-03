import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, Spin, Badge, Collapse, List, message, Popover, Tooltip, notification, Input, Space, Checkbox, Card, Rate, Statistic} from 'antd'
import { ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Wordcloud from './Charts/Wordcloud';
import Inbound from './Inbound';
import axios from 'axios';

const { Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const domain = process.env.REACT_APP_DOMAIN;
export default class InboundDetails extends Component {
    constructor(props) {
        super(props);
        this.verOpciones = this.verOpciones.bind(this);
    }

    state = {
        loading: false,
        inbound_id: 0,
        data_wordcloud: "",
        total_llamadas: [],
        columns: [
            {
              title: 'Rut',
              dataIndex: 'rut',
              key: 'rut',
            },
            {
              title: 'Número',
              dataIndex: 'numero',
              key: 'numero',
            },
            {
              title: 'Fecha Llamada',
              dataIndex: 'llamada',
              key: 'llamada',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Button onClick={async () => await this.verOpciones(record)} type="primary">Ver Opciones</Button>
                ),
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                    <Rate disabled defaultValue={2} />
                ),
            },
        ]
    }

    async obtenerDetallesInbound(campaign){
        try{
            const data = await fetch("https://"+domain+"/smartcenter/inbounddetails?campaign="+campaign);
            const response = await data.json();

            console.log(response);

            //return response;
        }catch (error){
            console.log(error);
        }
    }

    componentDidUpdate() {
        const id = this.props.id;    
        this.setState({ inbound_id: id });
        console.log(id);
    }

    async componentDidMount() {
        try {
            //const id = this.props.id;
            //this.setState({ inbound_id: id });
        } catch (error) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async verOpciones(){

    }

    render() {
        return (
            <div style={{marginLeft: "135px"}}>
                <br/>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={2}></Col>
                        <Col span={6}></Col>
                        <Col span={2}></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={8}>
                            <Card title="Interacciones" style={{ width: "90%" }}>
                                <p style={{"textAlign":"center"}}>
                                    <Row>
                                        <Col span={12}>
                                            <Statistic title="Total de llamadas" value={1128} />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="Transferencia a agente" value={93}/>    
                                        </Col>   
                                    </Row>
                                </p>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Variación Mes" style={{ width: "90%" }}>
                                <p style={{"textAlign":"center"}}>
                                    <Statistic
                                        title="Idle"
                                        value={9.3}
                                        precision={2}
                                        valueStyle={{ color: '#cf1322' }}
                                        prefix={<ArrowDownOutlined />}
                                        suffix="%"
                                    />
                                </p>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Satisfacción" style={{ width: "85%", height: "185px" }}>
                                <br/>
                                <p style={{"textAlign":"center"}}><Rate disabled defaultValue={2} /></p>
                            </Card>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <Row>
                        <Col span={12}>
                            <Card title="Wordcloud" style={{ width: "90%", height: "500px", maxHeight: "500px" }}>
                                <p style={{"textAlign":"center"}}><Wordcloud/></p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Llamadas" style={{ width: "90%", height: "500px", maxHeight: "500px" }}>
                                <p><Table dataSource={this.state.total_llamadas} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} /></p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={2}></Col>
                        <Col span={20}></Col>
                        <Col span={2}></Col>
                    </Row>
            </div>
        )
    }
}
