import React, { Component } from 'react';
import axios from 'axios';

import Form from './components/Form.jsx';
import SortedList from './components/SortedList.jsx';
import ProfileDetails from './components/ProfileDetails.jsx';
import LanguageList from './components/LanguageList.jsx';
import RepoStats from './components/RepoStats.jsx';
import Logo from './Logo.png';
import lda from './lda';
import scatter from './components/scatter';


import { Grid } from 'react-bootstrap';

import { Row, Col } from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gitun: 'No username',
      infoclean : '',
      info: null,
      formData: {
        username: '',
      },
      repitems: null,
      staritems: null,
      replanguagecount: {},
      keywords: null,
      
    }
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange= this.handleFormChange.bind(this);
  }

  handleUserFormSubmit(event) {
    event.preventDefault();
    axios.get('https://api.github.com/users/'+this.state.formData.username)
    .then(response => this.setState({
      gitun: response.data.login,
      infoclean: response.data,
      info : JSON.stringify(response.data, undefined, 2)
    })).catch((err) => { console.log(err); });


    axios.get('https://api.github.com/users/'+this.state.formData.username+'/repos')
    .then(response => {

      this.setState({
        replanguagecount: null
        })


      var itemsWithFalseForks = response.data.filter(item => item.fork === false)

      var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }else {
          return 0
        }
      })

      let totalforks = 0;
      let totalwatchers = 0;
      let dictrlc = Object.assign({}, this.state.replanguagecount);
      for (var i = 0; i < itemsWithFalseForks.length; i++) {
          dictrlc[itemsWithFalseForks[i]['language']] = -~ dictrlc[itemsWithFalseForks[i]['language']]
          totalforks = totalforks + itemsWithFalseForks[i]['forks_count']
          totalwatchers = totalwatchers + itemsWithFalseForks[i]['watchers_count']
      }

      let dictrlcclean = [];
      let iterarray = Object.entries(dictrlc)
      for (var n = 0; n < iterarray.length; n++) {
        dictrlcclean.push(
          Object.assign({},
          {lang: iterarray[n][0], count: iterarray[n][1]}))
      }

      var dictrlccleansorted = dictrlcclean.sort((b,a) => {
        if (a.count < b.count) {
          return -1
        }else if (a.count > b.count){
          return 1
        }else {
          return 0
        }
      })

      this.setState({
        repitems: sortedItems.slice(0,10),
        replanguagecount: dictrlccleansorted,
        totalforks: totalforks,
        totalwatchers: totalwatchers
      })

    }).catch((err) => { console.log(err); })

    axios.get('https://api.github.com/users/'+this.state.formData.username+'/starred')
    .then(response => {

      var itemsWithFalseForks = response.data.filter(item => item.fork === false)

      var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }else {
          return 0
        }
      })

      var documents = []
      for (var i = 0; i < response.data.length; i++) {
          var descr = response.data[i]['description']
          if (descr != null) {
            var newtext = descr.match(/[^.!?]+[.!?]+/g)
            if (newtext != null) {
              documents = documents.concat(newtext)
            }
          }
      }
      var result = lda(documents, 3, 3);
      var keywords = new Set()
      for (var k = 0; k < 3; k++) {
        for (var j = 0; j < 3; j++) {
          keywords = keywords.add(result[k][j]['term']);
        }
      }

      this.setState({
        staritems: sortedItems.slice(0,10),
        keywords: Array.from(keywords)
      })

      // console.log(Array.from(keywords))

    }).catch((err) => { console.log(err); })

  };


  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };


  render() {
    return (
      <div className="container">
      <div className="App">
        <header className="App-header">
          <h1 className="App-title" className="text-center">Github Access</h1>
        </header>
        
        <Form
          formData={this.state.formData}
          handleUserFormSubmit={this.handleUserFormSubmit}
          handleFormChange={this.handleFormChange}
        />
        <hr></hr>
        {
          this.state.info != null ? <div>
                        <h4>{this.state.formData.username}</h4>
            <ProfileDetails infoclean={this.state.infoclean}/>
            <hr></hr>
            <Row className="show-grid">
              
                            <Col xs={12} md={8}>

               <h4>Personal Top 10 Repositories</h4>

                <SortedList repitems={this.state.repitems}/>
                            </Col>
                            <Col xs={12} md={4} className="text-center">
                                <h4>Personal Repositories Summary</h4>
                                <RepoStats totalforks={this.state.totalforks}
                                    totalwatchers={this.state.totalwatchers} />
                                <p><b>Used Languages</b></p>
                                <LanguageList
                                    langslist={this.state.replanguagecount} />
                            </Col>
            </Row>
                        <hr></hr>
                        
            <Row className="show-grid" className="text-center">
                            <div>
                                <h4>{this.state.formData.username}</h4>

              {this.state.infoclean.html_url ? <div><p><a className="btn btn-info" href={this.state.infoclean.html_url} target="_blank">View on GitHub</a></p></div> : null }
            </div>
            
            </Row>
            <hr></hr>
            
            </div>
                        : <h4 className="text-center"><br /><br /><br /><br /><img src={Logo} alt='website logo' />
</h4>
        }
      </div>
      </div>
    );
  }
}

export default App;
