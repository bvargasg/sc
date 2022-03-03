import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, message, Popconfirm, Form, Input, notification} from 'antd'
import axios from 'axios';

const { Title } = Typography;
const domain = process.env.REACT_APP_DOMAIN;

export default class Servicios extends Component {

    constructor(props) {
        super(props);
        this.obtenerServicios = this.obtenerServicios.bind(this);
        this.EliminarServicio = this.EliminarServicio.bind(this);
        this.fillTable = this.fillTable.bind(this);
        this.GuardarServicio = this.GuardarServicio.bind(this);
    }

    state = {
        loading: false,
        servicios_api: [],
        servicios_tabla: [],
        id_usuario: 0,
        modalServiciosVisible: false,
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
                        title="Está seguro de eliminar el servicio?"
                        onConfirm={async () => await this.EliminarServicio(record)}
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

    async EliminarServicio(servicio){
        const id_servicio = servicio.key;
        const id_usuario = this.state.id_usuario;

        var id_eliminado = 0;

        await axios.post("https://"+domain+"/smartcenter/eliminarservicio", {usuario: id_usuario, servicio: id_servicio})
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

    async GuardarServicio(values){
        const nombre_servicio = values.nombre;
        const id_usuario = this.state.id_usuario;

        //setLoading_modal(true);

        var id_insertada = 0;

        await axios.post("https://"+domain+"/smartcenter/insertarservicio", {usuario: id_usuario, servicio: nombre_servicio})
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

    async obtenerServicios(){
        try{
            const usuario = this.props.usr_id;
            this.setState({ loading: true });

            const data = await fetch("https://"+domain+"/smartcenter/serviciosporusuario?usuario="+usuario);
            const array_servicios = await data.json();

            this.setState({ servicios_api: array_servicios });

            return array_servicios;
        }catch (error){
            console.log(error);
        }
    }

    async fillTable(){
        const i_api = await this.obtenerServicios();
        
        //var cont = 0;
        var arr = [];

        for (var i in i_api){
            //cont = cont + 1;

            const fila = {key: i_api[i].ID, nombre: i_api[i].NOMBRE}
            arr.push(fila);
        }

        this.setState({ servicios_tabla: arr });
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
                        <Col span={8}><Title><p style={{textAlign:"left"}}>&nbsp;&nbsp;&nbsp;Servicios</p></Title></Col>
                        <Col span={8}></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8}>
                            <p style={{textAlign:"right"}}><Button onClick={() => this.setState({ modalServiciosVisible: true })}>+</Button></p>
                            <Table dataSource={this.state.servicios_tabla} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                        </Col>
                        <Col span={8}></Col>
                    </Row>

                    <Modal title="Agregar Servicio" visible={this.state.modalServiciosVisible} onCancel={() => this.setState({ modalServiciosVisible: false })} footer={<Button key="back" onClick={() => this.setState({ modalServiciosVisible: false })}>Cancelar</Button>}>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.GuardarServicio}
                        >
                        <Form.Item
                            label="Nombre"
                            name="nombre"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresa el nombre del servicio',
                            },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <p style={{textAlign:"right"}}>
                                <Button type="primary" htmlType="submit">
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
