import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, Spin, Badge, Collapse, List, message, Popover, Tooltip, notification, Input, Space, Checkbox, Card, Rate, Statistic, Form, InputNumber} from 'antd'
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import axios from 'axios';
import InboundDetails from './InboundDetails';
import {  ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Wordcloud from './Charts/Wordcloud';
import InboundChart from './Charts/InboundChart';

const { Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const domain = process.env.REACT_APP_DOMAIN;

export default class Inbound extends Component {
    constructor(props) {
        super(props);
        this.TraerServiciosInbound = this.TraerServiciosInbound.bind(this);
        this.verDetalle = this.verDetalle.bind(this);
        this.VerCostos = this.VerCostos.bind(this);
        this.NuevoServicioInbound = this.NuevoServicioInbound.bind(this);
        this.VolverInbound = this.VolverInbound.bind(this);
        this.TraerExtraInbound = this.TraerExtraInbound.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.cerrarModalNewInbound = this.cerrarModalNewInbound.bind(this);
        this.submitInbound = this.submitInbound.bind(this);
    }

    async TraerServiciosInbound(){
        try {
            const usuario = this.props.usr_id;
            this.setState({ loading: true });
    
            const data = await fetch("https://"+domain+"/smartcenter/getcampaigns?usuario="+usuario+"&tipo=1");
            const array_inbound = await data.json();
    
            return array_inbound;
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async TraerExtraInbound(id_campaign){
        try {
            const usuario = this.props.usr_id;
            this.setState({ loading: true });
    
            const data = await fetch("https://"+domain+"/smartcenter/inboundextra?campaign="+id_campaign);
            const array_inbound = await data.json();
    
            return array_inbound;
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async cargarServiciosInbound(){
        try {
            const i_api = await this.TraerServiciosInbound();
            console.log(i_api);
            
            //var cont = 0;
            var arr = [];
    
            for (var i in i_api){
                //cont = cont + 1;
                var fecha_creacion = i_api[i].FECHA_INGRESO;
                
                const i_api_extra = await this.TraerExtraInbound(i_api[i].ID);
                //console.log(i_api_extra);

                const fila = {key: i_api[i].ID, nombre: i_api[i].NOMBRE, numero: i_api[i].TELEFONO, creacion: fecha_creacion, llamadas: i_api_extra.total_llamadas,motivo: i_api_extra.most_repeated}
                arr.push(fila);
            }
    
            this.setState({ servicios_inbound: arr });
            this.setState({ loading: false });
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
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

    async componentDidMount() {
        try {
            await this.cargarServiciosInbound();
        } catch (error) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async getDetalles(campaign){
        const url = "https://"+domain+"/smartcenter/inbounddetails?campaign="+campaign;
        const data = await fetch(url);
        const salida_datos = await data.json();   

        return salida_datos;
    }

    async verDetalle(registro){
        const id_camp = registro.key;
        this.setState({ inbound_id: id_camp });

        this.setState({ loading: true });
        const salida_datos = await this.getDetalles(id_camp);   
        this.setState({ loading: false });

        //console.log(salida_datos);

        this.setState({ total_llamadas: salida_datos.total_llamadas });
        this.setState({ total_transferencia_agentes: salida_datos.total_llamadas_transferencia });
        this.setState({ promedio_satisfaccion: salida_datos.total_satisfaccion });
        this.setState({ Word_cloud : salida_datos.wordcloud });

        this.setState({ listado_llamadas : salida_datos.listado_llamadas });

        var variacion;
        var variacion_color;
        var flecha;

        if(salida_datos.variacion_mes > 0){
            variacion_color = "#3f8600";    //VERDE
            variacion = salida_datos.variacion_mes;
            flecha = "▲";
        }else{
            variacion_color = "#cf1322"; //ROJO
            variacion = salida_datos.variacion_mes * -1;
            flecha = "▼";
        }

        this.setState({ variacion_mes: variacion });
        this.setState({ color_variacion: variacion_color });
        this.setState({ arrow: flecha });
        

        this.setState({ display_back_button: "block" });
        this.setState({ display_table: "none" });
        this.setState({ display_details: "block" });
        this.setState({ show_details: true });

    }

    async VerCostos(registro){

    }

    async NuevoServicioInbound(){
        this.setState({ isModalVisibleNewInbound: true });
    }

    cerrarModal(){
        this.setState({ isModalVisible: false });
    }

    cerrarModalNewInbound(){
        this.setState({ isModalVisibleNewInbound: false });
    }

    async submitInbound(values){
        //console.log(values);
        try {
            const nombre = values.nombre;    
            const fono = values.fono.fono;
            const opciones = values.opciones;

            await axios.post("https://"+domain+"/smartcenter/inboundnewservice", {nombre: nombre, fono: fono, opciones: opciones, usuario: this.props.usr_id})
            .then(function (response){
                    
                //var msg_output = response.data.v_msg_salida;
                //test
            
            });

        } catch (error) {
            
        }
    }

    VolverInbound(){
        //alert("test");
        this.setState({ display_back_button: "none" });
        this.setState({ show_details: false });
        this.setState({ display_table: "block" });
        this.setState({ display_details: "none" });
    }

    verOpciones(record){
        this.setState({ isModalVisible: true });
        this.setState({ listado_opciones: [] });

        var opciones = record.OPCIONES;
        var arr = [];

        for(var o in opciones){
            var fila = {opcion:opciones[o]};
            arr.push(fila);
        }
        console.log(arr);
        this.setState({ listado_opciones: arr });
    }

    state = {
        loading: false,
        loading_options: false,
        show_details: false,
        display_back_button: "none",
        display_details: "none",
        display_table: "block",
        inbound_id: 0,
        servicios_inbound: [],
        total_llamadas: 0,
        total_transferencia_agentes: 0,
        variacion_mes: 0,
        color_variacion:"",
        arrow:"",
        promedio_satisfaccion: 0,
        Word_cloud: [],
        listado_llamadas: [],
        listado_opciones: [],
        listado_opciones_columns: [
            {
                title: 'Opción',
                dataIndex: 'opcion',
                key: 'opcion',
            }
        ],
        isModalVisible: false,
        isModalVisibleNewInbound: false,
        columns: [
            {
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
            },
            {
              title: 'Número',
              dataIndex: 'numero',
              key: 'numero',
            },
            {
              title: 'Fecha Creación',
              dataIndex: 'creacion',
              key: 'creacion',
            },
            {
                title: 'Llamadas recibidas',
                dataIndex: 'llamadas',
                key: 'llamadas',
            },
            {
              title: 'Motivo Principal',
              dataIndex: 'motivo',
              key: 'motivo',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Button onClick={async () => await this.verDetalle(record)} type="primary">Ver detalle</Button>
                ),
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Button onClick={async () => await this.VerCostos(record)} type="danger">Ver Costos</Button>
                ),
            },
        ],
        columns_detalle: [
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
              dataIndex: 'fecha',
              key: 'fecha',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Button onClick={async () => await this.verOpciones(record)} type="primary">Ver Opciones</Button>
                ),
            },
        ]
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <br/>
                <Row>
                    <Col span={2}>
                        <Button onClick={this.VolverInbound} style={{display:this.state.display_back_button}} size={'large'} icon={<ArrowLeftOutlined />}></Button>
                    </Col>
                    <Col span={20}><Title>Inbound</Title></Col>
                    <Col span={2}></Col>
                </Row>
                <br/>

                <Spin spinning={this.state.loading} delay={100}>
                <div style={{display:this.state.display_table}}>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20}>
                            <p style={{textAlign:"right"}}><Button onClick={() => this.NuevoServicioInbound()}>+</Button></p>
                            <Table dataSource={this.state.servicios_inbound} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </div>
                </Spin>

                <div style={{display:this.state.display_details}}>
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
                                                                <Statistic title="Total de llamadas" value={this.state.total_llamadas} />
                                                            </Col>
                                                            <Col span={12}>
                                                                <Statistic title="Transferencia a agente" value={this.state.total_transferencia_agentes}/>    
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
                                                            value={this.state.variacion_mes}
                                                            precision={2}
                                                            valueStyle={{ color: this.state.color_variacion }}
                                                            prefix={this.state.arrow}
                                                            suffix="%"
                                                        />
                                                    </p>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card title="Satisfacción" style={{ width: "85%", height: "185px" }}>
                                                    <br/>
                                                    <p style={{"textAlign":"center"}}><Rate disabled defaultValue={this.state.promedio_satisfaccion} value={this.state.promedio_satisfaccion} /></p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <br/>
                                        <Row>
                                            <Col span={12}>
                                                <InboundChart palabras={this.state.Word_cloud}/>
                                            </Col>
                                            <Col span={12}>
                                                <Card title="Llamadas" style={{ width: "90%", height: "500px", maxHeight: "500px" }}>
                                                    <p><Table dataSource={this.state.listado_llamadas} columns={this.state.columns_detalle} pagination={{ defaultPageSize: 10}} loading={this.state.loading} /></p>
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

                </div>
                <Modal width={500} title="Opciones" visible={this.state.isModalVisible} onOk={() => this.cerrarModal()} onCancel={() => this.cerrarModal()} footer={[<Button key="submit" type="danger" onClick={() => this.cerrarModal()}>Cerrar</Button>,]}>
                    <Table dataSource={this.state.listado_opciones} columns={this.state.listado_opciones_columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading_options} />
                </Modal>
                <Modal width={500} title="New Inbound" visible={this.state.isModalVisibleNewInbound} onOk={() => this.cerrarModalNewInbound()} onCancel={() => this.cerrarModalNewInbound()} footer={[<Button key="submit" type="danger" onClick={() => this.cerrarModalNewInbound()}>Cerrar</Button>,]}>
                <Form name="dynamic_form_nest_item" onFinish={this.submitInbound} autoComplete="off">
                    <Form.Item
                        label="Nombre"
                        name="nombre"
                        rules={[
                        {
                            required: true,
                            message: 'Ingresar nombre para servicio inbound',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['fono', 'fono']}
                        label="Número"
                        rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99999999999,
                            required: true,
                            message: 'Ingresar número asociado',
                        },
                        ]}
                    >
                        <InputNumber style={{"width":"100%"}} />
                    </Form.Item>
                    <Form.List name="opciones">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                {...restField}
                                name={[name, 'opcion']}
                                fieldKey={[fieldKey, 'opcion']}
                                rules={[{ required: true, message: 'Missing first name' }]}
                                >
                                <Input placeholder="Opción" />
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'desc']}
                                fieldKey={[fieldKey, 'desc']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                                >
                                <Input placeholder="Descripción" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                            ))}
                            <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Agregar Opción
                            </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        )
    }
}
