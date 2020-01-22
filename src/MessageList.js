import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Message from './Message'
import './App.css';




class MessageList extends Component {

    UNSAFE_componentWillUpdate(){
    const node = ReactDOM.findDOMNode(this)
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
}

    componentDidUpdate(){
        //wrap all the components list - Dom
      if(this.shouldScrollToBottom){
        const node = ReactDOM.findDOMNode(this)
        //scroll as far as possible
        node.scrollTop = node.scrollHeight
      }
       
    }

    render() { 
        if(!this.props.roomId){
            return(
                <div className="message-list">
                    <div className="join-room">
                        &larr; Join a room!
                    </div>

                </div>
            )
        }
        return ( 
<div className='message-list'>
    
    {this.props.messages.map((message, index)=>{
        return(

            <Message key={index} username={message.senderId} text={message.text}/>

         
        )
    })}
</div>
            

         );
    }
}
 
export default MessageList;