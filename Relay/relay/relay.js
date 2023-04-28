const taClient = require("tournament-assistant-client");
const config = require("./config.json");
const WebSocket = require('ws');

const port = config.wsport;

const wss = new WebSocket.Server({ "port": port });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        console.log(`Received message => ${data}`)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});

const client = new taClient.Client("", {
    url: config.url
})

const ws = new WebSocket(config.outgoingSocket);
sockets = ws;

let connectedUsers = [];
let matchUsersToFollow = [];
let matches = [];
let coordinatorIdToFollow = "";

client.on("error", e => {
    console.log("err", e)
})

client.on("playSong", e => {
    console.log(e.data)
})

client.on("close", e => {
    console.log("close")
})

client.on("taConnected", e => {
    console.log("TA connected")
})

client.on("wsConnected", e => {
    console.log("WS connected")
})

client.on("userAdded", e => {
    console.log("User added")
    const user = {
        guid: e.data.guid,
        userId: e.data.user_id,
        name: e.data.name,
        syncDelay: 0
    }
    connectedUsers.push(user)
})

client.on("userUpdated", e => {
    let userIndex = connectedUsers.findIndex(x => e.data.guid === x.guid);
    console.log(userIndex);
    connectedUsers[userIndex].syncDelay = e.data.stream_delay_ms;
})

client.on("userLeft", e => {
    console.log("User left")
    connectedUsers = connectedUsers.filter(x => x.guid !== e.data.guid)
})

client.on("matchCreated", e => {
    console.log("Match created");

    matches = matches.filter(x => x.coordinatorUser?.guid !== undefined)
    matches = matches.filter(x => x?.coordinatorUser?.guid !== e.data?.leader);

    const match = {
        coordinatorUser: connectedUsers.find(x => x.guid === e.data.leader),
        matchUsers: e.data.associated_users.map(x => connectedUsers.find(y => y.guid === x)),
        song: undefined
    }
    match.matchUsers.sort(a, b => a.name > b.name)
    matches.push(match);

    e.data.associated_users.push(client.Self.guid);
    client.updateMatch(e.data);
    sockets.send(JSON.stringify({ matches: matches, type: "matches" }));
})

client.on("matchUpdated", e => {
    song = {
        hash: e.data?.selected_level?.level_id.toString().replace("custom_level_", ""),
        char: e.data?.selected_characteristic?.serialized_name,
        diffIndex: indexToName(e.data?.selected_difficulty)
    }
    matches[matches.findIndex(x => e.data.leader === x?.coordinatorUser?.guid)].song = song;
    sockets.send(JSON.stringify({ matches: matches, type: "matches" }));
})

client.on("matchDeleted", e => {
    console.log("Match deleted");
    matches = matches.filter(x => x.coordinatorUser.guid !== e.data.leader);
    sockets.send(JSON.stringify({ matches: matches, type: "matches" }));
})

client.on("realtimeScore", e => {
    const user = connectedUsers.find(x => e.data.user_guid === x.guid);
    if (matchUsersToFollow.includes(user.userId)) {
        const scoreData = {
            type: "score",
            user: connectedUsers.find(x => x.guid === e.data.user_guid),
            streamDelay: user.syncDelay,
            score: e.data.score,
            accuracy: e.data.accuracy,
            combo: e.data.combo,
            misses: e.data.notesMissed,
            badcut: e.data.badCuts,
            bombHit: e.data.bombHits,
            wallHit: e.data.wallHits,
            missBadCuts: e.data.badCuts + +e.data.notesMissed
        }
        sockets.send(JSON.stringify(scoreData));
    }
})

function indexToName(index) {
    switch (index) {
        case 0: return "Easy"
        case 1: return "Normal"
        case 2: return "Hard"
        case 3: return "Expert"
        case 4: return "ExpertPlus"
    }
}

sockets.on('message', function (msg) {
    try {
        msg = JSON.parse(msg);
        if (msg.type === "matchesPlease") {
            sockets.send(JSON.stringify({type: "coordinatorFollow", coordinatorId: coordinatorIdToFollow}));
            sockets.send(JSON.stringify({ matches: matches, type: "matches" }));
        }
        else if(msg.type === "matchPoint"){
            console.log("Match point event", msg.player, msg.incrementDecrement);
            sockets.send(JSON.stringify({type: "matchPoint", playerId: msg.player, incrementDecrement: msg.incrementDecrement}));
        }
        else {
            let match = matches.find(x => x.coordinatorUser.name === msg.name);
            let playerGuids = match.matchUsers.map(x => x.userId);
            matchUsersToFollow = playerGuids;
            coordinatorIdToFollow = match.coordinatorUser.guid;

            sockets.send(JSON.stringify({type: "coordinatorFollow", coordinatorId: coordinatorIdToFollow}));
            sockets.send(JSON.stringify({ matches: matches, type: "matches" }));
        }

    }
    catch (err) {
        console.log(err)
    }
})