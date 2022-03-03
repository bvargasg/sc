import React, { useState, useEffect } from 'react';
import { WordCloud } from '@ant-design/charts';

export default function Wordcloud(props) {
    const [data, setData] = useState([]);
    useEffect(() => {
        //asyncFetch();
        var p = {props};
        p = p.props.palabras;
        setData(p);
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/antv-keywords.json')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
            console.log('fetch data failed', error);
        });
    };

    const getWords = () => {
        //setData(props);
        console.log(props);
    };

    var config = {
        data: data,
        wordField: 'name',
        weightField: 'value',
        colorField: 'name',
        wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [8, 32],
        rotation: 0,
        },
        random: function random() {
        return 0.5;
        },
    };

    return (
        <div>
            <WordCloud {...config} />
        </div>
    )
}
