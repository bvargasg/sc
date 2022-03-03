import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';
import Cookies from 'js-cookie'
const domain = process.env.REACT_APP_DOMAIN;

function QDocumentos(props){
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {

    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM')); //user_id
    const usuario = Usuario_SM.user_id;

    fetch("https://"+domain+"/smartcenter/qdocumentos?usuario="+usuario)
      .then((response) => response.json())
      .then((json) => setData([{"tipo": "Pendientes", "cantidad": json[0].q_documentos_totales},{"tipo": "Compromiso", "cantidad": json[0].q_documentos_compromiso_pago}]))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
      
  };

  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'cantidad',
    colorField: 'tipo',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  return (
    <React.Fragment>
      <br/>
      <Card title="Q de Documentos">
      <Pie {...config} />
      </Card>
    </React.Fragment>
  );
}

export default QDocumentos;