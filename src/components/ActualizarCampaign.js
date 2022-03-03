import React from 'react'
import { useState, useEffect } from 'react';
import {Form, Row, Col, Card, Input, Button, Select, DatePicker, notification, message, Spin, Radio} from 'antd'
import axios from 'axios';
import Cookies from 'js-cookie'
//import { UserContext } from '../UserContext'

const domain = process.env.REACT_APP_DOMAIN;

function ActualizarCampaign(props){
    const [form] = Form.useForm();
    const { Option } = Select;
    
    const [archivo, setArchivo] = useState(null);
    //const [buffer_file, setBufferFile] = useState(null);

    //const {user} = useContext(UserContext);
    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM'));

    const [arr_servicios,setArrayServicios] = useState([]);
    const [arr_conf,setArrayConfiguracion] = useState([]);
    const [loading_modal, setLoading_modal] = useState(false);
    
    /*
    useEffect(() => {
        (async () => {
            //const usr_id = {user}.user.user_id;
            const usr_id = Usuario_SM.user_id
            //console.log(Usuario_SM);
            const data = await fetch("https://"+domain+"/smartcenter/serviciosporusuario?usuario="+usr_id);
            const array_servicios = await data.json();
            setArrayServicios(array_servicios);

            const data_config = await fetch("https://"+domain+"/smartcenter/configuracionporusuario?usuario="+usr_id);
            const array_conf = await data_config.json();
            setArrayConfiguracion(array_conf);
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    */

    const onFinish = (values) => {
       
        /*   FILE   */
        
        const file = {archivo}.archivo;

        const file_extension = file.name.split(".").pop();

        if(file_extension==="xlsx" || file_extension==="xls"){
            const Accion = values.Accion;
            const Estado = 1;
            const usr_ingreso = "1";

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const formData = new FormData();

            formData.append('Campaign',props.CampaignId);
            formData.append('Accion',Accion);
            formData.append('Estado',Estado);
            formData.append('Usuario_Ingreso',usr_ingreso);
            formData.append('file',file);

            setLoading_modal(true);

            try{
                axios.post("https://"+domain+"/smartcenter/crudcampaign", formData, config)
                .then(function (response){
                    console.log(response.data);

                    /*
                    var msg_output = response.data.msg;
                    var clientes_actualizados = response.data.rows_affected;

                    console.log(msg_output);
                    console.log(clientes_actualizados);

                    setLoading_modal(false);

                    if(clientes_actualizados === 0){
                        message.error(msg_output);
                    }else{
                        notification['success']({
                            message: msg_output,
                        });
                    }
                    */
                    setLoading_modal(false);
                    notification['success']({
                        message: "Lista actualizada correctamente",
                    });

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
            <div>
                <Spin spinning={loading_modal} delay={100}>
                <React.Fragment>

                <Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <Card title="Acción" style={{ width: "100%" }}>
                        <Form.Item name="Accion" label="Nombre Campaña" rules={[{required: true, message: 'Acción',},]}>
                            <Radio.Group>
                                <Radio value="1">Insertar</Radio>
                                <Radio value="0">Eliminar</Radio>
                            </Radio.Group>
                        </Form.Item>
                        </Card>
                    </Col>
                    <Col span={2}></Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <Card title="Listado de usuarios" style={{ width: "100%" }}>
                            <Form.Item name="Archivo" label="Listado de usuarios" hasFeedback rules={[{required: true, message: '',},]}>
                                <input onChange={SetFile} type="file" id="myfile" name="myfile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col span={2}></Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={2}>
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

export default ActualizarCampaign;