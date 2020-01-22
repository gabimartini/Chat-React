import React, {Component} from 'react';
import './App.css';
import MessageList from './MessageList'
import Chatkit from '@pusher/chatkit-client'
import {tokeUrl, instanceLocator} from './config'
import SendMessageForm from './SendMessageForm'
import RoomList from './RoomList'
import NewRoomForm from './NewRoomForm'

class App extends Component {

constructor(){
  super()
  this.state = {
    roomId: '',
    messages: [],
    joinableRooms:[],
    joinedRooms:[]
  }

  this.sendMessage = this.sendMessage.bind(this)
  this.subscribeToRoom = this.subscribeToRoom.bind(this)
  this.getRooms = this.getRooms.bind(this)
  this.createRoom = this.createRoom.bind(this)

}

  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'Gabriela',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokeUrl
      })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser=currentUser
      this.getRooms()
           
    })
    .catch(err => console.log('error on connecting: ', err))
  }
  
getRooms(){
  this.currentUser.getJoinableRooms()
.then(joinableRooms => {
  this.setState({
    joinableRooms,
    joinedRooms: this.currentUser.rooms
  })
})
.catch(err => console.log('error on joinableRooms: ', err))

}

  subscribeToRoom(roomId){
    this.setState({
      messages: [] })
    this.currentUser.subscribeToRoom({
      roomId:roomId,
      hooks: {
        onMessage: message => {
            this.setState({
            messages: [...this.state.messages, message]
          })
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      })
      this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ', err))
  }

sendMessage(text){
  this.currentUser.sendMessage({
    text,
    roomId:this.state.roomId
  })
}

createRoom(name){
 this.currentUser.createRoom({
   name
 })
 .then(room => this.subscribeToRoom(room.id))
 .catch(err => console.log('error with createRoom: ', err))
}

  render() { 
       return ( 
<div className='app'>
<RoomList 
roomId={this.state.roomId}
subscribeToRoom={this.subscribeToRoom} 
rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
  <MessageList messages = {this.state.messages}
  roomId={this.state.roomId}/>
  <SendMessageForm 
  disabled={!this.state.roomId}
  sendMessage = {this.sendMessage}/>
<NewRoomForm createRoom={this.createRoom}/>
</div>
      
     );
  }
}
 
export default App;

