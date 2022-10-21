import './App.css';
import web3 from './web3';
import lottery from './lottery';
import React, { Component } from 'react';

class App extends Component  {
  // equivilent to constructor
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    status: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ status: 'Waiting on transaction success...' });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ status: 'You have been entered!' });
    window.location.reload();
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ status: 'Picking a winner...' });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ status: 'A winner has been picked!' });
    window.location.reload();
  };

  render() {
    return (
      <div className="App">
        <h1>Lottery Contract</h1>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} players, entered into the prize pool.</p>
        <h2>Current Prize Total:</h2>
        <p>{web3.utils.fromWei(this.state.balance, 'ether')} ETHER</p>
        <hr />
        <div>
          <form onSubmit={this.onSubmit}>
            <h3>Want to try your luck?</h3>
            <p>Enter the lottery by sending some Ether to the contract address.</p>
            <div>
              <label>Amount of Ether to enter:</label>
              <input 
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
               />
            </div>
            <button>Enter</button>
          </form>
        </div>
        <hr />
        <h2>Ready to pick a winner?</h2>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <p>{this.state.status}</p>

      </div>
    );
  }
}

export default App;
