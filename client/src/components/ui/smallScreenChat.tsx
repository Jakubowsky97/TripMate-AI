const SmallScreenChat = ({messages} : {messages: { user: string; text: string }[]}) => { 
    return (
        <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.user}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
    )
}

export default SmallScreenChat;