import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { Card } from 'antd';
import Cookies from 'js-cookie'
const domain = process.env.REACT_APP_DOMAIN;

function InteraccionesPorDia(props){
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM')); //user_id
    const usuario = Usuario_SM.user_id;

    fetch("https://"+domain+"/smartcenter/llamadaspordia?usuario="+usuario)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  var config = {
    data: data,
    padding: 'auto',
    xField: 'Fecha',
    yField: 'Cantidad',
    xAxis: { tickCount: 5 },
    slider: {
      start: 0.1,
      end: 0.5,
    },
  };

  return (
    <React.Fragment>
      <br/>
      <Card title="Interacciones por día">
        <Line {...config} />
      </Card>
    </React.Fragment>
  );
}

export default InteraccionesPorDia;