import React from 'react';
import Plot from 'react-plotly.js';

const Scatter = (props) => {
  
        return (
            <Plot
                data={[
                    {
                        x: props.repoNames,
                        y: props.repoSize,
                        type: 'scatter',
                        mode: 'markers',
                        marker: {
                            color: '#D0F0C0',
                            size: [(props.repoSize[0] / props.total)*300, (props.repoSize[1] / props.total)*300,
                                (props.repoSize[2] / props.total) * 300, (props.repoSize[3] / props.total) * 300,
                                (props.repoSize[4] / props.total) * 300, (props.repoSize[5] / props.total)* 300,
                                (props.repoSize[6] / props.total) * 300, (props.repoSize[7] / props.total) * 300,
                                (props.repoSize[8] / props.total) * 300, (props.repoSize[9] / props.total) * 300]
                        },
                    },
                   
                ]}
                layout={{
                    width: 1200, height: 500, title: props.label, margin: {
                        l: 50,
                        r: 50,
                        b: 200,
                        t: 100,
                        pad: 4
                    }, }}
            />
        );
    
}
export default Scatter;