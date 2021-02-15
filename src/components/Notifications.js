const Notifications = (props) => {
  const { gameOver } = props;

  return (
    <section id='notifications'>
      Notifications
      { gameOver && 
        <div>
          {gameOver} Won!
        </div>
      }
    </section>
  )
}

export default Notifications;