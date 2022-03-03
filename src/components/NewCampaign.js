import React from 'react'
import { useState, useEffect } from 'react';
import {Form, Row, Col, Card, Input, Button, Select, DatePicker, notification, message, Spin} from 'antd'
import axios from 'axios';
import Cookies from 'js-cookie'
//import { UserContext } from '../UserContext'

const domain = process.env.REACT_APP_DOMAIN;

function NewCampaign(){
    const [form] = Form.useForm();
    const { Option } = Select;
    
    const [archivo, setArchivo] = useState(null);
    //const [buffer_file, setBufferFile] = useState(null);

    //const {user} = useContext(UserContext);
    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM'));

    const [arr_servicios,setArrayServicios] = useState([]);
    const [arr_conf,setArrayConfiguracion] = useState([]);
    const [loading_modal, setLoading_modal] = useState(false);
    

    useEffect(() => {
        (async () => {
            //const usr_id = {user}.user.user_id;
            const usr_id = Usuario_SM.user_id
            console.log(Usuario_SM);
            const data = await fetch("https://"+domain+"/smartcenter/serviciosporusuario?usuario="+usr_id);
            const array_servicios = await data.json();
            setArrayServicios(array_servicios);

            const data_config = await fetch("https://"+domain+"/smartcenter/configuracionporusuario?usuario="+usr_id);
            const array_conf = await data_config.json();
            setArrayConfiguracion(array_conf);
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onFinish = (values) => {
       
        /*   FILE   */
        
        const file = {archivo}.archivo;

        const file_extension = file.name.split(".").pop();

        if(file_extension==="xlsx" || file_extension==="xls"){
            const Campaña = values.Campaña;
            const Servicio = values.Servicio;
            const Configuracion = values.Configuracion;
            const Fecha_Inicio = values.Start_Date._d;
            const Estado = 1;
            const usr_ingreso = "1";

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const formData = new FormData();

            formData.append('Campaign',Campaña);
            formData.append('Servicio',Servicio);
            formData.append('Configuracion',Configuracion);
            formData.append('Fecha_Inicio',Fecha_Inicio);
            formData.append('Estado',Estado);
            formData.append('Usuario_Ingreso',usr_ingreso);
            formData.append('file',file);

            setLoading_modal(true);

            try{
                axios.post("https://"+domain+"/smartcenter/ingresocampaign", formData, config)
                .then(function (response){
                    var msg_output = response.data.v_output;
                    var id_insert = response.data.v_id_insert;
                    var clientes_insertados = response.data.clientes_insertados;

                    console.log(msg_output);
                    console.log(id_insert);
                    console.log(clientes_insertados);

                    setLoading_modal(false);

                    if(id_insert === 0){
                        message.error(msg_output);
                    }else{
                        notification['success']({
                            message: msg_output,
                            description:
                            'Clientes registrados: '+clientes_insertados,
                        });
                    }
                })
            }catch(error){
                setLoading_modal(false);
            }

        }else{
            message.error('Extension incorrecta. Por favor, ingresar archivo Excel');
        }
    };

        /*
        const normFile = (e) => {
            console.log('Upload event:', e);
        
            if (Array.isArray(e)) {
            return e;
            }
        
            return e && e.fileList;
        };
        */

        function SetFile(e){
            console.log(e.target.files[0]);
            setArchivo(e.target.files[0]);

            /*
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            
            reader.onload=(e)=>{    
                setBufferFile(e.target.result);
            }
            */
        }
    
        return (
            <div style={{marginLeft: "250px",marginTop:"80px"}}>
                <Spin spinning={loading_modal} delay={100}>
                <React.Fragment>

                <Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <Card title="Información de la Campaña" style={{ width: "100%" }}>
                        <Form.Item name="Campaña" label="Nombre Campaña" rules={[{required: true, message: 'Ingresa un nombre para la campaña',},]}>
                            <Input />
                        </Form.Item>
                        
                        <Form.Item name="Servicio" label="Servicio" hasFeedback rules={[{required: true, message: 'Ingresa el servicio al cuál corresponde',},]}>
                            <Select placeholder="Selecciona un servicio">
                                {
                                    arr_servicios.map(item => (
                                        <Option key={item.ID} value={item.ID}>{item.NOMBRE}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item name="Configuracion" label="Configuracion" hasFeedback rules={[{required: true, message: 'Ingresa una configuración para la campaña',},]}>
                            <Select placeholder="Selecciona una configuración">
                                {
                                    arr_conf.map(item => (
                                        <Option key={item.ID} value={item.ID}>{item.NOMBRE}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item name="Start_Date" label="Fecha Inicio" rules={[{required: true, message: 'Selecciona una fecha de inicio para la campaña',},]}> 
                            <DatePicker placeholder="Fecha Inicio" style={{width:"100%"}}/>
                        </Form.Item>
                        </Card>
                    </Col>
                    <Col span={2}></Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={10}>
                        <Card title="Listado de usuarios" style={{ width: "100%" }}>
                            <Form.Item name="Archivo" label="Listado de usuarios" hasFeedback rules={[{required: true, message: '',},]}>
                                <input onChange={SetFile} type="file" id="myfile" name="myfile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col span={10}>
                        {/*
                        <Card title="Templates" style={{ width: "100%" }}>
                        
                        </Card>
                        */}
                    </Col>
                    <Col span={2}></Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={2}>
                        {/*<Form.Item {...tailLayout}>*/}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>

                </Form>

                </React.Fragment>
                </Spin>
            </div>
        )
    }

export default NewCampaign;
