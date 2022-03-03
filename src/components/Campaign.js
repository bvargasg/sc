import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, Spin, Badge, Collapse, List, message, Popover, Tooltip, notification, Input, Space, Checkbox} from 'antd'
import { FileExcelOutlined, CaretRightOutlined, PauseOutlined, StopOutlined, UploadOutlined, CheckSquareOutlined, CloseSquareOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import ExportExcel from 'react-export-excel'
import axios from 'axios';
import './Interacciones.css'
import NuevaCampaign from './NewCampaign_Modal'
import ActualizarCampaign from './ActualizarCampaign'
import Highlighter from 'react-highlight-words';

const { Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;

const domain = process.env.REACT_APP_DOMAIN;

export default class Campaign extends Component {
    constructor(props) {
        super(props);
        this.obtenerInteracciones = this.obtenerInteracciones.bind(this);
        this.ExportarCampaign = this.ExportarCampaign.bind(this);
        this.GenerarExcel = this.GenerarExcel.bind(this);
        this.verDetalle = this.verDetalle.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.ModalCampaign = this.ModalCampaign.bind(this);
        this.cambiarEstadoPopUp = this.cambiarEstadoPopUp.bind(this);
        this.cambiarEstado = this.cambiarEstado.bind(this);
        this.triggerCall = this.triggerCall.bind(this);
        this.ModalActualizarLista = this.ModalActualizarLista.bind(this);
        this.MostrarSMS = this.MostrarSMS.bind(this);
        this.SeleccionarRegistro = this.SeleccionarRegistro.bind(this);
        this.borrarRegistros = this.borrarRegistros.bind(this);
    }

    async SeleccionarRegistro(registro){
        var rut = registro.rut;
        var index_found = -1;
        var found = false;
        

        for(var i in this.state.registros_seleccionados){
            if(this.state.registros_seleccionados[i].rut === rut){
                index_found = i;
                found = true;
                break;
            }
        }

        if(found){
            this.state.registros_seleccionados.splice(index_found,1);
        }else{
            this.state.registros_seleccionados.push(registro);
        }
    }

    async borrarRegistros(){
        try {
            if(this.state.registros_seleccionados.length>0){

                var arr = this.state.registros_seleccionados;
                var id_camp = this.state.s_id_campaign;
                //setLoading_modal(true);
                try{
                    await axios.post("https://"+domain+"/smartcenter/deleteclients", {array_clientes: arr,id_campaign:id_camp})
                    .then(function (response){
                        var rows_affected = response.data;

                        if(rows_affected>0){
                            notification['success']({
                                message: 'Campaña actualizada correctamente.',
                            });
                        }else{
                            message.error("Error al actualizar el listado.");
                        }
                    });
                }catch(error){
                    //setLoading_modal(false);
                }

            }else{
                message.warning('Debe seleccionar un registro');
            }
        } catch (error) {
            
        }
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  this.setState({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
    };
    
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    async verDetalle(registro){
        
        try {
            this.setState({ isModalVisible: true });
            //INIT
            if(registro.key !== this.state.s_id_campaign){   //DIFERENCE PETICIÓN
                const id_camp = registro.key;
                this.setState({ s_id_campaign: id_camp });
    
                //INIT
                
                this.setState({ loading_modal: true });
                const url = "https://"+domain+"/smartcenter/clientspercampaignmdb?campaign="+id_camp;
                const data = await fetch(url);
                const array_detalle_campaign = await data.json();                
    
                if (array_detalle_campaign.length > 0){
    
                    var arr = [];
    
                    this.setState({ total_interacciones: array_detalle_campaign[0].v_totales_interacciones });
                    this.setState({ total_interacciones_realizadas_llamadas: array_detalle_campaign[0].v_totales_realizadas_llamadas });
                    this.setState({ total_interacciones_realizadas_sms: array_detalle_campaign[0].v_totales_realizadas_sms });
                    this.setState({ total_interacciones_realizadas_mailing: array_detalle_campaign[0].v_totales_realizadas_mailing });
                    this.setState({ total_interacciones_realizadas: array_detalle_campaign[0].v_totales_realizadas_totales });
    
                    this.setState({ total_interacciones_header: "Total de interacciones realizadas: "+array_detalle_campaign[0].v_totales_realizadas_totales });
    
                    for(var i in array_detalle_campaign){
                        var fecha_contacto;
    
                        try{
                            fecha_contacto = (array_detalle_campaign[i].FECHA.split(".")[0]).replace("T"," ");
                        }catch(error){
                            fecha_contacto = "";
                        }
    
                        const fila = {email: array_detalle_campaign[i].EMAIL,rut:array_detalle_campaign[i].DNI, comuna:array_detalle_campaign[i].COMUNA,telefono: array_detalle_campaign[i].TELEFONO[0].FONO, contacto: fecha_contacto, sms: array_detalle_campaign[i].ESTADO_SMS, sms_texto: array_detalle_campaign[i].SMS}
                        arr.push(fila);
                    }
    
                    this.setState({ campaigns_details_tabla: arr });
                    this.setState({ loading_campaign_details: false });
                }
            
                this.setState({ loading_modal: false });   
            }
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    cerrarModal(){
        this.setState({ isModalVisible: false })
    }

    cambiarEstadoPopUp(registro){
        try {
            const id = registro.key;
            const status = registro.estado.valor;
    
            /*
            WHEN C.ESTADO = 0 THEN "Ingresada"
            WHEN C.ESTADO = 1 THEN "En curso"
            WHEN C.ESTADO = 2 THEN "Finalizada"
            WHEN C.ESTADO = 3 THEN "Cancelada"
            WHEN C.ESTADO = 4 THEN "Pausada"
            */
    
            if (status === "En curso"){
                this.setState({ status_campaign: '1' });
                this.setState({ content_popover: (<div><p style={{textAlign:'center'}}><table style={{marginLeft:'auto',marginRight:'auto',width:'100%'}}><tr><td>
                    <Tooltip title="Pausar">
                        <Button onClick={async () => await this.cambiarEstado(id,4)} shape="circle" icon={<PauseOutlined />} />
                    </Tooltip>
                </td><td>
                    <Tooltip title="Cancelar">
                        <Button onClick={async () => await this.cambiarEstado(id,3)} shape="circle" icon={<StopOutlined />} />
                    </Tooltip>
                </td></tr></table></p></div>) });
            }else if (status === "Pausada"){
                this.setState({ status_campaign: '4' });
                this.setState({ content_popover: (<div><p style={{textAlign:'center'}}><table style={{marginLeft:'auto',marginRight:'auto',width:'100%'}}><tr><td>
                    <Tooltip title="Reanudar">
                        <Button onClick={async () => await this.cambiarEstado(id,1)} shape="circle" icon={<CaretRightOutlined />} />
                    </Tooltip>
                </td><td>
                    <Tooltip title="Cancelar">
                        <Button onClick={async () => await this.cambiarEstado(id,3)} shape="circle" icon={<StopOutlined />} />
                    </Tooltip>
                </td></tr></table></p></div>) });
            }else{
                this.setState({ content_popover: (<div></div>) });
            }
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async cambiarEstado(id_campaign,status_final){
        try {
            /*
                status_final
    
                1 THEN "En curso"
                4 THEN "Pausada"
            */
                await axios.post("https://"+domain+"/smartcenter/cambiarestadocampaign", {campaign: id_campaign, estado: status_final})
                .then(function (response){
                        
                    var msg_output = response.data.v_msg_salida;
                    var row_count = response.data.v_estado_update;
            
                    if(row_count === 0){
                        message.error(msg_output);
                    }else{
                        notification['success']({
                            message: msg_output,
                        });
                    }                
                });
    
                await this.cargarCampaigns();
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async triggerCall(registro){
        try{
            await this.phone_call_ts(registro);
        }catch(error){
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }        
    }

    async phone_call_ts(registro){
        try{
            const id = registro.key;
            const status = registro.estado.valor;
            
            console.log(id,status);
            if (status === "En curso"){
                try {
                    await axios.post("https://"+domain+"/smartcenter/manualtriggercampaignmdbts", {campaign: id})
                    .then(function (response){  
                        notification['success']({
                            message: response.data,
                        });            
                    });
                } catch (error) {
                    message.error("Ocurrió un error. Favor intentar más tarde.");
                }
            }else{
                message.error("La campaña seleccionada no se encuentra 'En curso'");
            }
        }catch(error){
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }     
    }

    async phone_call(registro){
        try{
            const id = registro.key;
            const status = registro.estado.valor;
            
            console.log(id,status);
            if (status === "En curso"){
                await axios.post("https://"+domain+"/smartcenter/manualtriggercampaignmdb", {campaign: id})
                .then(function (response){  
                    notification['success']({
                        message: response.data,
                    });            
                });
            }else{
                message.error("La campaña seleccionada no se encuentra 'En curso'");
            }
        }catch(error){
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }     
    }

    state = {
        loading: false,
        loading_campaign_details: false,
        isModalVisible: false,
        loading_modal: false,
        campaigns_api: [],
        campaigns_tabla: [],
        campaigns_details_tabla: [],
        s_id_campaign: 0,
        total_interacciones_header: "",
        total_interacciones: 0,
        total_interacciones_realizadas_llamadas: 0,
        total_interacciones_realizadas_sms: 0,
        total_interacciones_realizadas_mailing: 0,
        total_interacciones_realizadas: 0,
        export_campaigns_array: [],
        export_campaign_filename: "",
        export_campaign_sheetname: "",
        modalNuevaCampaign: false,
        modalActualizarCampaign: false,
        modalSMS: false,
        sms_text: "",
        status_campaign: "",
        columnas_exportar: [],
        content_popover: (<div></div>),
        registros_seleccionados: [],
        columns: [
            {
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
            },
            {
              title: 'Servicio',
              dataIndex: 'servicio',
              key: 'servicio',
            },
            {
              title: 'Fecha Inicio',
              dataIndex: 'inicio',
              key: 'inicio',
            },
            {
              title: 'Estado',
              dataIndex: 'estado',
              key: 'estado',
              render: (text,record) => (
                    <Popover content={this.state.content_popover} title="Cambiar Estado" trigger="click">
                        <Badge onClick={async () => await this.cambiarEstadoPopUp(record)} status={text.status} text={text.valor} />
                    </Popover>
                ),
            },
            {
              title: 'Fecha Ingreso',
              dataIndex: 'ingreso',
              key: 'ingreso',
            },
            {
              title: 'Ultima Modificación',
              dataIndex: 'modif',
              key: 'modif',
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
                 <Button onClick={async () => await this.triggerCall(record)} type="danger">Llamar</Button>
                ),
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                    <Button onClick={async () => await this.ExportarCampaign(record)} style={{backgroundColor:"#00CC8C", color:"white"}}><FileExcelOutlined />Exportar Campaña</Button>
                ),
            },
        ],
        columns_campaign_detail: [
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                 <Checkbox onChange={async () => await this.SeleccionarRegistro(record)}/>
                ),
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              width: 200,
            },
            {
                title: 'Rut',
                dataIndex: 'rut',
                key: 'rut',
                ...this.getColumnSearchProps('rut'),
                width: 120,
            },
            {
              title: 'Teléfono',
              dataIndex: 'telefono',
              key: 'telefono',
              ...this.getColumnSearchProps('telefono'),
              width: 100,
            },
            {
                title: 'Comuna',
                dataIndex: 'comuna',
                key: 'comuna',
            },
            {
              title: 'Fecha contacto',
              dataIndex: 'contacto',
              key: 'contacto',
            },
            {
                title: 'SMS',
                dataIndex: 'sms',
                key: 'sms',
                render: (text, record) => {
                    if(text === 1){
                        return  <Button onClick={async () => await this.MostrarSMS(record)} style={{backgroundColor:"#00CC8C", color:"white"}} icon={<CheckSquareOutlined />}>Ver</Button>
                    }else{
                        return <div></div>
                    }
                },
            },
        ],
    }

    async ExportarCampaign(registro){
        try {
            const id_campaign = registro.key;
    
            const nombre_campaign = registro.nombre;
            const servicio_campaign = registro.servicio;
    
            const nombre_archivo = "CAMPAÑA_"+nombre_campaign+"_"+servicio_campaign;
            const nombre_hoja = "CAMPAÑA_"+nombre_campaign;
    
            console.log(id_campaign);
    
            const estado = await this.GenerarExcel(id_campaign,nombre_archivo,nombre_hoja);
    
            /*
                ESTADO 1 = OK
                ESTADO 2 = NO DATA
                ESTADO 3 = ERROR
            */
            if(estado===1){
                this.btnExport.click();
            }else if(estado===2){
                message.error('No existen interacciones para esta campaña');
            }else{
                message.error('Ocurrió un error. Intentar más tarde.');
            }
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async MostrarSMS(registro){
        this.setState({ modalSMS: true });
        this.setState({ sms_text: registro.sms_texto });
    }

    FormatoFecha(input_fecha){
        try {
            var vfecha_inicio = input_fecha;
            vfecha_inicio = vfecha_inicio.split(".")[0];
            vfecha_inicio = vfecha_inicio.replace("T"," ");
            return vfecha_inicio;
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }
    /*
    async GenerarExcel(id_campaign,nombre_archivo,nombre_hoja){
        try{
            this.setState({ export_campaign_filename: nombre_archivo });
            this.setState({ export_campaign_sheetname: nombre_hoja });

            const array_salida = [];
            var previous_cliente_id = 0;

            this.setState({ loading_modal: true });

            const data = await fetch("https://"+domain+"/smartcenter/exportacioncampaign2?campaign="+id_campaign);
            const array_campaigns = await data.json();
            console.log(array_campaigns.length);

            for (var i = 0; i < array_campaigns.length; i+=1){
                //VALORES CLIENTE
                var DNI = "";
                var ANI = "";

                //VALORES LLAMADA
                var FECHA_LLAMADA = "";
                var DURACION_LLAMADA = "";
                var QINTENTOS = "";
                var ESTADO_LLAMADA = "";
                
                //VALORES DOCUMENTO ASOCIADO
                var NRO_DOCUMENTO = "";
                var FECHA_COMPROMISO_PAGO = "";
                var MOTIVO_NO_PAGO = "";
                
                //SOLO DOC
                //var solo_documento = false;
                
                try{
                    DNI = array_campaigns[i].DNI;
                    ANI = array_campaigns[i].ANI;

                    FECHA_LLAMADA = array_campaigns[i].FECHA_LLAMADA;
                    DURACION_LLAMADA = array_campaigns[i].DURACION_LLAMADA;
                    QINTENTOS = array_campaigns[i].QINTENTOS;
                    ESTADO_LLAMADA = array_campaigns[i].ESTADO_LLAMADA;
                        
                    NRO_DOCUMENTO = array_campaigns[i].NRO_DOCUMENTO;
                    FECHA_COMPROMISO_PAGO = array_campaigns[i].FECHA_COMPROMISO_PAGO;
                    MOTIVO_NO_PAGO = array_campaigns[i].MOTIVO_NO_PAGO;
                    
                    array_salida.push({"DNI": DNI, "TELEFONO": ANI, "FECHA_LLAMADA": FECHA_LLAMADA, "DURACION_LLAMADA": DURACION_LLAMADA, "QINTENTOS": QINTENTOS, "ESTADO_LLAMADA": ESTADO_LLAMADA, "NRO_DOCUMENTO": NRO_DOCUMENTO, "FECHA_COMPROMISO_PAGO": FECHA_COMPROMISO_PAGO, "MOTIVO_NO_PAGO": MOTIVO_NO_PAGO});
                }catch(err){
                    console.log(err);
                }
            }
            this.setState({ loading_modal: false });
            this.setState({ export_campaigns_array: array_salida });
        
            if(array_salida.length>0){
                return 1;
            }else{
                return 2;
            }
            
        }catch (error){
            return 3;
        }
    }
    */
    //MONGODB
    async GenerarExcel(id_campaign,nombre_archivo,nombre_hoja){
        try{
            this.setState({ export_campaign_filename: nombre_archivo });
            this.setState({ export_campaign_sheetname: nombre_hoja });
            this.setState({ loading_modal: true });

            const data = await fetch("https://"+domain+"/smartcenter/exportacioncampaignmdb?campaign="+id_campaign);
            const array_campaigns = await data.json();
            var array_llaves_columnas = Object.keys(array_campaigns[0]);
            var columnas = [];

            for(var c in array_llaves_columnas){
                columnas.push({"COL":array_llaves_columnas[c]});
            }

            this.setState({columnas_exportar:columnas});
            this.setState({ loading_modal: false });
            this.setState({ export_campaigns_array: array_campaigns });

            console.log(array_campaigns.length);
        
            if(array_campaigns.length>0){
                return 1;
            }else{
                return 2;
            }
            
        }catch (error){
            return 3;
        }
    }

    async obtenerInteracciones(){
        try {
            const usuario = this.props.usr_id;
            this.setState({ loading: true });
    
            const data = await fetch("https://"+domain+"/smartcenter/getcampaigns?usuario="+usuario+"&tipo=0");
            const array_campaigns = await data.json();
    
            this.setState({ campaigns_api: array_campaigns });
    
            return array_campaigns;
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async componentDidMount() {
        try {
            await this.cargarCampaigns();
        } catch (error) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async PostInsertCampaign(id){
        if(id>0){
            console.log("update");
        }else{
            console.log("nothing");
        }
    }

    async cargarCampaigns(){
        try {
            const i_api = await this.obtenerInteracciones();
            
            //var cont = 0;
            var arr = [];
    
            for (var i in i_api){
                //cont = cont + 1;
    
                var vfecha_inicio = i_api[i].FECHA_INICIO;
                vfecha_inicio = vfecha_inicio.split(".")[0];
                vfecha_inicio = vfecha_inicio.replace("T"," ");
    
                var vfecha_ingreso = i_api[i].FECHA_INGRESO;
                vfecha_ingreso = vfecha_ingreso.split(".")[0];
                vfecha_ingreso = vfecha_ingreso.replace("T"," ");
    
                var vfecha_modif = i_api[i].FECHA_ULTIMA_MODIFICACION;
                vfecha_modif = vfecha_modif.split(".")[0];
                vfecha_modif = vfecha_modif.replace("T"," ");
                
                var estado = {"valor":i_api[i].ESTADO_OUTPUT,"status":i_api[i].ESTADO_STATUS};
    
                const fila = {key: i_api[i].ID, nombre: i_api[i].NOMBRE, servicio: i_api[i].SERVICIO, inicio: vfecha_inicio, estado: estado,ingreso: vfecha_ingreso,modif: vfecha_modif}
                arr.push(fila);
            }
    
            this.setState({ campaigns_tabla: arr });
            this.setState({ loading: false });
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    ModalCampaign(){
        this.setState({ modalNuevaCampaign: true });
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    ModalActualizarLista(){
        this.setState({ modalActualizarCampaign: true });
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <br/>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}><Title>Campañas</Title></Col>
                    <Col span={2}></Col>
                </Row>
                <br/>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <p style={{textAlign:"right"}}><Button onClick={() => this.ModalCampaign()}>+</Button></p>
                        <Table dataSource={this.state.campaigns_tabla} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                    </Col>
                    <Col span={2}></Col>
                </Row>

                <Modal width={1300} title="Detalle de campaña" visible={this.state.isModalVisible} onOk={() => this.cerrarModal()} onCancel={() => this.cerrarModal()} footer={[<Button key="submit" type="danger" onClick={() => this.cerrarModal()}>Cerrar</Button>,]}>
                    <Spin spinning={this.state.loading_modal} delay={100}>
                        <Row>
                            <Col span={14}>
                                <Row style={{"width":"800px"}}>
                                    <Col align="left" span={12}>
                                        <p style={{"display":'inline'}}>
                                            <h4 style={{"display":"inline-block"}}>Listado de clientes</h4>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Button onClick={() => this.ModalActualizarLista()} style={{"display":"inline-block"}} type="" icon={<UploadOutlined />}>
                                                Cargar Lista
                                            </Button>
                                        </p>
                                    </Col>
                                    <Col align="right" span={12}>
                                        <Button type="primary" danger onClick={() => this.borrarRegistros()} style={{"display":"inline-block"}} type="" icon={<DeleteOutlined />}>
                                                Eliminar registros
                                        </Button>
                                    </Col>
                                </Row>
                                <br/>
                                <div style={{ overflowX: "hidden", overflowY: "scroll", maxHeight: "600px", width: "800px"}}>
                                    <Table dataSource={this.state.campaigns_details_tabla} columns={this.state.columns_campaign_detail} pagination={{ defaultPageSize: 7}} loading={this.state.loading_campaign_details} />
                                </div>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={8}>
                                <p style={{width: "100%", textAlign: "left"}} className="ant-btn ant-btn-primary">Total de Interacciones: {this.state.total_interacciones}</p>
                                <Collapse defaultActiveKey={["0"]}>
                                    <Panel header={this.state.total_interacciones_header} key="1">
                                    <List>
                                        <List.Item>
                                            <Typography.Text code>[LLAMADAS]</Typography.Text> {this.state.total_interacciones_realizadas_llamadas}
                                        </List.Item>
                                        <List.Item>
                                            <Typography.Text code>[SMS]</Typography.Text> {this.state.total_interacciones_realizadas_sms}
                                        </List.Item>
                                        <List.Item>
                                            <Typography.Text code>[MAILING]</Typography.Text> {this.state.total_interacciones_realizadas_mailing}
                                        </List.Item>
                                    </List>
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </Spin>
                </Modal>

                <ExcelFile element={<Button style={{visibility:"hidden"}} ref={(button) => { this.btnExport = button; }}> Exportar Campaña</Button>} filename={this.state.export_campaign_filename}>
                    <ExcelSheet data={this.state.export_campaigns_array} name={this.state.export_campaign_sheetname}>
                        {/*
                        <ExcelColumn label="DNI" value="DNI" />
                        <ExcelColumn label="TELEFONO" value="TELEFONO" />
                        <ExcelColumn label="FECHA_LLAMADA" value="FECHA_LLAMADA" />
                        <ExcelColumn label="DURACION_LLAMADA" value="DURACION_LLAMADA" />
                        <ExcelColumn label="QINTENTOS" value="QINTENTOS" />                        
                        <ExcelColumn label="ESTADO_LLAMADA" value="ESTADO_LLAMADA" />
                        <ExcelColumn label="NRO_DOCUMENTO" value="NRO_DOCUMENTO" />
                        <ExcelColumn label="FECHA_COMPROMISO_PAGO" value="FECHA_COMPROMISO_PAGO" />
                        <ExcelColumn label="MOTIVO_NO_PAGO" value="MOTIVO_NO_PAGO" />
                        */}
                        {   this.state.columnas_exportar.map( m => {
                                return(
                                    <ExcelColumn label={m.COL} value={m.COL} />
                                )
                            })
                        }
                    </ExcelSheet>
                </ExcelFile>

                <Modal width={1000} title="Nueva Campaña" visible={this.state.modalNuevaCampaign} onCancel={() => this.setState({ modalNuevaCampaign: false })} footer={<Button key="back" onClick={() => this.setState({ modalNuevaCampaign: false })}>Cancelar</Button>}>
                    <NuevaCampaign PostInsertCampaign={this.PostInsertCampaign.bind(this)}/>
                    <div ref={el => { this.el = el; }} />
                </Modal>

                <Modal width={500} title="Actualizar Campaña" visible={this.state.modalActualizarCampaign} onCancel={() => this.setState({ modalActualizarCampaign: false })} footer={<Button key="back" onClick={() => this.setState({ modalActualizarCampaign: false })}>Cancelar</Button>}>
                    <ActualizarCampaign CampaignId={this.state.s_id_campaign} PostInsertCampaign={this.PostInsertCampaign.bind(this)}/>
                    <div ref={el => { this.el = el; }} />
                </Modal>

                <Modal width={500} title="SMS Enviado" visible={this.state.modalSMS} onCancel={() => this.setState({ modalSMS: false })} footer={<Button key="back" onClick={() => this.setState({ modalSMS: false })}>Cancelar</Button>}>
                    <TextArea rows={4} value={this.state.sms_text} />
                </Modal>
            </div>
        )
    }
}
