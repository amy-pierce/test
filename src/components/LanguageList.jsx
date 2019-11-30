import React from 'react';
import PieChart from './PieChart';
let x = ''
let langs = '';
const LanguageList = (props) => {
    if (props.langslist) {
        {
            var totalcount = Object.entries(props.langslist).map(([key, eachitem]) =>
                (eachitem.count)).reduce((pv, cv) => pv + cv, 0)
        }
        return (
            
                <div>
                    {
                        Object.entries(props.langslist).map(([key, eachitem]) =>
                            
                                <div key={key}>
                                    {eachitem.lang} - {Math.round(100 * eachitem.count / totalcount)}%
             
                                {console.log(x = x + eachitem.count + ',')}
                        
                            { console.log(langs = langs + eachitem.lang + ',') }

                </div>)}
                
                <div className='App-header'>
                    <h2>Languages</h2>
                </div>
                <div>
                    <div className="text-left">
                        <PieChart repoSize={x.split(',')} repoNames={langs.split(',')} />
                        </div>
                        {x = ''}
                        {langs = ''}

                </div>
            </div>
        )
    } else { return null; }

};

export default LanguageList;
