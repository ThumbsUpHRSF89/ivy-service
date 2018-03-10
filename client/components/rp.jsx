import React from 'react';
import $ from 'jquery';
import Product from './product';



export default class RelatedProduct extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.handleLeftButtonClick = this.handleLeftButtonClick.bind(this);
    this.handleRightButtonClick = this.handleRightButtonClick.bind(this);
    this.handleStartOverButton = this.handleStartOverButton.bind(this);
    this.state = {
      currentData: [],
      data: [],
      count: 1,
      displayNum:6,
      pageNum: 1,
      pages: 0,
    };
  }
  
  componentDidMount() {
    if(window.innerWidth >= 1500){
      this.setState({
        displayNum:11,
      })
    }
    let ar = window.location.pathname.split('/');
    let id = Number(ar[ar.length-2]);
    this.getData(id); // if want to test on local server 8001 change "this.props.id" to a number
  }

  getData(id) {
    const port = process.env.PORT
    const host = process.env.HOST
    $.get(`http://${host}:${port}/product/${id}`).done((body) => {
      console.log('data from database', body);
      this.setState({ data: body });
      const totalPage = Math.ceil(body.length / this.state.displayNum);
      const cd = body.slice(0, this.state.displayNum);
      this.setState({
        currentData: cd,
        pages: totalPage,
      });
    }).fail((err) => {
      if (err) {
        console.log('can not get data from database');
      }
    });
  }

  handleLeftButtonClick() {
    const pageTotalNum = Math.ceil(this.state.data.length / this.state.displayNum);
    if (this.state.pageNum === pageTotalNum) {
      return;
    }
    const start = this.state.count * this.state.displayNum;
    const end = (this.state.count + 1) * this.state.displayNum;
    const cd = this.state.data.slice(start, end);
    this.setState({
      currentData: cd,
      count: this.state.count + 1,
      pageNum: this.state.pageNum + 1,
    });
  }
  handleRightButtonClick() {
    if (this.state.pageNum === 1) {
      return;
    }
    const start = (this.state.count - 2) * this.state.displayNum;
    const end = (this.state.count - 1) * this.state.displayNum;
    const cd = this.state.data.slice(start, end);
    this.setState({
      currentData: cd,
      count: this.state.count - 1,
      pageNum: this.state.pageNum - 1,
    });
  }
  handleStartOverButton() {
    this.setState({
      currentData: this.state.data.slice(0, 11),
      count: 1,
      pageNum: 1,
    });
  }
  render() {
    const arr = [];
    this.state.currentData.forEach((n) => {
      arr.push(<Product item={n} key={n.id} />);
    });
    let button;
    if (this.state.pageNum !== 1) {
      button = <div className="startOver" onClick={this.handleStartOverButton}>Start over</div>;
    } 
    return (
      <div className="border">
        <div className="top-line" />
        <div className="pageBox">
          {button}
          <div className="pageNum">Page {this.state.pageNum} of {this.state.pages}</div>
        </div>
        <div className="outterBox">
          <div className="leftButton"><button onClick={this.handleRightButtonClick} /></div>
          <div className="placeholder">{arr}</div>
          <div className="rightButton"><button onClick={this.handleLeftButtonClick} /></div>
        </div>
        <div className="bottom-line" />
      </div>
    );
  }
}

