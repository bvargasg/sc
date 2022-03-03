import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, Spin, message, Input, Tooltip} from 'antd'
import { PlaySquareOutlined } from '@ant-design/icons';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ChatBubble from 'react-chat-bubble';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './Interacciones.css'
const { Title } = Typography;
const domain = process.env.REACT_APP_DOMAIN;

export default class Interacciones2 extends Component {
    constructor(props) {
        super(props);
        this.obtenerInteracciones = this.obtenerInteracciones.bind(this);
        this.verDetalle = this.verDetalle.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.cerrarModalRecording = this.cerrarModalRecording.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.SearchCampaign = this.SearchCampaign.bind(this);
        this.getRecordingId = this.getRecordingId.bind(this);
        this.mostrarModalRecording = this.mostrarModalRecording.bind(this);
    }

    async verDetalle(registro){
        //EXISTE CONVERSACION/DETALLE
        const data_response_ed = await fetch("https://"+domain+"/smartcenter/existeconversacion?id_llamada="+registro.key);
        const json_response_ed = await data_response_ed.json();
        const bool_existe_detalle = json_response_ed[0].EXISTE_CONVERSACION;    //1     0

        if (bool_existe_detalle === 1){
            this.setState({ isModalVisible: true });
            //INIT
            if(registro.key !== this.state.s_id_llamada){   //DIFERENCE PETICIÓN
                const id_interaccion = registro.key;
                this.setState({ s_id_llamada: id_interaccion });

                //INIT
                this.setState({ chat_bubbles: []});

                this.setState({ q_turnos: "" });
                this.setState({ q_timeouts: "" });
                this.setState({ avg_confidence: "" });
                this.setState({ transcripciones: [] });
            
                this.setState({ loading_modal: true });
                const url = "https://"+domain+"/smartcenter/detalleinteraccion?id_llamada="+id_interaccion;
                const data = await fetch(url);
                const array_detalle_llamada = await data.json();
        
                console.log(array_detalle_llamada);
                
                if (array_detalle_llamada.length > 0){
                    this.setState({ q_turnos: array_detalle_llamada[0].v_turnos });
                    this.setState({ q_timeouts: array_detalle_llamada[0].v_timeouts });
                    this.setState({ avg_confidence: array_detalle_llamada[0].v_confidence });
                    this.setState({ v_sid: array_detalle_llamada[0].v_sid });
                    await this.getRecordingId(array_detalle_llamada[0].v_sid);
        
                    this.setState({ transcripciones: array_detalle_llamada });

                    for(var i in array_detalle_llamada){
                        var tipo = 0;
                        var msg = "";
                        var img = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

                        if (array_detalle_llamada[i].SPEAKER === "AGENTE"){
                            tipo = 1;
                        }else{
                            tipo = 0;
                        }

                        msg = array_detalle_llamada[i].TRANSCRIPCION;

                        const mensaje = {"type": tipo, "image": img, "text": msg};
                        this.state.chat_bubbles.push(mensaje);
                    }
                }
        
                this.setState({ loading_modal: false });   
            }
        }else{
            message.error('No existe detalle para esta interacción');
        }
        
    }

    async getRecordingId(callsid){
        try {
            this.setState({ loading_modal_recording: true });

            const url = "https://"+domain+"/smartcenter/recordingsid?sid="+callsid;
            const data = await fetch(url);
            const data_json = await data.json();

            if(data_json.recording_sid !== undefined){
                const url = "https://api.twilio.com/2010-04-01/Accounts/ACd7f68dd1a69a86337001b4c4c497b623/Recordings/"+data_json.recording_sid;
                this.setState({ recording_url: url });
                this.setState({ loading_modal_recording: false });
            }else{
                this.setState({ recording_url: "" });
            }

        } catch (error) {
            console.log(error);
            this.setState({ loading_modal_recording: false });
        }
    }

    cerrarModal(){
        this.setState({ isModalVisible: false })
    }

    cerrarModalRecording(){
        this.setState({ isModalVisibleRecording: false });
    }

    async mostrarModalRecording(){
        if(this.state.recording_url === ""){
            message.error('No existe grabación de audio');
        }else{
            this.setState({ isModalVisibleRecording: true });
        }
    }

