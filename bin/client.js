//# sourceMappingURL=./client.js.map
require('source-map-support').install();
/*The MIT License
===============

Copyright (c) 2014 Chris Vickery, Thomas "TAT" Andresen and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
var SockJS,net,http,EventEmitter,Room,PlugAPIInfo,request,WebSocket,encoder,util,zlib,rpcNames,messageTypes,client,ws,p3Socket,initialized,commandPrefix,apiId,_this,_key,_updateCode,lastRpcMessage,historyID,lastHistoryID,serverRequests,room,rpcHandlers,logger;net=require("net");http=require("http");EventEmitter=require("events").EventEmitter;util=require("util");zlib=require("zlib");SockJS=require("sockjs-client-node");request=require("request");WebSocket=require("ws");encoder=require("node-html-encoder").Encoder("entity");
Room=require("./room");PlugAPIInfo=require("../package.json");
rpcNames={BOOTH_JOIN:"booth.join_1",BOOTH_LEAVE:"booth.leave_1",BOOTH_SKIP:"booth.skip_1",DURATION_MISMATCH:"duration.mismatch",DURATION_UPDATE:"duration.update",HISTORY_SELECT:"history.select_1",MEDIA_RECOVER:"media.recover_1",MEDIA_SELECT:"media.select_1",MEDIA_UPDATE:"media.update_1",MODERATE_ADD_DJ:"moderate.add_dj_1",MODERATE_BAN:"moderate.ban_1",MODERATE_BANS:"moderate.bans_1",MODERATE_CHAT_DELETE:"moderate.chat_delete_1",MODERATE_MOVE_DJ:"moderate.move_dj_1",MODERATE_PERMISSIONS:"moderate.permissions_1",
MODERATE_REMOVE_DJ:"moderate.remove_dj_1",MODERATE_SKIP:"moderate.skip_1",MODERATE_UNBAN:"moderate.unban_1",MODERATE_UPDATE_DESCRIPTION:"moderate.update_description_1",MODERATE_UPDATE_NAME:"moderate.update_name_1",MODERATE_UPDATE_WELCOME:"moderate.update_welcome_1",PLAYLIST_ACTIVATE:"playlist.activate_1",PLAYLIST_CREATE:"playlist.create_1",PLAYLIST_DELETE:"playlist.delete_1",PLAYLIST_MEDIA_DELETE:"playlist.media.delete_1",PLAYLIST_MEDIA_INSERT:"playlist.media.insert_1",PLAYLIST_MEDIA_MOVE:"playlist.media.move_1",
PLAYLIST_MEDIA_SHUFFLE:"playlist.media.shuffle_1",PLAYLIST_RENAME:"playlist.rename_1",PLAYLIST_SELECT:"playlist.select_1",REPORT_DISCONNECT:"report.disconnect_1",REPORT_RECONNECT:"report.reconnect_1",ROOM_CAST:"room.cast_1",ROOM_CREATE:"room.create_1",ROOM_CURATE:"room.curate_1",ROOM_CYCLE_BOOTH:"room.cycle_booth_1",ROOM_DETAILS:"room.details_1",ROOM_JOIN:"room.join_1",ROOM_LOCK_BOOTH:"room.lock_booth_1",ROOM_SEARCH:"room.search_1",ROOM_STAFF:"room.staff_1",ROOM_STATE:"room.state_1",USER_CHANGE_NAME:"user.change_name_1",
USER_GET_BY_IDS:"user.get_by_ids_1",USER_IGNORING:"user.ignoring_1",USER_NAME_AVAILABLE:"user.name_available_1",USER_PONG:"user.pong_1",USER_SET_AVATAR:"user.set_avatar_1",USER_SET_LANGUAGE:"user.set_language_1",USER_SET_STATUS:"user.set_status_1"};
messageTypes={BAN:"ban",BOOTH_CYCLE:"boothCycle",BOOTH_LOCKED:"boothLocked",CHAT:"chat",CHAT_COMMAND:"command",CHAT_DELETE:"chatDelete",CHAT_EMOTE:"emote",COMMAND:"command",CURATE_UPDATE:"curateUpdate",DJ_ADVANCE:"djAdvance",DJ_UPDATE:"djUpdate",EMOTE:"emote",FOLLOW_JOIN:"followJoin",MODERATE_ADD_DJ:"modAddDJ",MODERATE_ADD_WAITLIST:"modAddWaitList",MODERATE_AMBASSADOR:"modAmbassador",MODERATE_BAN:"modBan",MODERATE_MOVE_DJ:"modMoveDJ",MODERATE_REMOVE_DJ:"modRemoveDJ",MODERATE_REMOVE_WAITLIST:"modRemoveWaitList",
MODERATE_SKIP:"modSkip",MODERATE_STAFF:"modStaff",PDJ_MESSAGE:"pdjMessage",PDJ_UPDATE:"pdjUpdate",PING:"ping",PLAYLIST_CYCLE:"playlistCycle",REQUEST_DURATION:"requestDuration",REQUEST_DURATION_RETRY:"requestDurationRetry",ROOM_CHANGE:"roomChanged",ROOM_DESCRIPTION_UPDATE:"roomDescriptionUpdate",ROOM_JOIN:"roomJoin",ROOM_NAME_UPDATE:"roomNameUpdate",ROOM_VOTE_SKIP:"roomVoteSkip",ROOM_WELCOME_UPDATE:"roomWelcomeUpdate",SESSION_CLOSE:"sessionClose",SKIP:"skip",STROBE_TOGGLE:"strobeToggle",USER_COUNTER_UPDATE:"userCounterUpdate",
USER_FOLLOW:"userFollow",USER_JOIN:"userJoin",USER_LEAVE:"userLeave",USER_UPDATE:"userUpdate",VOTE_UPDATE:"voteUpdate",VOTE_UPDATE_MULTI:"voteUpdateMulti"};p3Socket=ws=client=null;initialized=!1;commandPrefix="!";apiId=0;_updateCode=_key=_this=null;lastRpcMessage=Date.now();lastHistoryID="";serverRequests={queue:[],sent:0,limit:10,running:!1};room=new Room;rpcHandlers={};
logger={pad:function(a){return 10>a?"0"+a.toString(10):a.toString(10)},months:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),timestamp:function(){var a=new Date,b=[this.pad(a.getHours()),this.pad(a.getMinutes()),this.pad(a.getSeconds())].join(":");return[a.getDate(),this.months[a.getMonth()],b].join(" ")},log:function(){var a=Array.prototype.slice.call(arguments);a.unshift(this.timestamp());console.log.apply(console,a)}};http.OutgoingMessage.prototype.__renderHeaders=http.OutgoingMessage.prototype._renderHeaders;
http.OutgoingMessage.prototype._renderHeaders=function(){if(this._header)throw Error("Can't render headers after they are sent to the client.");this.setHeader("Cookie",'usr="'+_key+'"');return this.__renderHeaders()};function __bind(a,b){return function(){return a.apply(b,arguments)}}function intPM(a,b){p3Socket.send({type:"PM",value:{id:"object"===typeof a?a.id:a,message:b}})}
function intChat(a,b){var c=room.self.id.substr(0,6)+Math.floor(4294967295*Math.random()).toString(16);ws.send("5::/room:"+JSON.stringify({name:"diaf",args:[{msg:a,cid:c}]}));void 0!==b&&!isNaN(b)&&0<~~b&&setTimeout(function(){_this.moderateDeleteChat(c)},1E3*~~b)}
var DateUtilities={MONTHS:"January February March April May June July August September October November December".split(" "),SERVER_TIME:null,OFFSET:0,setServerTime:function(a){this.SERVER_TIME=this.convertUnixDateStringToDate(a);this.OFFSET=this.SERVER_TIME.getTime()-(new Date).getTime()},yearsSince:function(a){return this.ServerDate().getFullYear()-a.getFullYear()},monthsSince:function(a){var b=this.ServerDate();return 12*(b.getFullYear()-a.getFullYear())+(b.getMonth()-a.getMonth())},daysSince:function(a){var b=
this.ServerDate(),c=b.getTime(),d=a.getTime();a=(c-d)/864E5;c=(c-d)%864E5/864E5;0<c&&864E5*c>1E3*this.secondsSinceMidnight(b)&&a++;return~~a},hoursSince:function(a){return~~((this.ServerDate().getTime()-a.getTime())/36E5)},minutesSince:function(a){return~~((this.ServerDate().getTime()-a.getTime())/6E4)},secondsSince:function(a){return~~((this.ServerDate().getTime()-a.getTime())/1E3)},monthName:function(a,b){var c=this.MONTHS[a.getMonth()];return b?c:c.substr(0,3)},secondsSinceMidnight:function(a){var b=
new Date(a.getTime());this.midnight(b);return~~((a.getTime()-b.getTime())/1E3)},midnight:function(a){a.setHours(0);a.setMinutes(0);a.setSeconds(0);a.setMilliseconds(0)},minutesUntil:function(a){return~~((a.getTime()-this.ServerDate().getTime())/6E4)},millisecondsUntil:function(a){return a.getTime()-this.ServerDate().getTime()},ServerDate:function(){return new Date((new Date).getTime()+this.OFFSET)},getSecondsElapsed:function(a){return a&&"0"!=a?this.secondsSince(new Date(a.substr(0,a.indexOf(".")))):
0},convertUnixDateStringToDate:function(a){return a?new Date(a.substr(0,4),Number(a.substr(5,2))-1,a.substr(8,2),a.substr(11,2),a.substr(14,2),a.substr(17,2)):null}};
function queueTicker(){serverRequests.running=!0;var a=serverRequests.sent<serverRequests.limit,b=serverRequests.queue.pop();a&&b&&(serverRequests.sent++,"rpc"==b.type?sendRPC(b):"gateway"==b.type?sendGateway(b.opts,b.callbacks.success,b.callbacks.failure):"connect"==b.type&&("socket"==b.server?connectSocket(b.room):"chat"==b.server&&connectChat(b.room)),setTimeout(function(){serverRequests.sent--},6E4));0<serverRequests.queue.length?setImmediate(queueTicker):serverRequests.running=!1}
function queueRPC(a,b,c,d){b=void 0===b?[]:b;util.isArray(b)||(b=[b]);var e=++apiId,f={type:"rpc",id:e,name:a,args:b};rpcHandlers[e]={callback:c,type:a,args:b};d&&!0===d?sendRPC(f):(serverRequests.queue.push(f),serverRequests.running||queueTicker())}function sendRPC(a){client.send(a)}
function queueGateway(a,b,c,d,e){b=void 0===b?[]:b;util.isArray(b)||(b=[b]);c="function"===typeof c?__bind(c,_this):function(){};d="function"===typeof d?__bind(d,_this):function(){queueGateway(a,b,c)};var f;f=JSON.stringify({service:a,body:b});f={method:"POST",url:"http://plug.dj/_/gateway/"+a,headers:{"User-Agent":"plugAPI_"+PlugAPIInfo.version,Accept:"application/json, text/javascript, */*; q=0.01",Cookie:"usr="+_key,"Content-Type":"application/json"},body:f};e&&!0===e?sendGateway(f,c,d):(serverRequests.queue.push({type:"gateway",
opts:f,callbacks:{success:c,failure:d}}),serverRequests.running||queueTicker())}function sendGateway(a,b,c){request(a,function(a,e,f){if(a)"function"===typeof c&&c(a),logger.log("[Gateway Error]",a);else try{f=JSON.parse(f),0===f.status?b(f.body):c(f.body)}catch(g){c(g),logger.log("[Gateway Error]",g)}})}
function getUpdateCode(a){request({url:"https://d1rfegul30378.cloudfront.net/updatecode.txt",headers:{"Accept-Encoding":"gzip"},encoding:null},function(b,c,d){zlib.unzip(d,function(b,c){_updateCode=c.toString();"function"===typeof a&&a()})})}
function joinRoom(a,b){var c=function(){queueRPC(rpcNames.ROOM_JOIN,[a,_updateCode],function(c){if(c.status){if(999===c.status){logger.log("Error while joining:",c.result?c.result:"Unknown error");setTimeout(function(){joinRoom(a,b)},1E3);return}throw Error("Wrong updateCode");}DateUtilities.setServerTime(c.serverTime);queueGateway(rpcNames.ROOM_DETAILS,[a],function(a){initRoom(a,function(){"undefined"!==typeof b&&b(a)})})})};null===_updateCode?getUpdateCode(c):c()}
function send(a){return client.send(a)}
function receivedChatMessage(a){var b,c,d,e,f,g,k;if(initialized){a.message=encoder.htmlDecode(a.message);if("message"!=a.type&&"pm"!=a.type||0!==a.message.indexOf(commandPrefix)||!_this.processOwnMessages&&a.from.id==room.self.id)"emote"==a.type&&_this.emit(messageTypes.CHAT_EMOTE,a);else{if("function"===typeof _this.preCommandHandler&&!1===_this.preCommandHandler(a))return;c="pm"==a.type;d=a.message.substr(commandPrefix.length).split(" ")[0];e={message:a,chatID:a.cid,cid:a.cid,from:room.getUser(a.fid),
command:d,args:a.message.substr(commandPrefix.length+d.length+1),mentions:[],respond:function(){var b=Array.prototype.slice.call(arguments).join(" ");return c?intPM(this.from,b):_this.sendChat("@"+a.from+" "+b)},respondTimeout:function(){var b=Array.prototype.slice.call(arguments),d=b.splice(b.length-1,1),b=b.join(" ");return c?intPM(this.from,b):_this.sendChat("@"+a.from+" "+b,d)},havePermission:function(b,c,d){void 0===b&&(b=0);(b=void 0!==room.getUser(a.fid)&&room.getUser(a.fid).permission>=b)&&
"function"===typeof c?c():b||"function"!==typeof d||d();return b},isFrom:function(b,c,d){"string"===typeof b&&(b=[b]);if(void 0===b||!util.isArray(b))return"function"===typeof d&&d(),!1;(b=-1<b.indexOf(a.fid))&&"function"===typeof c?c():b||"function"!==typeof d||d();return b}};f=e.args.indexOf("@");g=room.getUsers();for(k=Math.ceil(1E10*Math.random());-1<f;){var l=e.args.substr(f),h=null;for(b in g)g.hasOwnProperty(b)&&1===l.indexOf(g[b].username)&&(null===h||g[b].username.length>h.username.length)&&
(h=g[b]);null!==h&&(e.args=e.args.substr(0,f)+"%MENTION-"+k+"-"+e.mentions.length+"%"+e.args.substr(f+h.username.length+1),e.mentions.push(h));f=e.args.indexOf("@",f+1)}e.args=e.args.split(" ");for(b in e.args)e.args.hasOwnProperty(b)&&(isNaN(e.args[b])||(e.args[b]=~~e.args[b]));for(b in e.mentions)e.mentions.hasOwnProperty(b)&&(e.args[e.args.indexOf("%MENTION-"+k+"-"+b+"%")]=e.mentions[b]);_this.emit(messageTypes.CHAT_COMMAND,e);_this.emit(messageTypes.CHAT_COMMAND+":"+d,e);_this.deleteCommands&&
_this.moderateDeleteChat(a.cid)}"pm"==a.type?_this.emit("pm",a):(_this.emit(messageTypes.CHAT,a),_this.emit(messageTypes.CHAT+":"+a.type,a),null!==room.getUser()&&-1<a.message.indexOf("@"+room.getUser().username)&&(_this.emit(messageTypes.CHAT+":mention",a),_this.emit("mention",a)))}}function queueConnectChat(a){serverRequests.queue.push({type:"connect",server:"chat",room:a});serverRequests.running||queueTicker()}
function connectChat(a){var b={url:"https://sio2.plug.dj/socket.io/1/?t="+Date.now(),headers:{"User-Agent":"plugAPI_"+PlugAPIInfo.version,Cookie:"usr="+_key}};request(b,function(b,d,e){b?(logger.log("[Chat Server] Error while connecting:",b),process.nextTick(function(){logger.log("[Chat Server] Reconnecting");queueConnectChat(a)})):(b="wss://sio2.plug.dj/socket.io/1/websocket/"+e.split(":")[0],ws=new WebSocket(b),ws.on("open",function(){logger.log("[Chat Server] Connected");this.send("1::/room");
this.send("5::/room:"+JSON.stringify({name:"rkl",args:[a]}))}),ws.on("message",function(a){"2::"==a&&this.send("2::");a.match(/^5::\/room:/)&&(a=a.split("5::/room:")[1],a=JSON.parse(a).args[0],receivedChatMessage(a))}),ws.on("error",function(b){logger.log("[Chat Server] Error:",b);process.nextTick(function(){logger.log("[Chat Server] Reconnecting");queueConnectChat(_this.roomId?_this.roomId:a)})}),ws.on("close",function(b){logger.log("[Chat Server] Closed with code",b);process.nextTick(function(){logger.log("[Chat Server] Reconnecting");
queueConnectChat(_this.roomId?_this.roomId:a)})}))})}function queueConnectSocket(a){serverRequests.queue.push({type:"connect",server:"socket",room:a});serverRequests.running||queueTicker()}
function connectSocket(a){apiId=0;rpcHandlers={};client=SockJS.create("https://sjs.plug.dj/plug");client.send=function(a){return this.write(JSON.stringify(a))};client.on("error",function(b){logger.log("[Socket Server] Error:",b);process.nextTick(function(){logger.log("[Socket Server] Reconnecting");queueConnectSocket(_this.roomId?_this.roomId:a)})});client.on("data",dataHandler);client.on("data",function(a){return _this.emit("tcpMessage",a)});client.on("close",function(){logger.log("[Socket Server] Closed");
process.nextTick(function(){logger.log("[Socket Server] Reconnecting");queueConnectSocket(_this.roomId?_this.roomId:a)})});return client.on("connection",function(){logger.log("[Socket Server] Connected");a&&joinRoom(a);_this.emit("connected");_this.emit("server:socket:connected");return _this.emit("tcpConnect",client)})}
function connectPlugCubedSocket(){var a=!1;p3Socket=SockJS.create("https://socket.plugcubed.net/gateway");p3Socket.send=function(a){a=JSON.stringify(a);return this.write(a)};p3Socket.on("error",function(a){logger.log("[p3Socket Server] Error:",a);process.nextTick(function(){logger.log("[p3Socket Server] Reconnecting");connectPlugCubedSocket()})});p3Socket.on("data",function(b){var c=JSON.parse(b);b=c.type;c=c.data;a?"pm"===b&&c.cid&&receivedChatMessage(c):"validate"===b&&1===c.status&&(a=!0)});p3Socket.on("close",
function(){logger.log("[p3Socket Server] Closed");process.nextTick(function(){logger.log("[p3Socket Server] Reconnecting");connectPlugCubedSocket()})});return p3Socket.on("connection",function(){logger.log("[p3Socket Server] Connected");_this.emit("server:p3socket:connected");var a=_this.getUser();p3Socket.send({type:"userdata",id:a.id,username:a.username,room:_this.roomId,version:"plugAPIv"+PlugAPIInfo.version});return _this.emit("tcpConnect",p3Socket)})}
function initRoom(a,b){room.reset();lastRpcMessage=Date.now();if(void 0===a.room||void 0===a.user)return client.close();room.setUsers(a.room.users);room.setStaff(a.room.staff);room.setAmbassadors(a.room.ambassadors);room.setAdmins(a.room.admins);room.setOwner(a.room.owner);room.setSelf(a.user.profile);room.setDjs(a.room.djs);room.setMedia(a.room.media,a.room.mediaStartTime,a.room.votes,a.room.curates);room.boothLocked=a.boothLocked;historyID!==a.room.historyID&&(_this.roomId=a.room.id,historyID=a.room.historyID,
_this.emit(messageTypes.DJ_ADVANCE,{currentDJ:a.room.currentDJ,djs:a.room.djs.splice(1),media:room.media.info,mediaStartTime:a.room.mediaStartTime,historyID:historyID}),queueGateway(rpcNames.HISTORY_SELECT,[a.room.id],__bind(room.setHistory,room)),_this.enablePlugCubedSocket&&connectPlugCubedSocket(),_this.emit(messageTypes.ROOM_JOIN,a.room.name,a));initialized=!0;return b()}
function parseRPCReply(a,b){a===rpcNames.ROOM_JOIN&&(_this.emit(messageTypes.ROOM_CHANGE,b),"undefined"!==typeof b.room&&"undefined"!==typeof b.room.historyID&&(historyID=b.room.historyID,_this.roomId=b.room.id,_this.userId=b.user.profile.id))}
function dataHandler(a){"string"===typeof a&&(a=JSON.parse(a));if(a.messages)for(var b=0;b<a.messages.length;b++)messageHandler(a.messages[b]);else"rpc"===a.type&&(reply=a.result)&&(0!==a.status&&(reply=a),null!=rpcHandlers[a.id]&&"function"===typeof rpcHandlers[a.id].callback&&rpcHandlers[a.id].callback(reply),parseRPCReply(null!=rpcHandlers[a.id]?rpcHandlers[a.id].type:void 0,reply),delete rpcHandlers[a.id])}
function messageHandler(a){switch(a.type){case messageTypes.PING:queueRPC(rpcNames.USER_PONG);break;case messageTypes.MODERATE_STAFF:for(var b in a.data.users)a.data.users[b].user&&a.data.users[b].user.id&&(room.staff[a.data.users[b].user.id]=a.data.users[b].permission);room.setPermissions();break;case messageTypes.USER_JOIN:room.addUser(a.data);lastRpcMessage=Date.now();break;case messageTypes.USER_LEAVE:b=room.getUser(a.data.id);null==b&&(b={id:a.data.id});room.remUser(a.data.id);lastRpcMessage=
Date.now();_this.emit(a.type,b);return;case messageTypes.VOTE_UPDATE:room.logVote(a.data.id,1===a.data.vote?"woot":"meh");lastRpcMessage=Date.now();break;case messageTypes.DJ_UPDATE:room.setDjs(a.data.djs);lastRpcMessage=Date.now();break;case messageTypes.DJ_ADVANCE:b={dj:a.data.djs[0],lastPlay:{dj:_this.getDJ(),media:_this.getMedia(),score:_this.getRoomScore()},media:a.data.media,mediaStartTime:a.data.mediaStartTime,earn:a.data.earn};room.setDjs(a.data.djs);room.djAdvance(a.data);historyID=a.data.historyID;
lastRpcMessage=Date.now();_this.emit(a.type,b);return;case messageTypes.CURATE_UPDATE:room.logVote(a.data.id,"curate");lastRpcMessage=Date.now();break;case messageTypes.USER_UPDATE:room.updateUser(a.data);break;case void 0:logger.log("UNKNOWN MESSAGE FORMAT",a)}a.type&&_this.emit(a.type,a.data)}
var PlugAPI=function(a){if(!a)throw Error("You must pass the authentication cookie into the PlugAPI object to connect correctly");_this=this;_key=a;this.multiLine=!1;this.multiLineLimit=5;this.roomId=null;this.processOwnMessages=this.enablePlugCubedSocket=!1;this.deleteCommands=!0;room.User.prototype.addToWaitlist=function(){console.error("Using deprecated addToWaitlist - change to addToWaitList");_this.moderateAddDJ(this.id)};room.User.prototype.addToWaitList=function(){_this.moderateAddDJ(this.id)};
room.User.prototype.removeFromWaitlist=function(){console.error("Using deprecated removeFromWaitlist - change to removeFromWaitList");_this.moderateAddDJ(this.id)};room.User.prototype.removeFromWaitList=function(){_this.moderateRemoveDJ(this.id)};room.User.prototype.moveInWaitList=function(a){_this.moderateMoveDJ(this.id,a)};this.ROLE={NONE:0,RESIDENTDJ:1,BOUNCER:2,MANAGER:3,COHOST:4,HOST:5,AMBASSADOR:8,ADMIN:10};this.STATUS={AVAILABLE:0,AFK:1,WORKING:2,GAMING:3};this.BAN={HOUR:60,DAY:1440,PERMA:-1};
this.messageTypes=messageTypes;this.preCommandHandler=function(){return!0};this.log=__bind(logger.log,logger);logger.log("Running plugAPI v."+PlugAPIInfo.version)};util.inherits(PlugAPI,EventEmitter);
PlugAPI.prototype.getTwitterAuth=function(a,b,c){if(!a||!b)throw Error("Missing arguments");var d;"string"===typeof b?a={username:a,password:b}:(console.error("Using deprecated parameters for getTwitterAuth - please update."),c=b);if(!c||"function"!==typeof c)throw Error("Missing callback");try{d=require("plug-dj-login")}catch(e){throw Error("Error loading module plug-dj-login. Try running `npm install plug-dj-login`.");}d(a,function(a,b){if(a)c(a,null);else{var d=b.value,d=d.replace(/^"/,"").replace(/"$/,
"");c(null,d)}})};PlugAPI.prototype.close=function(){client.removeAllListeners("close");client.close();ws.removeAllListeners("close");ws.close();this.enablePlugCubedSocket&&(p3Socket.removeAllListeners("close"),p3Socket.close())};PlugAPI.prototype.setCommandPrefix=function(a){if(!a||"string"!==typeof a||1>a.length)return!1;commandPrefix=a;return!0};PlugAPI.prototype.setLogObject=function(a){console.error("Using deprecated setLogObject - change to setLogger");return this.setLogger(a)};
PlugAPI.prototype.setLogger=function(a){return a&&"object"===typeof a&&!util.isArray(a)&&"function"===typeof a.log?(this.logger=a,!0):!1};PlugAPI.prototype.connect=function(a){if(!a||"string"!==typeof a||0===a.length||-1<a.indexOf("/"))throw Error("Invalid room name");queueConnectChat(a);queueConnectSocket(a)};
PlugAPI.prototype.sendChat=function(a,b){if(235<a.length&&this.multiLine)for(var c=a.replace(/.{235}\S*\s+/g,"$&\u00a4").split(/\s+\u00a4/),d=0;d<c.length&&!(a=c[d],0<d&&(a="(continued) "+a),intChat(a,b),d+1>=this.multiLineLimit);d++);else intChat(a,b)};PlugAPI.prototype.sendPM=function(a,b){return intPM(a,b)};PlugAPI.prototype.woot=function(a){queueGateway(rpcNames.ROOM_CAST,[!0,historyID,lastHistoryID===historyID],a);return lastHistoryID=historyID};
PlugAPI.prototype.meh=function(a){queueGateway(rpcNames.ROOM_CAST,[!1,historyID,lastHistoryID===historyID],a);return lastHistoryID=historyID};PlugAPI.prototype.getHistory=function(a){if("function"!==typeof a)throw Error("You must specify callback!");if(initialized){var b=room.getHistory();if(1<b.length){a(b);return}}setImmediate(function(){_this.getHistory(a)})};PlugAPI.prototype.isUsernameAvailable=function(a,b){return queueGateway(rpcNames.USER_NAME_AVAILABLE,[a],b)};
PlugAPI.prototype.changeUsername=function(a,b){return queueGateway(rpcNames.USER_CHANGE_NAME,[a],b)};PlugAPI.prototype.changeRoomName=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.COHOST))return!1;queueGateway(rpcNames.MODERATE_UPDATE_NAME,[a],b);return!0};PlugAPI.prototype.changeRoomDescription=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.COHOST))return!1;queueGateway(rpcNames.MODERATE_UPDATE_DESCRIPTION,[a],b);return!0};
PlugAPI.prototype.changeDJCycle=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.MANAGER))return!1;queueGateway(rpcNames.ROOM_CYCLE_BOOTH,[this.roomId,a],b);return!0};PlugAPI.prototype.getTimeElapsed=function(){return this.roomId&&null!=room.getMedia()?Math.min(room.getMedia().duration,DateUtilities.getSecondsElapsed(room.getMediaStartTime())):-1};
PlugAPI.prototype.getTimeRemaining=function(){return this.roomId&&null!=room.getMedia()?room.getMedia().duration-this.getTimeElapsed():-1};PlugAPI.prototype.joinBooth=function(a){if(!this.roomId||room.isDJ()||room.isInWaitList()||room.boothLocked&&!this.havePermission(void 0,this.ROLE.RESIDENTDJ)||50<=this.getDJs().length)return!1;queueGateway(rpcNames.BOOTH_JOIN,[],a);return!0};
PlugAPI.prototype.leaveBooth=function(a){if(!this.roomId||!room.isDJ()&&!room.isInWaitList())return!1;queueGateway(rpcNames.BOOTH_LEAVE,[],a);return!0};PlugAPI.prototype.moderateAddDJ=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.BOUNCER)||room.isDJ(a)||room.isInWaitList(a)||room.boothLocked&&!this.havePermission(void 0,this.ROLE.MANAGER))return!1;queueGateway(rpcNames.MODERATE_ADD_DJ,a,b);return!0};
PlugAPI.prototype.moderateRemoveDJ=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.BOUNCER)||!room.isDJ(a)&&!room.isInWaitList(a)||room.boothLocked&&!this.havePermission(void 0,this.ROLE.MANAGER))return!1;queueGateway(rpcNames.MODERATE_REMOVE_DJ,a,b);return!0};PlugAPI.prototype.moderateMoveDJ=function(a,b,c){if(!this.roomId||!this.havePermission(void 0,this.ROLE.MANAGER)||!room.isInWaitList(a)||isNaN(b))return!1;queueGateway(rpcNames.MODERATE_MOVE_DJ,[a,50<b?50:1>b?1:b],c);return!0};
PlugAPI.prototype.moderateBanUser=function(a,b,c,d){if(!this.roomId||!this.havePermission(void 0,this.ROLE.BOUNCER))return!1;b=String(b||1);c||(c=this.BAN.PERMA);c===this.BAN.PERMA&&this.havePermission(void 0,this.ROLE.BOUNCER)&&!this.havePermission(void 0,this.ROLE.MANAGER)&&(c=this.BAN.DAY);queueGateway(rpcNames.MODERATE_BAN,[a,b,c],d);return!0};
PlugAPI.prototype.moderateUnBanUser=function(a,b){console.error("Using deprecated moderateUnBanUser - change to moderateUnbanUser");return this.moderateUnbanUser(a,b)};PlugAPI.prototype.moderateUnbanUser=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.MANAGER))return!1;queueGateway(rpcNames.MODERATE_UNBAN,[a],b);return!0};
PlugAPI.prototype.moderateForceSkip=function(a){if(!this.roomId||!this.havePermission(void 0,this.ROLE.BOUNCER)||null===room.getDJ())return!1;queueGateway(rpcNames.MODERATE_SKIP,[room.getDJ().id,historyID],a);return!0};PlugAPI.prototype.moderateDeleteChat=function(a,b){if(!this.roomId||!this.havePermission(void 0,this.ROLE.BOUNCER))return!1;queueGateway(rpcNames.MODERATE_CHAT_DELETE,[a],b,void 0,!0);return!0};
PlugAPI.prototype.moderateLockWaitList=function(a,b,c){return this.moderateLockBooth(a,b,c)};PlugAPI.prototype.moderateSetRole=function(a,b,c){if(!this.roomId||null===this.getUser(a)||isNaN(b))return!1;queueGateway(rpcNames.MODERATE_PERMISSIONS,[a,b],c);return!0};PlugAPI.prototype.moderateLockBooth=function(a,b,c){if(!this.roomId||null===this.getUser()||!this.havePermission(void 0,this.ROLE.MANAGER)||a===room.boothLocked&&!b)return!1;queueGateway(rpcNames.ROOM_LOCK_BOOTH,[this.roomId,a,b],c);return!0};
PlugAPI.prototype.getUsers=function(){return room.getUsers()};PlugAPI.prototype.getUser=function(a){return room.getUser(a)};PlugAPI.prototype.getAudience=function(a){return room.getAudience()};PlugAPI.prototype.getDJ=function(){return room.getDJ()};PlugAPI.prototype.getDJs=function(){return room.getDJs()};PlugAPI.prototype.getStaff=function(){return room.getStaff()};PlugAPI.prototype.getAdmins=function(){return room.getAdmins()};PlugAPI.prototype.getHost=function(){return room.getHost()};
PlugAPI.prototype.getSelf=function(){return room.getSelf()};PlugAPI.prototype.getWaitList=function(){return room.getWaitList()};PlugAPI.prototype.getWaitListPosition=function(a){return room.getWaitListPosition(a)};PlugAPI.prototype.getAmbassadors=function(){return room.getAmbassadors()};PlugAPI.prototype.getMedia=function(){return room.getMedia()};PlugAPI.prototype.getRoomScore=function(){return room.getRoomScore()};
PlugAPI.prototype.setStatus=function(a,b){if(!this.roomId||!a||0>a||3<a)return!1;queueGateway(rpcNames.USER_SET_STATUS,a,b);return!0};PlugAPI.prototype.createPlaylist=function(a,b){if(!this.roomId||!a)return!1;queueGateway(rpcNames.PLAYLIST_CREATE,a,b);return!0};PlugAPI.prototype.addSongToPlaylist=function(a,b,c){if(!this.roomId||!a||!b)return!1;queueGateway(rpcNames.PLAYLIST_MEDIA_INSERT,[a,null,-1,[b]],c);return!0};
PlugAPI.prototype.getPlaylists=function(a){if(!this.roomId)return!1;queueGateway(rpcNames.PLAYLIST_SELECT,[(new Date(0)).toISOString().replace("T"," "),null,100,null],a);return!0};PlugAPI.prototype.activatePlaylist=function(a,b){if(!this.roomId||!a)return!1;queueGateway(rpcNames.PLAYLIST_ACTIVATE,[a],b);return!0};PlugAPI.prototype.playlistMoveSong=function(a,b,c,d){if(!this.roomId)return!1;queueGateway(rpcNames.PLAYLIST_MEDIA_MOVE,[a.id,a.items[c],[b]],d);return!0};
PlugAPI.prototype.setAvatar=function(a,b){queueGateway(rpcNames.USER_SET_AVATAR,[a],b);return!0};PlugAPI.prototype.havePermission=function(a,b){var c=this.getUser(a);return!(null==c||c.permission<b)};PlugAPI.prototype.listen=function(a,b){var c=this;http.createServer(function(a,b){var f="";a.on("data",function(a){f+=a.toString()});a.on("end",function(){a._POST=querystring.parse(f);c.emit("httpRequest",a,b)})}).listen(a,b)};
PlugAPI.prototype.tcpListen=function(a,b){var c=this;net.createServer(function(a){a.on("connect",function(){c.emit("tcpConnect",a)});a.on("data",function(b){b=b.toString();"\n"==b[b.length-1]&&c.emit("tcpMessage",a,b.substr(0,b.length-1))});a.on("end",function(){c.emit("tcpEnd",a)})}).listen(a,b)};module.exports=PlugAPI;
