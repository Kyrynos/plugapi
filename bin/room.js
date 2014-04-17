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
var songHistory=[],Room=function(){function a(a,b){return function(){return a.apply(b,arguments)}}var b=this;this.User=function(a){this.avatarID=a.avatarID?a.avatarID:"";this.curated=!0===b.media.stats.curates[a.id]?!0:!1;this.curatorPoints=a.curatorPoints?a.curatorPoints:0;this.dateJoined=a.dateJoined?a.dateJoined:"";this.djPoints=a.djPoints?a.djPoints:0;this.fans=a.fans?a.fans:0;this.id=a.id?a.id:"";this.language=a.language?a.language:"";this.listenerPoints=a.listenerPoints?a.listenerPoints:0;this.permission=
void 0!==b.adminIds[a.id]?10:b.isAmbassador(a.id)?b.ambassadorIds[a.id]:b.isStaff(a.id)?b.staffIds[a.id]:0;this.status=a.status?a.status:0;this.username=a.username?a.username:"";this.vote=void 0!==b.media.stats.votes[a.id]?"woot"===b.media.stats.votes[a.id]?1:-1:0};this.User.prototype.toString=function(){return this.username};this.getRoomScore=a(this.getRoomScore,this);this.getMedia=a(this.getMedia,this);this.getMediaStartTime=a(this.getMediaStartTime,this);this.getWaitlist=a(this.getWaitlist,this);
this.getHost=a(this.getHost,this);this.getAdmins=a(this.getAdmins,this);this.getStaff=a(this.getStaff,this);this.getAmbassadors=a(this.getAmbassadors,this);this.getAudience=a(this.getAudience,this);this.getDJ=a(this.getDJ,this);this.getDJs=a(this.getDJs,this);this.getSelf=a(this.getSelf,this);this.getUser=a(this.getUser,this);this.getUsers=a(this.getUsers,this);this.logVote=a(this.logVote,this);this.setPermissions=a(this.setPermissions,this);this.setMedia=a(this.setMedia,this);this.setDjs=a(this.setDjs,
this);this.setSelf=a(this.setSelf,this);this.setOwner=a(this.setOwner,this);this.setAdmins=a(this.setAdmins,this);this.setStaff=a(this.setStaff,this);this.setUsers=a(this.setUsers,this);this.remUser=a(this.remUser,this);this.addUser=a(this.addUser,this);this.reset=a(this.reset,this);this.isStaff=a(this.isStaff,this);this.djAdvance=a(this.djAdvance,this);this.users={};this.staffIds={};this.ambassadorIds={};this.adminIds={};this.ownerId="";this.self={};this.djs={};this.media={info:{},stats:{votes:{},
curates:{}}}};Room.prototype.usersToArray=function(a){var b,c,d;d=[];for(b in a)c=new this.User(a[b]),d.push(c);return d};Room.prototype.isAmbassador=function(a){return null!=this.ambassadorIds[a]};Room.prototype.isStaff=function(a){return null!=this.staffIds[a]};Room.prototype.reset=function(){this.users={};this.djs={};this.media={info:{},stats:{votes:{},curates:{}}};this.staffIds={};return this.ownerId=""};
Room.prototype.addUser=function(a){this.users[a.id]=a;return this.isStaff(a.id)?this.users[a.id].permission=this.staffIds[a.id]:this.users[a.id].permission=0};Room.prototype.remUser=function(a){delete this.users[a]};Room.prototype.updateUser=function(a){this.users[a.id]=a};Room.prototype.setUsers=function(a){var b,c,d,e;this.users={};e=[];c=0;for(d=a.length;c<d;c++)b=a[c],e.push(this.users[b.id]=b);return e};Room.prototype.setStaff=function(a){this.staffIds=a;return this.setPermissions()};
Room.prototype.setAmbassadors=function(a){this.ambassadorIds=a;return this.setPermissions()};Room.prototype.setAdmins=function(a){return this.adminIds=a};Room.prototype.setOwner=function(a){return this.ownerId=a};Room.prototype.setSelf=function(a){return this.self=a};Room.prototype.setDjs=function(a){var b,c,d,e;this.djs={};e=[];c=0;for(d=a.length;c<d;c++)b=a[c],e.push(this.djs[b.user.id]=b.user);return e};
Room.prototype.setMedia=function(a,b,c,d){var e;null==c&&(c={});null==d&&(d={});this.media={info:a,startTime:b,stats:{votes:{},curates:{}}};for(e in c)a=c[e],this.media.stats.votes[e]=1===a?"woot":"meh";a=[];for(e in d)c=d[e],a.push(this.media.stats.curates[e]=c);return a};
Room.prototype.djAdvance=function(a){if(1>songHistory.length)return setImmediate(this.djAdvance,a);songHistory[0].room=this.getRoomScore();this.setMedia(a.media,a.mediaStartTime);a={id:a.historyID,media:a.media,room:{positive:0,listeners:null,curates:0,negative:0},timestamp:a.mediaStartTime,user:{id:a.currentDJ,username:void 0===this.getUser(a.currentDJ)?"":this.getUser(a.currentDJ).username}};50<songHistory.unshift(a)&&songHistory.splice(50,songHistory.length-50)};
Room.prototype.setPermissions=function(){var a,b,c;b=this.users;c=[];for(a in b)this.isAmbassador(a)?c.push(this.users[a].permission=this.ambassadorIds[a]):this.isStaff(a)?c.push(this.users[a].permission=this.staffIds[a]):c.push(this.users[a].permission=0);return c};Room.prototype.logVote=function(a,b){if("woot"===b||"meh"===b)return this.media.stats.votes[a]=b;if("curate"===b)return this.media.stats.curates[a]=b};Room.prototype.getUsers=function(){return this.usersToArray(this.users)};
Room.prototype.getUser=function(a){a||(a=this.self.id);if(null!=this.users[a])return new this.User(this.users[a])};Room.prototype.getSelf=function(){if(null!=this.self)return this.getUser()};Room.prototype.getDJ=function(){return 0<this.getDJs().length?new this.User(this.getDJs()[0]):null};Room.prototype.getDJs=function(){return this.usersToArray(this.djs)};
Room.prototype.getAudience=function(){var a,b,c,d;a=[];d=this.users;for(b in d)c=d[b],0>__indexOf.call(Object.keys(this.djs),b)&&a.push(new this.User(c));return a};Room.prototype.getAmbassadors=function(){var a,b,c;c=this.users;for(a in c)b=c[a],b.ambassador&&ambassdors.push(new this.User(b));return[]};Room.prototype.getStaff=function(){var a,b,c,d;b=[];d=this.users;for(a in d)c=d[a],a in this.staffIds&&b.push(new this.User(c));return b};
Room.prototype.getAdmins=function(){var a,b,c,d;a=[];d=this.users;for(b in d)c=d[b],b in this.adminIds&&a.push(new this.User(c));return a};Room.prototype.getHost=function(){var a,b,c;c=this.users;for(a in c)if(b=c[a],a===this.ownerId)return new this.User(b);return null};Room.prototype.getWaitlist=function(){return this.usersToArray(this.djs).splice(1)};Room.prototype.getWaitListPosition=function(a){var b=this.getWaitlist(),c=0,d;for(d in b){if(b[d].id===a)return c;c++}return-1};
Room.prototype.getMedia=function(){return this.media.info};Room.prototype.getMediaStartTime=function(){return this.media.startTime};Room.prototype.getHistory=function(){return songHistory};Room.prototype.setHistory=function(a){songHistory=a};Room.prototype.getRoomScore=function(){var a,b,c,d,e,f;e=c=a=0;f=this.media.stats.votes;for(b in f)d=f[b],"woot"===d&&e++,"meh"===d&&c++;d=this.media.stats.curates;for(b in d)a++;return{positive:e,listeners:Math.max(this.getUsers().length-1,0),curates:a,negative:c}};
module.exports=Room;