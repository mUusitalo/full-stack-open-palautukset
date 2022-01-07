const Notification = ({message, success=true}) => {
    if (!message) return null

    const style = {
      fontSize: 30,
      color: success ? 'green' : 'red',
      backgroundColor: 'snow',
      border: 5,
      borderStyle: 'solid',
      borderRadius: 10,
      padding: 10,
      textAlign: 'center'
    }
  
    return <div style={style}>{message}</div>
}

export default Notification
