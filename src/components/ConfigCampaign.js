import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, message, Popconfirm, Form, Input, notification, TimePicker, InputNumber} from 'antd'
import axios from 'axios';

const { Title } = Typography;

const domain = process.env.REACT_APP_DOMAIN;

export default class ConfigCampaign extends Component {

    constructor(props) {
        super(props);
        this.obtenerConfig = this.obtenerConfig.bind(this);
        this.EliminarConfig = this.EliminarConfig.bind(this);
        this.fillTable = this.fillTable.bind(this);
        this.GuardarConfig = this.GuardarConfig.bind(this);
    }

    state = {
        loading: false,
        config_api: [],
        config_tabla: [],
        id_usuario: 0,
        modalConfigVisible: false,
        columns: [
            {
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
              width: '80%',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                    <Popconfirm
                        title="Está seguro de eliminar esta configuración?"
                        onConfirm={async () => await this.EliminarConfig(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger">Eliminar</Button>
                    </Popconfirm>
                ),
                width: '20%',
            },
        ],
        dataSource: [
            {
              key: '1',
              nombre: 'Servicio1TEst',
            },
        ]
    }

    async EliminarConfig(config){
        const id_config = config.key;
        const id_usuario = this.state.id_usuario;

        
        var id_eliminado = 0;

        await axios.post("https://"+domain+"/smartcenter/eliminarconf", {usuario: id_usuario, conf: id_config})
        .then(function (response){
                
            var msg_output = response.data.v_msg_salida;
            id_eliminado = response.data.v_estado_insert;

            //setLoading_modal(false);

            if(id_eliminado === 0){
                message.error(msg_output);
            }else{
                notification['success']({
                    message: msg_output,
                });
            }                
        });
        await this.fillTable();
        
    }

    async GuardarConfig(values){
        const nombre_conf = values.nombre;
        const q_intentos = values.qintentos;

        const a_m = values.am._d.toTimeString().split(' ')[0];
        const p_m = values.pm._d.toTimeString().split(' ')[0];
        const medio_dia = values.mediodia._d.toTimeString().split(' ')[0];

        const id_usuario = this.state.id_usuario;

        console.log(a_m);
        console.log(p_m);
        console.log(medio_dia);

        
        //setLoading_modal(true);

        var id_insertada = 0;

        await axios.post(`https://testinginnovacion.mybluemix.net/smartcenter/insertarconfiguracion`, {usuario: id_usuario, am: a_m, pm: p_m, mediodia: medio_dia, qintentos: q_intentos, nombre: nombre_conf})
        .then(function (response){
                
            var msg_output = response.data.v_msg_salida;
            id_insertada = response.data.v_estado_insert;

            //setLoading_modal(false);

            if(id_insertada === 0){
                message.error(msg_output);
            }else{
                notification['success']({
                    message: msg_output,
                });
            }                
        });
        await this.fillTable();
        
    }

    async obtenerConfig(){        
        try{
            const usuario = this.props.usr_id;
            this.setState({ loading: true });

            const data = await fetch("https://testinginnovacion.mybluemix.net/smartcenter/configuracionporusuario?usuario="+usuario);
            const array_config = await data.json();

            this.setState({ config_api: array_config });

            return array_config;
        }catch (error){
            console.log(error);
        }        
    }

    async fillTable(){        
        const i_api = await this.obtenerConfig();
        
        //var cont = 0;
        var arr = [];

        for (var i in i_api){
            //cont = cont + 1;

            const fila = {key: i_api[i].ID, nombre: i_api[i].NOMBRE}
            arr.push(fila);
        }

        this.setState({ config_tabla: arr });
        this.setState({ loading: false });

        return arr;        
    }

    async componentDidMount() {        
        try{
            this.setState({ id_usuario: this.props.usr_id });
            await this.fillTable();
        }catch (error){
            this.setState({ loading: false });
            console.log(error);
        }        
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <br/>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8}><Title><p style={{textAlign:"left"}}>&nbsp;&nbsp;&nbsp;Configuración</p></Title></Col>
                        <Col span={8}></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8}>
                            <p style={{textAlign:"right"}}><Button onClick={() => this.setState({ modalConfigVisible: true })}>+</Button></p>
                            <Table dataSource={this.state.config_tabla} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                        </Col>
                        <Col span={8}></Col>
                    </Row>

                    <Modal title="Agregar Configuración" visible={this.state.modalConfigVisible} onCancel={() => this.setState({ modalConfigVisible: false })} footer={<Button key="back" onClick={() => this.setState({ modalConfigVisible: false })}>Cancelar</Button>}>
                    <Form
                        layout="vertical" name="control-hooks"
                        onFinish={this.GuardarConfig}
                        >
                        <Form.Item
                            label="Nombre configuración"
                            name="nombre"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresa el nombre de la configuración',
                            },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="AM"
                            name="am"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresar hora AM',
                            },
                            ]}
                        >
                            <TimePicker style={{width:"100%"}} format='HH:mm' minuteStep={1} />
                        </Form.Item>

                        <Form.Item
                            label="Medio Día"
                            name="mediodia"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresar hora MEDIODIA',
                            },
                            ]}
                        >
                            <TimePicker style={{width:"100%"}} format='HH:mm' minuteStep={1} />
                        </Form.Item>

                        <Form.Item
                            label="PM"
                            name="pm"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresar hora PM',
                            },
                            ]}
                        >
                            <TimePicker style={{width:"100%"}} format='HH:mm' minuteStep={1} />
                        </Form.Item>

                        <Form.Item
                            label="Q intentos"
                            name="qintentos"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresar Q de Intentos',
                            },
                            ]}
                        >
                            <InputNumber style={{width:"100%"}} min={1} max={10}/>
                        </Form.Item>

                        <Form.Item>
                            <p style={{textAlign:"right"}}>
                                <Button style={{width:"100%"}} type="primary" htmlType="submit">
                                    Guardar
                                </Button>
                            </p>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
