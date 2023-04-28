import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReactDOM from "react-dom";
import config from "./config.json"
import '../src/panel.css'

const client = new W3CWebSocket(config.realyServerUrl);

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.sendMessage = this.sendMessage.bind(this)
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send(JSON.stringify({ type: "matchesPlease" }));
    };
    client.onmessage = (message) => {
      const msgJSON = JSON.parse(message.data);
      if (msgJSON.type === "matches") {
        console.log("Matches updated")
        console.log(msgJSON.matches);
        this.setState({ matches: msgJSON.matches })
      }
    };
  }

  sendMessage(type, message) {
    if (type === "coordinatorUpdate") {
      console.log("pressed coordinator ", message)
      client.send(JSON.stringify(message));
    }
    else if (type === "matchPoint") {
      client.send(JSON.stringify({
        type: "matchPoint",
        player: message.player,
        incrementDecrement: message.incDec
      }))
    }
  }

  render() {

    return (
      <div>
        {this.state.matches.map((match, index) => (

          <Match
            key={index}
            players={match.matchUsers.filter(function (x) { if (x.name === match.coordinatorUser.name) { return false } else { return true } })}
            coordinator={match.coordinatorUser}
            sendMessage={this.sendMessage}
          />
        ))}
      </div>
    );
  }
}

class Match extends React.Component {
  render() {
    const { players, coordinator } = this.props;
    return (
      <div className="Match">
        <ul>
          {players.map(player =>
            <li key={player.userId}>{player.name}
              <button onClick={() => this.props.sendMessage("matchPoint", { player: player.userId, incDec: "decrement" })}>-</button>
              <button onClick={() => this.props.sendMessage("matchPoint", { player: player.userId, incDec: "increment" })}>+</button>
            </li>)}
        </ul>
        <div>Coordinator: {coordinator.name}</div>
        <button onClick={() => this.props.sendMessage("coordinatorUpdate", coordinator)}>Select</button>
      </div>
    );
  }
}

<body id="root"></body>;

ReactDOM.render(<Panel></Panel>, document.getElementById("root"));

export default Panel;