    state = {
        loading: false,
        isModalVisible: false,
        isModalVisibleRecording: false,
        loading_modal: false,
        loading_modal_recording: false,
        interacciones_api: [],
        interacciones_tabla: [],
        interacciones_tabla_backup: [],
        transcripciones: [],
        chat_bubbles: [],
        s_id_llamada: 0,
        q_turnos: 0,
        q_timeouts: 0,
        v_sid: "",
        recording_url: "",
        avg_confidence: 0,
        nameSearch: "",
        columns: [
            {
              title: 'Número',
              dataIndex: 'numero',
              key: 'numero',
            },
            {
              title: 'Fecha',
              dataIndex: 'fecha',
              key: 'fecha',
            },
            {
              title: 'Duración llamada',
              dataIndex: 'duracion',
              key: 'duracion',
            },
            {
              title: 'Motivo corte',
              dataIndex: 'corte',
              key: 'corte',
            },
            {
                title: 'Campaña',
                dataIndex: 'campaign',
                key: 'campaign',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Button onClick={async () => await this.verDetalle(record)} type="primary">Ver detalle</Button>
                ),
              },
        ],
        dataSource: [
            {
              key: '1',
              número: '56992667132',
              fecha: '14-01-2021',
              duracion: '00:01:27',
              corte: 'BYE',
            },
            {
              key: '2',
              número: '56993694122',
              fecha: '14-01-2021',
              duracion: '00:04:57',
              corte: 'BYE',
            },
        ]
    }

    async obtenerInteracciones(){
        try{
            const usuario = this.props.usr_id;
            this.setState({ loading: true });

            console.log("usuario:",usuario);
            const data = await fetch("https://"+domain+"/smartcenter/traerinteracciones?usuario="+usuario);
            const array_interacciones = await data.json();

            this.setState({ interacciones_api: array_interacciones });

            return array_interacciones;
        }catch (error){
            console.log(error);
        }
    }

    async fetchData(){
        try{
            console.log("fetch data start");
            const i_api = await this.obtenerInteracciones();
            console.log(i_api);
        
            //var cont = 0;
            var arr = [];

            for (var i in i_api){
                //cont = cont + 1;

                var vfecha = i_api[i].FECHA;
                vfecha = vfecha.split(".")[0];
                vfecha = vfecha.replace("T"," ");

                const fila = {key: i_api[i].ID, numero: i_api[i].ANI, fecha: vfecha, duracion: i_api[i].DURACION_LLAMADA, corte: i_api[i].MOTIVO_CORTE, campaign: i_api[i].NOMBRE_CAMPAIGN}
                arr.push(fila);
            }

            this.setState({ interacciones_tabla: arr });
            this.setState({ loading: false });
        }catch (error){
            console.log(error);
        }
    }

    async componentDidMount() {
        try{
            await this.fetchData();

            //TRAER INTERACCIONES - WEBSOCKET

            const ws = new W3CWebSocket("ws://"+domain+"/ws/interacciones");
            const ws_orq = new W3CWebSocket("ws://"+domain+"/ws/interacciones");
            ws.onopen = () => {
                
            };
            ws.ws_orq = () => {
                
            };
            ws.onmessage = async (message) => {
                await this.fetchData();
            }
            ws_orq.onmessage = async (message) => {
                await this.fetchData();
            }

            //-------------------------------
        
        }catch (error){
            this.setState({ loading: false });
            console.log(error);
        }
    }

    SearchCampaign(input){
        input = input.trim();
        if(input.length>0){
            this.setState({ interacciones_tabla_backup: this.state.interacciones_tabla });
            this.setState({interacciones_tabla: this.state.interacciones_tabla.filter(int =>int.campaign.includes(input))})
        }else{
            this.setState({ interacciones_tabla: this.state.interacciones_tabla_backup });
        }
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <br/>
                <Row>
                    <Col span={4}></Col>
                    <Col span={16}><Title>Interacciones</Title></Col>
                    <Col span={4}></Col>
                </Row>
                <br/>
                <Row>
                    <Col span={4}></Col>
                    <Col span={16}>
                        <Title level={5}>Filtro - Campaña</Title>
                        <Input.Search
                        allowClear
                        onSearch=
                                {nameSearch => this.SearchCampaign(nameSearch)}
                        />
                        <Table dataSource={this.state.interacciones_tabla} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                    </Col>
                    <Col span={4}></Col>
                </Row>

                <Modal width={1000} title="Detalle de llamada" visible={this.state.isModalVisible} onOk={() => this.cerrarModal()} onCancel={() => this.cerrarModal()} footer={[<Button key="submit" type="danger" onClick={() => this.cerrarModal()}>Cerrar</Button>,]}>
                    <Spin spinning={this.state.loading_modal} delay={100}>
                        <Row>
                            <Col span={18}>
                                <h4>Transcripción</h4>
                                <br/>
                                <p style={{display:"flex", justifyContent:"space-between"}}>
                                    <h5>Agente Virtual</h5>
                                    <h5>Cliente</h5>
                                </p>
                                <div style={{ overflowX: "hidden", overflowY: "scroll", maxHeight: "500px"}}>
                                    <ChatBubble messages = {this.state.chat_bubbles}/>
                                </div>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={4}>
                                <p style={{width: "100%", textAlign: "left"}} className="ant-btn ant-btn-primary">Q de turnos: {this.state.q_turnos}</p>
                                <p style={{width: "100%", textAlign: "left"}} className="ant-btn ant-btn-primary">Q de Timeouts: {this.state.q_timeouts}</p>
                                <p style={{width: "100%", textAlign: "left"}} className="ant-btn ant-btn-primary">Confidence: {this.state.avg_confidence}</p>
                                <p style={{width: "100%", textAlign: "left"}} > 
                                    <Tooltip title="Reproducir audio" placement="bottom">
                                        <Button onClick={async () => await this.mostrarModalRecording()} shape="circle" icon={<PlaySquareOutlined />} /> 
                                    </Tooltip>
                                </p>
                            </Col>
                        </Row>
                    </Spin>
                </Modal>

                <Modal width={500} title="Grabación de llamada" visible={this.state.isModalVisibleRecording} onOk={() => this.cerrarModalRecording()} onCancel={() => this.cerrarModalRecording()} footer={[<Button key="submit" type="danger" onClick={() => this.cerrarModalRecording()}>Cerrar</Button>,]}>
                    <Spin spinning={this.state.loading_modal_recording} delay={100}>
                        <AudioPlayer src={this.state.recording_url} />
                    </Spin>
                </Modal>
            </div>
        )
    }
}
